'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
type Permissions = {
  _id: string
  permission_slug: string
  status: string
}
type PermissionData = {
  _id?: string
  permission_name: string
  createdAt?: string
  updatedAt?: string
  __v?: number
  permissions: Permissions[]
}
export default function EditRole() {
  const router = useRouter()
  const { id } = useParams()
  const [permissionData, setPermissionData] = useState<PermissionData>({
    permission_name: '',
    permissions: []
  })


  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null

  const fetchRole = useCallback(async () => {
    if (!id) return
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/view-permission/${id}`, {
        headers: { Authorization: `${token}` }
      })
      setPermissionData(response.data.data)
    } catch (error) {
      alert('Failed to fetch permission')
    }
  }, [id, token]) // ✅ included dependencies

  useEffect(() => {
    fetchRole()
  }, [fetchRole]) // ✅ no warning

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPermissionData(prev => ({ ...prev, [name]: value }))
  }
  const handlePermissionChange = (
    index: number,
    field: keyof Permissions,
    value: string
  ) => {
    setPermissionData((prev) => {
      if (!prev) return prev

      const updatedPermissions = [...prev.permissions]
      updatedPermissions[index] = {
        ...updatedPermissions[index],
        [field]: value
      }

      return {
        ...prev,
        permissions: updatedPermissions
      }
    })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { _id, createdAt, updatedAt, __v, ...updatedData } = permissionData
    const permsisson_update = { ...updatedData, id: permissionData._id }

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/update-permission/${id}`, permsisson_update, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json'
        }
      })
      alert('permission updated successfully!')
      router.push('/dashboard/permissions')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update permission')
    }
  }


  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header"><h5>Edit Permission</h5></div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label-title">Permission Name</label>
                  <input
                    className="form-control"
                    type="text"
                    name="role_name"
                    value={permissionData.permission_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label-title">Permissions</label>
                  <div className="row">
                    {permissionData.permissions.map((perm, index) => (
                      <div className="col-md-4 mb-2" key={perm._id}>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id={`perm-${index}`}
                            checked={perm.status === 'active'}
                            onChange={(e) =>
                              handlePermissionChange(
                                index,
                                'status',
                                e.target.checked ? 'active' : 'inactive'
                              )
                            }
                          />
                          <label className="form-check-label" htmlFor={`perm-${index}`}>
                            {perm.permission_slug}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
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
