import { ImageResponse } from "next/og";

export const alt = "Northline: footwear built for the long way home";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "#f4f1ea",
                    color: "#141414",
                    padding: 80,
                }}
            >
                <div style={{ display: "flex", fontSize: 36, letterSpacing: 6, textTransform: "uppercase", color: "#6b675f" }}>
                    Autumn / Winter 2026
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", fontSize: 140, fontWeight: 700, lineHeight: 1 }}>Northline</div>
                    <div style={{ display: "flex", fontSize: 48, marginTop: 24, color: "#d9461f" }}>
                        Built for the long way home.
                    </div>
                </div>
            </div>
        ),
        { ...size },
    );
}