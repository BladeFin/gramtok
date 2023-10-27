import { useRef, useState, useEffect } from "react";
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
  const [loadNewVidsAt, setloadNewVidsAt] = useState(lastVideoIndex);
  const [quiz,setQuiz] = useState(['','','','',-1]);
  const [passedTimes, setPassedTimes] = useState([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [overlayStyle, setOverlayStyle] = useState("hidden");
  const [manualPause, setManualPause] = useState(false);

  useEffect(() => {
    if (isInViewport) {
      video.current.load();
    }
  }, [isInViewport]);
  
  if (isInViewport) {
    setTimeout(() => {
      if (!isQuizActive && !manualPause) {
        video.current.play();
      }
    }, 500);

    if (loadNewVidsAt === Number(video.current.id)) {
      setloadNewVidsAt((prev) => prev + 2);
      updateURLs(3);
      console.log("YIPPEE");
    }
  }

  const togglePlay = () => {
    let currentVideo = video.current;
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
      for (var i = 0; i < quizOptions[quizOptions.length-1].length; i++) {
        if (!passedTimes.includes(quizOptions[quizOptions.length-1][i]) && currentTime > quizOptions[quizOptions.length-1][i]) {
          setQuiz(quizOptions[i]);
          setPassedTimes(passedTimes.push(quizOptions[quizOptions.length-1][i]));
          setIsQuizActive(true);
          video.current.pause();
        }
      }
    }
  };
  
  useEffect(() => {
    video.current.addEventListener('timeupdate',handleTimeUpdate);

    return () => {
      video.current.removeEventListener('timeupdate',handleTimeUpdate);
    };
  }, []);

  const handleOptionClick = (optionIndex) => {
    // handle the user's answer
    setSelectedOption(optionIndex);
    //setSelected(true);
    //setStyleA("hidden");
    //setStyleB("hidden");
    //setOverlayStyle("hidden")
    if (isQuizActive) {
      if (optionIndex === quiz[4]-1) { //quiz[4]-1 converts normal counting to index
        console.log("hoorah")
        //setResultMessage("Success!");
        setOverlayStyle('cfu-overlay-correct');
        setTimeout(() => {
          setOverlayStyle('hidden');
        }, 1000);
        setIsQuizActive(false);
        setQuiz(['','','','',-1]);
        video.current.play();
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
    }
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
  }
  
  return (
    /**
    <div className="slider-children"> //Version 1 Start (using pexel)
      <video
        muted
        className="video"
        ref={video}
        onClick={togglePlay}
        id={index}
        autoPlay={index === 1}
      >
        <source src={videoURL} type="video/mp4" />
      </video>
      <div className="video-content" onClick={togglePlay}>
        <p className="m-0">@{author}</p>
        <p>
          Video by <a href={authorLink}>{author} </a> on Pexel
        </p>
      </div>
    </div> //Version 1 End (using pexel)
    */
   <>
   <div className="slider-children">
     <font color="red" className = "video-background">Loading...</font>
     <video
      className="video"
      ref={video}
      onClick={togglePlay}
      id={index}
      muted
      playsInline
      autoPlay={index === 1}  //NOTE: You can only autoplay muted videos on chrome, I don't know about IOS
      loop = {true}
      >
        <source src={videoURL} type="video/mp4" />
      </video>
      <QuizCard
        videoURL={videoURL}
        quizOptions={quiz}
        index={index}
        handleOptionClick={handleOptionClick}
        selectedOption = {selectedOption}
        overlayStyle = {overlayStyle}
      />
   </div>
   </>
   
  );
};

export default VideoCard;
/**
  function optionA() {
    if (quizOptions[quizOptions.length-1] == 0) {
          document.getElementById("quizArea").innerHTML = "<font color = 'green'> Success! </font>";
    } else {
      document.getElementById("quizArea").innerHTML = "<font color = 'red'> Wrong! </font>"
    }
  }
  function optionB() {
    if (quizOptions[quizOptions.length-1] == 1) {
          document.getElementById("quizArea").innerHTML = "<font color = 'green'> Success! </font>";
    } else {
      document.getElementById("quizArea").innerHTML = "<font color = 'red'> Wrong! </font>"
    }
  }
  function optionC() {
    if (quizOptions[quizOptions.length-1] == 2) {
          document.getElementById("quizArea").innerHTML = "<font color = 'green'> Success! </font>";
    } else {
      document.getElementById("quizArea").innerHTML = "<font color = 'red'> Wrong! </font>"
    }
  }
  function optionD() {
    if (quizOptions[quizOptions.length-1] == 3) {
          document.getElementById("quizArea").innerHTML = "<font color = 'green'> Success! </font>";
    } else {
      document.getElementById("quizArea").innerHTML = "<font color = 'red'> Wrong! </font>"
    }
  }
 */