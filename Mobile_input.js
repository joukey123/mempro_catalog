import styled from "styled-components";

const ModalBox = styled.div`
  position: fixed;
  bottom: 80%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  display: flex;
  color: white;

  p {
    width: 100px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px 0px 0 20px;
    background-color: #024ea2;
    font-size: 15px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }
  form {
    width: 100px;
  }
  input {
    width: 100px;
    height: ${(props) => (props.$windowWidth > 970 ? "48px" : "40px")};
    background-color: white;
    border-radius: 0px 20px 20px 0px;
    font-size: 16px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
    text-align: center;
  }
`;

function Mobile_Input({ goToPage, handleInputChange, windowWidth }) {
  return (
    <ModalBox $windowWidth={windowWidth}>
      <p>페이지 입력</p>
      <form onSubmit={goToPage}>
        <input type="number" min={1} max={72} onChange={handleInputChange} />
      </form>
    </ModalBox>
  );
}
export default Mobile_Input;
