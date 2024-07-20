import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HorizontalBarChart = ({id,chartData}) => {

  const data = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 
      'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Messages',
        data: chartData,
        backgroundColor: 'rgb(18, 140, 126)',
        borderColor: 'rgb(18, 140, 126)',
        borderWidth: 1,
        barThickness: 7,
      },
    ],
  };

  const options = {
    indexAxis: 'x',
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
      title: {
        display: true,
        text: 'Messages in each month', // Add your title here
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
        right: 0
      },
    },
  };

  return <Bar id={id} data={data} options={options} />;
};

export default HorizontalBarChart;
