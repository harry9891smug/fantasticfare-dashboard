'use client'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { ApexOptions } from 'apexcharts'

export default function TrafficChart() {
  const options: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false }
    },
    colors: ['#3b82f6', '#10b981', '#6366f1'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    }
  }
  

  const series = [
    {
      name: 'Organic',
      data: [30, 40, 35, 50, 49, 60, 70]
    },
    {
      name: 'Direct',
      data: [15, 25, 30, 40, 35, 45, 55]
    },
    {
      name: 'Referral',
      data: [10, 15, 20, 25, 30, 35, 40]
    }
  ]

  return (
    <div className="card">
      <div className="card-header">
        <h5>Traffic</h5>
        <div className="btn-group">
          <button className="btn btn-outline-light">Day</button>
          <button className="btn btn-outline-light">Week</button>
          <button className="btn btn-outline-light active">Month</button>
        </div>
      </div>
      <div className="card-body">
        <Chart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
    </div>
  )
}