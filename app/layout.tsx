import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { FilmModalProvider } from "@/components/film-modal";
import { Navigation } from "@/components/navigation";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "optional",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Molecular Frame | AI-native pharma films",
    template: "%s | Molecular Frame",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "pharma mechanism of action video",
    "MOA animation",
    "medical animation",
    "scientific visualization",
    "AI pharma video",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Molecular Frame | Pharma stories, built at molecular speed",
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Molecular Frame, AI-native pharma films",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Molecular Frame | AI-native pharma films",
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071014",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <FilmModalProvider>
          <Navigation />
          {children}
        </FilmModalProvider>
        <Analytics />
      </body>
    </html>
  );
}
