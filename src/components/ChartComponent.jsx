import React, { useContext, useEffect, useState } from 'react'
import UserContext from '../utils/UserContext.js';
import { Bar } from 'react-chartjs-2';

import DoughnutChart from './DoughnutChart.jsx';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import HorizontalBarChart from './HorizontalBarChart.jsx';
import VerticalBarChart from './VerticalBarChart.jsx';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = () => {

  const {chat} = useContext(UserContext);
  const [data,setData] = useState({
    labels: ['First User Name', 'Second User Name', 'Third User Name'],
    values: [57.63, 42.37, 30.00], // example values
  })

  const [statistics,setStatistics] = useState(null);

  useEffect(()=>{
    if(chat){
      let labels= [];
      let color = [];
      let values = [];
      setStatistics(chat.statistics)
      chat.funFacts.map((user)=>{
        if(user.name !== 'null'){
          labels.push(user.name);
          color.push(user.color);
          values.push(user.numberOfMessages)
        }
      })
      setData({
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
                <div className='md:w-5/12 w-full flex flex-col mx-auto pb-5 md:py-10 justify-evenly items-center chart-stats md:gap-10'>
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
                <div className=' w-full md:w-2/5 mx-auto px-2 flex justify-center items-center'>
                  <DoughnutChart data={data}/>
                </div>
              </div>
              <div className='flex flex-col md:flex-row md:h-96'>
                <div className=' md:w-1/2 px-2 bar-chart '>
                  <VerticalBarChart chartData = {statistics.hourlyData}/>     
                </div>
                <div className=' md:w-1/2 px-2 bar-chart '>
                  <HorizontalBarChart chartData= {statistics.monthlyData}/>
                </div>
              </div>
              
            </div>
        : 
        <h1>Error</h1>
    }
    </div>  
  )
}

export default ChartComponent