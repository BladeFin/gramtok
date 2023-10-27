import { useState, useEffect } from "react";

import BottomNav from "./components/BottomNav";
import VideoCard from "./components/VideoCard";

async function getGoogleSheetData(sheetURL) {
  try {
    const response = await fetch(sheetURL);
    const html = await response.text();

    // Extract the data from the HTML response
    const startIndex = html.indexOf('<table');
    const endIndex = html.indexOf('</table>', startIndex) + '</table>'.length;
    const tableHtml = html.substring(startIndex, endIndex);

    // Create a temporary DOM element to parse the HTML table
    const tempElement = document.createElement('div');
    tempElement.innerHTML = tableHtml;

    // Extract the data from the table rows
    const rows = tempElement.getElementsByTagName('tr');
    const data = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowData = [];
      const cells = row.getElementsByTagName('td');

      for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];
        rowData.push(cell.textContent.trim());
      }

      data.push(rowData);
    }

    return data;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return null;
  }
}
var urlList = []
const vidDic = {}
// Usage
const sheetURL = 'https://docs.google.com/spreadsheets/d/1esjtdZsj1jlCdsry8f30lE_8sEG8z5n2J7-S0UnCggs/edit?usp=sharing'; // Source of the questions
getGoogleSheetData(sheetURL)
  .then((data) => {
    console.log('Google Sheets data:', data);
    var i = 4;
    while (i < data.length && data[i][0] != '') {
      var times = []
      var quizData = []
      urlList.push(data[i][0]);
      vidDic[data[i][0]] = [];
      for (var j = 1; j < data[i].length; j++) {
        if (data[i][j] == '') {
          j=data[i].length;
        } else if ((j)%6==1) {
          times.push(parseInt(data[i][j]));
        } else if (j%6 == 0) {
          quizData.push(parseInt(data[i][j])-1);
          vidDic[data[i][0]].push(quizData);
          quizData = [];
        } else {
          quizData.push(data[i][j]);
        }
      }
      vidDic[data[i][0]].push(times);
      i++;
    }
  });
var randTemp;
function getRand() {
  if (urlList.length > 3) {
    randTemp = [];
    for (var i = 0; i < 3; i++) {
      var temp = Math.floor(Math.random()*urlList.length);
      while (randTemp.includes(temp)) {
        temp = Math.floor(Math.random() * urlList.length);  
      }
      randTemp.push(temp);
    }
  } else {
    randTemp = [Math.floor(Math.random() * urlList.length),Math.floor(Math.random() * urlList.length),Math.floor(Math.random() * urlList.length)];
  }
  console.log(randTemp);
  return randTemp;
};
var temp = null

function App() {
  //const [videos, setvideos] = useState([]);
  //const [videosLoaded, setvideosLoaded] = useState(false);
  const [videoURLList, setVideoURLList] = useState([]);
  const [loadedURLs, setLoadedURLs] = useState(false);
  const [randomIndex, setRandomIndex] = useState(0);

  const randomQuery = () => {
    const queries = ["Food", "Random", "Business", "Travel"];
    return queries[Math.floor(Math.random() * queries.length)];
  };

  //const getVideos = (length) => {
    //const client = createClient("zf2drSzvgOkPfMnOB9vuc37Kv46KEY2vr92kxivohfjim3WufL7O7Xf7");

    //const query = randomQuery();
    //client.videos
    //  .search({ query, per_page: length })
    //  .then((result) => {
    //    setvideos((oldVideos) => [...oldVideos, ...result.videos]);
    //    setvideosLoaded(true);
    //  })
    //  .catch((e) => setvideosLoaded(false)); 

    //var newVideos = [0,1,2];
    //setvideos((oldVideos) => [...oldVideos, ...newVideos]);
    //setvideosLoaded(true);
  //};

  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * urlList.length));
    updateURLs(3);
  }, []);

  const updateURLs = async (length) => {
    var rand = getRand();
    var newURLs = [rand.length];
    for (var i = 0; i < rand.length; i++) {
      newURLs[i] = urlList[rand[i]];
    }
    if (videoURLList.length == 0) {
      setVideoURLList(newURLs);
    } else {
      setVideoURLList((oldVideoURLList) => [...oldVideoURLList, ...newURLs]);
    }
    setLoadedURLs(true);
    console.log("videoURLList" + videoURLList);
    document.body.style.overflow = "hidden";
    disableScroll();
    console.log("A");
    await sleep(50000);
    console.log("B");
    enableScroll();
    document.body.style.overflow = "auto";
    
  }

function disableScroll() { 
    // Get the current page scroll position 
    var scrollTop = 
    window.scrollY || document.documentElement.scrollTop; 
    var scrollLeft = 
    window.pageXOffset || document.documentElement.scrollLeft; 
  
        // if any scroll is attempted, 
        // set this to the previous value 
        window.onscroll = function() { 
            window.scrollTo(scrollLeft, scrollTop); 
        }; 
} 
  
function enableScroll() { 
    window.onscroll = function() {}; 
} 

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
  }
  return (
      <main>
        <div className="slider-container">
          {loadedURLs && videoURLList.length > 0 ? (
            <>
              {getRand()}
              {videoURLList.map((url, id) => (
                <><VideoCard
                  key={id}
                  index={id}
                  videoURL={videoURLList[id]}
                  lastVideoIndex={videoURLList.length - 1}
                  updateURLs={updateURLs}
                  quizOptions={vidDic[videoURLList[id]]} />
                </>
              ))}
            </>
          ) : (
            <>Loading...</>
          )}
        </div>

        <BottomNav />
      </main>
  );
}

export default App;
/**
 * goes right under the videocard thing
 *                 <div class="cfu">
                  <font color="green">{vidDic[urlList[randTemp]][0]}</font>
                  <font color="blue"> {vidDic[urlList[randTemp]][1]}</font>
                  <font color="yellow"> {vidDic[urlList[randTemp]][2]}</font>
                  <font color="red"> {vidDic[urlList[randTemp]][3]}</font>
                  </div>
 */