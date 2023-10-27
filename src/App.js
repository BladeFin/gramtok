import { useState, useEffect } from "react";

import BottomNav from "./components/BottomNav";
import VideoCard from "./components/VideoCard";
import { createClient } from '@supabase/supabase-js';

const supabaseURL = 'https://qdmsdgecdugalpbgbomf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbXNkZ2VjZHVnYWxwYmdib21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY5ODMzOTUsImV4cCI6MjAxMjU1OTM5NX0.AY0vice-dxYoUM1O2tGpkDJOjotPgmgKDiR-peomsh4';

const supabase = createClient(supabaseURL, supabaseKey)

var data;
var quizList = [];

function fetchTableData() {
  supabase
    .from('quizlist_duplicate') //quizlist_duplicate is kibadev links, quizlist is drive links
    .select('*')
    .then(({ data: responseData, error }) => {
      if (error) {
        console.error('Error fetching data:', error);
      } else {
        const formattedData = responseData.map((row) => [
          row.url,
          row.ask_after_1,
          row.option_a_1,
          row.option_b_1,
          row.option_c_1,
          row.option_d_1,
          row.answer_1,
          row.ask_after_2,
          row.option_a_2,
          row.option_b_2,
          row.option_c_2,
          row.option_d_2,
          row.answer_2,
        ]);
        console.log(formattedData);
        data = formattedData; // Assign to the global variable
        console.log(data);
        //Make the quizlist
        /**quizOptions needs to be a 2d array - the first n-1 arrays need to be arr[5] such that arr[0] = ans1, arr[1] = ans2, arr[2] = ans3, arr[3] = ans4, arr[4] = corr.  The last is a time list
 * [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] -> [[1,2,3,4,5],[7,8,9,10,11],[13,14,15,16,17],[0,6,12]]
 */
        for (var i = 0; i < data.length; i++) {
          var fin = [];
          var times = [];
          var working = [];
          var temp = data[i].slice(1).filter(n => n);
          for (var j = 0; j < temp.length; j++) {
            if (j % 6 == 0) {
              times.push(temp[j])
              if (working.length != 0) {
                fin.push(working);
                working = [];
              }
            } else {
              working.push(temp[j])
            }
          }
          fin.push(working)
          fin.push(times)
          quizList.push(fin)
        }
        console.log("QUIZLIST")
        console.log(data[0])
        console.log(quizList);
      }
    });
}

fetchTableData()

function App() {
  const [videoURLList, setVideoURLList] = useState([]);
  const [loadedURLs, setLoadedURLs] = useState(false);

  useEffect(() => {
    updateURLs(3);
  }, []);

  const updateURLs = async (length) => {
    console.log(data==null)
    console.log(supabaseURL);
    var rand = [length]
    if (data && quizList.length != 0) {
      for (var i = 0; i < length; i++) {
        var temp = Math.floor(Math.random()*data.length);
        while (videoURLList != null && videoURLList.includes(data[temp][0]) && videoURLList.length < data.length-3) {
          temp = Math.floor(Math.random()*data.length);
        }
        rand[i] = temp
      }
      var newURLs = [rand.length];
      for (var i = 0; i < rand.length; i++) {
        newURLs[i] = data[rand[i]][0];
      }
      if (videoURLList.length == 0) {
        setVideoURLList(newURLs);
      } else {
        setVideoURLList((oldVideoURLList) => [...oldVideoURLList, ...newURLs]);
      }
      setLoadedURLs(true);
    } else {
      console.log('a')
      await sleep(2000);
      console.log('b')
      updateURLs(length)

    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
  }
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
                  quizOptions={quizList[id]} /> 
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