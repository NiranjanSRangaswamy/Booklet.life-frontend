import React from "react"

const Instruction = () => {
  return (
    <>
    <section className="instruction w-full flex flex-col justify-center items-center gap-5" id='instruction'>
      <div className=" text-center md:w-1/2 flex flex-col items-center">
        <h1 className=" mt-8 font-semibold text-3xl md:text-4xl md:mt-2">How to Export Data from WhatsApp</h1>
        <p className="mt-2 w-11/12 text-center text-gray-700 font-medium">   Follow these easy steps to export your chat file and get ready to transform your messages into a beautiful PDF or printed keepsake.</p>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className=" md:w-1/2">
          <h3 className="text-center my-3 text-teal-600 font-bold text-xl">Android</h3>
            <ol  className="w-5/6 md:w-4/5 relative  text-gray-700 md:text-sm">
              <span className="flex justify-center items-start"><div className="circle ">1</div></span><li>Launch WhatsApp and go to the chat you want to export.</li>
              <span className="flex justify-center items-start"><div className="circle ">2</div></span><li>Tap on the three dots in the top right corner of the screen to open the menu. Select 'More' from the dropdown menu.</li>
              <span className="flex justify-center items-start"><div className="circle ">3</div></span><li>Tap on 'Export Chat'. Choose whether to include media (images, videos) or export without media for a smaller file size.</li>
              <span className="flex justify-center items-start"><div className="circle ">4</div></span><li>Choose how you want to save the exported chat file (e.g., email, Google Drive, etc.). Ensure the file is saved in .txt or .zip format.</li>
              <span className="flex justify-center items-start"><div className="circle ">5</div></span><li>Visit our website and click on 'Upload Chat.'. Select the exported .txt file from your device and upload it.</li>
              <div className="line absolute"></div>
            </ol>
        </div>
        <div className="md:w-1/2">
          <h3 className="text-center my-3 text-teal-600 font-bold text-xl ">IOS</h3>
            <ol className="w-5/6 md:w-4/5 relative  text-gray-700 md:text-sm">
              <span className="flex justify-center items-start"><div className="circle ">1</div></span><li>Launch WhatsApp and navigate to the chat you want to export.</li>
              <span className="flex justify-center items-start"><div className="circle ">2</div></span><li>Tap on the chat you want to export to open it. Tap on the contact name or group name at the top of the screen to open the chat info.</li>
              <span className="flex justify-center items-start"><div className="circle ">3</div></span><li>Scroll down and tap on 'Export Chat. Choose whether to attach media (images, videos) or export without media for a smaller file size.</li>
              <span className="flex justify-center items-start"><div className="circle ">4</div></span><li>Select how you want to save the exported chat file. You can send it via email, save it to your Files app, or use another compatible app.</li>
              <span className="flex justify-center items-start"><div className="circle ">5</div></span><li>If you choose to email it, send the email to yourself so you can easily access the .txt file on your computer. If you save it to the Files app, make sure you know the location where it is saved.</li>
              <span className="flex justify-center items-start"><div className="circle ">6</div></span><li>Visit our website and click on 'Upload Chat.' Select the exported .txt file from your device and upload it.</li>
              <div className="line absolute"></div>
            </ol>
        </div>
      </div>
    </section>
    </>
  )
}

export default Instruction