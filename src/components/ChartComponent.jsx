import React, { useContext, useEffect, useState } from "react";
import UserContext from "../utils/UserContext.js";
import { Bar } from "react-chartjs-2";

import DoughnutChart from "./DoughnutChart.jsx";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import HorizontalBarChart from "./HorizontalBarChart.jsx";
import VerticalBarChart from "./VerticalBarChart.jsx";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = () => {
  const { chat } = useContext(UserContext);
  const [data, setData] = useState({
    labels: ["First User Name", "Second User Name", "Third User Name"],
    values: [57.63, 42.37, 30.0], // example values
  });

  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    if (chat) {
      let labels = [];
      let color = [];
      let values = [];
      setStatistics(chat.statistics);
      chat.funFacts.map((user) => {
        if (user.name !== "null") {
          labels.push(user.name);
          color.push(user.color);
          values.push(user.numberOfMessages);
        }
      });
      setData({
        labels,
        color,
        values,
      });
    }
  }, [chat, statistics]);

  return (
    <div className="chart">
      {statistics ? (
        <div className="">
          <div className="flex flex-col">
            <div className=" w-full md:w-3/5 mx-auto px-2 flex justify-center items-center">
              <DoughnutChart data={data} id={"pieChart"} />
            </div>
            <div className=" h-96 px-2 bar-chart ">
              <VerticalBarChart chartData={statistics.hourlyData} id={"hourlyChart"} />
            </div>
            <div className=" h-96 px-2 bar-chart ">
              <HorizontalBarChart chartData={statistics.monthlyData} id={"monthlyChart"} />
            </div>
          </div>
        </div>
      ) : (
        null
      )}
    </div>
  );
};

export default ChartComponent;
