'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'

interface Enquiry {
  _id: string
  first_name: string
  last_name: string
  email: string
  mobile_number: string
  country_code: string
  message: string
  enquiry_from: string
  createdAt: string
}

export default function ViewEnquiry() {
  const { id } = useParams()
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/show-enquiry/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response.data)
        setEnquiry(response.data.enquriy)
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch enquiry')
      }
    }

    if (id) fetchEnquiry()
  }, [id])

  if (error) return <div className="text-red-500 p-4">{error}</div>
  if (!enquiry) return <div className="p-4">Loading enquiry details...</div>

  return (
    <div className="container mt-5">
  <h2 className="mb-4 mt-4">Enquiry Details</h2>

  <div className="card shadow-sm rounded-4">
    <div className="card-body p-4">
      <div className="row mb-3">
        <div className="col-md-6">
          <h5 className="text-muted">Name</h5>
          <p className="fw-semibold">{enquiry.first_name} {enquiry.last_name}</p>
        </div>
        <div className="col-md-6">
          <h5 className="text-muted">Email</h5>
          <p className="fw-semibold">{enquiry.email}</p>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <h5 className="text-muted">Mobile</h5>
          <p className="fw-semibold">{enquiry.country_code} {enquiry.mobile_number}</p>
        </div>
        <div className="col-md-6">
          <h5 className="text-muted">Enquiry From</h5>
          <p className="fw-semibold">{enquiry.enquiry_from}</p>
        </div>
      </div>

      <div className="mb-3">
        <h5 className="text-muted">Message</h5>
        <p className="fw-normal border p-3 bg-dark rounded">{enquiry.message} </p>
      </div>

      <div>
        <h5 className="text-muted">Created At</h5>
        <p className="fw-semibold">{new Date(enquiry.createdAt).toLocaleString()}</p>
      </div>
    </div>
  </div>
</div>

  )
}
