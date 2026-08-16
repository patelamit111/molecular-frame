import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        background: "#0e1b20",
        color: "#eaa55f",
        fontSize: 18,
        fontFamily: "sans-serif",
        fontWeight: 700,
      }}
    >
      M
    </div>,
    size,
  );
}
