import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ContactPage from "./pages/ContactPage"
import SignupPage from "./pages/SignupPage"
import LoginPage from './pages/LoginPage.jsx'
import { useEffect, useState } from "react"

const App = () => {
  const [chatObject,setChatObject] = useState(null)

  const getChatObject=(chatObject)=>{
    setChatObject(chatObject)
  }
  useEffect(()=>{
    if(chatObject){
      console.log(chatObject)
    }
  },[chatObject])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  Component={HomePage} hanldeChatObject={getChatObject} />
        <Route path="/contact" Component={ContactPage}/>
        <Route path="/signup" Component={SignupPage}/>
        <Route path="/login" Component={LoginPage}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App