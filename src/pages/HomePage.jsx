import Home from "../components/Home"
import FAQ from "../components/FAQ"
import { useState } from "react"
import Instruction from "../components/Instruction"
import About from "../components/About"
import Footer from "../components/Footer"

const HomePage = () => {
  const [chatData, setChatData] = useState(null)
  const [chatObject,setChatObject] = useState(null)
  let [authors,setAuthors] = useState(null)
  const [attachments, setAttachments] = useState(null)
  const [ego,setEgo] = useState(null)


  return (
    <>
      <Home  />
      <Instruction/>
      <About/>
      <FAQ/>
      <Footer loadHomePage={false}/>
    </>
  )
}

export default HomePage