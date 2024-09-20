import React, { useContext, useEffect, useState } from "react";
import { numPagesState, pageNumberState } from "./atoms";
import { useRecoilState, useRecoilValue } from "recoil";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const numPages = useRecoilValue(numPagesState); //전체페이지 수
  const [pageNumber, setPageNumber] = useRecoilState(pageNumberState);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isPlay, setIsPlay] = useState(false);

  const goToPreviousPage = (first) => {
    if (pageNumber > 1) {
      windowSize.width <= 970
        ? setPageNumber(pageNumber - 1)
        : setPageNumber(pageNumber - 2);
    }
    if (pageNumber === numPages) {
      setPageNumber(pageNumber - 1);
    }
    if (first === 1) {
      setPageNumber(1);
    }
    setIsPlay(false);
  };
  const goToNextPage = (last) => {
    if (pageNumber < numPages) {
      windowSize.width <= 970
        ? setPageNumber(pageNumber + 1)
        : setPageNumber(pageNumber + 2);
    }
    if (pageNumber === numPages - 1) {
      setPageNumber(pageNumber + 1);
    }
    if (last === numPages) {
      setPageNumber(numPages);
    }
    setIsPlay(false);
  };

  // 윈도우 크기 변경 이벤트 핸들러
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    // 윈도우 크기 변경 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        pageNumber,
        numPages,
        setPageNumber,
        goToPreviousPage,
        goToNextPage,
        windowSize,
        isPlay,
        setIsPlay,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
