import { Resend } from "resend";
import { z } from "zod";

const controlCharacters = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const maxBodyBytes = 50_000;
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMaxRequests = 5;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimits = new Map<string, RateLimitEntry>();

const clean = (value: string) => value.replace(controlCharacters, "").trim();

const pilotSchema = z
  .object({
    name: z.string().trim().min(2).max(120).transform(clean),
    workEmail: z
      .string()
      .trim()
      .email()
      .max(200)
      .transform((value) => clean(value).toLowerCase()),
    company: z.string().trim().min(2).max(160).transform(clean),
    role: z.string().trim().max(160).transform(clean).optional().default(""),
    therapyArea: z
      .string()
      .trim()
      .max(160)
      .transform(clean)
      .optional()
      .default(""),
    timeline: z
      .string()
      .trim()
      .max(80)
      .transform(clean)
      .optional()
      .default(""),
    brief: z.string().trim().min(20).max(2500).transform(clean),
    website: z.string().trim().max(200).optional().default(""),
  })
  .strict();

type PilotRequest = z.infer<typeof pilotSchema>;

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return Response.json(
      { ok: false, error: "This request origin is not allowed." },
      { status: 403 },
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json(
      { ok: false, error: "Please send this form as JSON." },
      { status: 415 },
    );
  }

  const rateLimit = checkRateLimit(request);
  if (!rateLimit.allowed) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) {
    return Response.json(
      { ok: false, error: "This request is too large." },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = await readBoundedJson(request, maxBodyBytes);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return Response.json(
        { ok: false, error: "This request is too large." },
        { status: 413 },
      );
    }
    return Response.json(
      { ok: false, error: "We could not read this request." },
      { status: 400 },
    );
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof body.website === "string" &&
    body.website.trim().length > 0
  ) {
    return Response.json({
      ok: true,
      message: "Your request has been received.",
    });
  }

  const parsed = pilotSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        error: "Please complete the required fields and check your work email.",
      },
      { status: 400 },
    );
  }

  const pilot = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.PILOT_INBOX;

  if (!apiKey || !inbox) {
    return deliveryUnavailable(pilot, inbox);
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ??
        "Molecular Frame <onboarding@resend.dev>",
      to: [inbox],
      replyTo: pilot.workEmail,
      subject: `Pilot request from ${pilot.company}`,
      text: buildPlainText(pilot),
      html: buildHtml(pilot),
    });

    if (result.error) {
      return deliveryUnavailable(pilot, inbox);
    }

    return Response.json({
      ok: true,
      message: "Your brief is in. We will review it and reply by email.",
    });
  } catch {
    return deliveryUnavailable(pilot, inbox);
  }
}

class BodyTooLargeError extends Error {}

async function readBoundedJson(request: Request, limit: number) {
  if (!request.body) {
    throw new Error("Missing request body");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > limit) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  return JSON.parse(text) as unknown;
}

function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  const requestUrl = new URL(request.url);
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const expectedOrigin = forwardedHost
    ? `${forwardedProtocol ?? requestUrl.protocol.replace(":", "")}://${forwardedHost}`
    : requestUrl.origin;

  try {
    return new URL(origin).origin === expectedOrigin;
  } catch {
    return false;
  }
}

function checkRateLimit(request: Request) {
  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const ip = request.headers.get("x-real-ip")?.trim() || forwardedFor;

  if (!ip) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const now = Date.now();
  const existing = rateLimits.get(ip);
  if (!existing || existing.resetAt <= now) {
    rateLimits.set(ip, { count: 1, resetAt: now + rateLimitWindowMs });
    pruneRateLimits(now);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= rateLimitMaxRequests) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function pruneRateLimits(now: number) {
  if (rateLimits.size < 500) return;
  for (const [ip, entry] of rateLimits) {
    if (entry.resetAt <= now) rateLimits.delete(ip);
  }
  if (rateLimits.size > 1000) {
    const oldestKey = rateLimits.keys().next().value as string | undefined;
    if (oldestKey) rateLimits.delete(oldestKey);
  }
}

function deliveryUnavailable(pilot?: PilotRequest, inbox?: string) {
  const fallbackUrl = pilot && inbox ? buildMailto(pilot, inbox) : undefined;

  return Response.json(
    {
      ok: false,
      error: fallbackUrl
        ? "Direct delivery is unavailable. Your entries are still here, and you can open them in an email draft."
        : "Direct delivery is unavailable. Your entries are still here, so please try again shortly.",
      ...(fallbackUrl ? { fallbackUrl } : {}),
    },
    { status: 503 },
  );
}

function buildMailto(pilot: PilotRequest, inbox: string) {
  const subject = encodeURIComponent(
    `Molecular Frame pilot request — ${pilot.company}`,
  );
  const body = encodeURIComponent(buildPlainText(pilot));
  return `mailto:${encodeURIComponent(inbox)}?subject=${subject}&body=${body}`;
}

function buildPlainText(pilot: PilotRequest) {
  return [
    "New Molecular Frame pilot request",
    "",
    `Name: ${pilot.name}`,
    `Work email: ${pilot.workEmail}`,
    `Company: ${pilot.company}`,
    `Role: ${pilot.role || "Not provided"}`,
    `Therapy area: ${pilot.therapyArea || "Not provided"}`,
    `Timeline: ${pilot.timeline || "Not provided"}`,
    "",
    "Brief:",
    pilot.brief,
  ].join("\n");
}

function buildHtml(pilot: PilotRequest) {
  const rows = [
    ["Name", pilot.name],
    ["Work email", pilot.workEmail],
    ["Company", pilot.company],
    ["Role", pilot.role || "Not provided"],
    ["Therapy area", pilot.therapyArea || "Not provided"],
    ["Timeline", pilot.timeline || "Not provided"],
  ];

  return `
    <div style="font-family: Arial, sans-serif; color: #152127; line-height: 1.55; max-width: 680px; margin: 0 auto;">
      <h1 style="font-size: 24px;">New Molecular Frame pilot request</h1>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th style="text-align: left; padding: 10px 16px 10px 0; border-bottom: 1px solid #dce2e4;">${escapeHtml(label)}</th>
                <td style="padding: 10px 0; border-bottom: 1px solid #dce2e4;">${escapeHtml(value)}</td>
              </tr>`,
          )
          .join("")}
      </table>
      <h2 style="font-size: 18px; margin-top: 28px;">Brief</h2>
      <p style="white-space: pre-wrap;">${escapeHtml(pilot.brief)}</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
