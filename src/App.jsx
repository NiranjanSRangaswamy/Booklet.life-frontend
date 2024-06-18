import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ContactPage from "./pages/ContactPage"
import SignupPage from "./pages/SignupPage"
import LoginPage from './pages/LoginPage.jsx'
import { useEffect, useState } from "react"
import UserContext from './utils/UserContext.js';
import AnalyticsPage from "./pages/AnalyticsPage.jsx"

const App = () => {
  const [chat,setChat] = useState(null)

  return (
    <BrowserRouter>
        <UserContext.Provider value={{ chat, setChat }}>
          <Routes>
              <Route path="/"  Component={HomePage} />
              <Route path="/contact" Component={ContactPage}/>
              <Route path="/signup" Component={SignupPage}/>
              <Route path="/login" Component={LoginPage}/>
              <Route path="/chart" Component={AnalyticsPage}/>
          </Routes>
        </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App