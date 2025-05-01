'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function AddRole() {
  const router = useRouter()
  const [AddonsData, setAddonsData] = useState({
    addon_name: '',
    addon_icon: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddonsData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      alert('Please login to continue')
      router.push('/login')
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/package-addons-create', 
        AddonsData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' 
          }
        }
      )
      
      console.log('Response:', response.data)
      alert('Addons created successfully!')
      router.push('/dashboard/addons')
    } catch (error : any) {
      console.error('Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.')
        router.push('/login')
      } else {
        alert(error.response?.data?.message || 'Failed to create Addons')
      }
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header"><h5>Add New Addons</h5></div>
                <div className="card-body">
                  <form className="theme-form mega-form" onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label-title">Addons Title</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Addons Title"
                        name="addon_name"
                        value={AddonsData.addon_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label-title">Addons Icon</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Addons Icon"
                        name="addon_icon"
                        value={AddonsData.addon_icon}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="card-footer text-end">
                      <button type="submit" className="btn btn-primary me-3">Submit</button>
                      <button type="button" className="btn btn-outline-primary" onClick={() => router.push('/dashboard/addons')}>Cancel</button>
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
