import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Molecular Frame",
    short_name: "Molecular Frame",
    description: "Cinematic films for complex pharmaceutical science.",
    start_url: "/",
    display: "standalone",
    background_color: "#071014",
    theme_color: "#071014",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
