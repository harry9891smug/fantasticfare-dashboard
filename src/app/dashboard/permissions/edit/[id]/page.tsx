'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
type PermissionData = {
  _id?: string
  permission_name: string
  status: string
  createdAt?: string
  updatedAt?: string
  __v?: number
}
export default function EditRole() {
  const router = useRouter()
  const { id } = useParams()
  const [permissionData, setPermissionData] = useState<PermissionData>({ permission_name: '', status: 'active' })


  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

  const fetchRole = useCallback(async () => {
    if (!id) return
    try {
      const response = await axios.get(`https://backend.fantasticfare.com/api/view-permission/users`, {
        headers: { Authorization: `${token}` }
      })
      setPermissionData(response.data.data)
    } catch (error) {
      alert('Failed to fetch role')
    }
  }, [id, token]) // ✅ included dependencies

  useEffect(() => {
    fetchRole()
  }, [fetchRole]) // ✅ no warning

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPermissionData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { _id, createdAt, updatedAt, __v, ...updatedData } = permissionData

    try {
      await axios.put(`https://backend.fantasticfare.com/api/update-permission/users`, updatedData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json'
        }
      })
      alert('Role updated successfully!')
      router.push('/dashboard/permissions')
    } catch (error:any) {
      alert(error.response?.data?.message || 'Failed to update role')
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header"><h5>Edit Role</h5></div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label-title">Role Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="role_name"
                    value={permissionData.permission_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="card-footer text-end">
                  <button type="submit" className="btn btn-primary me-3">Update</button>
                  <button type="button" className="btn btn-outline-primary" onClick={() => router.push('/dashboard/permissions')}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
