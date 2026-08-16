import { ImageResponse } from "next/og";

export const alt = "Molecular Frame, AI-native pharma films";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#071014",
        color: "#edf4f3",
        padding: "68px 76px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          borderRadius: "50%",
          right: -80,
          top: -130,
          border: "1px solid rgba(143,182,191,0.3)",
          background:
            "radial-gradient(circle at 38% 40%, rgba(234,165,95,0.34), rgba(143,182,191,0.1) 36%, rgba(7,16,20,0) 68%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 310,
          height: 200,
          borderRadius: "48% 52% 55% 45%",
          right: 105,
          top: 186,
          transform: "rotate(-18deg)",
          background:
            "radial-gradient(circle at 38% 32%, #efb477, #9b583e 35%, #321f22 76%)",
          boxShadow: "inset 18px 16px 42px rgba(241,182,117,0.23)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "-0.03em",
          }}
        >
          Molecular Frame
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#eaa55f",
              fontSize: 18,
              marginBottom: 24,
            }}
          >
            AI-native pharma film studio
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 720,
              fontSize: 72,
              lineHeight: 0.98,
              letterSpacing: "-0.055em",
              fontWeight: 520,
            }}
          >
            Pharma stories, built at molecular speed.
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
