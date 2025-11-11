import React, { useState } from 'react'
import { FaBars, FaTimes, FaTrash} from 'react-icons/fa'

const RecentSearch = ({ setRecentHistory, askQuestion , setSelectedHistory, recentHistory}) => {

     const clearHistory = () => {
    localStorage.removeItem("history");
    setRecentHistory([]);
  };
  
  const [nav, setNav] = useState(false)
  
  const clearSelectedHistory =(selectedItem)=>{
    let history = JSON.parse(localStorage.getItem("history"))
    history = history.filter((item)=>{
      if(item!=selectedItem){
        return item
      }
    })
    setRecentHistory(history)
    localStorage.setItem('history', JSON.stringify(history))
    console.log(selectedItem)
  }
  return (<>
        <div className=' md:hidden flex fixed top-2 left-2 sm:top-3 sm:left-3 z-40 ' onClick={() => setNav(!nav)}>
        <FaBars className='dark:text-white text-black sm:text-2xl text-xl'/>
        </div>
    <div>
    
      <div className={`${nav?'block' :'hidden'} md:w-[20vw] md:block min-w-[220px] md:min-w-[200px] col-span-4 dark:bg-zinc-800 bg-zinc-200 w-[40vw] fixed h-screen pt-3 z-30`}>
        <h1 className='text-xl dark:text-white flex justify-center items-center gap-2 flex-col relative top-10 md:static'>
          <span>Recent Search</span>
          <span className='flex gap-2'>
            <h1>Clear All</h1>
            <button
              onClick={clearHistory}
              className=' cursor-pointer p-2 hover:text-zinc-900 dark:hover:text-zinc-100 dark:bg-zinc-700 hover:bg-zinc-400 rounded-full dark:hover:bg-zinc-600 bg-zinc-300 dark:text-zinc-400 text-zinc-500'
              title='Delet'
            >
            <FaTrash />
            </button>
          </span>
        </h1>
        <ul className='overflow-y-auto overflow-x-hidden text-left mt-2 h-[calc(100vh-120px)] relative top-10 md:static'>
          {recentHistory &&
            recentHistory.map((item, index) => (
              <div key={index} className='flex justify-between'>
              <li
                onClick={() => {
                  setSelectedHistory(item.trim());
                  askQuestion(item.trim())
                  setNav(!true);
                }}
                className='p-1 pl-5 px-5 dark:text-zinc-500 text-zinc-800 truncate cursor-pointer dark:hover:bg-zinc-700 hover:bg-zinc-300 dark:hover:text-zinc-100 w-full'
              >
                {item}
              </li>
            <button
              onClick={()=>clearSelectedHistory(item)}
              className=' cursor-pointer p-2 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-400 rounded-full dark:hover:bg-zinc-600 dark:text-zinc-500 text-zinc-600'
              title='Delet'
            >
            <FaTimes />
            </button>
              </div>
            ))}
        </ul>
        </div>
      </div>
      </>
  )
}

export default RecentSearch
