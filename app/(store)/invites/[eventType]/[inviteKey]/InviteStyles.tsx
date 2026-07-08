import styled, { keyframes } from "styled-components";
const moveLeftToRight = keyframes`
  0%   { transform: translateX(-10px) translateY(-10px) scale(1.2); }
  40%  { transform: translateX(6px) translateY(-4px) scale(1.9); }
  70%  { transform: translateX(30px) translateY(-28px) scale(1.9); }
  100% { transform: translateX(-10px) translateY(-10px) scale(1.2); }
`;

export const MapBlock = styled.div`
  margin-top: 24px;
  overflow: hidden;
  height: 185px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    animation: ${moveLeftToRight} 18s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
    will-change: transform;

    &:hover {
      animation-play-state: paused;
    }
  }
`;
export const TimeBlock = styled.div``;
export const BgBlock = styled.div`
  position: relative;
  height: 300px;

  background-position: bottom right;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 0 0 0 5vw;
  margin: 10vh 0 0 0;
`;
export const BgImage = styled.img`
  border-radius: 5px;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right bottom;
`;
export const TimeNumber = styled.div``;
export const Togo = styled.div`
  display: inline-block;
`;
export const TimeLabel = styled.div`
  padding: 0 15px 0 0;
`;
export const DaysToGO = styled.div`
  justify-content: flex-start;
  position: relative;
  margin: -5vh 0 30px 0;
  display: flex;
  z-index: 9;

  h1 {
    font-size: clamp(1.6rem, 4vw, 4.7rem);
    font-weight: 500;
  }
  h3 {
    font-size: clamp(1.6rem, 4vw, 2.7rem);
    font-weight: 400;
    text-transform: uppercase;
  }
  h6 {
    font-size: clamp(1.6rem, 4vw, 1.7rem);
    font-weight: 400;
    text-transform: uppercase;
  }
`;
export const ProductUL = styled.ul`
  padding: 0 0 0 20px;
  li {
    margin-bottom: 10px;
    padding: 0 0 0 5px;
    list-style: circle;
  }
  h5 {
    font-size: clamp(0.9rem, 3vw, 0.5rem);
    font-weight: 500;
    letter-spacing: 0.2px;
    color: #37474f;
  }
  p {
    color: #455a64;
  }
`;
export const TitleBlock = styled.div`
  h1 {
    font-size: clamp(1.6rem, 4vw, 2.7rem);
    font-weight: 700;
    padding: 0 0 0 3vw;
  }
  h6 {
    font-size: clamp(1rem, 4vw, 1rem);
    font-weight: 200;
    padding: 0 0 0 6vw;
    max-width: 500px;
  }
`;
export const Title = styled.div``;
export const WaveWrapper = styled.div`
  justify-content: center;
  display: inline-flex;
  align-items: center;
  flex-flow: column;
`;
export const GallerImage = styled.div`
  height: 100px;
  img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;
export const CarouselImage = styled.img`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;
export const CarouselBlock = styled.div`
  .overflow-hidden[data-slot="carousel-content"] {
    height: 100%;
  }
`;
