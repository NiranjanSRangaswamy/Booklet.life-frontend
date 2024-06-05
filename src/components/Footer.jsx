import React from 'react'
import logoWhite from '../assets/logo-white.png'
import { Link } from 'react-router-dom'



const Footer= ({loadHomePage}) => {  
  return (
    <section id="footer" className="footer w-full">
      <div className='flex flex-col justify-center items-center'>
        <img src={logoWhite} alt="booklet.life logo" className='my-3' />
        <p className='text-white md:w-3/5 w-11/12 text-center md:text-sm'>At WhatsApp Chat Analyzer, we specialize in transforming your WhatsApp conversations into beautiful keepsakes. Whether you choose a digital PDF or a printed book, we ensure your memories are preserved in the most authentic and visually appealing way.</p>
        {loadHomePage?<button className="mx-auto my-3 md:mx-20  rounded-sm py-1 px-2 text-white"><Link to='/
        '>Analyze Now</Link></button>:<button className="mx-auto my-3 md:mx-20  rounded-sm py-1 px-2 text-white"><a href='#home'>Analyze Now</a></button>}
        
      </div>
      <div className='line'></div>
      <div className='text-white py-2 w-full text-center'>@2024 Copyright Booklet.life</div>
    </section>
  )
}

export default Footer