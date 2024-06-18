import React,{useEffect,useContext} from 'react'
import Navbar from './Navbar'
import UserContext from '../utils/UserContext.js';


const Analytics = () => {

  const {chat,setChat} = useContext(UserContext)

  useEffect(()=>{
    if(chat)
      console.log(chat.Statistics)
  },[chat])

  return (
    <section className='analytics min-h-screen w-full ' id='analytics'>
      <Navbar/>
      <div className='container w-full flex justify-center'>
        <div className='bg-white h-screen w-full my-6 md:my-10 md:w-3/4 rounded-lg md:rounded-xl'>
                </div>
      </div>
    </section>
  )
}

export default Analytics