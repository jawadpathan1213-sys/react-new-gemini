import React, { useState, useRef, useEffect, useCallback } from "react";
import { URL } from "./const.js";
import RecentSearch from "./components/RecentSearch.jsx";
import QuestionAns from "./components/QuestionAns.jsx";
import { FaArrowUp, FaPlus } from "react-icons/fa";

const App = () => {
  useEffect(() => {
    if (!localStorage.getItem("history")) {
      localStorage.setItem("history", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("history")) || [];
    setRecentHistory(history);
  }, []);

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("chatHistory")) || [];
  });

  const [result, setResult] = useState(() => {
    return JSON.parse(localStorage.getItem("result")) || [];
  });

  const [selectedHistory, setSelectedHistory] = useState("");
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [loader, setLoader] = useState(false);
  const scrollToAns = useRef();

  const askQuestion = useCallback(
    async (text, fromHistory = false) => {
      const finalText = text || question || selectedHistory;
      if (!finalText?.trim()) return;

      setLoader(true);

      if (!fromHistory) {
        const textToSave = finalText.replace(/\s+/g, " ").trim();
        const normalized = textToSave.toLowerCase();

        let history = JSON.parse(localStorage.getItem("history")) || [];

        history = history.filter(
          (item) =>
            item.replace(/\s+/g, " ").trim().toLowerCase() !== normalized
        );

        const cleanSave =
          textToSave.charAt(0).toUpperCase() + textToSave.slice(1);

        history.unshift(cleanSave);
        history = history.slice(0, 30);

        localStorage.setItem("history", JSON.stringify(history));
        setRecentHistory(history);
      }

      setChatHistory((prev) => [...prev, { role: "user", content: finalText }]);

      const payload = {
        contents: [
          ...chatHistory.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
          })),
          { role: "user", parts: [{ text: finalText }] },
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
        res?.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response";

      setChatHistory((prev) => [...prev, { role: "assistant", content: data }]);

      const cleaned = (data.includes("*") ? data.split("* ") : [data]).map(
        (t) => t.trim()
      );

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
    },
    [chatHistory, question, selectedHistory]
  );

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

  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    localStorage.setItem("result", JSON.stringify(result));
  }, [chatHistory, result]);

  const inputRef = useRef(null); // <-- input focus ke liye

  const clearChat = () => {
    setChatHistory([]);
    setResult([]);
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("result");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className={darkMode === "dark" ? "dark" : "light"}>
      <div className='grid grid-cols-10 h-screen text-center'>
        <select
          onChange={(e) => setDarkMode(e.target.value)}
          className='text-[11px] sm:text-[16px] dark:text-white text-black z-40 fixed sm:top-3 top-2 right-2 sm:right-3 sm:px-3 px-1 sm:py-1 py-0 dark:bg-zinc-800 bg-zinc-200 border dark:border-zinc-500 border-zinc-400 rounded-4xl sm:h-10 h-7'
        >
          <option value='dark' className=''>
            Dark
          </option>
          <option value='light' className=''>
            Light
          </option>
        </select>

        <RecentSearch
          clearChat={clearChat}
          setSelectedHistory={setSelectedHistory}
          askQuestion={askQuestion}
          selectedHistory={selectedHistory}
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
        />
        <div className='md:col-span-8 col-span-10  md:w-[80vw] md:absolute md:right-1 w-[99vw]'>
          <div
            ref={scrollToAns}
            className=' h-fit max-h-[99vh]  overflow-y-auto pr-2 sm:pb-[20vh] pt-[10vh] pb-10'
          >
            <div className='dark:text-zinc-300 px-[5vw]  md:pr-[3vw] lg:px-[8vw] md:pl-[6vw]'>
              {" "}
              <h1 className='text-xl md:text-4xl sm:2xl bg-clip-text text-transparent bg-linear-to-r from-pink-700 to-violet-700 h-20 xl:text-5xl px-2 '>
                How can I Help You?
              </h1>
              {result.map((item, index) => (
                <QuestionAns item={item} index={index} key={index} />
              ))}
            </div>
            {loader ? (
              <div className='flex justify-center py-4'>
                <img src='/spinner.svg' alt='' className='w-10' />
              </div>
            ) : null}
          </div>
          <div className='flex dark:bg-zinc-800 bg-white  dark:text-white  rounded-full border dark:border-zinc-700 border-zinc-500 lg:right-[20vw] lg:left-[35vw] md:right-[10vw] md:left-[30vw] sm:right-[20vw] sm:left-[20vw] right-[10vw] left-[10vw] fixed sm:bottom-[10vh] bottom-2 shadow-[0_0_5px_0.5px_gray] dark:shadow-none sm:px-3 md:px-4 py-2 px-2'>
            <input
              value={question}
              ref={inputRef}
              onKeyDown={isEnter}
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
              type='text'
              placeholder='Ask anthing'
              className='w-full h-full md:p-4 sm:p-2 p-1 outline-none sm:text-[16px] text-[11px]'
            />
             
            <button onClick={() => askQuestion()} className='cursor-pointer '>
              <FaArrowUp
                className={`rounded-full sm:w-9 w-5 sm:h-9 h-5 sm:p-2 p-1 ${
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
