import React, { useRef, useState, useEffect } from "react";
import QuizCard from "./QuizCard.js";
import useIsInViewport from "../hooks/useIsInViewport";

const VideoCard = ({
  index,
  videoURL,
  lastVideoIndex,
  updateURLs,
  quizOptions
}) => {
  const video = useRef();
  const isInViewport = useIsInViewport(video);

  // State to track whether the video has been loaded
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (isInViewport && !videoLoaded) {
      video.current.load();
      video.current.addEventListener("canplaythrough", () => {
        // The video is loaded and ready to play
        setVideoLoaded(true);
      });
    } else if (!isInViewport) {
      video.current.pause();
    }
  }, [isInViewport, videoLoaded]);

  const [loadNewVidsAt, setLoadNewVidsAt] = useState(lastVideoIndex);
  const [quiz, setQuiz] = useState(['', '', '', '', -1]);
  const [passedTimes, setPassedTimes] = useState([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [overlayStyle, setOverlayStyle] = useState("hidden");
  const [manualPause, setManualPause] = useState(false);

  const togglePlay = () => {
    const currentVideo = video.current;
    if (currentVideo.paused && !isQuizActive) {
      currentVideo.play();
      setManualPause(false);
    } else {
      currentVideo.pause();
      setManualPause(true);
    }
  };

  useEffect(() => {
    if (!isInViewport) {
      video.current.pause();
    }
  }, [isInViewport]);

  const handleTimeUpdate = () => {
    const currentTime = video.current.currentTime;
    if (quizOptions && quizOptions.length > 0) {
      for (let i = 0; i < quizOptions[quizOptions.length - 1].length; i++) {
        if (
          !passedTimes.includes(quizOptions[quizOptions.length - 1][i]) &&
          currentTime > quizOptions[quizOptions.length - 1][i]
        ) {
          setQuiz(quizOptions[i]);
          setPassedTimes((prevPassedTimes) => [
            ...prevPassedTimes,
            quizOptions[quizOptions.length - 1][i]
          ]);
          setIsQuizActive(true);
          video.current.pause();
        }
      }
    }
  };

  useEffect(() => {
    video.current.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.current.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const handleOptionClick = (optionIndex) => {
    setSelectedOption(optionIndex);
    if (isQuizActive) {
      if (optionIndex === quiz[4] - 1) {
        setOverlayStyle("cfu-overlay-correct");
        setTimeout(() => {
          setOverlayStyle("hidden");
        }, 1000);
        setIsQuizActive(false);
        setQuiz(['', '', '', '', -1]);
        video.current.play();
      } else {
        setOverlayStyle("cfu-overlay-wrong");
        setTimeout(() => {
          setOverlayStyle("hidden");
        }, 1000);
      }
      setTimeout(() => {
        setSelectedOption(null);
      }, 5000);
    }
  };

  return (
    <div className="slider-children">
      <font color="red" className="video-background">
        {!videoLoaded ? "Loading..." : ""}
      </font>
      <video
        className="video"
        ref={video}
        onClick={togglePlay}
        id={index}
        muted
        playsInline
        autoPlay={index === 1}
        loop={true}
      >
        <source src={videoURL} type="video/mp4" />
      </video>
      <QuizCard
        videoURL={videoURL}
        quizOptions={quiz}
        index={index}
        handleOptionClick={handleOptionClick}
        selectedOption={selectedOption}
        overlayStyle={overlayStyle}
      />
    </div>
  );
};

export default VideoCard;
