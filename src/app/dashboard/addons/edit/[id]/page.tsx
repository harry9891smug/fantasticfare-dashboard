'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'

export default function EditAddons() {
  const router = useRouter()
  const { id } = useParams()
  const [addonData, setAddonData] = useState({ 
    addon_name: '', 
    addon_icon: '' 
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAddon = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Please login to continue')
        return
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/package-addons-view/${id}`, 
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        }
      )
      setAddonData(response.data.data)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch Addon')
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchAddon()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddonData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Please login to continue')
        return
      }

      const updateData = {
        addon_name: addonData.addon_name,
        addon_icon: addonData.addon_icon
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/package-addons-update/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      alert('Addon updated successfully!')
      router.push('/dashboard/addons')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to update addon'
      setError(errorMessage)
      console.error('Update error:', error)
    }
  }

  if (isLoading) {
    return <div className="container-fluid">Loading...</div>
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">{error}</div>
        <button 
          className="btn btn-primary" 
          onClick={() => router.push('/dashboard/addons')}
        >
          Back to Addons
        </button>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header"><h5>Edit Addons</h5></div>
            <div className="card-body">
              {error && <div className="alert alert-danger mb-3">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label-title">Addons Title</label>
                  <input
                    className="form-control"
                    type="text"
                    name="addon_name"
                    value={addonData.addon_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label-title">Addons Icon</label>
                  <input
                    className="form-control"
                    type="text"
                    name="addon_icon"
                    value={addonData.addon_icon}
                    onChange={handleChange}
                    required
                  />
                  <small className="text-muted">
                    Enter Font Awesome icon class (e.g. &quot;fa-solid fa-plus&quot;)
                  </small>
                </div>
                <div className="card-footer text-end">
                  <button type="submit" className="btn btn-primary me-3">
                    Update
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-primary" 
                    onClick={() => router.push('/dashboard/addons')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
