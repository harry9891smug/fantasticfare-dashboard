'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation'
import Image from 'next/image'

interface User {
  _id: string;
  name: string;
  email: string;
  mobile_number: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ViewUser() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const userId = params?.id as string // 👈 get id from URL

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Unauthorized: No token found. Please log in.')
        return
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setUser(response.data.user || null)
      } catch (error: any) {
        console.error('Fetch user error:', error)
        setError(error.response?.data?.message || 'Failed to fetch user')
      }
    }

    if (userId) fetchUser()
  }, [userId])

  if (error) return <div className="text-red-500 p-4">{error}</div>
  if (!user) return <div className="p-4">Loading user details...</div>

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>User Details: {user.name}</h5>
        </div>
        <div className="card-body">
          <form className="theme-form mega-form">
            <div className="personal-info">
              <div className="personal-info__img">
                <Image src="/assets/images/users/4.jpg" alt="User Image" width={150} height={150} />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <label className="form-label-title mt-3">Name</label>
                <input className="form-control" type="text" value={user.name} readOnly />
              </div>

              <div className="col-sm-6">
                <label className="form-label-title mt-3">Email</label>
                <input className="form-control" type="email" value={user.email} readOnly />
              </div>

              <div className="col-sm-6">
                <label className="form-label-title mt-3">Mobile Number</label>
                <input className="form-control" type="text" value={user.mobile_number} readOnly />
              </div>

              <div className="col-sm-6">
                <label className="form-label-title mt-3">Role</label>
                <input className="form-control" type="text" value={user.role} readOnly />
              </div>

              <div className="col-sm-6">
                <label className="form-label-title mt-3">Created At</label>
                <input className="form-control" type="text" value={user.createdAt?.slice(0, 10)} readOnly />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
