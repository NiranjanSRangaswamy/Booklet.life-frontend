import React, { useEffect, useContext, useState } from "react";
import Navbar from "./Navbar";
import UserContext from "../utils/UserContext.js";

import ChartComponent from "./ChartComponent.jsx";
import ChatDisplay from "./ChatDisplay.jsx";

const Analytics = () => {
  const { chat, setChat } = useContext(UserContext);
  const [statistics, setStatistics] = useState(null);
  const [media, setMedia] = useState(null);
  const [funfacts, setFunfacts] = useState(null);
  const [ego, setEgo] = useState(null);
  const [color, setColor] = useState(null);
  const [mode, setMode] = useState("dark");
  const [attachments, setAttachments] = useState(null);

  useEffect(() => {
    if (chat) {
      console.log(chat);
      setStatistics(chat.Statistics);
      setMedia(chat.media["media"]);
      setAttachments(chat.media["attachments"]);
      setFunfacts(chat.getFunFacts());
      setColor(chat.personColorMap);
    }
    if (funfacts) {
      setEgo(funfacts[0].name);
    }
  }, [chat, funfacts]);
  const handleEgoChange = (e) => {
    setEgo(e.target.value);
  };
  const handleColorchange = (e) => {
    setMode(e.target.value);
  };

  return (
    <section className="analytics min-h-screen w-full " id="analytics">
      <Navbar />
      <div className="container w-full flex justify-center">
        <div className="content bg-white min-h-screen w-full flex flex-col  md:my-10 md:w-3/4 rounded-lg md:rounded-xl">
          <div className="attachments flex justify-evenly md:justify-center gap-5 my-10 flex-wrap ">
            <div>
              <h1>{media?.totalmessages}</h1>
              <p>Messages</p>
            </div>
            <div>
              <h1>{media?.images}</h1>
              <p>Pictures</p>
            </div>
            <div>
              <h1>{media?.video}</h1>
              <p>Videos</p>
            </div>
            <div>
              <h1>{media?.audio}</h1>
              <p>Audio</p>
            </div>
            <div>
              <h1>{media?.documents}</h1>
              <p>Documents</p>
            </div>
          </div>
          <div className="statistics w-full flex justify-center  ">
            <div className="p-5 rounded-md">
              <div>
                <p>First Message</p>
                <h1>{statistics?.firstMessage}</h1>
              </div>
              <div>
                <p>Last Message</p>
                <h1>{statistics?.lastMessage}</h1>
              </div>
              <div>
                <p>Most Active Month</p>
                <h1>{statistics?.mostActiveMonth}</h1>
              </div>
              <div>
                <p>Most Active User</p>
                <h1>{statistics?.mostActiveUser}</h1>
              </div>
              <div>
                <p>Total Participants</p>
                <h1>{statistics?.totalParticipants}</h1>
              </div>
              <div>
                <p>Average Message Per User</p>
                <h1>{statistics?.averageMessagePerUser}</h1>
              </div>
            </div>
          </div>
          <div className="funfacts w-11/12 mx-auto flex justify-center my-10">
            <div className="flex flex-wrap gap-5">
              {funfacts?.map((user, i) => {
                if (user.name !== "null") {
                  return (
                    <div key={i} className="user flex flex-grow flex-col">
                      <h1>{user.name}</h1>
                      <div>
                        <p>Messages sent</p>
                        <h2>{user.numberOfMessage}</h2>
                      </div>
                      <div>
                        <p>Words per message</p>
                        <h2>{user.averageMessageLength}</h2>
                      </div>
                      <div>
                        <p>Longest Message</p>
                        <h2>{user.longestMessage}</h2>
                      </div>
                      <div>
                        <p>Total words</p>
                        <h2>{user.numberOfWords}</h2>
                      </div>
                      <div>
                        <p>Unique words</p>
                        <h2>{user.uniqueWords}</h2>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <ChartComponent />
          {funfacts ? (
            <div className="preview rounded-xl w-11/12 mx-auto my-6 ">
              <div className=" header  flex flex-col md:flex-row mx-auto justify-between  ">
                <h1 className="text-white mx-auto text-2xl font-semibold md:ml-6 my-3">Chat Preview</h1>
                <select
                  name="ego"
                  id="ego"
                  onChange={handleEgoChange}
                  className="text-gray-700 text-sm bg-whit mx-auto py-1 md:my-3 mb-3 md:mr-6 rounded-md"
                >
                  {/* {!ego && <option value="">Change point of view</option>} */}
                  {funfacts.map((user, index) => {
                    if (user.name !== "null") {
                      return (
                        <option key={index} value={user.name}>
                          {user.name}
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
              <ChatDisplay ego={ego} color={color} mode={mode} />
            </div>
          ) : (
            <h1>error</h1>
          )}
        </div>
      </div>
    </section>
  );
};

export default Analytics;
