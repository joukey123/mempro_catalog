import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useGlobalContext } from "./context";
import Mobile_Input from "./Mobile_input";

const Icon = styled.button`
  border: 0;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 15px;
  margin: 10px 10px;
  cursor: pointer;
  -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #245e95;
    -webkit-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.3;
      cursor: not-allowed;
      pointer-events: none; // 클릭 이벤트 비활성화
    `}
`;

const PagesController = styled.div`
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
  height: 60px;
  position: fixed;
  bottom: 0;
  left: 50%;
  -webkit-transform: translate(-50%, 0%);
  -ms-transform: translate(-50%, 0%);
  transform: translate(-50%, 0%);
  background-color: white;
  -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
`;

const CurrentPageBox = styled.div`
  width: 100px;
  height: 35px;
  background-color: ${(props) =>
    props.$toggleInput ? "rgba(0,0,0,0.7)" : "rgba(0, 0, 0, 0.3)"};
  color: white;
  display: -ms-flexbox;
  display: flex;
  display: -webkit-box;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  border-radius: 15px;
  margin: 0 20px;
  font-size: 18px;
  -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  &:hover {
    -webkit-transition: all 0.2s ease-in-out;
    -o-transition: all 0.2s ease-in-out;
    transition: all 0.2s ease-in-out;
  }
`;
const NumberBox = styled.div``;

const Form = styled.form`
  width: 100px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  position: absolute;
  input {
    width: 100px;
    height: 40px;
    border-radius: 15px;
    text-align: center;
    position: absolute;
    background-color: red;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    &:focus {
      outline: none;
    }
  }
`;

function Controller({ windowWidth }) {
  const {
    numPages,
    goToPreviousPage,
    goToNextPage,
    setPageNumber,
    pageNumber,
    setIsPlay,
  } = useGlobalContext();
  const [inputPageNumber, setInputPageNumber] = useState(""); //input 페이지 설정
  const [toggleInput, setToggleInput] = useState(false);

  // const goToPreviousPage = (first) => {
  //   if (pageNumber > 1) {
  //     {
  //       windowWidth <= 970
  //         ? setPageNumber(pageNumber - 1)
  //         : setPageNumber(pageNumber - 2);
  //     }
  //   }
  //   if (pageNumber === numPages) {
  //     setPageNumber(pageNumber - 1);
  //   }
  //   if (first === 1) {
  //     setPageNumber(1);
  //   }
  // };
  // const goToNextPage = (last) => {
  //   if (pageNumber < numPages) {
  //     {
  //       windowWidth <= 970
  //         ? setPageNumber(pageNumber + 1)
  //         : setPageNumber(pageNumber + 2);
  //     }
  //   }
  //   if (pageNumber === numPages - 1) {
  //     setPageNumber(pageNumber + 1);
  //   }
  //   if (last === numPages) {
  //     setPageNumber(numPages);
  //   }
  // };

  const goToPage = (event) => {
    event.preventDefault();
    const enteredPage = parseInt(inputPageNumber);
    console.log(enteredPage);
    if (windowWidth > 970) {
      if (inputPageNumber < 1 || inputPageNumber > numPages) {
        alert(`페이지수를 확인하세요!`);
      } else if (enteredPage === 1 || enteredPage === numPages) {
        setPageNumber(enteredPage);
      } else if (enteredPage % 2 === 0) {
        setPageNumber(enteredPage + 1);
      } else {
        setPageNumber(enteredPage);
      }
    } else {
      if (inputPageNumber < 1 || inputPageNumber > numPages) {
        alert(`페이지수를 확인하세요!`);
      } else {
        setPageNumber(enteredPage);
      }
    }
    setInputPageNumber(inputPageNumber);
    setToggleInput(false);
    setIsPlay(false);
  };
  const handleInputChange = (event) => {
    setInputPageNumber(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 37) {
      // 왼쪽 화살표 키
      goToPreviousPage();
    } else if (event.keyCode === 39) {
      // 오른쪽 화살표 키
      goToNextPage();
    }
  };
  const handleWheel = (event) => {
    if (event.deltaY > 0) {
      // 마우스 휠을 아래로 스크롤할 때
      goToNextPage();
    } else {
      // 마우스 휠을 위로 스크롤할 때
      goToPreviousPage();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleKeyDown, handleWheel]);

  return (
    <PagesController>
      <Icon onClick={() => goToPreviousPage(1)} disabled={pageNumber <= 1}>
        <i className="fa-solid fa-angles-left"></i>
      </Icon>
      <Icon onClick={goToPreviousPage} disabled={pageNumber <= 1}>
        <i className="fa-solid fa-chevron-left"></i>
      </Icon>
      <CurrentPageBox
        $toggleInput={toggleInput}
        onClick={() => setToggleInput((current) => !current)}
      >
        <NumberBox>
          <span style={{ fontWeight: "bold", marginRight: "5px" }}>
            {windowWidth > 970 && pageNumber % 2 === 0
              ? pageNumber + 1
              : pageNumber}
          </span>
          /
          <span style={{ fontWeight: "200", marginLeft: "5px" }}>
            {numPages}
          </span>
        </NumberBox>
      </CurrentPageBox>
      {toggleInput === true ? (
        // <Form onSubmit={goToPage}>
        //   <input type="number" onChange={handleInputChange} />
        // </Form>
        <Mobile_Input
          goToPage={goToPage}
          handleInputChange={handleInputChange}
          windowWidth={windowWidth}
        />
      ) : null}
      {/* {toggleInput === true && windowWidth <= 970 ? (
        <Mobile_Input
          goToPage={goToPage}
          handleInputChange={handleInputChange}
        />
      ) : null} */}
      <Icon onClick={goToNextPage} disabled={pageNumber >= numPages}>
        <i className="fa-solid fa-chevron-right"></i>
      </Icon>
      <Icon
        onClick={() => goToNextPage(numPages)}
        disabled={pageNumber >= numPages}
      >
        <i className="fa-solid fa-angles-right"></i>
      </Icon>
    </PagesController>
  );
}

export default Controller;
