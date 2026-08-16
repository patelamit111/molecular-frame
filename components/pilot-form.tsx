"use client";

import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fallbackUrl?: string };

type PilotResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
  fallbackUrl?: string;
};

export function PilotForm() {
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setSubmission({ status: "submitting" });
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as PilotResponse;

      if (!response.ok || !result.ok) {
        setSubmission({
          status: "error",
          message:
            result.error ?? "We could not send this request. Please try again.",
          fallbackUrl: result.fallbackUrl,
        });
        return;
      }

      form.reset();
      setSubmission({
        status: "success",
        message:
          result.message ?? "Your brief is in. We will review it and reply by email.",
      });
    } catch {
      setSubmission({
        status: "error",
        message: "We could not connect. Please try again or email us directly.",
      });
    }
  }

  const submitting = submission.status === "submitting";

  return (
    <form className="pilot-form" onSubmit={handleSubmit}>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="form-row form-row--two">
        <Field label="Name" name="name" autoComplete="name" required />
        <Field
          label="Work email"
          name="workEmail"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="form-row form-row--two">
        <Field
          label="Company"
          name="company"
          autoComplete="organization"
          required
        />
        <Field
          label="Role"
          name="role"
          autoComplete="organization-title"
        />
      </div>

      <div className="form-row form-row--two">
        <Field label="Therapy area" name="therapyArea" />
        <label className="field" htmlFor="timeline">
          <span>Timeline</span>
          <select id="timeline" name="timeline" defaultValue="">
            <option value="">Select if known</option>
            <option value="Under 8 weeks">Under 8 weeks</option>
            <option value="2-4 months">2-4 months</option>
            <option value="4-8 months">4-8 months</option>
            <option value="Exploring">Exploring</option>
          </select>
        </label>
      </div>

      <label className="field" htmlFor="brief">
        <span>What should the film make clear?</span>
        <textarea
          id="brief"
          name="brief"
          rows={5}
          maxLength={2500}
          required
          placeholder="Share the mechanism, audience, review needs, and intended channels."
        />
      </label>

      <div className="form-submit-row">
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Sending request" : "Request a pilot"}
          <ArrowRight aria-hidden="true" weight="bold" />
        </button>
        <p>We use your information only to respond to this request.</p>
      </div>

      <div className="form-status" aria-live="polite" aria-atomic="true">
        {submission.status === "success" ? (
          <p className="form-status__success">
            <CheckCircle aria-hidden="true" weight="fill" />
            {submission.message}
          </p>
        ) : null}
        {submission.status === "error" ? (
          <div className="form-status__error" role="alert">
            <p>{submission.message}</p>
            {submission.fallbackUrl ? (
              <a className="text-link form-status__fallback" href={submission.fallbackUrl}>
                Open the email draft
                <ArrowRight aria-hidden="true" weight="bold" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "email";
  autoComplete?: string;
  required?: boolean;
};

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
}: FieldProps) {
  return (
    <label className="field" htmlFor={name}>
      <span>{label}</span>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        maxLength={160}
        required={required}
      />
    </label>
  );
}
