import React,{useEffect,useContext, useState} from 'react'
import Navbar from './Navbar'
import UserContext from '../utils/UserContext.js';

import ChartComponent from './ChartComponent.jsx';


const Analytics = () => {

  const {chat,setChat} = useContext(UserContext);
  const [statistics,setStatistics] = useState(null);
  const [attachments, setAttachments] = useState(null)
  const [funfacts,setFunfacts] = useState(null)
  const [data,setdata] = useState({
    labels: ['First User Name', 'Second User Name', 'Third User Name'],
    values: [57.63, 42.37, 30.00], // example values
  })

  useEffect(()=>{
    if(chat){
      setStatistics(chat.Statistics)
      setAttachments(chat.attachments)
      setFunfacts(chat.getFunFacts())
    }
  },[chat])
  
  return (
    <section className='analytics min-h-screen w-full ' id='analytics'>
      <Navbar/>
      <div className='container w-full flex justify-center'>
        <div className='content bg-white min-h-screen w-full flex flex-col  md:my-10 md:w-5/6 rounded-lg md:rounded-xl'>
          <div className='attachments flex justify-evenly md:justify-center gap-5 my-10 flex-wrap '>
            <div>
              <h1>{attachments?.totalmessages}</h1>
              <p>Messages</p>
            </div>
            <div>
              <h1>{attachments?.images}</h1>
              <p>Pictures</p>
            </div>
            <div>
              <h1>{attachments?.video}</h1>
              <p>Videos</p>
            </div>
            <div>
              <h1>{attachments?.audio}</h1>
              <p>Audio</p>
            </div>
            <div>
              <h1>{attachments?.documents-1}</h1>
              <p>Documents</p>
            </div>
          </div>
          <div className='statistics w-full flex justify-center  '>
            <div className='p-5 rounded-md' >
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
          <div className='funfacts w-11/12 mx-auto flex justify-center my-10'>
            <div className='flex flex-wrap gap-5'>
              {
                funfacts?.map((user,i)=>{
                  return(
                    <div key={i} className='user flex flex-grow flex-col'>
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
                  )
                })
              }
            </div>
          </div>
          <ChartComponent/>
        </div>
      </div>
    </section>
  )
}

export default Analytics