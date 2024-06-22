import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../utils/UserContext.js';
import { Bar } from 'react-chartjs-2';

import DoughnutChart from './DoughnutChart.jsx';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import HorizontalBarChart from './HorizontalBarChart.jsx';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = () => {

  const {chat,setChat} = useContext(UserContext);
  const [data,setdata] = useState({
    labels: ['First User Name', 'Second User Name', 'Third User Name'],
    values: [57.63, 42.37, 30.00], // example values
  })

  const [statistics,setStatistics] = useState(null);
  useEffect(()=>{
    if(chat){
      let labels= [];
      let color = [];
      let values = [];
      console.log(chat)
      setStatistics(chat.Statistics)
      chat._funfacts.map((user)=>{
        labels.push(user.name);
        color.push(user.color);
        values.push(user.numberOfMessage)
      })
      setdata({
        labels,
        color,
        values
      })
    }    
  },[chat,statistics])



  return (
    <div className='chart'>
      {
        statistics?
            <div className=''>
              <div className='flex flex-col md:flex-row '>
                <div className='md:w-5/12 w-full flex flex-col pb-5 md:py-10 flex-grow justify-evenly items-center chart-stats md:gap-10'>
                  <div>
                    <h1>{statistics?.noOfDays}</h1>
                    <p>Days</p>
                  </div>
                  <div>
                    <h1>{statistics?.messagesPerDay}</h1>
                    <p>Average Messages Per Day</p>
                  </div>
                  <div>
                    <h1>{statistics?.messagePerMonth}</h1>
                    <p>Average Messages Per Day</p>
                  </div>
                </div>
                <div className='bar-chart w-full md:w-7/12'>
                  <HorizontalBarChart chartData= {statistics.monthlyData}/>      
                </div>
              </div>
              <div className='md:w-3/5 w-11/12 mx-auto'>
                <DoughnutChart data={data}/>
              </div>
            </div>
        : 
        <h1>Error</h1>
    }
    </div>  
  )
}

export default ChartComponent