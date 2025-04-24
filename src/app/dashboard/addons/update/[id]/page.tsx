'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'

interface Addon {
  _id: string
  addon_name: string
  addon_icon: string
  status: number
  checked: boolean
}

export default function EditAddons() {
  const router = useRouter()
  const { id } = useParams()
  const [addons, setAddons] = useState<Addon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id || typeof window === 'undefined') return;
  
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        console.log("Fetched token:", token)
  
        if (!token) {
          setError('Please login to continue')
          setLoading(false)
          return
        }
  
        const headers = { Authorization: `Bearer ${token}` }
  
        const [packageRes, addonsRes] = await Promise.all([
          axios.get(`https://backend.fantasticfare.com/api/package_view/${id}`, { headers }),
          axios.get('https://backend.fantasticfare.com/api/package-addons', { headers })
        ])
  
        if (packageRes.data.status && addonsRes.data.status) {
          const packageAddonIds: string[] = packageRes.data.data.addon_ids || []
          const allAddons: Addon[] = addonsRes.data.data.addons.map((addon: any) => ({
            ...addon,
            checked: packageAddonIds.includes(addon._id)
          }))
  
          setAddons(allAddons)
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }
  
    fetchData()
  }, [id])
  

  const toggleAddon = async (addonId: string, checked: boolean) => {
    try {
      setLoading(true)
      await axios.post(
        `https://backend.fantasticfare.com/api/package_update/${id}/addons`,
        {
          action: checked ? 'add' : 'remove',
          addon_id: addonId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      )

      // Update local state
      setAddons(prev =>
        prev.map(addon =>
          addon._id === addonId ? { ...addon, checked } : addon
        )
      )
    } catch (err: any) {
      setError(err.response?.data?.message || 'Addon update failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container-fluid text-center py-5">
        <div className="spinner-border text-primary" />
        <p>Loading addons data...</p>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Manage Addons for Package</h5>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <ul className="list-group">
            {addons.map(addon => (
              <li
                key={addon._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>
                    <i className={addon.addon_icon}></i> {addon.addon_name}
                  </strong>
                </div>
                <input
                  type="checkbox"
                  checked={addon.checked}
                  onChange={e => toggleAddon(addon._id, e.target.checked)}
                  disabled={loading}
                />
              </li>
            ))}
          </ul>
          <div className="text-end mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => router.push(`/dashboard/packages/edit/${id}`)}
            >
              Back to Package
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
