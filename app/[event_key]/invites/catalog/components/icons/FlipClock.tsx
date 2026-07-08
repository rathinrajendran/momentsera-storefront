import { useState, useEffect, useRef, useCallback } from "react";

// ─── Styles (injected once) ────────────────────────────────────────────────

const CSS = `
  .flip-clock {
    text-align: center;
    perspective: 400px;
    margin: 20px auto;
    display: flex;
    gap: 0;
  }
  .flip-clock *, .flip-clock *::before, .flip-clock *::after {
    box-sizing: border-box;
  }
  .flip-clock__piece {
    display: inline-block;
    margin: 0 5px;
  }
  .flip-clock__slot {
    font-size: 2vw;
    display: block;
    text-align: center;
    color: #aaa;
    margin-top: 4px;
  }
  .card {
    display: block;
    position: relative;
    padding-bottom: 0.72em;
    font-size: 9vw;
    line-height: 0.95;
  }
  .card__top,
  .card__bottom,
  .card__back::before,
  .card__back::after {
    display: block;
    height: 0.72em;
    color: #ccc;
    background: #222;
    padding: 0.25em 0.25em;
    border-radius: 0.15em 0.15em 0 0;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    width: 1.8em;
    transform: translateZ(0);
  }
  .card__bottom {
    color: #fff;
    position: absolute;
    top: 50%;
    left: 0;
    border-top: solid 1px #000;
    background: #393939;
    border-radius: 0 0 0.15em 0.15em;
    pointer-events: none;
    overflow: hidden;
  }
  .card__bottom::after {
    display: block;
    margin-top: -0.72em;
  }
  .card__back::before,
  .card__bottom::after {
    content: attr(data-value);
  }
  .card__back {
    position: absolute;
    top: 0;
    height: 100%;
    left: 0;
    pointer-events: none;
  }
  .card__back::before {
    position: relative;
    z-index: -1;
    overflow: hidden;
  }
  .flip-clock__piece.flip .card__back::before {
    animation: flipTop 0.3s cubic-bezier(.37,.01,.94,.35) both;
    transform-origin: center bottom;
  }
  .flip-clock__piece.flip .card__back .card__bottom {
    transform-origin: center top;
    animation: flipBottom 0.6s cubic-bezier(.15,.45,.28,1) both;
  }
  @keyframes flipTop {
    0% { transform: rotateX(0deg); z-index: 2; opacity: 0.99; }
    99% { opacity: 0.99; }
    100% { transform: rotateX(-90deg); opacity: 0; }
  }
  @keyframes flipBottom {
    0%, 50% { z-index: -1; transform: rotateX(90deg); opacity: 0; }
    51% { opacity: 0.99; }
    100% { opacity: 0.99; transform: rotateX(0deg); z-index: 5; }
  }
`;

function injectStyles() {
  if (document.getElementById("flip-clock-styles")) return;
  const style = document.createElement("style");
  style.id = "flip-clock-styles";
  style.textContent = CSS;
  document.head.appendChild(style);
}

// ─── FlipCard ─────────────────────────────────────────────────────────────

interface FlipCardProps {
  label: string;
  value: number;
}

function FlipCard({ label, value }: FlipCardProps) {
  const pieceRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef<string | null>(null);

  const formatted = String(value).padStart(2, "0");

  const topRef = useRef<HTMLElement>(null);
  const bottomRef = useRef<HTMLElement>(null);
  const backRef = useRef<HTMLElement>(null);
  const backBottomRef = useRef<HTMLElement>(null);

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    const piece = pieceRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    const back = backRef.current;
    const backBottom = backBottomRef.current;

    if (!piece || !top || !bottom || !back || !backBottom) return;

    if (prevValueRef.current !== null && prevValueRef.current !== formatted) {
      back.setAttribute("data-value", prevValueRef.current);
      bottom.setAttribute("data-value", prevValueRef.current);
    }

    prevValueRef.current = formatted;
    top.textContent = formatted;
    backBottom.setAttribute("data-value", formatted);

    piece.classList.remove("flip");
    void piece.offsetWidth; // reflow
    piece.classList.add("flip");
  }, [formatted]);

  return (
    <span ref={pieceRef} className="flip-clock__piece">
      <b className="card">
        <b ref={topRef as React.RefObject<HTMLElement>} className="card__top" />
        <b ref={bottomRef as React.RefObject<HTMLElement>} className="card__bottom" />
        <b ref={backRef as React.RefObject<HTMLElement>} className="card__back">
          <b ref={backBottomRef as React.RefObject<HTMLElement>} className="card__bottom" />
        </b>
      </b>
      <span className="flip-clock__slot">{label}</span>
    </span>
  );
}

// ─── Time helpers ─────────────────────────────────────────────────────────

interface TimeRemaining {
  Days: number;
  Hours: number;
  Minutes: number;
  Seconds: number;
  Total: number;
}

function getTimeRemaining(endTime: Date): TimeRemaining {
  const t = endTime.getTime() - Date.now();
  return {
    Total: t,
    Days: Math.floor(t / (1000 * 60 * 60 * 24)),
    Hours: Math.floor((t / (1000 * 60 * 60)) % 24),
    Minutes: Math.floor((t / 1000 / 60) % 60),
    Seconds: Math.floor((t / 1000) % 60),
  };
}

interface CurrentTime {
  Hours: number;
  Minutes: number;
  Seconds: number;
}

function getCurrentTime(): CurrentTime {
  const t = new Date();
  return {
    Hours: t.getHours() % 12,
    Minutes: t.getMinutes(),
    Seconds: t.getSeconds(),
  };
}

// ─── CountdownClock ────────────────────────────────────────────────────────

interface CountdownClockProps {
  /** ISO string or Date for the target time */
  deadline: Date | string;
  /** Called when countdown reaches zero */
  onComplete?: () => void;
}

export function CountdownClock({ deadline, onComplete }: CountdownClockProps) {
  const endTime = deadline instanceof Date ? deadline : new Date(Date.parse(deadline));
  const [time, setTime] = useState<TimeRemaining>(() => getTimeRemaining(endTime));
  const rafRef = useRef<number>(0);
  const frameCount = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let done = false;

    function tick() {
      if (done) return;
      rafRef.current = requestAnimationFrame(tick);

      if (frameCount.current++ % 10 !== 0) return;

      const t = getTimeRemaining(endTime);
      if (t.Total <= 0) {
        setTime({ Days: 0, Hours: 0, Minutes: 0, Seconds: 0, Total: 0 });
        cancelAnimationFrame(rafRef.current);
        done = true;
        onCompleteRef.current?.();
        return;
      }
      setTime(t);
    }

    const id = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, 500);

    return () => {
      done = true;
      clearTimeout(id);
      cancelAnimationFrame(rafRef.current);
    };
  }, [endTime]);

  return (
    <div className="flip-clock">
      <FlipCard label="Days" value={time.Days} />
      <FlipCard label="Hours" value={time.Hours} />
      <FlipCard label="Minutes" value={time.Minutes} />
      <FlipCard label="Seconds" value={time.Seconds} />
    </div>
  );
}

// ─── LiveClock ─────────────────────────────────────────────────────────────

export function LiveClock() {
  const [time, setTime] = useState<CurrentTime>(() => getCurrentTime());
  const rafRef = useRef<number>(0);
  const frameCount = useRef(0);

  useEffect(() => {
    let active = true;

    function tick() {
      if (!active) return;
      rafRef.current = requestAnimationFrame(tick);
      if (frameCount.current++ % 10 !== 0) return;
      setTime(getCurrentTime());
    }

    const id = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick);
    }, 500);

    return () => {
      active = false;
      clearTimeout(id);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="flip-clock">
      <FlipCard label="Hours" value={time.Hours} />
      <FlipCard label="Minutes" value={time.Minutes} />
      <FlipCard label="Seconds" value={time.Seconds} />
    </div>
  );
}

// ─── Demo ──────────────────────────────────────────────────────────────────

const deadline = new Date(Date.now() + 12 * 24 * 60 * 60 * 1000);

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#EEE",
        gap: "40px",
      }}
    >
      <CountdownClock deadline={deadline} onComplete={() => alert("Countdown complete!")} />
      <LiveClock />
    </div>
  );
}
