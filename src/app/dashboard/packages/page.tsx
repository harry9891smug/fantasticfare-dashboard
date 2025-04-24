'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FiPlusSquare, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi'
import Link from 'next/link'

interface Package {
  _id: string
  package_name: string
  from_country: string
  to_country: string
  total_price: number
  status: string
}

export default function AllPackages() {
  const [packages, setPackages] = useState<Package[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPackages = async () => {
      const token = localStorage.getItem('authToken')
      try {
        const res = await axios.get('https://backend.fantasticfare.com/api/package-list', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPackages(res.data.data)
      } catch (err:any) {
        setError(err.response?.data?.message || 'Failed to fetch packages')
      }
    }
    fetchPackages()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this package?')) return
    const token = localStorage.getItem('authToken')
    try {
      await axios.delete(`https://backend.fantasticfare.com/api/delete-package/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPackages(packages.filter(pkg => pkg._id !== id))
    } catch (err:any) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header card-header--2">
          <h5>All Packages</h5>
          <Link href="/dashboard/packages/new" className="btn btn-theme">
            <FiPlusSquare className="me-2" /> Add New
          </Link>
        </div>
        
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, index) => (
                  <tr key={pkg._id}>
                    <td>{index + 1}</td>
                    <td>{pkg.package_name}</td>
                    <td>${pkg.total_price}</td>
                    <td>{pkg.status}</td>
                    <td>
                   
                    <Link href={`/dashboard/packages/edit/${pkg._id}`} className="me-2">
                        <FiEdit className="text-success" />
                      </Link>
                      <Link href={`/dashboard/packages/${pkg._id}`} className="me-2">
                        <FiEye className="text-warning" />
                      </Link>
                      <button onClick={() => handleDelete(pkg._id)} className="btn btn-link p-0">
                        <FiTrash2 className="text-danger" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}