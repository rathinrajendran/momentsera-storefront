import { ShareCardProps } from "../types";

export default function CoverCard({ title, description, coverImage }: ShareCardProps) {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
      }}
    >
      {coverImage && (
        <img
          src={coverImage}
          style={{
            width: "1200px",
            height: "420px",
            objectFit: "cover",
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "36px 48px",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 28,
            color: "#555",
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}
