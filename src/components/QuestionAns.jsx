import React from 'react'
import Answers from './Answers'

const QuestionAns = ({item, index }) => {
  return (
    <div>
       <div
                className={`${item.type == "q" ? "flex justify-end" : ""} sm:py-2 p-0`}
                key={index}
              > 
                {item.type == "q" ? (
                  
                  <li className=' text-right px-1 py-0 md:px-2 sm:py-1 rounded-tl-4xl rounded-br-4xl rounded-bl-4xl border border-zinc-300 dark:border-zinc-700 bg-zinc-300 dark:bg-zinc-700 list-none wrap-break-word'>
                    <Answers
                      ans={item.text}
                      index={0}
                      totalResult={1}
                      type={item.type}
                    />
                  </li>
                ) : (
                  item.text.map((ansItem, ansIndex) => (
                    <li className='text-left  list-none ' key={ansIndex}>
                      <Answers
                        ans={ansItem}
                        index={ansIndex}
                        totalResult={item.text.length}
                        type={item.type}
                      />
                    </li>
                  ))
                )}
              </div>
    </div>
  )
}

export default QuestionAns
