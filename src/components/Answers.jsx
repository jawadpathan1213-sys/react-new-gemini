import React, { useEffect, useState } from "react";
import { checkHeading, replacecheckHeading } from "../helper";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

const Answers = ({ ans, index, totalResult, type }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
      setAnswer(replacecheckHeading(ans));
    } else {
      setHeading(false);
      setAnswer(ans);
    }
  }, [ans]);

const components = {
  code({ inline, className, children, ...props }) {
    const lang = className?.replace("language-", "");

    if (!inline) {
      return (
        <div
          className="overflow-x-auto w-full rounded-md max-w-full"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <SyntaxHighlighter
            language={lang || "javascript"}
            style={dark}
            PreTag="div"
            wrapLongLines={true}
           
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code
        className="dark:bg-zinc-300 px-1 py-0.5 rounded text-sm inline-block "
        style={{ whiteSpace: "normal" }}
        {...props}
      >
        {children}
      </code>
    );
  },
};

  return (<>
     
    <div className='flex w-full my-1 sm:my-3 max-w-[90vw] ]'>
      {index === 0 && totalResult > 1 ? (
        <span className='font-medium sm:text-[25px] text-[19px] text-white'>
          {answer}
        </span>
      ) : heading ? (
        <span className='font-medium sm:text-[23px] text-[17px] text-white'>
          {answer}
        </span>
      ) : (
        // Use a div here so width control and scrolling behave predictably on mobile
        <div
          className={
            type === "q"
              ? " sm:px-3 px-2  md:max-w-[50vw] w-fit max-w- sm:text-[16px] text-[11px]" // question card: let it be half width on md+, full on mobile
              : "md:pl-3 pl-1 my-2 md:w-[60vw] w-full max-w-[90vw] sm:text-[16px] text-[11px]"
          }
        >
          <ReactMarkdown components={components}>{answer}</ReactMarkdown>
        </div>
      )}
    </div>
    </>
  );
};

export default Answers;
