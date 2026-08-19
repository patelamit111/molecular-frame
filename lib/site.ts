export const siteConfig = {
  name: "Molecular Frame",
  description:
    "Cinematic mechanism-of-action and medical films that make complex pharmaceutical science clear and memorable.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") ??
    "https://molecularframe.com",
} as const;

export const aspirinMedia = {
  film: "/media/aspirin/aspirin-flagship-web.mp4",
  loop: "/media/aspirin/aspirin-hero-loop.mp4",
  poster: "/media/aspirin/aspirin-poster.webp",
  captions: "/media/aspirin/aspirin-captions.vtt",
  detail: "/media/aspirin/aspirin-cox1-detail.webp",
} as const;

export const linsitinibMedia = {
  film: "/media/concepts/linsitinib/linsitinib-cinematic-v2.mp4",
  loop: "/media/concepts/linsitinib/linsitinib-hero-loop.mp4",
  poster: "/media/concepts/linsitinib/linsitinib-poster.webp",
  captions: "/media/concepts/linsitinib/linsitinib-captions.vtt",
} as const;

export const filmCatalog = {
  aspirin: {
    title: "Aspirin: platelet inhibition",
    label: "Independent concept film",
    note: "Simplified scientific visualization. Not medical advice.",
    ...aspirinMedia,
  },
  linsitinib: {
    title: "Linsitinib: human scale to IGF-1R",
    label: "Independent concept film",
    note:
      "Independent portfolio concept, not an official Sling Therapeutics communication. Linsitinib is investigational and not approved as a marketed product. Not medical advice.",
    ...linsitinibMedia,
  },
} as const;

export type FilmId = keyof typeof filmCatalog;

export const layers = {
  navigation: 30,
  mobileMenu: 40,
  modalBackdrop: 70,
  modalContent: 80,
} as const;
