import React, { useEffect, useContext, useState } from "react";
import Navbar from "./Navbar";
import UserContext from "../utils/UserContext.js";
import { Link, useNavigate } from "react-router-dom";

import ChartComponent from "./ChartComponent.jsx";
import ChatDisplay from "./ChatDisplay.jsx";
import { Box, FormControl, Select, MenuItem, Switch } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import darkBg from "../assets/dark-bg.png";
import lightBg from "../assets/light-bg.png";
import darkIcon from "../assets/logo-white.jpg";
import lightIcon from "../assets/logo-green.jpg";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

const Analytics = () => {
  const navigate = useNavigate();
  const [isPDFDownloaded, setISPDFDownloaded] = useState(false);
  const { chat, setChat } = useContext(UserContext);
  const [statistics, setStatistics] = useState(null);
  const [media, setMedia] = useState(null);
  const [funFacts, setFunFacts] = useState(null);
  const [ego, setEgo] = useState("");
  const [color, setColor] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (chat) {
      setStatistics(chat.statistics);
      setMedia(chat.media["media"]);
      setFunFacts(chat.funFacts);
      setColor(chat.personColorMap);
    }
    if (funFacts) {
      setEgo(funFacts[0].name);
    }
  }, [chat, funFacts]);

  useEffect(() => {
    setTimeout(() => {
      if (chat) {
        clearTimeout();
      } else navigate("/");
    }, 60000);
  }, []);
  const handleEgoChange = (e) => {
    setEgo(e.target.value);
  };

  const handleColorChange = (e) => {
    setDarkMode(e.target.checked);
  };

  const handlePDFDownload = async () => {
    setIsLoading(true)
    const pieChart = document.getElementById("pieChart").toDataURL();
    const hourlyChart = document.getElementById("hourlyChart").toDataURL();
    const monthlyChart = document.getElementById("monthlyChart").toDataURL();
    const base64Images = {
      darkBg,
      lightBg,
      darkIcon,
      lightIcon,
      pieChart,
      hourlyChart,
      monthlyChart,
    };
    const worker = new Worker(new URL("../utils/worker.js", import.meta.url));
    worker.postMessage({ chat, ego, darkMode, sample: false, base64Images });
    worker.addEventListener("message", (event) => {
      const { pdf } = event.data;
      const url = URL.createObjectURL(pdf);
      const a = document.createElement("a");
      a.href = url;
      a.download = "sample.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      worker.terminate();
      setIsLoading(false)
      setISPDFDownloaded(true);
    });
  };

  return (
    <section className="analytics min-h-screen w-full " id="analytics">
      <Navbar />
      <div className="container w-full flex justify-center">
        <div className="content min-h-screen bg-white md:my-10 md:w-3/4 rounded-lg md:rounded-xl">
          {chat ? (
            <div className="min-h-screen w-full flex flex-col  ">
              <div className="attachments flex justify-evenly md:justify-center gap-5 my-10 flex-wrap ">
                <div>
                  <h1>{media?.totalMessages}</h1>
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
                  {funFacts?.map((user, i) => {
                    if (user.name !== "null") {
                      return (
                        <div key={i} className="user flex flex-grow flex-col">
                          <h1>{user.name}</h1>
                          <div>
                            <p>Messages sent</p>
                            <h2>{user.numberOfMessages}</h2>
                          </div>
                          <div>
                            <p>Longest Message</p>
                            <h2>{user.longestMessage}</h2>
                          </div>
                          <div>
                            <p>Words per message</p>
                            <h2>{user.averageMessageLength}</h2>
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
              <div className="preview rounded-xl w-11/12 mx-auto my-6 ">
                <div className=" header  flex flex-row mx-auto justify-between  ">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MaterialUISwitch checked={darkMode} onChange={handleColorChange} />
                  </Box>
                  <Box>
                    <FormControl
                      sx={{ m: 1, minWidth: 120 }}
                      size="small"
                      className="text-gray-700 text-sm bg-whit mx-auto py-1 md:my-3 mb-3 md:mr-6 rounded-md"
                    >
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={ego}
                        label="Change Point of View"
                        onChange={handleEgoChange}
                        sx={{
                          height: "2.5rem",
                          fontSize: "0.875rem",
                          ".MuiOutlinedInput-notchedOutline": { border: 0 }, // Remove border for outlined input
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: 0 }, // Remove border when focused
                        }}
                        className="bg-white" // Custom styles for smaller size
                      >
                        {funFacts?.map((user, index) => {
                          if (user.name !== "null")
                            return (
                              <MenuItem value={user.name} key={index}>
                                {user.name}
                              </MenuItem>
                            );
                        })}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <ChatDisplay ego={ego} color={color} mode={darkMode} />
                <div className="download w-full flex justify-evenly md:justify-center md:gap-5">
                  <button className=" my-3   rounded-sm py-1 px-2 text-white" onClick={handlePDFDownload}>
                    {isPDFDownloaded ? "Download Again" : (isLoading ? <CircularProgress /> : "Get Full PDF")}
                  </button>
                  {isPDFDownloaded ? (
                    <button className=" my-3   rounded-sm py-1 px-2 text-white">
                      <Link to={"/"}>Download Different PDF</Link>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 border-4 border-dashed rounded-full animate-spin border-teal-500 mx-auto"></div>
              <h2 className="text-zinc-900 dark:text-white mt-4">Loading...</h2>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Analytics;
