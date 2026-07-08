"use client";

import { useInviteData } from "../../../hooks/useInviteData";
import { cn } from "../../../utils/utils";
import { format } from "date-fns";

interface CatalogProps {
  data: any;
  settings: any;
  appearance: any;
  experience: any;
  printable: any;
  eventKey: string;
  isLive?: boolean;
}

export default function Aurelia({ data, printable }: CatalogProps) {
  const event = data?.event ?? {};

  const gallery = data?.gallery ?? [];

  const functions = data?.functions ?? [];

  const firstFunction = functions?.[0] ?? {};

  const inviteData = useInviteData(data);

  /* ----------------------------------------
      DYNAMIC DATA
  ---------------------------------------- */

  const coverImage = gallery?.[0]?.url || "/placeholder.jpg";

  const eventDate = firstFunction?.start_datetime ? format(new Date(firstFunction.start_datetime), "MM.dd.yy") : "10.20.19";

  const eventTime = firstFunction?.start_datetime ? format(new Date(firstFunction.start_datetime), "hh:mm a") : "04:00 PM";

  const venue = firstFunction?.location || "Wedding Venue";

  const address = firstFunction?.location_map || firstFunction?.address || "Reception to follow";

  const message = event?.message || "You are invited to our wedding";

  const printableTitle = printable?.customTitle || "THE WEDDING";

  /* ----------------------------------------
      CARD SIZE
  ---------------------------------------- */

  const cardClass =
    printable?.cardSize === "landscape"
      ? "w-[900px] h-[520px]"
      : printable?.cardSize === "square"
        ? "w-[620px] h-[620px]"
        : "w-[420px] h-[760px]";

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-6"
      style={{
        background: "var(--bg-page)",
        color: "var(--primary)",
        fontFamily: "var(--font-secondary)",
        fontSize: "var(--font-size-primary)",
      }}
    >
      <div
        className={cn("flex overflow-hidden shadow-2xl", cardClass)}
        style={{
          background: "var(--surface-card)",
          borderRadius: "var(--radius-theme)",
          border: "1px solid var(--border)",
        }}
      >
        {/* LEFT PANEL */}
        <div
          className="relative flex w-[26%] items-center justify-center"
          style={{
            background: "var(--accent)",
          }}
        >
          <div className="flex rotate-[-90deg] flex-col items-center px-5 whitespace-nowrap">
            <h2
              className="text-center leading-none uppercase"
              style={{
                color: "white",
                fontFamily: "var(--font-primary)",
                fontSize: "calc(var(--font-size-accent) * 0.95)",
                letterSpacing: "0.18em",
              }}
            >
              {printableTitle}
            </h2>

            <p
              className="mt-4 text-center uppercase"
              style={{
                color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-secondary)",
                fontSize: "calc(var(--font-size-secondary) * 0.50)",
                letterSpacing: "0.35em",
              }}
            >
              {message}
            </p>

            <div
              className="mt-8"
              style={{
                color: "white",
                fontSize: "calc(var(--font-size-primary) * 1.8)",
              }}
            >
              ✦
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="flex flex-1 flex-col"
          style={{
            background: "var(--surface-card)",
          }}
        >
          {/* TOP */}
          <div
            className="flex h-[28%] items-center justify-center"
            style={{
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div className="px-4 text-center">
              <h1
                className="leading-[1.1] break-words uppercase"
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-accent)",
                  fontSize: "calc(var(--font-size-accent) * 1.1)",
                  letterSpacing: "0.18em",
                }}
              >
                {inviteData.brideName}
              </h1>

              <div
                className="my-1"
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-primary)",
                  fontSize: "calc(var(--font-size-primary) * 1.1)",
                }}
              >
                &
              </div>

              <h1
                className="leading-[1.1] break-words uppercase"
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-accent)",
                  fontSize: "calc(var(--font-size-accent) * 1.1)",
                  letterSpacing: "0.18em",
                }}
              >
                {inviteData.groomName}
              </h1>
            </div>
          </div>

          {/* IMAGE */}
          {printable?.includes?.includes("Gallery") && (
            <div className="flex-1 overflow-hidden">
              <img src={coverImage} alt="Wedding" className="h-full w-full object-cover" />
            </div>
          )}

          {/* FOOTER */}
          <div className="flex h-[26%] flex-col items-center justify-center px-6 text-center">
            <div
              className="mb-4 h-[2px] w-10"
              style={{
                background: "var(--accent)",
              }}
            />

            <h3
              className="uppercase"
              style={{
                color: "var(--primary)",
                fontFamily: "var(--font-primary)",
                fontSize: "calc(var(--font-size-primary) * 1.05)",
                letterSpacing: "0.2em",
              }}
            >
              {eventDate}
            </h3>

            <p
              className="mt-5 leading-6 uppercase"
              style={{
                color: "var(--secondary)",
                fontFamily: "var(--font-secondary)",
                fontSize: "calc(var(--font-size-secondary) * 0.55)",
                letterSpacing: "0.25em",
              }}
            >
              {eventTime}

              <br />

              {venue}
            </p>

            <p
              className="mt-4 max-w-[260px] leading-5 uppercase"
              style={{
                color: "var(--secondary)",
                fontFamily: "var(--font-secondary)",
                fontSize: "calc(var(--font-size-secondary) * 0.48)",
                letterSpacing: "0.35em",
                opacity: 0.8,
              }}
            >
              {address}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
