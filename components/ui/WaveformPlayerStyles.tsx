import styled from "styled-components";

export const WaveWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgb(148 163 151);
  padding: 5px 6px 5px 15px;
  border-radius: 40px;
  width: 170px;
`;

export const Waveform = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const WaveButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: #ffffff;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;

  &:active {
    transform: scale(0.95);
  }
`;
