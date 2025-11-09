import React, { useEffect, useState } from 'react'
import { checkHeading, replacecheckHeading } from '../helper'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown'

const Answers = ({ans, index, totalResult,  type}) => {

    const [heading, setHeading] = useState(false)

    const [answer, setAnswer] = useState(ans)

    
useEffect(() => {
  if (checkHeading(ans)) {
    setHeading(true);
    setAnswer(replacecheckHeading(ans));
  } else {
    setHeading(false);
    setAnswer(ans);
  }
}, [ans])

const components = {
  code({inline, className, children, ...props}) {
    const lang = className?.replace("language-", "");

    if (!inline) {
      return (
        <SyntaxHighlighter
          language={lang || "javascript"}
          style={dark}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      );
    }

    return (
      <code className="dark:bg-zinc-300 px-1 py-0.5 rounded text-sm" {...props}>
        {children}
      </code>
    );
  }
};
    
  return (
    <div className='flex'>
      {
      index === 0  && totalResult > 1 ? <span className=' font-medium  text-[20px] text-white'>{answer}</span>:
      heading? <span className=' font-medium  text-[19px] text-white'>{answer}</span>:
      <span className={type==='q'?'p-3 md:max-w-[50vw] max-w-[75vw] w-fit':'md:pl-3 pl-1 w-[75vw] '}>
        <ReactMarkdown components={components}>{answer}</ReactMarkdown>
        </span>
      }
    </div>
  )
}

export default Answers
