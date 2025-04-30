'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function AddRole() {
  const router = useRouter()
  const [roleData, setRoleData] = useState({
    role_name: '',
    status: 'active'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRoleData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken') // Get token

    try {
      await axios.post('http://localhost:8000/api/create-role', roleData, {
        headers: { Authorization: `${token}`, 'Content-Type': 'application/json' }
      })
      alert('Role created successfully!')
      router.push('/dashboard/roles') // Redirect after success
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
                      <label className="form-label-title">Role Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Role Name"
                        name="role_name"
                        value={roleData.role_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="card-footer text-end">
                      <button type="submit" className="btn btn-primary me-3">Submit</button>
                      <button type="button" className="btn btn-outline-primary" onClick={() => router.push('/dashboard/roles')}>Cancel</button>
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
