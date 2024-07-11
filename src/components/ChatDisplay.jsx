import React, { useContext, useEffect, useState } from "react";
import UserContext from "../utils/UserContext";
import { getAttachment } from "../utils/procesAttachments";
import { IoIosPlay } from "react-icons/io";
import { IoIosDocument } from "react-icons/io";

const ChatDisplay = ({ ego, color, mode}) => {
  const { chat } = useContext(UserContext);
  const [sample, setSample] = useState(null);
  const [attachments, setAttachments] = useState(null);

  useEffect(() => {
    if (chat) {
      setSample(chat.filterdChatObject.slice(0, 40));
      setAttachments(chat.media.attachments);
    }
  }, [chat]);

  const getTime = (date) => {
    const year = date.getFullYear();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${day} ${month} ${year} ${hour}:${minute}`;
  };

  const parseMessage = (message) => {
    const validUrl = new RegExp(
      "(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?",
      "i"
    );
    const words = message.split(" ");
    let htmlMessage = "";
    words.forEach((word) => {
      if (validUrl.test(word)) {
        htmlMessage += "<a style='color:#007FFF; word-break: break-all' href=" + word + ">" + word + "</a>" + " ";
      } else {
        htmlMessage += word + " ";
      }
    });
    return htmlMessage;
  };

  const removeFileAttachedMessage = (message) => {
    const fileAttachedIndex = message.indexOf("(file attached)");
    if (fileAttachedIndex !== -1) {
      return message.substring(fileAttachedIndex + "(file attached)".length).trim();
    }
    return message;
  };

  const renderAttachment = (message) => {
    const { url, type } = getAttachment(message.attachment.fileName, attachments);
    if (type.startsWith("image/")) {
      return <img src={url} alt="attachment" className="thumbnail sm:min-w-[300px]" />;
    } else if (type.startsWith("video/")) {
      return (
        <video className="thumbnail sm:min-w-[300px]" controls={false}>
          <source src={url} type={type} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (type.startsWith("audio")) {
      return (
        <div className="audio-bubble flex items-cente text-gray-400 rounded-lg p-2">
          <span className="flex items-center mr-2"><IoIosPlay color="rgb(97, 97, 97)" size={'30px'}/></span>
           <span className="flex items-center text-xs">{message.attachment.fileName}</span>
        </div>
      );
    } else {
      return (
        <div className="document-bubble flex items-cente text-gray-400  rounded-lg p-2">
          <span className="flex items-center mr-2"><IoIosDocument size={'32px'} /></span>
          <span className="flex items-center text-xs">{message.attachment.fileName}</span>
        </div>
      )
    }
    return null;
  };

  return (
    <div className={mode?'chat-display dark h-screen':'chat-display light h-screen'} >
      {sample?.map((message, i) => {
        const cleanedMessage = removeFileAttachedMessage(message.message);
        return (
          <div
            key={i}
            className={`w-full ${message.author === ego ? "flex justify-end" : ""} ${
              (message.author === null) | "system" ? "system flex justify-center " : ""
            }`}
          >
            <div className={message.author === ego ? "author" : "others"}>
              <h1 style={{ color: color[message.author] }} className='px-1'>{message.author}</h1>
              {message.attachment && renderAttachment(message)}
              {cleanedMessage ? <p className="px-1 " dangerouslySetInnerHTML={{ __html: parseMessage(cleanedMessage) }} /> : null}
              <p className=" text-xs text-gray-400 text-right time">{getTime(new Date(message.date))}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatDisplay;
