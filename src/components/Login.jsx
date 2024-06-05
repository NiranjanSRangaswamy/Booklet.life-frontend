import { BsFillEyeSlashFill } from "react-icons/bs";
import { useNavigate } from "react-router";
import { AiFillEye } from "react-icons/ai";
import { useState } from "react";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
// import Cookies from "js-cookie";
// import axios from "axios";
import React from "react";
// import modules for validations

// import css
import imgSignUp from "../assets/img/girl.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signUpStatus, setSignUpStatus] = useState("");

  //function to handel show and hide eye on password field starts
  function password_show_hide2() {
    var x = document.getElementById("password") ;
    var show_eye = document.getElementById("show_eye2");
    var hide_eye = document.getElementById("hide_eye2");

    if (!x || !show_eye || !hide_eye) {
      console.error("One or more elements not found");
      return;
    }

    hide_eye.classList.remove("d-none");
    if (x.type === "password") {
      x.type = "text";
      show_eye.style.display = "none";
      hide_eye.style.display = "block";
    } else {
      x.type = "password";
      show_eye.style.display = "block";
      hide_eye.style.display = "none";
    }
  }

  //function to handel show and hide eye on password field ends

  const history = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    console.log(email, password);

    // axios.post("http://localhost:3000/api/v1/login", {
    //   email, password
    // })
    // .then((res)=> {
    //   const {token} = res.data;

    //   Cookies.set("token", token);
    //   console.log(signUpStatus)
    //   if(res.status === 200 && Cookies.get("token")){
    //     setSignUpStatus("Login sucessfully");
    //     setTimeout(()=>{
    //       history("/");
    //     }, 1000)
    //   }else if(res.status === 400){
    //     setSignUpStatus("Invalid Credentials")
    //   }else if(res.status === 500){
    //     setSignUpStatus("Login failed, try again");
    //   }
    // })
  };

  return (
    <>
      <section className=" login w-full  flex flex-col md:flex-row bg-white" id="login">
        <div className=" md:w-2/5 flex justify-center items-center t">
          <img className="imgGirl" id="" src={imgSignUp} alt="not found" />
        </div>

        <div className="w-11/12 md:w-3/5 m-auto signUpInfo  flex justify-center items-center">
          <div className="md:w-1/2 w-full md:min-h-4/5 flex flex-col justify-between ">
            <form className="w-full flex gap-3 flex-col " onSubmit={loginUser}>
              <p className="text-center font-bold text-2xl c">Login to your Account</p>
              <div>
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <input
                  type="email"
                  className="text-sm input"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm"> Password</label>
                <div className="flex input">
                  <input
                    name="password"
                    type="password"
                    className="flex-grow outline-none text-sm "
                    id="password"
                    placeholder="password"
                    required={true}
                    aria-label="password"
                    aria-describedby="basic-addon1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="flex justify-center items-center px-1" onClick={password_show_hide2}>
                    <BsFillEyeSlashFill id="show_eye2" className="show" />
                    <AiFillEye id="hide_eye2" className="hide" />
                  </div>
                </div>
              </div>

              <button type="submit">LogIn</button>
            </form>
            <div className="flex justify-between text-sm my-3">
              <Link to="/" className="text-teal-600 font-semibold">Forgot Password?</Link>
              <p className="loginLink">
                Not registered? <Link to="/signup" className="text-teal-600 font-semibold">Create an account</Link>
              </p>
            </div>
            <p className="seperator text-xs">OR</p>
            <div className="flex flex-col gap-3">
              <p className="signUpWith">Login using</p>
              <div className="flex flex-col md:flex-row gap-3 sign-in-links">
                <Link to={'/'}  className="oauth">
                  <FcGoogle size={30} />
                  <p className="flex-grow">Continue with google</p>
                </Link>
                <Link to={'/'} className="oauth">
                  <FaApple size={30} />
                  <p className="flex-grow">Continue with apple</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
