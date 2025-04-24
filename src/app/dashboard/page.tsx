// import { auth } from "./auth/auth";
// import { redirect } from "next/navigation";

import StatsCards from './components/statscard'
import BookingHistory from './components/bookinghistory'
import CalendarWidget from './components/calender'
export default  function DashboardPage() {
    
  
  return (
    <div className="container-fluid">
    {/* Stats Cards Row */}
   

    {/* Charts Row */}
    <div className="row">
        <StatsCards />
        {/* <div className="col-xl-4">
            <VisitorsChart />
        </div>
        <div className="col-xl-8">
            <EarningsChart />
        </div> */}

        {/* Booking History & Calendar */}
        <div className="col-xxl-8">
            <BookingHistory />
        </div>
        <div className="col-xxl-4">
            <CalendarWidget />
        </div>
    

        {/* Additional Sections */}
        {/* <div className="col-lg-6">
            <TrafficChart />
        </div>
        <div className="col-lg-6">
            {/* <WorldMap /> 
        </div> */}
    </div>
  </div>
  )
}