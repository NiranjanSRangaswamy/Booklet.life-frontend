import React,{ useContext, useEffect, useState } from "react";
import Navbar from "./Navbar.jsx"
import JSZip from "jszip";
import { parseString } from "whatsapp-chat-parser";
import { useNavigate } from "react-router-dom";
import { prepareChatObject } from "../utils/transformChatData.js"; 
import UserContext from '../utils/UserContext.js';


const Home = (props) => {
  const {chat,setChat} = useContext(UserContext)
  const [file,setFile] = useState(null)

  const navigate = useNavigate()

  const handleFileChange=(e)=>{
    setFile(e.target.files[0])
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
     processFileList(file)
     navigate('/chart')
  }

  const processFileList = (file) =>    {

    if (!file) return 'File is not selected'
    const reader = new FileReader();
    if (/^application\/(?:x-)?zip(?:-compressed)?$/.test(file.type)) {
      reader.addEventListener("loadend", zipLoadEndHandler);
      reader.readAsArrayBuffer(file);
    } else if (file.type === "text/plain") {
      reader.addEventListener("loadend", txtLoadEndHandler);
      reader.readAsText(file);
    } else {
      return 'wrong file'
    }
  };
  
  const zipLoadEndHandler = async (e) => {
    const arrayBuffer = e.target.result;
    const zip = await JSZip.loadAsync(arrayBuffer); 
  
    try {
      const chatFile = await getChatFile(zip);
      const messages = await parseString(chatFile, { parseAttachments: true });
      updateMessages({
        messages,
        attachments: Object.values(zip.files).map((file) => ({
          name: file.name,
          compressedContent: file._data.compressedContent,
        })),
      });
    } catch (error) {
      alert('Wrong file')
      navigate('/')
    }

  };
  
  const txtLoadEndHandler = (e) => {
    const messages = parseString(e.target.result);
    updateMessages({ messages: messages });
  };

  const updateMessages = (chatObject) => {
    extendDataStructure(chatObject);
  };

  const extendDataStructure = async (chatObject) => {
    let authors = {};
    await chatObject.messages.forEach((object, index) => {
      if (!(object.author in authors)) authors[object.author] = 0;
      else authors[object.author] += 1;
      object.absolute_id = index;
      object.personal_id = authors[object.author];
    });
    newMessages(chatObject)
  };

  const getChatFile = async (zipData) => {
    const chatFile = zipData.file("_chat.txt");
    if (chatFile) return await chatFile.async("string");
      return zipData
        .file(/.*(?:chat|whatsapp).*\.txt$/i)
        .sort((a, b) => a.name.length - b.name.length)[0]
        .async("string");
  };

async function newMessages(chatObject){
    if (!chatObject.default || this.chat === undefined) {
      const data =  await prepareChatObject(chatObject);
      data.media =await data.media;
      setChat(data)
    }
  }

  
  return (
    <section id="home" className="home w-full">
      <Navbar />
      <div className="container  flex-col justify-center items-center gap-1  md:w-2/4">
        <h1 className="text-3xl font-semibold sm:text-4xl w-max my-3">Whatsapp Chat Analyzer</h1>
        <p className="text-center leading-tight my-1 md:text-md">Relive Your Conversations: Convert WhatsApp Chats to Stunning PDFs</p>
        <p className="text-center leading-tight my-1 md:text-md">Transform your WhatsApp chats into beautifully formatted PDFs or printed keepsakes with our easy-to-use chat analyzer.</p>
        <form className="file-input w-full md:w-96 flex items-center" onSubmit={handleSubmit}>
          {file?<label htmlFor="file" className=" bg-white w-full h-full flex items-center pl-3 text-md md:text-sm  text-gray-500">{file.name} selected</label>:<label htmlFor="file" className=" bg-white w-full h-full flex items-center pl-3 text-md md:text-sm  text-gray-500">Select .txt or .zip file</label>}
          <input type="file" name="file" id="file" accept=".txt , .zip" className=" hidden" onChange={handleFileChange}/>
          <div className="flex justify-center items-center bg-white">
            <input type="submit" value="Get Started" id="file-submit"  className="mx-2 rounded-sm py-1 px-2"/>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Home;
