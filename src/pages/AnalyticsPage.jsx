import React from 'react'
import Footer from "../components/Footer"
import Analytics from '../components/Analytics.jsx';
import '../assets/css/analytics.css'


const AnalyticsPage = () => {

  return (
    <>
      <Analytics/>
      <Footer loadHomePage={true} />
    </>
  )
}

export default AnalyticsPage