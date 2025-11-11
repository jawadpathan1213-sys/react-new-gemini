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

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("history")) || [];
    setRecentHistory(history);
    console.log(history);
  }, []);

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [result, setResult] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState("");
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [ask, setAsk] = useState(false);
  const [loader, setLoader] = useState(false);
  const scrollToAns = useRef();

  const askQuestion = async (text, fromHistory = false) => {
    const finalText = text || question || selectedHistory;
    if (!finalText?.trim()) return;

    setLoader(true);

    // ✅ Sirf tab history save hogi jab user input kare (history se click na ho)
    if (!fromHistory) {
      const textToSave = finalText.replace(/\s+/g, " ").trim();
      const normalized = textToSave.toLowerCase();

      let history = JSON.parse(localStorage.getItem("history")) || [];

      // ✅ Remove duplicates
      history = history.filter(
        (item) => item.replace(/\s+/g, " ").trim().toLowerCase() !== normalized
      );

      // ✅ Capitalize first letter
      const cleanSave =
        textToSave.charAt(0).toUpperCase() + textToSave.slice(1);
      history.unshift(cleanSave);

      // ✅ Limit history 30 items
      history = history.slice(0, 30);

      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    }

    // Add new user message to local chat history
    setChatHistory((prev) => [...prev, { role: "user", content: finalText }]);

    // Create payload with full chat context
    const payload = {
      contents: [
        ...chatHistory.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
        {
          role: "user",
          parts: [{ text: finalText }],
        },
      ],
    };

    setQuestion("");

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const res = await response.json();
    const data =
      res.candidates?.[0]?.content?.parts?.[0]?.text ||
      res.candidates?.[0]?.content?.[0]?.text ||
      "Error: No response";

    setChatHistory((prev) => [...prev, { role: "assistant", content: data }]);
    const dataString = data.includes("*") ? data.split("* ") : [data];
    const cleaned = dataString.map((t) => t.trim());

    setResult((prev) => [
      ...prev,
      { type: "q", text: finalText },
      { type: "a", text: cleaned },
    ]);

    setTimeout(() => {
      scrollToAns.current?.scrollTo({
        top: scrollToAns.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);

    setTimeout(() => setLoader(false), 300);
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
          className='dark:text-white text-black z-40 fixed top-3 right-3 px-3 py-1 dark:bg-zinc-800 bg-zinc-200 border rounded-4xl h-10'
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
        <div className='md:col-span-8 col-span-10  md:w-[80vw] md:absolute md:right-1 w-[99vw]'>
          <div
            ref={scrollToAns}
            className='h-[75vh] overflow-y-auto pr-2 pb-[15vh]'
          >
            <div className='dark:text-zinc-300 px-[5vw]  md:pr-[3vw] lg:px-[8vw] md:pl-[6vw]'>
              {" "}
              <h1 className='text-3xl md:text-4xl bg-clip-text text-transparent bg-linear-to-r from-pink-700 to-violet-700 h-20 xl:text-5xl  px-2 min-w-[230px]'>
                Hello User , Ask Me Anything
              </h1>
             
              {result.map((item, index) => (
                <div>
                   
                  <QuestionAns item={item} index={index} key={index} />
                  
                </div>
              ))}
            </div>
            {loader ? (
                    <div className='flex justify-center py-4'>
                      <img src='/spinner.svg' alt='' className='w-10' />
                    </div>
                  ) : null}
          </div>
          <div
            className='flex dark:bg-zinc-800 bg-white  dark:text-white  rounded-full border dark:border-zinc-700 border-zinc-500 lg:right-[20vw] lg:left-[35vw] md:right-[10vw] md:left-[30vw] sm:right-[20vw] sm:left-[20vw] right-[10vw] left-[10vw] fixed sm:bottom-[15vh] bottom-2 shadow-[0_0_5px_0.5px_gray] dark:shadow-none sm:p-1 p-0.5'
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
              className='w-full h-full md:p-4 sm:p-2 p-1 outline-none'
            />
            <button
              onClick={() => askQuestion()}
              className='md:mx-4 mx-2 cursor-pointer '
            >
              <FaArrowUp
                className={`rounded-full sm:w-9 w-7 sm:h-9 h-7 sm:p-2 p-1 ${
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
