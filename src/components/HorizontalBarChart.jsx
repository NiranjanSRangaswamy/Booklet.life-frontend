import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HorizontalBarChart = ({chartData}) => {

  const data = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 
      'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Messages in this month',
        data: chartData,
        backgroundColor: 'rgb(18, 140, 126)',
        borderColor: 'rgb(18, 140, 126)',
        borderWidth: 1,
        barThickness: 10,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    Response: true,
    maintainAspectRatio:false,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Hide x-axis gridlines
        },
      },
      y:{
        ticks: {
          autoSkip: false, // Prevents skipping of labels
        },
        grid: {
          display: false, // Hide x-axis gridlines
        },
      }
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    layout: {
      padding: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default HorizontalBarChart;
