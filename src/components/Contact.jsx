import Navbar from "./Navbar";
import { IoLocationOutline } from "react-icons/io5";
import { IoMailOpenOutline } from "react-icons/io5";
import { TiSocialFacebook } from "react-icons/ti";
import { IoLogoInstagram } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import React, { useState, ChangeEvent } from "react";



const Contact = () => {
  const [contactData, setContactData] = useState<ContactData>({
    name: "",
    email: "",
    phone: null,
    message: "",
  });

  const handleChange = (e) => {
    setContactData({
      ...contactData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(contactData);
  };

  return (
    <section id="contact" className="contact min-h-screen w-full">
      <Navbar />
      <div className="container w-full flex justify-center items-center">
        <div className=" form-out md:w-1/2 flex flex-col bg-white min-w-min md:flex-row  md: justify-around">
          <div className=" bg-teal-600 rounded-md m-3 md:w-2/5 flex flex-col justify-start text-white">
            <div className="grid-items">
              <IoLocationOutline color="white" size={16} className="my-1" />
              <div className="flex flex-col">
                <h3>LOCATION</h3>
                <p>
                  #128, 2nd main, 2nd cross, Deepanjali Nagar, Near metro
                  station, Bengaluru 560026
                </p>
              </div>
            </div>
            <div className="grid-items">
              <IoMailOpenOutline color="white" size={16} className="my-1" />
              <div className="flex flex-col">
                <h3>Email</h3>
                <h3>support@booklet.life</h3>
              </div>
            </div>
            <div className="grid-items">
              <TiSocialFacebook color="white" size={20} className="my-1" />
              <a href="">Booklet.life</a>
            </div>
            <div className="grid-items">
              <IoLogoInstagram color="white" size={16} className="my-1" />
              <a href="">booklet.life</a>
            </div>
            <div className="grid-items">
              <FaXTwitter color="white" size={16} className="my-1" />
              <a href="">booklet_life</a>
            </div>
          </div>
          <div className="w-full md:w-3/5">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col h-full justify-around items-center gap-4 md:gap-0 mb-3 mx-4 "
              id="contact-form"
            >
              <legend className="text-center font-bold">Quik Contact</legend>
              <input
                type="text"
                placeholder="Your name"
                name="name"
                value={contactData.name}
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder="Your Email"
                name="email"
                value={contactData.email}
                onChange={handleChange}
              />
              <input
                type="number"
                placeholder="Your Phone number"
                name="phone"
                value={contactData.phone || ""}
                onChange={handleChange}
              />
              <textarea
                name="message"
                id="message"
                cols={4}
                placeholder="Your message"
              ></textarea>
              <input type="submit" value="Send Message" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
