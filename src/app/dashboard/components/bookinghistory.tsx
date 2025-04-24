// src/components/dashboard/tables/BookingHistory.tsx
'use client'
import Image from 'next/image'
import { FiArrowUp as FiTakeoff, FiArrowDown as FiLand } from 'react-icons/fi'

export default function BookingHistory() {
  const bookings = [
    {
      image: '/assets/images/tours/1.jpg',
      title: 'Hot Air Balloon',
      nights: '10 Night',
      departure: '02 November',
      duration: '25h 10m (2 stop)',
      arrival: '03 November',
      status: 'Active',
      price: '$900'
    },
    // Add other bookings...
  ]

  return (
    <div className="card">
        <div className="card-header">
            <div className="card-header-title">
                <h5>Booking History</h5>

            </div>


        </div>
        <div className="card-body">
            <div className="table-responsive ">
                <table className=" dashboard-table table border-0 ">

                    <tbody>
                        <tr>
                            <td><Image src="/assets/images/tours/1.jpg" width={50} height={50} alt="tour 1"/></td>
                            <td><span className="fw-500"> Hot Air
                                    Balloon</span><span>Egyptair</span></td>
                            <td><span> 10 Night </span></td>
                            <td><span><svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24">
                                        <title>flight_takeoff</title>
                                        <path
                                            d="M22.078 9.656q0.141 0.609-0.164 1.125t-0.914 0.703q-5.813 1.547-9.656 2.578l-5.297 1.406-1.594 0.469-2.625-4.5 1.453-0.375 1.969 1.5 4.969-1.313-4.125-7.172 1.922-0.516 6.891 6.422 5.344-1.406q0.609-0.188 1.148 0.141t0.68 0.938zM2.484 18.984h19.031v2.016h-19.031v-2.016z">
                                        </path>
                                    </svg>02 November</span>
                            </td>
                            <td><span></span>
                                <span>25h 10m (2 stop)</span>
                            </td>
                            <td><span><svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24">
                                        <title>flight_land</title>
                                        <path
                                            d="M14.016 14.438q-3.844-1.078-9.656-2.578l-1.594-0.469v-5.156l1.453 0.375 0.938 2.344 4.969 1.313v-8.25l1.922 0.516 2.766 9 5.297 1.406q0.609 0.188 0.914 0.727t0.164 1.148q-0.188 0.609-0.703 0.891t-1.125 0.141zM2.484 18.984h19.031v2.016h-19.031v-2.016z">
                                        </path>
                                    </svg>03 November</span>
                            </td>
                            <td><span className="badge badge-primary">Active</span>
                            </td>
                            <td><span>$900</span>
                            </td>
                        </tr>
                        <tr>
                            <td><Image src="/assets/images/tours/2.jpg" width={50} height={50} alt="tour 2"/></td>
                            <td><span> Cool Water Ride</span><span>chine</span></td>
                            <td><span> 25 Night </span></td>
                            <td><span><svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24">
                                        <title>flight_takeoff</title>
                                        <path
                                            d="M22.078 9.656q0.141 0.609-0.164 1.125t-0.914 0.703q-5.813 1.547-9.656 2.578l-5.297 1.406-1.594 0.469-2.625-4.5 1.453-0.375 1.969 1.5 4.969-1.313-4.125-7.172 1.922-0.516 6.891 6.422 5.344-1.406q0.609-0.188 1.148 0.141t0.68 0.938zM2.484 18.984h19.031v2.016h-19.031v-2.016z">
                                        </path>
                                    </svg>04 march</span>
                            </td>
                            <td><span></span>
                                <span>10h 20m (1 stop)</span>
                            </td>
                            <td><span><svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24">
                                        <title>flight_land</title>
                                        <path
                                            d="M14.016 14.438q-3.844-1.078-9.656-2.578l-1.594-0.469v-5.156l1.453 0.375 0.938 2.344 4.969 1.313v-8.25l1.922 0.516 2.766 9 5.297 1.406q0.609 0.188 0.914 0.727t0.164 1.148q-0.188 0.609-0.703 0.891t-1.125 0.141zM2.484 18.984h19.031v2.016h-19.031v-2.016z">
                                        </path>
                                    </svg>05 march</span>
                            </td>
                            <td><span className="badge badge-secondary">Booked</span></td>
                            <td><span>$900</span>
                            </td>
                        </tr>
                        <tr>
                            <td><Image src="/assets/images/tours/3.jpg" width={50} height={50} alt=""/></td>
                            <td><span className="fw-500"> Tour of
                                    Shimala</span><span>India</span></td>
                            <td><span> 15 Night </span></td>
                            <td><span><svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24">
                                        <title>flight_takeoff</title>
                                        <path
                                            d="M22.078 9.656q0.141 0.609-0.164 1.125t-0.914 0.703q-5.813 1.547-9.656 2.578l-5.297 1.406-1.594 0.469-2.625-4.5 1.453-0.375 1.969 1.5 4.969-1.313-4.125-7.172 1.922-0.516 6.891 6.422 5.344-1.406q0.609-0.188 1.148 0.141t0.68 0.938zM2.484 18.984h19.031v2.016h-19.031v-2.016z">
                                        </path>
                                    </svg>03 November</span>
                            </td>
                            <td><span></span>
                                <span>30h 20m (2 stop)</span>
                            </td>
                            <td><span><svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24">
                                        <title>flight_land</title>
                                        <path
                                            d="M14.016 14.438q-3.844-1.078-9.656-2.578l-1.594-0.469v-5.156l1.453 0.375 0.938 2.344 4.969 1.313v-8.25l1.922 0.516 2.766 9 5.297 1.406q0.609 0.188 0.914 0.727t0.164 1.148q-0.188 0.609-0.703 0.891t-1.125 0.141zM2.484 18.984h19.031v2.016h-19.031v-2.016z">
                                        </path>
                                    </svg>03 November</span>
                            </td>
                            <td><span className="badge badge-primary">Active</span></td>
                            <td><span>$1500</span>
                            </td>
                        </tr>
                        <tr>
                            <td><Image src="/assets/images/tours/4.jpg" width={50} height={50} alt=""/></td>
                            <td><span className="fw-500"> Beautiful Bali</span><span>Us</span>
                            </td>
                            <td><span> 14 Night </span></td>
                            <td><span><svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24">
                                        <title>flight_takeoff</title>
                                        <path
                                            d="M22.078 9.656q0.141 0.609-0.164 1.125t-0.914 0.703q-5.813 1.547-9.656 2.578l-5.297 1.406-1.594 0.469-2.625-4.5 1.453-0.375 1.969 1.5 4.969-1.313-4.125-7.172 1.922-0.516 6.891 6.422 5.344-1.406q0.609-0.188 1.148 0.141t0.68 0.938zM2.484 18.984h19.031v2.016h-19.031v-2.016z">
                                        </path>
                                    </svg>02 November</span>
                            </td>
                            <td><span></span>
                                <span>30h 20m (1 stop)</span>
                            </td>
                            <td><span><svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                        width="24" height="24" viewBox="0 0 24 24">
                                        <title>flight_land</title>
                                        <path
                                            d="M14.016 14.438q-3.844-1.078-9.656-2.578l-1.594-0.469v-5.156l1.453 0.375 0.938 2.344 4.969 1.313v-8.25l1.922 0.516 2.766 9 5.297 1.406q0.609 0.188 0.914 0.727t0.164 1.148q-0.188 0.609-0.703 0.891t-1.125 0.141zM2.484 18.984h19.031v2.016h-19.031v-2.016z">
                                        </path>
                                    </svg>02 November</span>
                            </td>
                            <td><span className="badge badge-secondary">Booked</span></td>
                            <td><span>$1200</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}