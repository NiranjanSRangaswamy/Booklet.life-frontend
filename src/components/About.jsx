import React from "react"

const About = () => {
  return (
    <section id="about" className="about">
      <h2 className="text-center text-3xl font-semibold my-5 md:text-4xl">About Us</h2>
      <div className="my-5 flex w-full flex-col md:flex-row justify-around">
      <div id="content" className="w-5/6 mx-auto text-center md:text-left md:w-1/2 flex flex-col justify-center gap-4 items-start">
        <h1 className="md:mx-20  font-semibold"><span>Analyze</span> your <span>WhatsApp</span> Chat in few <span> Seconds</span></h1>
        <p className="md:mx-20 text-sm text-gray-700 font-medium ">At <span>BOOKLET.LIFE</span>, we understand that your conversations are more than just words—they're memories. Our mission is to help you preserve these moments in a tangible, beautiful format. Whether you prefer a digital PDF or a physical printed book, we've got you covered.</p>
        <button className=" mx-auto md:mx-20 rounded-sm py-1 px-2 text-white"><a href="#home">Analyze Now</a></button>
      </div>
      <div id="video" className="md:w-1/2  flex items-center justify-center flex-col w-full">
        
      </div>
      </div>
    </section>
  )
}

export default About