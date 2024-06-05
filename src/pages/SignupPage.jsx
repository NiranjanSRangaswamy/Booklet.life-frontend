import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import SignUp from "../components/SignUp"

const SignupPage = () => {
  return (
    <div className='bg-teal-600'>
      <Navbar/>
      <SignUp/>
      <Footer loadHomePage={true}/>
    </div>
  )
}

export default SignupPage