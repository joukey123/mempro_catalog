import React, { useMemo, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Thumbnail as PDFThumbnail } from "react-pdf";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { numPagesState, pageNumberState, showThumbnailState } from "./atoms";

const ThumbnailWrap = styled.div`
  display: -ms-flexbox;
  display: flex;
  display: -webkit-box;
  width: 100%;
  overflow-x: scroll;
  position: absolute;
  bottom: 0;
  background-color: #b2b2b2;
  padding: 3px;
  scroll-behavior: smooth; /* 부드러운 스크롤 효과를 적용합니다. */
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const ThumbnailLButton = styled.button`
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  width: 30px;
  height: 30px;
  color: white;
  left: 5px;
  bottom: 30px;
  border: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const ThumbnailRButton = styled.button`
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  width: 30px;
  height: 30px;
  color: white;
  right: 5px;
  bottom: 30px;
  border: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const ClostButton = styled.button`
  background-color: #b2b2b2;
  position: fixed;
  font-size: 15px;
  width: 30px;
  height: 30px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
  right: 0px;
  bottom: 92px;
  border: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const Thumbnail = styled(PDFThumbnail)`
  margin-right: ${(props) =>
    props.$windowWidth > 970 ? (props.index % 2 === 0 ? "3px" : "") : "3px"};

  /* ${({ index }) => (index % 2 === 0 ? "margin-right: 3px;" : "")} */
  ${({ isSelected }) =>
    isSelected &&
    `border-top: 2px solid #EE7D19; border-bottom: 2px solid #EE7D19;`}
`;

function ThumbnailBox({ windowWidth }) {
  const numPages = useRecoilValue(numPagesState);
  const [pageNumber, setPageNumber] = useRecoilState(pageNumberState);
  const thumbnailContainerRef = useRef(null);
  const setShowThumbnail = useSetRecoilState(showThumbnailState);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(null);

  useEffect(() => {
    // 페이지 번호가 변경될 때마다 선택된 썸네일의 인덱스를 업데이트
    if (pageNumber === numPages) {
      setSelectedThumbnailIndex(pageNumber);
    }
    setSelectedThumbnailIndex(pageNumber - 1);

    const thumbnailWrap = thumbnailContainerRef.current;
    const selectedThumbnail = thumbnailWrap.querySelector(
      `.react-pdf__Thumbnail__page[data-page-number="${pageNumber}"]`
    );

    if (selectedThumbnail) {
      // 썸네일이 있을 경우
      const thumbnailWrapRect = thumbnailWrap.getBoundingClientRect();
      const selectedThumbnailRect = selectedThumbnail.getBoundingClientRect();
      if (
        selectedThumbnailRect.right > thumbnailWrapRect.right ||
        selectedThumbnailRect.left < thumbnailWrapRect.left
      ) {
        // 선택된 썸네일이 화면에 보이지 않을 경우 스크롤 이동

        if (pageNumber < numPages) {
          const scrollLeftOffset =
            selectedThumbnailRect.left -
            thumbnailWrapRect.left -
            thumbnailWrapRect.width / 2 +
            selectedThumbnailRect.width / 2;
          thumbnailWrap.scrollLeft += scrollLeftOffset;
        }
        if (pageNumber >= numPages - 1) {
          thumbnailWrap.scrollLeft = thumbnailWrap.scrollWidth;
        }
      }
    }
  }, [pageNumber, numPages]);

  const thumbnailToPage = (index) => {
    let selectedThumbnailIndex = index;
    if (index % 2 !== 0) {
      selectedThumbnailIndex = index - 1;
    }
    if (index === numPages) {
      setPageNumber(index); // 마지막 페이지인 경우 페이지 번호를 numPages로 설정
      setSelectedThumbnailIndex(numPages - 1);
    } else {
      setPageNumber(selectedThumbnailIndex + 1);
      setSelectedThumbnailIndex(selectedThumbnailIndex);
    }
  };
  const thumbnailToOnePage = (index) => {
    setPageNumber(index); // 마지막 페이지인 경우 페이지 번호를 numPages로 설정
    setSelectedThumbnailIndex(numPages);
  };
  const thumbnails = useMemo(
    () => Array.from(new Array(numPages), (_, index) => index),
    [numPages]
  );

  const scrollLeft = () => {
    if (thumbnailContainerRef.current) {
      thumbnailContainerRef.current.scrollLeft -= 300;
    }
  };

  const scrollRight = () => {
    if (thumbnailContainerRef.current) {
      thumbnailContainerRef.current.scrollLeft += 300;
    }
  };

  const closeThumbnail = () => {
    setShowThumbnail((prev) => !prev);
  };

  return (
    <ThumbnailWrap ref={thumbnailContainerRef}>
      {thumbnails.map((index) => (
        <Thumbnail
          key={`page_${index + 1}`}
          index={index}
          isSelected={
            windowWidth <= 970
              ? selectedThumbnailIndex === index
              : selectedThumbnailIndex === index ||
                selectedThumbnailIndex === index + 1
          }
          pageNumber={index + 1}
          scale={0.1}
          onItemClick={() =>
            windowWidth <= 970
              ? thumbnailToOnePage(index + 1)
              : thumbnailToPage(index + 1)
          }
          $windowWidth={windowWidth}
        />
      ))}
      <ThumbnailLButton onClick={scrollLeft}>
        <i className="fa-solid fa-arrow-left"></i>
      </ThumbnailLButton>
      <ThumbnailRButton onClick={scrollRight}>
        <i className="fa-solid fa-arrow-right"></i>
      </ThumbnailRButton>
      <ClostButton onClick={closeThumbnail}>
        <i className="fa-solid fa-xmark"></i>
      </ClostButton>
    </ThumbnailWrap>
  );
}

export default React.memo(ThumbnailBox);
