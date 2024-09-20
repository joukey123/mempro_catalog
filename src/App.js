import "./reset.css";
import "./App.css";
import { pdfjs, Document, Page } from "react-pdf";

import pcPDF from "./mempro_catalog_NEW.pdf";
import mobilePDF from "./mempro_catalog_OUT.pdf";
import Controller from "./Controller";
import ThumbnailBox from "../Thumbnail";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { numPagesState, showThumbnailState } from "./atoms";
import Nav from "./Nav";
import styled, { createGlobalStyle } from "styled-components";
import { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { useGlobalContext } from "./context";
import "react-pdf/dist/Page/TextLayer.css";
import pdfsLow from "./mempro_catalog_min.pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const GlobalStyle = createGlobalStyle`
body {
  font-family: "Noto Sans KR", sans-serif;
}
`;

const Viewbox = styled.div`
  width: 100%;
  /* height: calc(100% - 0px); */
  height: ${(props) => props.$windowHeight - 0}px;
  background-color: #f3f5f6;
`;

const PageWrap = styled.div`
  display: -ms-flexbox;
  display: flex;
  display: -webkit-box;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .react-pdf__Page__canvas {
    width: ${(props) => props.$windowWidth}px !important;
    height: auto !important;
    /* max-width: 800px !important; */
    max-width: ${(props) =>
      props.$windowWidth >= 970
        ? `${props.$windowWidth * 0.9}px `
        : `calc(${props.$windowWidth}px * 0.9)`} !important;

    /* ${(props) =>
      props.windowHeight &&
      `
    height: ${props.windowHeight}px !important;
    width: auto !important;
    max-height: 1000px;
   `} */
  }
`;

const Thumbnail = styled.div`
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  z-index: 99999;
`;
const Hambuger = styled.button`
  width: 50px;
  height: 50px;
  color: #024ea2;
  border-radius: 10px;
  position: absolute;
  top: 5px;
  left: 40px;
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
const Modal = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 99999999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.9);
  button {
    background-color: transparent;
    font-size: 20px;
    color: white;
    border: 0;
    margin-bottom: 20px;
    text-align: right;
    width: ${(props) => (props.$windowWidth <= 970 ? "90%" : "50%")};
    cursor: pointer;
  }
`;
const Video = styled.video`
  width: ${(props) => (props.$windowWidth <= 970 ? "90%" : "50%")};
  position: relative;
`;
const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  standardFontDataUrl: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css`,
};

function App() {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const { windowSize, pageNumber, setPageNumber, isPlay, setIsPlay } =
    useGlobalContext();
  const [videoState, setVideoState] = useState(0);
  const setNumPages = useSetRecoilState(numPagesState);
  const showThumbnail = useRecoilValue(showThumbnailState);
  const [isClick, setIsClick] = useState(false);
  const [initialWidth, setInitialWidth] = useState(
    (windowSize.width - windowSize.width * 0.75) / 2
  );
  const [initialHeight, setInitialHeight] = useState(
    (windowSize.height - windowSize.height * 1.1) / 2
  );

  const onSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  const handleContextMenu = (event) => {
    event.preventDefault(); // 우클릭 기본 동작 막기
  };
  const videolink = (text) => {
    if (text === "sanding") {
      setVideoState(1);
    } else if (text === "bending") {
      setVideoState(2);
    } else if (text === "prober") {
      setVideoState(3);
    } else if (text === "mask") {
      setVideoState(4);
    } else if (text === "tester") {
      setVideoState(5);
    } else if (text === "pogo") {
      setVideoState(6);
    } else if (text === "rubber") {
      setVideoState(7);
    }
    setIsPlay(true);
  };

  useEffect(() => {
    setInitialWidth((windowSize.width - windowSize.width * 0.75) / 2);
    setInitialHeight((windowSize.height - windowSize.height * 0.9 - 120) / 2);
    if (windowSize.width > 970 && pageNumber % 2 === 0) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  }, [windowSize.width]);

  return (
    <div>
      <GlobalStyle />

      <TransformWrapper
        initialScale={0.75}
        initialPositionX={initialWidth}
        initialPositionY={initialHeight}
        minScale={0.6}
        maxScale={2}
        wheel={{ activationKeys: ["Control", "Shift"] }}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <Nav windowWidth={windowSize.width} isClick={isClick} />
            <Viewbox
              className="viewBox"
              onContextMenu={handleContextMenu}
              $windowHeight={windowSize.height}
            >
              <TransformComponent>
                {isMobile ||
                (windowSize.width <= 970 &&
                  windowSize.width / windowSize.height < 1.5) ? (
                  <Document
                    file={mobilePDF}
                    onLoadSuccess={onSuccess}
                    options={options}
                  >
                    {windowSize.width <= 970 &&
                      windowSize.width / windowSize.height < 1.5 && (
                        <PageWrap
                          $windowWidth={windowSize.width}
                          style={{ fontFamily: "noto" }}
                        >
                          <Page
                            pageNumber={pageNumber}
                            renderTextLayer={false}
                            scale={96 / 72}
                          >
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible one" : "hidden"
                              }`}
                              onClick={() => setPageNumber(4)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible two" : "hidden"
                              }`}
                              onClick={() => setPageNumber(5)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible three" : "hidden"
                              }`}
                              onClick={() => setPageNumber(6)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible four" : "hidden"
                              }`}
                              onClick={() => setPageNumber(9)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible five" : "hidden"
                              }`}
                              onClick={() => setPageNumber(12)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible six" : "hidden"
                              }`}
                              onClick={() => setPageNumber(15)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible seven" : "hidden"
                              }`}
                              onClick={() => setPageNumber(16)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible eight" : "hidden"
                              }`}
                              onClick={() => setPageNumber(17)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible nine" : "hidden"
                              }`}
                              onClick={() => setPageNumber(18)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible ten" : "hidden"
                              }`}
                              onClick={() => setPageNumber(20)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible ten-one" : "hidden"
                              }`}
                              onClick={() => setPageNumber(21)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible ten-two" : "hidden"
                              }`}
                              onClick={() => setPageNumber(22)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2
                                  ? "visible ten-three"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(24)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible ten-four" : "hidden"
                              }`}
                              onClick={() => setPageNumber(25)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible ten-five" : "hidden"
                              }`}
                              onClick={() => setPageNumber(25)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible ten-six" : "hidden"
                              }`}
                              onClick={() => setPageNumber(26)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2
                                  ? "visible ten-seven"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(28)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2
                                  ? "visible ten-eight"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(30)}
                            />
                            <div
                              className={`page-2-only ${
                                pageNumber === 2 ? "visible ten-nine" : "hidden"
                              }`}
                              onClick={() => setPageNumber(32)}
                            />

                            {/* 모바일3 */}
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible one" : "hidden"
                              }`}
                              onClick={() => setPageNumber(36)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible two" : "hidden"
                              }`}
                              onClick={() => setPageNumber(38)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible three" : "hidden"
                              }`}
                              onClick={() => setPageNumber(40)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible four" : "hidden"
                              }`}
                              onClick={() => setPageNumber(42)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible five" : "hidden"
                              }`}
                              onClick={() => setPageNumber(44)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible six" : "hidden"
                              }`}
                              onClick={() => setPageNumber(46)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible seven" : "hidden"
                              }`}
                              onClick={() => setPageNumber(48)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible eight" : "hidden"
                              }`}
                              onClick={() => setPageNumber(50)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible nine" : "hidden"
                              }`}
                              onClick={() => setPageNumber(52)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible ten" : "hidden"
                              }`}
                              onClick={() => setPageNumber(54)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible ten-one" : "hidden"
                              }`}
                              onClick={() => setPageNumber(56)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible ten-two" : "hidden"
                              }`}
                              onClick={() => setPageNumber(58)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3
                                  ? "visible ten-three"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(60)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible ten-four" : "hidden"
                              }`}
                              onClick={() => setPageNumber(62)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible ten-five" : "hidden"
                              }`}
                              onClick={() => setPageNumber(64)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3 ? "visible ten-six" : "hidden"
                              }`}
                              onClick={() => setPageNumber(66)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3
                                  ? "visible ten-seven"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(68)}
                            />
                            <div
                              className={`page-3-only-m ${
                                pageNumber === 3
                                  ? "visible ten-eight"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(70)}
                            />
                            <div
                              className={`page-17-only-m ${
                                pageNumber === 17
                                  ? "visible seventeen-one"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(16)}
                            />
                            <div
                              className={`page-17-only-m ${
                                pageNumber === 17
                                  ? "visible seventeen-two"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(18)}
                            />
                            <div
                              className={`page-17-only-m ${
                                pageNumber === 17
                                  ? "visible seventeen-three"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(21)}
                            />
                            <div
                              className={`page-24-only-m ${
                                pageNumber === 24
                                  ? "visible twofour-one"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(16)}
                            />
                            <div
                              className={`page-24-only-m ${
                                pageNumber === 24
                                  ? "visible twofour-two"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(25)}
                            />
                            <div
                              className={`page-24-only-m ${
                                pageNumber === 24
                                  ? "visible twofour-three"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(25)}
                            />
                            <div
                              className={`page-24-only-m ${
                                pageNumber === 24
                                  ? "visible twofour-four"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(25)}
                            />
                            <div
                              className={`page-24-only-m ${
                                pageNumber === 24
                                  ? "visible twofour-five"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(25)}
                            />
                            <div
                              className={`page-24-only-m ${
                                pageNumber === 24
                                  ? "visible twofour-six"
                                  : "hidden"
                              }`}
                              onClick={() => setPageNumber(26)}
                            />

                            {/* 비디오 */}
                            <div
                              className={`page-37-only ${
                                pageNumber === 37 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("sanding");
                              }}
                            />
                            <div
                              className={`page-39-only ${
                                pageNumber === 39 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("sanding");
                              }}
                            />
                            <div
                              className={`page-41-only ${
                                pageNumber === 41 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("sanding");
                              }}
                            />
                            <div
                              className={`page-43-only ${
                                pageNumber === 43 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("sanding");
                              }}
                            />
                            <div
                              className={`page-45-only ${
                                pageNumber === 45 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("sanding");
                              }}
                            />
                            <div
                              className={`page-47-only ${
                                pageNumber === 47 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("bending");
                              }}
                            />
                            <div
                              className={`page-49-only ${
                                pageNumber === 49 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("prober");
                              }}
                            />
                            <div
                              className={`page-51-only ${
                                pageNumber === 51 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("prober");
                              }}
                            />
                            <div
                              className={`page-53-only ${
                                pageNumber === 53 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("prober");
                              }}
                            />
                            <div
                              className={`page-55-only ${
                                pageNumber === 55 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("prober");
                              }}
                            />
                            <div
                              className={`page-57-only ${
                                pageNumber === 57 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("mask");
                              }}
                            />
                            <div
                              className={`page-59-only ${
                                pageNumber === 59 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("tester");
                              }}
                            />
                            <div
                              className={`page-61-only ${
                                pageNumber === 61 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("tester");
                              }}
                            />
                            <div
                              className={`page-63-only ${
                                pageNumber === 63 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("pogo");
                              }}
                            />
                            <div
                              className={`page-65-only ${
                                pageNumber === 65 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("pogo");
                              }}
                            />
                            <div
                              className={`page-67-only ${
                                pageNumber === 67 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("rubber");
                              }}
                            />
                            <div
                              className={`page-69-only ${
                                pageNumber === 69 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("rubber");
                              }}
                            />
                            <div
                              className={`page-71-only ${
                                pageNumber === 71 ? "visible video" : "hidden"
                              }`}
                              onClick={() => {
                                videolink("rubber");
                              }}
                            />
                          </Page>
                        </PageWrap>
                      )}
                  </Document>
                ) : (
                  <Document
                    file={pcPDF}
                    onLoadSuccess={onSuccess}
                    options={options}
                  >
                    {/* {windowSize.width / windowSize.height > 2 && (
                    <PageWrap $windowWidth={windowSize.width}>
                      {pageNumber === 1 ? (
                        <Page
                          pageNumber={1}
                          renderTextLayer={false}
                          height={windowSize.height * 0.8}
                        />
                      ) : pageNumber === 72 ? (
                        <Page pageNumber={72} renderTextLayer={false} />
                      ) : (
                        <>
                          <Page
                            pageNumber={pageNumber - 1}
                            renderTextLayer={false}
                          />
                          {pageNumber > 72 ? null : (
                            <Page
                              pageNumber={pageNumber}
                              renderTextLayer={false}
                            />
                          )}
                        </>
                      )}
                    </PageWrap>
                  )} */}

                    {windowSize.width > 970 &&
                      windowSize.width / windowSize.height >= 1.5 && (
                        <PageWrap>
                          {pageNumber === 1 ? (
                            <Page
                              pageNumber={1}
                              renderTextLayer={false}
                              height={windowSize.height - 120 * 0.8}
                              scale={96 / 72}
                            />
                          ) : pageNumber === 72 ? (
                            <Page
                              pageNumber={72}
                              renderTextLayer={false}
                              height={windowSize.height - 120 * 0.8}
                              scale={96 / 72}
                            />
                          ) : (
                            <>
                              <Page
                                pageNumber={pageNumber - 1}
                                renderTextLayer={false}
                                height={windowSize.height - 120 * 0.8}
                                scale={96 / 72}
                              >
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible one" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(5)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible two" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(5)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible three"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(7)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible four" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(9)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible five" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(13)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible six" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(15)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible seven"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(17)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible eight"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(17)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible nine" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(19)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible ten" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(21)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-one"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(21)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-two"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(23)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-three"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-four"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-five"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-six"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(27)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-seven"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(29)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-eight"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(31)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-nine"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(33)}
                                />
                                <div
                                  className={`page-25-only ${
                                    pageNumber === 25
                                      ? "visible twofive-one"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(17)}
                                />
                                <div
                                  className={`page-25-only-m ${
                                    pageNumber === 25
                                      ? "visible twofive-two"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-25-only-m ${
                                    pageNumber === 25
                                      ? "visible twofive-three"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-25-only-m ${
                                    pageNumber === 25
                                      ? "visible twofive-four"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-25-only-m ${
                                    pageNumber === 25
                                      ? "visible twofive-five"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-25-only-m ${
                                    pageNumber === 25
                                      ? "visible twofive-six"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(27)}
                                />
                              </Page>
                              {pageNumber > 72 ? null : (
                                <Page
                                  pageNumber={pageNumber}
                                  renderTextLayer={false}
                                  height={windowSize.height - 120 * 0.8}
                                  scale={96 / 72}
                                >
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible one"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(37)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible two"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(39)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible three"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(41)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible four"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(43)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible five"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(45)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible six"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(47)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible seven"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(49)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible eight"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(51)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible nine"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(53)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(55)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-one"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(57)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-two"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(59)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-three"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(61)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-four"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(63)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-five"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(65)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-six"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(67)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-seven"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(69)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-eight"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(71)}
                                  />
                                  <div
                                    className={`page-17-only-m ${
                                      pageNumber === 17
                                        ? "visible seventeen-one"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(17)}
                                  />
                                  <div
                                    className={`page-17-only-m ${
                                      pageNumber === 17
                                        ? "visible seventeen-two"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(19)}
                                  />
                                  <div
                                    className={`page-17-only-m ${
                                      pageNumber === 17
                                        ? "visible seventeen-three"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(21)}
                                  />
                                  {/* 비디오 */}
                                  <div
                                    className={`page-37-only ${
                                      pageNumber === 37
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("sanding");
                                    }}
                                  />
                                  <div
                                    className={`page-39-only ${
                                      pageNumber === 39
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("sanding");
                                    }}
                                  />
                                  <div
                                    className={`page-41-only ${
                                      pageNumber === 41
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("sanding");
                                    }}
                                  />
                                  <div
                                    className={`page-43-only ${
                                      pageNumber === 43
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("sanding");
                                    }}
                                  />
                                  <div
                                    className={`page-45-only ${
                                      pageNumber === 45
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("sanding");
                                    }}
                                  />
                                  <div
                                    className={`page-47-only ${
                                      pageNumber === 47
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("bending");
                                    }}
                                  />
                                  <div
                                    className={`page-49-only ${
                                      pageNumber === 49
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("prober");
                                    }}
                                  />
                                  <div
                                    className={`page-51-only ${
                                      pageNumber === 51
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("prober");
                                    }}
                                  />
                                  <div
                                    className={`page-53-only ${
                                      pageNumber === 53
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("prober");
                                    }}
                                  />
                                  <div
                                    className={`page-55-only ${
                                      pageNumber === 55
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("prober");
                                    }}
                                  />
                                  <div
                                    className={`page-57-only ${
                                      pageNumber === 57
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("mask");
                                    }}
                                  />
                                  <div
                                    className={`page-59-only ${
                                      pageNumber === 59
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("tester");
                                    }}
                                  />
                                  <div
                                    className={`page-61-only ${
                                      pageNumber === 61
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("tester");
                                    }}
                                  />
                                  <div
                                    className={`page-63-only ${
                                      pageNumber === 63
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("pogo");
                                    }}
                                  />
                                  <div
                                    className={`page-65-only ${
                                      pageNumber === 65
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("pogo");
                                    }}
                                  />
                                  <div
                                    className={`page-67-only ${
                                      pageNumber === 67
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("rubber");
                                    }}
                                  />
                                  <div
                                    className={`page-69-only ${
                                      pageNumber === 69
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("rubber");
                                    }}
                                  />
                                  <div
                                    className={`page-71-only ${
                                      pageNumber === 71
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("rubber");
                                    }}
                                  />
                                </Page>
                              )}
                            </>
                          )}
                          {/* <div
                      className={`page-3-only ${
                        pageNumber === 3 ? "visible" : "hidden"
                      }`}
                    >
                      This div is only visible on page 3.
                    </div> */}
                        </PageWrap>
                      )}
                    {windowSize.width > 970 &&
                      windowSize.width / windowSize.height < 1.5 && (
                        <PageWrap $windowWidth={windowSize.width / 2}>
                          {pageNumber === 1 ? (
                            <Page
                              pageNumber={1}
                              renderTextLayer={false}
                              scale={96 / 72}
                            />
                          ) : pageNumber === 72 ? (
                            <Page
                              pageNumber={72}
                              renderTextLayer={false}
                              scale={96 / 72}
                            />
                          ) : (
                            <>
                              <Page
                                pageNumber={pageNumber - 1}
                                renderTextLayer={false}
                                scale={96 / 72}
                              >
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible one" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(5)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible two" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(5)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible three"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(7)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible four" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(9)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible five" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(13)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible six" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(15)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible seven"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(17)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible eight"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(17)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible nine" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(19)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3 ? "visible ten" : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(21)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-one"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(21)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-two"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(23)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-three"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-four"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-five"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-six"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(27)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-seven"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(29)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-eight"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(31)}
                                />
                                <div
                                  className={`page-3-only ${
                                    pageNumber === 3
                                      ? "visible ten-nine"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(33)}
                                />
                                <div
                                  className={`page-25-only ${
                                    pageNumber === 25
                                      ? "visible twofive-one"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(17)}
                                />
                                <div
                                  className={`page-25-only-m ${
                                    pageNumber === 25
                                      ? "visible twofive-two"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-25-only-m ${
                                    pageNumber === 25
                                      ? "visible twofive-three"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-25-only-m ${
                                    pageNumber === 25
                                      ? "visible twofive-four"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-25-only-m ${
                                    pageNumber === 25
                                      ? "visible twofive-five"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(25)}
                                />
                                <div
                                  className={`page-25-only-m ${
                                    pageNumber === 25
                                      ? "visible twofive-six"
                                      : "hidden"
                                  }`}
                                  onClick={() => setPageNumber(27)}
                                />
                              </Page>
                              {pageNumber > 72 ? null : (
                                <Page
                                  pageNumber={pageNumber}
                                  renderTextLayer={false}
                                  scale={96 / 72}
                                >
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible one"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(37)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible two"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(39)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible three"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(41)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible four"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(43)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible five"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(45)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible six"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(47)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible seven"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(49)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible eight"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(51)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible nine"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(53)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(55)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-one"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(57)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-two"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(59)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-three"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(61)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-four"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(63)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-five"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(65)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-six"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(67)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-seven"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(69)}
                                  />
                                  <div
                                    className={`page-3-only-r ${
                                      pageNumber === 3
                                        ? "visible ten-eight"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(71)}
                                  />
                                  <div
                                    className={`page-17-only-m ${
                                      pageNumber === 17
                                        ? "visible seventeen-one"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(17)}
                                  />
                                  <div
                                    className={`page-17-only-m ${
                                      pageNumber === 17
                                        ? "visible seventeen-two"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(19)}
                                  />
                                  <div
                                    className={`page-17-only-m ${
                                      pageNumber === 17
                                        ? "visible seventeen-three"
                                        : "hidden"
                                    }`}
                                    onClick={() => setPageNumber(21)}
                                  />

                                  {/* video link box */}
                                  <div
                                    className={`page-37-only ${
                                      pageNumber === 37
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("sanding");
                                    }}
                                  />
                                  <div
                                    className={`page-39-only ${
                                      pageNumber === 39
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("sanding");
                                    }}
                                  />
                                  <div
                                    className={`page-41-only ${
                                      pageNumber === 41
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("sanding");
                                    }}
                                  />
                                  <div
                                    className={`page-43-only ${
                                      pageNumber === 43
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("sanding");
                                    }}
                                  />
                                  <div
                                    className={`page-45-only ${
                                      pageNumber === 45
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("sanding");
                                    }}
                                  />
                                  <div
                                    className={`page-47-only ${
                                      pageNumber === 47
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("bending");
                                    }}
                                  />
                                  <div
                                    className={`page-49-only ${
                                      pageNumber === 49
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("prober");
                                    }}
                                  />
                                  <div
                                    className={`page-51-only ${
                                      pageNumber === 51
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("prober");
                                    }}
                                  />
                                  <div
                                    className={`page-53-only ${
                                      pageNumber === 53
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("prober");
                                    }}
                                  />
                                  <div
                                    className={`page-55-only ${
                                      pageNumber === 55
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("prober");
                                    }}
                                  />
                                  <div
                                    className={`page-57-only ${
                                      pageNumber === 57
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("mask");
                                    }}
                                  />
                                  <div
                                    className={`page-59-only ${
                                      pageNumber === 59
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("tester");
                                    }}
                                  />
                                  <div
                                    className={`page-61-only ${
                                      pageNumber === 61
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("tester");
                                    }}
                                  />
                                  <div
                                    className={`page-63-only ${
                                      pageNumber === 63
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("pogo");
                                    }}
                                  />
                                  <div
                                    className={`page-65-only ${
                                      pageNumber === 65
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("pogo");
                                    }}
                                  />
                                  <div
                                    className={`page-67-only ${
                                      pageNumber === 67
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("rubber");
                                    }}
                                  />
                                  <div
                                    className={`page-69-only ${
                                      pageNumber === 69
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("rubber");
                                    }}
                                  />
                                  <div
                                    className={`page-71-only ${
                                      pageNumber === 71
                                        ? "visible video"
                                        : "hidden"
                                    }`}
                                    onClick={() => {
                                      videolink("rubber");
                                    }}
                                  />
                                </Page>
                              )}
                            </>
                          )}
                          {/* <div
                          className={`page-3-only ${
                            pageNumber === 3 ? "visible" : "hidden"
                          }`}
                        >
                          This div is only visible on page 3.
                        </div> */}
                        </PageWrap>
                      )}
                  </Document>
                )}
              </TransformComponent>
              {showThumbnail && (
                <Thumbnail>
                  <Document
                    file={pdfsLow}
                    onLoadSuccess={onSuccess}
                    options={options}
                  >
                    <ThumbnailBox windowWidth={windowSize.width} />
                  </Document>
                </Thumbnail>
              )}
            </Viewbox>
          </>
        )}
      </TransformWrapper>
      {isPlay && (
        <Modal $windowWidth={windowSize.width}>
          <button onClick={() => setIsPlay(false)}>X</button>
          <Video controls autoPlay $windowWidth={windowSize.width}>
            {videoState === 1 && (
              <source
                src={`https://www.mempro.co.kr/sanding.mp4`}
                type="video/mp4"
              />
            )}
            {videoState === 2 && (
              <source
                src={`https://www.mempro.co.kr/bending.mp4`}
                type="video/mp4"
              />
            )}
            {videoState === 3 && (
              <source
                src={`https://www.mempro.co.kr/prober.mp4`}
                type="video/mp4"
              />
            )}
            {videoState === 4 && (
              <source
                src={`https://www.mempro.co.kr/mask.mp4`}
                type="video/mp4"
              />
            )}
            {videoState === 5 && (
              <source
                src={`https://www.mempro.co.kr/tester.mp4`}
                type="video/mp4"
              />
            )}
            {videoState === 6 && (
              <source
                src={`https://www.mempro.co.kr/pogo.mp4`}
                type="video/mp4"
              />
            )}
            {videoState === 7 && (
              <source
                src={`https://www.mempro.co.kr/rubber.mp4`}
                type="video/mp4"
              />
            )}
          </Video>
        </Modal>
      )}
      {windowSize.width <= 970 && (
        <>
          <Hambuger onClick={() => setIsClick((current) => !current)}>
            <i className="fa-solid fa-bars"></i>
          </Hambuger>
        </>
      )}
      <Controller windowWidth={windowSize.width} />
    </div>
  );
}

export default App;
