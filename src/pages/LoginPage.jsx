import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import Login from '../components/Login'


const LoginPage = () => {
  return (
    <div className="bg-teal-600">
      <Navbar/>
      <Login/>
      <Footer loadHomePage={true}/>
    </div>
  )
}

export default LoginPage