import styled from "styled-components";
import { useControls } from "react-zoom-pan-pinch";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { fullScreenState, showThumbnailState } from "./atoms";
import { ReactComponent as Logo } from "./logo.svg";
import { ReactComponent as Logo2 } from "./logo2.svg";

const NavMenu = styled.ul`
  width: 100%;
  height: 60px;
  background-color: white;
  position: fixed;
  top: 0;
  z-index: 9999;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);

  li {
    margin: 0 20px;
    position: relative;
  }
  li:first-child {
    margin: 0 20px;
    position: absolute;
    left: 40px;
  }
`;

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

const Dropmenu = styled.ul`
  width: 100px;
  position: fixed;
  top: 50px;
  left: 15px;
  display: -ms-flexbox;
  display: flex;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-transform: scale(0.8);
  -ms-transform: scale(0.8);
  transform: scale(0.8);

  li {
    margin: 0 !important;
    padding: 0 !important;
    position: relative !important;
    left: 0 !important;
    margin-bottom: 10px !important;
  }
  button {
    width: 100%;
    height: 50px;
    background-color: white;
    border-radius: 20px;
    -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    color: rgba(0, 0, 0, 0.7);
    &:hover {
      background-color: aliceblue;
    }
  }
`;
const CompressButton = styled.button`
  width: 50px;
  height: 50px;
  color: #024ea2;
  border-radius: 10px;
  position: absolute;
  top: 5px;
  right: 40px;
  z-index: 100000;
  font-size: 20px;
  display: -ms-flexbox;
  display: flex;
  background-color: transparent;
  font-size: 25px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  border: 0;
  -webkit-transform: scale(0.8);
  -ms-transform: scale(0.8);
  transform: scale(0.8);
`;
function Nav({ windowWidth, isClick }) {
  const doc = document.documentElement;
  const { zoomIn, zoomOut, resetTransform } = useControls();
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
    console.log(newScale);
    if (newScale >= 25) {
      setCurrentScale(newScale);
    }
  };

  const resetZoom = () => {
    setCurrentScale(100);
    resetTransform();
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
    <NavMenu>
      {windowWidth <= 970 ? (
        <CompressButton onClick={resetZoom}>
          <i className="fa-solid fa-compress"></i>
        </CompressButton>
      ) : null}

      {isClick && windowWidth <= 970 ? (
        <>
          <Dropmenu $isClick={isClick}>
            <li className="plus">
              <NabButton onClick={() => handleZoomIn(0.2, 200)}>
                <i className="fa-solid fa-magnifying-glass-plus"></i>
              </NabButton>
            </li>
            <li className="minus">
              <NabButton onClick={() => handleZoomOut(0.2, 200)}>
                <i className="fa-solid fa-magnifying-glass-minus"></i>
              </NabButton>
            </li>
            <li className="thumbnail">
              <NabButton
                onClick={HandleshowThumbnail}
                $isactive={showThumbnail}
              >
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
          </Dropmenu>
        </>
      ) : null}
      {windowWidth <= 970 ? (
        <>
          <li
            className="Mobile-logo"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              left: 0,
            }}
          >
            <Logo2 width={150} height={40} />
          </li>
        </>
      ) : (
        <>
          <li className="logo">
            <Logo2 width={150} height={40} />
          </li>
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
        </>
      )}

      {/* <li className="search">
        <NabButton>
          <i className="fa-solid fa-magnifying-glass"></i>
        </NabButton>
      </li> */}
    </NavMenu>
  );
}

export default Nav;
