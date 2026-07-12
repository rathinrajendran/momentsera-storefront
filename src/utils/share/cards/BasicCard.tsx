import { ShareCardProps } from "../types";

export default function BasicCard({ title, description }: ShareCardProps) {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#ffffff",
        color: "#111827",
        padding: 80,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 62,
          fontWeight: 700,
          marginBottom: 30,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 34,
          color: "#4b5563",
          maxWidth: 900,
          lineHeight: 1.5,
        }}
      >
        {description}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 40,
          fontSize: 24,
          color: "#9ca3af",
        }}
      >
        invite.momentsera.com
      </div>
    </div>
  );
}
