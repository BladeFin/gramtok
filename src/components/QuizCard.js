import { useState } from 'react';

const QuizCard = ({
  videoURL,
  quizOptions,
  index,
  handleOptionClick,
  selectedOption,
  overlayStyle
}) => {
  //const [selected, setSelected] = useState(false);
  //const [resultMessage, setResultMessage] = useState(null);
  const [styleA, setStyleA] = useState("answerStyleA1");
  const [styleB, setStyleB] = useState("answerStyleB1");
  
  /**
  const handleOptionClick = (optionIndex, setResultMessage) => {
    setSelectedOption(optionIndex);
    //setSelected(true);
    //setStyleA("hidden");
    //setStyleB("hidden");
    //setOverlayStyle("hidden")

    if (optionIndex === quizOptions[4]) {
      //setResultMessage("Success!");
      setOverlayStyle('cfu-overlay-correct');
      setTimeout(() => {
        setOverlayStyle('hidden');
      }, 1000);
    } else {
      //setResultMessage("Wrong!");
      setOverlayStyle('cfu-overlay-wrong');
      setTimeout(() => {
        setOverlayStyle('hidden');
      },1000);
    }
    setTimeout(() => {
      setSelectedOption(null);
    }, 500);
  };
  */

  return (
    <>
      <div className={overlayStyle} id="overlayArea" key={String(videoURL) + String({index}) + "A"}></div>
      <div className="cfu" id="quizArea" key={String(videoURL) + String({index}) + "B"}>
        <button
          className = {styleA}
          key={String(videoURL) + "0"}
          id="ansA"
          onClick={() => handleOptionClick(0)}
        >
          {quizOptions[0]}
        </button>
        <button
          className = {styleB}
          key={String(videoURL) + "1"}
          id="ansB"
          onClick={() => handleOptionClick(1)}
        >
          {quizOptions[1]}
        </button>
        <button
          className = {styleA}
          key={String(videoURL) + "2"}
          id="ansC"
          onClick={() => handleOptionClick(2)}
        >
          {quizOptions[2]}
        </button>
        <button
          className = {styleB}
          key={String(videoURL) + "3"}
          id="ansD"
          onClick={() => handleOptionClick(3)}
        >
          {quizOptions[3]}
        </button>
      </div>
    </>
  );
};

export default QuizCard;
/**
{selectedOption !== null && resultMessage && (
        <div className="cfu">
          {resultMessage === "Success!" ? (
            <font color="green">{resultMessage}</font>
          ) : (
            <font color="red">{resultMessage}</font>
          )}
        </div>
        )}
         */