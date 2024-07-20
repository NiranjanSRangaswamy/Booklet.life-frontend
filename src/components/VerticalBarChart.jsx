import React from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const VerticalBarChart = ({id,chartData}) => {

  const data = {
    labels: ["0AM","1AM","2AM","3AM","4AM","5AM","6AM","7AM","8AM","9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM","10PM","11PM",],
    datasets: [
      {
        label: "Messages",
        data: chartData,
        backgroundColor: "rgb(18, 140, 126)",
        borderColor: "rgb(18, 140, 126)",
        borderWidth: 1,
        barThickness: 7,
      },
    ],
  };

  const options = {
    indexAxis: "x",
    Response: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Hide x-axis gridlines
        },
      },
      y: {
        ticks: {
          autoSkip: false, // Prevents skipping of labels
        },
        grid: {
          display: false, // Hide x-axis gridlines
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Messages in each hour', // Add your title here
        font: {
          size: 30
        }
      }
    },
    layout: {
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    },
  };

  return <Bar data={data} id={id} options={options} />;
}

export default VerticalBarChart