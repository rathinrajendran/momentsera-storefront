import { useState, useEffect, useRef } from "react";

const CSS = `
  .flip-clock__piece {
    display: inline-block;
    margin: 0;
    box-sizing: border-box;
    text-align: end;
  }
  .flip-clock__piece *, .flip-clock__piece *::before, .flip-clock__piece *::after {
    box-sizing: border-box;
  }
  .card {
    display: block;
    position: relative;
    padding-bottom: 25px;
    font-size: 30px;
    line-height: 25px;
    text-align: center;
  }
  .card__top,
  .card__bottom,
  .card__back::before,
  .card__back::after {
    display: block;
    height: 25px;
    color: #ccc;
    background: #1565C0;
    padding: 12px 5px 0px 5px;
    border-radius: 8px 8px 0 0;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    width: 50px;
    transform: translateZ(0);
  }
  .card__bottom {
    color: #fff;
    position: absolute;
    top: 50%;
    left: 0;
    background: #2196F3;
    border-radius: 0 0 8px 8px;
    pointer-events: none;
    overflow: hidden;
  }
  .card__bottom::after {
    display: block;
    margin-top: -25px;
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

interface FlipCardProps {
  value: number;
}

function FlipCard({ value }: FlipCardProps) {
  const pieceRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef<string | null>(null);
  const topRef = useRef<HTMLElement>(null);
  const bottomRef = useRef<HTMLElement>(null);
  const backRef = useRef<HTMLElement>(null);
  const backBottomRef = useRef<HTMLElement>(null);

  const formatted = String(value).padStart(2, "0");

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
    void piece.offsetWidth;
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
    </span>
  );
}

const SEQUENCE = [28, 29, 30];

export default function AnimatedFlipClock() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SEQUENCE.length);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        minHeight: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: "400px",
      }}
    >
      <FlipCard value={SEQUENCE[index]} />
    </div>
  );
}
