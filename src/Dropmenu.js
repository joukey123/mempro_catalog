import styled from "styled-components";
import { useControls } from "react-zoom-pan-pinch";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { fullScreenState, showThumbnailState } from "./atoms";
import { ReactComponent as Logo } from "./logo.svg";
import { ReactComponent as Logo2 } from "./logo2.svg";

const DropmenuContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${({ isClick }) => (isClick ? "0" : "-280px")}; /* 슬라이딩 효과 */
  width: 280px;
  height: 100%;
  background-color: #f0f0f0;
  transition: right 0.3s ease; /* 슬라이딩 애니메이션 */
  z-index: 9999;
`;
const DropUl = styled.ul``;

const NabButton = styled.button`
  background-color: transparent;
  font-size: 25px;
  border: 0;
  color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
  padding: 10px;

  ${({ $isactive }) => $isactive && `background-color: #F0F8FF;`};
  &:hover {
    background-color: aliceblue;
  }
`;

function Dropmenu({ isClick }) {
  const doc = document.documentElement;
  const { zoomIn, zoomOut } = useControls();
  const [currentScale, setCurrentScale] = useState(100);
  const [showThumbnail, setShowThumbnail] = useRecoilState(showThumbnailState);
  const [fullScreen, setFullScreen] = useRecoilState(fullScreenState);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.keyCode === 27) {
        // Escape 키 눌렀을 때 실행할 작업
        setFullScreen((prev) => !prev); // 예를 들어 썸네일을 닫는 작업 수행
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleZoomIn = (num, speed) => {
    zoomIn(num, speed);
    const newScale = Math.round((currentScale + 25) * 100) / 100; // %로 표현하기 위해 100을 곱함
    if (newScale <= 200) {
      setCurrentScale(newScale);
    }
  };
  const handleZoomOut = (num, speed) => {
    zoomOut(num, speed);
    const newScale = Math.round((currentScale - 25) * 100) / 100; // %로 표현하기 위해 100을 곱함
    if (newScale >= 100) {
      setCurrentScale(newScale);
    }
  };

  const naveToggle = (menu) => {
    if (menu === "full") {
      openFullScreenMode();
      setFullScreen((prev) => !prev);
    }
  };
  const HandleshowThumbnail = () => {
    setShowThumbnail((prev) => !prev);
  };
  function openFullScreenMode() {
    if (doc.requestFullscreen) doc.requestFullscreen();
    else if (doc.webkitRequestFullscreen)
      // Chrome, Safari (webkit)
      doc.webkitRequestFullscreen();
    else if (doc.mozRequestFullScreen)
      // Firefox
      doc.mozRequestFullScreen();
    else if (doc.msRequestFullscreen)
      // IE or Edge
      doc.msRequestFullscreen();
  }

  return (
    <DropmenuContainer isClick={isClick}>
      <DropUl>
        <li className="minus">
          <NabButton onClick={() => handleZoomOut(0.2, 200)}>
            <i className="fa-solid fa-magnifying-glass-minus"></i>
          </NabButton>
        </li>
        <li className="scale-indicator">{currentScale}%</li>

        <li className="plus">
          <NabButton onClick={() => handleZoomIn(0.2, 200)}>
            <i className="fa-solid fa-magnifying-glass-plus"></i>
          </NabButton>
        </li>
        <li className="full">
          <NabButton onClick={() => naveToggle("full")}>
            <i className="fa-solid fa-expand"></i>
          </NabButton>
        </li>
        <li className="thumbnail">
          <NabButton onClick={HandleshowThumbnail} $isactive={showThumbnail}>
            <i className="fa-solid fa-newspaper"></i>
          </NabButton>
        </li>
        <li className="mail">
          <NabButton>
            <a href="mailto:mempro_group@mempro.co.kr">
              <i className="fa-solid fa-envelope"></i>
            </a>
          </NabButton>
        </li>
      </DropUl>
    </DropmenuContainer>
  );
}

export default Dropmenu;
