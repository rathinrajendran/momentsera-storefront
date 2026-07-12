import { ShareCardProps } from "../types";

export default function HeroCard({ bride, groom, eventTitle, eventDate, venue, coverImage }: ShareCardProps) {
  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        color: "#1f2937",
        position: "relative",
      }}
    >
      {/* Hero Image */}
      <div
        style={{
          width: "100%",
          height: "470px",
          display: "flex",
          overflow: "hidden",
          background: "#f5f5f5",
        }}
      >
        {coverImage ? (
          <img
            src={coverImage}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 40,
              color: "#9ca3af",
            }}
          >
            No Cover Image
          </div>
        )}
      </div>

      {/* Bottom Information */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "32px 42px",
          background: "#ffffff",
        }}
      >
        {/* Couple */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {bride} & {groom}
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 22,
              color: "#6b7280",
            }}
          >
            {eventTitle}
          </div>

          <div
            style={{
              marginTop: 18,
              fontSize: 20,
              color: "#4b5563",
            }}
          >
            {eventDate}
          </div>

          {venue && (
            <div
              style={{
                marginTop: 6,
                fontSize: 18,
                color: "#6b7280",
              }}
            >
              {venue}
            </div>
          )}
        </div>

        {/* Brand */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Momentsera
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 18,
              color: "#9ca3af",
            }}
          >
            Digital Invitation
          </div>
        </div>
      </div>
    </div>
  );
}
