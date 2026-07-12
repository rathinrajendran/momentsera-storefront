"use client";

import styled from "styled-components";
import BlurText from "../../../components/bits/BlurText";
import { Input } from "../../../components/ui/input";

export const HomeWrapper = styled.div`
  background: #ffffff;
  width: 100%;
  .wave {
    display: flex;
    gap: 5px;
    height: 14px;
  }

  .wave span {
    width: 2.5px;
    background: currentColor;
    border-radius: 2px;
    animation: wave 1s infinite ease-in-out;
  }

  .wave span:nth-child(2) {
    animation-delay: 0.1s;
  }
  .wave span:nth-child(3) {
    animation-delay: 0.2s;
  }
  .wave span:nth-child(4) {
    animation-delay: 0.3s;
  }

  @keyframes wave {
    0%,
    100% {
      height: 4px;
    }
    50% {
      height: 14px;
    }
  }
`;
export const BlurTextWrapper = styled(BlurText)`
  font-size: clamp(1.6rem, 4vw, 2.7rem);
  justify-content: center;
  letter-spacing: -0.5px;
  font-weight: 800;
  line-height: 1.2;
  color: #373a3c;
  max-width: 550px;
  margin: 0 auto;
`;

export const StarBorderWrapper = styled.div`
  .star-border-container {
    border-radius: 30px;
    .border-gradient-bottom {
      background: radial-gradient(circle, rgb(150 78 27), transparent 10%) !important;
    }
    .border-gradient-top {
      background: radial-gradient(circle, rgb(150 78 27), transparent 10%) !important;
    }
    .inner-content {
      position: relative;
      background: linear-gradient(to bottom, #fffefd, #fef9f5);
      border: 1px solid #fce1ce;
      color: #b47d57;
      font-size: 16px;
      text-align: center;
      padding: 16px 26px;
      border-radius: 46px;
      z-index: 1;
      cursor: pointer;
      &:hover {
        background: linear-gradient(to bottom, #fffefd, #fde9db);
      }
    }
  }
`;

export const Subscription = styled.p`
  font-size: clamp(0.8rem, 4vw, 0.8rem);
  margin: 15px auto 0 auto !important;
  line-height: 1.6;
  position: relative;
  max-width: 550px;
  font-weight: 400;
  letter-spacing: 0.8px;
  padding: 10px 0 0 0;
  color: #232323;
`;
export const DescriptionBlock = styled.div`
  padding: 0 5vw 10vh 5vw;
  text-align: center;
`;
export const DescriptionTextH3 = styled.h3`
  font-size: clamp(1.6rem, 4vw, 3.8rem);
  font-weight: 700;
  line-height: 1.2;
  color: #373a3c;
  letter-spacing: -1.5px;
  margin: 0 auto;
  position: relative;
`;

export const DescriptionTextH5 = styled.h5`
  font-size: clamp(1.6rem, 4vw, 3.1rem);
  font-weight: 700;
  line-height: 1.5;
  color: #94a397;
  letter-spacing: -1.5px;
  margin: 0 auto;
  position: relative;
`;
export const MainBlock = styled.div``;
export const FormInput = styled(Input)``;
export const Screen = styled.div`
  display: flex;
  justify-content: center;
  img {
    width: 100%;
    height: auto;
    display: block;
    transform: translateY(0);
    transition: transform 3s ease-in-out;
  }
  &:hover {
    img {
      transform: translateY(calc(-100% + 300px));
    }
  }
`;

export const OverFlowScreen = styled.div`
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
    display: block;
    transform: translateY(0);
    transition: transform 3s ease-in-out;
  }
  &:hover {
    img {
      transform: translateY(calc(-100% + 300px));
    }
  }
`;
export const MobileOverFlowScreen = styled.div`
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
    display: block;
    transform: translateY(0);
    transition: transform 3s ease-in-out;
  }
  &:hover {
    img {
      transform: translateY(calc(-100% + 200px));
    }
  }
`;
export const Wrapper = styled.div`
  width: 70px;
  height: 70px;
  background: red;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 0 0 10px #000000;
`;

export const OverFlowBlock = styled.div`
  background: red;
  overflow: hidden;
  height: calc(100dvh - 87px);
`;
