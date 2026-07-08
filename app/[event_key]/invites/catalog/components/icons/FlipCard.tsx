"use client";

import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

type FlipCardProps = {
  value: string | number;
};

const flipTop = keyframes`
  0% {
    transform: rotateX(0deg);
    z-index: 2;
  }

  100% {
    transform: rotateX(-90deg);
    opacity: 0;
  }
`;

const flipBottom = keyframes`
  0% {
    transform: rotateX(90deg);
    opacity: 0;
  }

  100% {
    transform: rotateX(0deg);
    opacity: 1;
  }
`;

const Piece = styled.span<{ $flip: boolean }>`
  display: inline-block;

  ${({ $flip }) =>
    $flip &&
    css`
      .card__back::before {
        animation: ${flipTop} 0.3s cubic-bezier(0.37, 0.01, 0.94, 0.35);
        animation-fill-mode: both;
        transform-origin: center bottom;
      }

      .card__back .card__bottom {
        animation: ${flipBottom} 0.6s cubic-bezier(0.15, 0.45, 0.28, 1);
        animation-fill-mode: both;
        transform-origin: center top;
      }
    `}
`;

const Card = styled.span`
  display: block;
  position: relative;
  padding-bottom: 0.72em;
  font-size: 72px;
  line-height: 0.95;
`;

const SharedFace = css`
  display: block;
  width: 1.8em;
  height: 0.72em;

  padding: 0.25em;

  color: #fff;
  background: #2563eb;

  border-radius: 16px 16px 0 0;

  transform-style: preserve-3d;
  backface-visibility: hidden;
`;

const Top = styled.span`
  ${SharedFace};
  overflow: hidden;
`;

const Bottom = styled.span`
  ${SharedFace};

  position: absolute;
  top: 50%;
  left: 0;

  overflow: hidden;

  background: #1d4ed8;

  border-top: 1px solid rgba(0, 0, 0, 0.25);

  border-radius: 0 0 16px 16px;

  &::after {
    content: attr(data-value);
    display: block;
    margin-top: -0.72em;
  }
`;

const Back = styled.span`
  position: absolute;
  inset: 0;
  pointer-events: none;

  &::before {
    content: attr(data-value);

    display: block;
    overflow: hidden;

    background: #2563eb;
    color: white;

    width: 1.8em;
    height: 0.72em;

    padding: 0.25em;

    border-radius: 16px 16px 0 0;

    position: relative;
    z-index: -1;
  }
`;

export default function FlipCard({ value }: FlipCardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value === displayValue) return;

    setFlip(true);

    const timer = setTimeout(() => {
      setDisplayValue(value);
      setFlip(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [value, displayValue]);

  return (
    <Piece $flip={flip}>
      <Card>
        <Top>{displayValue}</Top>

        <Bottom className="card__bottom" data-value={displayValue} />

        <Back className="card__back" data-value={displayValue}>
          <Bottom className="card__bottom" data-value={value} />
        </Back>
      </Card>
    </Piece>
  );
}
