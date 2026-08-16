export const siteConfig = {
  name: "Molecular Frame",
  description:
    "AI-native pharma films built for scientific clarity, cinematic impact, and rigorous review.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") ??
    "https://molecular-frame.vercel.app",
} as const;

export const aspirinMedia = {
  film: "/media/aspirin/aspirin-flagship-web.mp4",
  loop: "/media/aspirin/aspirin-hero-loop.mp4",
  poster: "/media/aspirin/aspirin-poster.webp",
  captions: "/media/aspirin/aspirin-captions.vtt",
  detail: "/media/aspirin/aspirin-cox1-detail.webp",
} as const;

export const layers = {
  navigation: 30,
  mobileMenu: 40,
  modalBackdrop: 70,
  modalContent: 80,
} as const;
