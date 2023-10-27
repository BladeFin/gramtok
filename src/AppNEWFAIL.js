import { useState, useEffect } from "react";

import BottomNav from "./components/BottomNav";
import VideoCard from "./components/VideoCard";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qdmsdgecdugalpbgbomf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbXNkZ2VjZHVnYWxwYmdib21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY5ODMzOTUsImV4cCI6MjAxMjU1OTM5NX0.AY0vice-dxYoUM1O2tGpkDJOjotPgmgKDiR-peomsh4';

const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [loadedURLs, setLoadedURLs] = useState(false);
  const [videoURLList, setVideoURLList] = useState([]);
  const [tableData, setTableData] = useState();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingClass, setLoadingClass] = useState("center");
  const [sliderClass, setSliderClass] = useState("hidden");
  var formattedData;
  useEffect(() => {
    async function fetchTableData() {
      const { data, error } = await supabase
        .from('quizlist')
        .select('*'); // Adjust this query as needed

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        // Assuming your table has columns 'column1' and 'column2'
        formattedData = data.map((row) => [row.url, row.ask_after_1, row.option_a_1, row.option_b_1, row.option_c_1, row.option_d_1, row.answer_1, row.ask_after_2, row.option_a_2, row.option_b_2, row.option_c_2, row.option_d_2, row.answer_2]);
        setTableData(formattedData);
        console.log("asdf");
        console.log(formattedData)
        setDataLoaded(true);
        console.log(formattedData.length == 0)
        const d = new Date();
        var done = false;
        while (formattedData.length == 0 && !done) {
          var a = new Date();
          if (a.getTime() > d.getTime()+10000) {
            done = true
            console.log('timeout')
          }
        }
        console.log('goupdate');
        updateURLs(3);
      }
    }

    fetchTableData();
  }, []);
  
  useEffect(() => {
    //updateURLs(3);
  }, []);

  const updateURLs = async (length) => {
    console.log('a')
    if (formattedData.length != 0) {
      console.log('b')
      //array to hold 3 random video url id
      var rand = [length]
      //fill random array with video #'s that haven't been used yet
      for (var i = 0; i < rand.length; i++) {
        var temp = 0
        var done = false
        while (!done) {
          temp = Math.floor(Math.random()*formattedData.length)
          if ((!rand.includes(temp) && !videoURLList.includes(temp)) || videoURLList.length > formattedData.length-length) {
            rand[i] = temp
            done = true
          }
        }
      }
      var newURLs = [rand.length];
      for (var i = 0; i < rand.length; i++) {
        newURLs[i] = formattedData[rand[i]][0]
      }
      if (videoURLList.length == 0) {
        setVideoURLList(newURLs);
        setLoadedURLs(true);
      } else {
        setVideoURLList((oldVideoURLList) => [...oldVideoURLList, ...newURLs]);
      }
    } else {
      console.log('idfk cry?')
      //idfk cry?  give an error I supppose...
    }
  }
  //videoURL is the url of the video
  //last video index is ()shocker() the last video indesx
  //update urls sends the method to get 3 new urls
  //quiz options is comprised of an array of 2 arrays - the first lists time,answer1,answer2,answer3,answer4,correct_answer,time2,answer1-2,answer2-2, etc.  The second is an array of all the times at which a question is asked.
  return (
    <main>
      <div className="slider-container">
        {loadedURLs && videoURLList.length > 0 ? (
          <>
            {videoURLList.map((url, id) => (
              <><VideoCard
                key={id}
                index={id}
                videoURL={videoURLList[id]}
                lastVideoIndex={videoURLList.length - 1}
                updateURLs={updateURLs}
                quizOptions={[videoURLList[id].slice(1),videoURLList.slice(1).filter((element, index) => (index) % 6 === 0)]} /> 
              </>
            ))}
          </>
        ) : (
          <font color="red">Loading...</font>
        )}
      </div>

      <BottomNav />
    </main>
);
}

export default App;