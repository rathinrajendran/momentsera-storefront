import { ShareCardProps } from "../types";

export default function PremiumCard({ bride, groom, eventTitle, eventDate, venue, coverImage }: ShareCardProps) {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        background: "linear-gradient(135deg,#fdf8f2,#fff7ed,#faf5ff)",
        position: "relative",
      }}
    >
      {coverImage && (
        <img
          src={coverImage}
          style={{
            position: "absolute",
            inset: 0,
            width: "1200px",
            height: "630px",
            objectFit: "cover",
            opacity: 0.22,
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          alignItems: "center",
          textAlign: "center",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            color: "#8b7355",
          }}
        >
          {eventTitle.toUpperCase()}
        </div>

        <div
          style={{
            marginTop: 35,
            fontSize: 72,
            fontWeight: 700,
            color: "#2d2d2d",
          }}
        >
          {bride}
        </div>

        <div
          style={{
            fontSize: 42,
            margin: "18px 0",
            color: "#b48b45",
          }}
        >
          &
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#2d2d2d",
          }}
        >
          {groom}
        </div>

        {eventDate && (
          <div
            style={{
              marginTop: 40,
              fontSize: 34,
              color: "#555",
            }}
          >
            {eventDate}
          </div>
        )}

        {venue && (
          <div
            style={{
              marginTop: 12,
              fontSize: 28,
              color: "#777",
            }}
          >
            {venue}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 24,
            color: "#8b7355",
          }}
        >
          Momentsera
        </div>
      </div>
    </div>
  );
}
