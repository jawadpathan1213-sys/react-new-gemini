import React, { useState, useRef, useEffect } from "react";
import { URL } from "./const.js";
import RecentSearch from "./components/RecentSearch.jsx";
import QuestionAns from "./components/QuestionAns.jsx";
import { FaArrowUp } from "react-icons/fa";

const App = () => {
  useEffect(() => {
    if (!localStorage.getItem("history")) {
      localStorage.setItem("history", JSON.stringify([]));
    }
  }, []);

  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState("");
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [ask, setAsk] = useState(false);
  const [loader, setLoader] = useState(false);
  const scrollToAns = useRef();

  const askQuestion = async (text) => {
    if (!question.trim() && !selectedHistory.trim()) {
      return false;
    }
    setLoader(true);
    console.log('this is one')
    const textToSave = question.trim() ? question : selectedHistory.trim();
    if (!recentHistory.includes(textToSave)) {
      let history = JSON.parse(localStorage.getItem("history")) || [];
      history = history.filter((item) => item !== textToSave);
      history = [textToSave, ...history].slice(0, 30); // Optional limit to 30 entries

      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    }

    const payLoadData = text
      ? text
      : question.trim()
      ? question
      : selectedHistory.trim();
      const payload = {
        contents: [
          {
            parts: [{ text: payLoadData }],
          },
        ],
      };
      setQuestion("");
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const res = await response.json();
    const data =
      res.candidates?.[0]?.content?.parts?.[0]?.text ||
      res.candidates?.[0]?.content?.[0]?.text ||
      "";
    const dataString = data.includes("*") ? data.split("* ") : [data]; // if no bullets, keep full text
    const dataString2 = dataString.map((elm) => elm.trim());
    const finalQuestion = text || question || selectedHistory;
    setResult((prev) => [
      ...prev,
      { type: "q", text: finalQuestion },
      { type: "a", text: dataString2 },
    ]);
    setTimeout(() => {
      scrollToAns.current?.scrollTo({
        top: scrollToAns.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
setTimeout(() => setLoader(false), 500);  
    console.log('this is tow')

};


  const isEnter = (event) => {
    if (event.key == "Enter") {
      askQuestion();
    }
  };

  // dark mode features
  const [darkMode, setDarkMode] = useState("dark");
  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={darkMode === "dark" ? "dark" : "light"}>
      <div className='grid grid-cols-10 h-screen text-center'>
        <select
          onChange={(e) => setDarkMode(e.target.value)}
          className='dark:text-white text-black z-40 fixed bottom-3 left-3 px-5 py-2 dark:bg-zinc-800 bg-zinc-200 border rounded-4xl h-10'
        >
          <option value='dark' className=''>
            Dark
          </option>
          <option value='light' className=''>
            Light
          </option>
        </select>

        <RecentSearch
          setSelectedHistory={setSelectedHistory}
          askQuestion={askQuestion}
          selectedHistory={selectedHistory}
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
        />
        <div className='md:col-span-8 col-span-6  md:w-[80vw] absolute right-1 w-[99vw]'>
          <h1 className='text-3xl md:text-4xl bg-clip-text text-transparent bg-linear-to-r from-pink-700 to-violet-700 h-20 xl:text-5xl mt-10 px-2'>
            Hello User , Ask Me Anything
          </h1>
          {loader ? (
            <div className='flex justify-center'>
              <img src='/spinner.svg' alt='' className='w-10' />
            </div>
          ) : null}
          <div
            ref={scrollToAns}
            className='h-[75vh] overflow-y-auto pr-2 pb-[20vh]'
          >
            <div className='dark:text-zinc-300 px-[5vw]  md:pl-[5vw] md:pr-[7vw]'>
              {result.map((item, index) => (
                <QuestionAns item={item} index={index} key={index} />
              ))}
            </div>
          </div>
          <div
            className='flex dark:bg-zinc-800 bg-white md:w-[50vw] dark:text-white m-auto rounded-full border dark:border-zinc-700 border-zinc-500 
        fixed z-40  w-auto bottom-[15vh]  md:left-[35vw] left-[7vw] right-[7vw] md:right-[10vw] shadow-[0_0_5px_0.5px_gray] dark:shadow-none p-1'
          >
            <input
              value={question}
              onKeyDown={isEnter}
              onChange={(e) => {
                setQuestion(e.target.value);
                setAsk(true);
              }}
              type='text'
              placeholder='Ask me anthing'
              className='w-full h-full md:p-4 p-2 outline-none'
            />
            <button
              onClick={() => askQuestion()}
              className='md:mx-4 mx-2 cursor-pointer '
            >
              <FaArrowUp
                className={`rounded-full w-9 h-9 p-2 ${
                  question.trim() === ""
                    ? "dark:bg-zinc-600 bg-zinc-300 dark:text-zinc-200 text-zinc-800"
                    : "dark:text-black dark:bg-zinc-200 bg-zinc-900 text-zinc-50"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
