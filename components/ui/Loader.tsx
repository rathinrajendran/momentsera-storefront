import styled from "styled-components";

function Loader() {
  return (
    <Wrapper>
      <Loaders />
    </Wrapper>
  );
}

export default Loader;
const Wrapper = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
`;
const Loaders = styled.div`
  position: relative;
  height: 100px;
  width: 100px;

  &:before,
  &:after {
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3) inset;
    border-radius: 50%;
    position: absolute;
    content: "";
    inset: 0;
  }
  &:after {
    animation: rotate 2s linear infinite;
    box-shadow: 0 2px 0 #ff3d00 inset;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
