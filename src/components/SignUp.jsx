import { BsFillEyeSlashFill } from "react-icons/bs";
import { AiFillEye } from "react-icons/ai";
import { Fragment, useState } from "react";
// import {useRef, useEffect} from 'react';
import "../assets/css/signup.css";
import imgSignUp from "../assets/img/girl.png";
import { FaApple } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import {
//   faLocationDot,
//   faEnvelope,
//   faPhone,

// } from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [signUpStatus, setSignUpStatus] = useState("");

  // on click functions on passwoord button starts
  function password_show_hide() {
    var x = document.getElementById("password");
    var show_eye = document.getElementById("show_eye");
    var hide_eye = document.getElementById("hide_eye");

    if (!x || !show_eye || !hide_eye) {
      console.error("One or more elements not found");
      return;
    }

    // hide_eye.classList.remove("d-none");

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

  function cpassword_show_hide1() {
    var x = document.getElementById("cpassword") ;
    var show_eye = document.getElementById("show_eye1");
    var hide_eye = document.getElementById("hide_eye1");

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
  // on click functions on passwoord button starts

  // functions to submit form data
  const onSubmitFrom = async (e) => {
    e.preventDefault();
    try {
      const body = { name, email, password, cpassword };
      console.log(body);
      // const response = await fetch("http://localhost:3000/api/v1/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(body),
      // });
      // if (response.status === 422) {
      //   setSignUpStatus("Please fill up all the fields");
      // } else if (response.status === 400) {
      //   setSignUpStatus("Email already register try another");
      // } else if (response.status === 421) {
      //   setSignUpStatus("Password is not matching");
      // } else if (response.status === 200) {
      //   setSignUpStatus("Registered sucessfully");
      //   setTimeout(() => {
      //     window.location.assign("/login");
      //   }, 1000);
      // } else if (response.status === 500) {
      //   setSignUpStatus("Registered failed, try again");
      // }
      // console.log(response)
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };
  return (
    <Fragment>
      <section id="signup" className="bg-white signup py-5 md:py-0">
        <div className="flex flex-col w-full md:flex-row">
          <div className="md:w-2/5 imgCont  flex justify-center items-center">
            <img className="imgGirl" id="" src={imgSignUp} alt="not found" />
          </div>

          <div className="w-11/12 md:w-3/5 m-auto signUpInfo  flex justify-center items-center ">
            <div className="md:w-1/2 w-full md:min-h-4/5 flex flex-col justify-between ">
              <form className=" w-full flex gap-2 flex-col signUpForm form-group" onSubmit={onSubmitFrom}>
                <p className="text-center font-bold text-2xl">Create new Account</p>
                <div>
                  <label htmlFor="fullName" className="text-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control inputTypes text-sm input"
                    id="fullName"
                    placeholder="Enter Name"
                    required={true}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control inputTypes text-sm input"
                    id="email"
                    placeholder="Enter email"
                    required={true}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="text-sm">Password</label>
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
                    <div className="flex justify-center items-center px-1" onClick={password_show_hide}>
                      <BsFillEyeSlashFill id="show_eye" className="show" />
                      <AiFillEye id="hide_eye" className="hide" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="cpassword" className="text-sm">
                    Confirm Password
                  </label>
                  <div className="flex input">
                    <input
                      name="password"
                      type="password"
                      className="flex-grow outline-none text-sm"
                      id="cpassword"
                      placeholder="Enter Password"
                      required={true}
                      aria-label="password"
                      aria-describedby="basic-addon1"
                      value={cpassword}
                      onChange={(e) => setCpassword(e.target.value)}
                    />

                    <div className="flex justify-center items-center px-1" onClick={cpassword_show_hide1}>
                      <BsFillEyeSlashFill id="show_eye1" />
                      <AiFillEye id="hide_eye1" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="submitBtn ">
                  Sign Up
                </button>
              </form>
              <p className="loginLink text-end text-sm my-2">
                Already have an account?{" "}
                <Link to={"/login" }className="text-teal-600 font-bold">
                  Login
                </Link>
              </p>
              <p className="seperator text-xs">OR</p>
              <div className="flex flex-col gap-3">
                <p className="signUpWith">Sign up using</p>
                <div className="flex flex-col md:flex-row gap-3 sign-in-links">
                  <Link to={'/'} className="oauth">
                    <FcGoogle size={30}/>
                    <p className="flex-grow">Continue with google</p>
                  </Link>
                  <Link to={'/'} className="oauth">
                    <FaApple size={30}/>
                    <p className="flex-grow">Continue with apple</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default SignUp;
