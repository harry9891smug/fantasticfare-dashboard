'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function AddRole() {
  const router = useRouter()
  const [roleData, setRoleData] = useState({
    permission_name: '',
    status: 'active',
    controller_id:1
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRoleData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken') // Get token

    try {
      await axios.post('https://backend.fantasticfare.com/api/create-permission', roleData, {
        headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
      })
      alert('Permission created successfully!')
      router.push('/dashboard/permissions') // Redirect after success
    } catch (error:any) {
      alert(error.response?.data?.message || 'Failed to create role')
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header"><h5>Add New Role</h5></div>
                <div className="card-body">
                  <form className="theme-form mega-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label-title">Permission Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Role Name"
                        name="role_name"
                        value={roleData.permission_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="card-footer text-end">
                      <button type="submit" className="btn btn-primary me-3">Submit</button>
                      <button type="button" className="btn btn-outline-primary" onClick={() => router.push('/dashboard/permissions')}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
