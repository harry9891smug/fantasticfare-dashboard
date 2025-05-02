'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FiPlusSquare,FiEye, FiEdit,FiTrash2} from 'react-icons/fi'
import Link from 'next/link'

interface Permission {
    _id: string;       
    permission_name: string; 
    status: string;    
    createdAt?: string;
    updatedAt?: string;
  }
  
  export default function AllRoles() {
    const [permission, setPermissions] = useState<Permission[]>([]);
    const [permissionName, setPermissionName] = useState('');
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        const fetchPermissions = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
              setError('Unauthorized: No token found. Please log in.');
              return;
            }
          
            try {
              const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/permissions`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              
              // Use response.data.data instead of response.data
              setPermissions(response.data.data || []); 
              
            } catch (error: any) {
              console.error('Fetch roles error:', error);
              setError(error.response?.data?.message || 'Failed to fetch permissions');
              setPermissions([]); // Reset to empty array on error
            }
          };
  
      fetchPermissions();
    }, []); // ✅ Fix: useEffect now properly calls fetchRoles only once
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this permission?')
        if (!confirmDelete) return
      
        const token = localStorage.getItem('authToken')
      
        try {
          await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete-permission/${id}`, {
            headers: { Authorization: `${token}` }
          })
          alert('permission deleted successfully!')
          setPermissions(permission.filter(permission => permission._id !== id)) // Remove deleted role from list
        } catch (error:any) {
          alert(error.response?.data?.message || 'Failed to delete permission')
        }
      }

  return (
    <div className="container-fluid">
    <div className="row">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header card-header--2">
            <div>
              <h5>All Permission</h5>
            </div>
            <div className="d-inline-flex">
              <Link href="/dashboard/permissions/new" className="btn btn-theme">
                <FiPlusSquare className="me-2" />
                Add New
              </Link>
            </div>
          </div>

          <div className="card-body">
            <div className="table-responsive table-desi">
            <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Permission Name</th>

                      <th>Status</th>
                      <th>View</th>
                      {/* <th>Edit</th> */}
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                  {permission.length > 0 ? (
                        permission.map((perm, index) => (
                            <tr key={perm._id}>
                            <td>{index + 1}</td>
                            <td>{perm.permission_name || "N/A"}</td>
                            <td>{perm.status || "Inactive"}</td>

                            <td>
                                <Link href={`/dashboard/permissions/edit/${perm._id}`}>
                                <FiEye className="text-primary" />
                                </Link>
                            </td>
                            {/* <td>
                                <Link href={`/dashboard/roles/edit/${role._id}`}>
                                <FiEdit className="text-warning" />
                                </Link>
                            </td> */}
                            <td>
                                <button className="btn btn-link p-0" onClick={() => handleDelete(perm._id)}>
                                <FiTrash2 className="text-danger" />
                                </button>
                            </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan={6} className="text-center">
                            No roles found.
                            </td>
                        </tr>
                        )}

                  </tbody>
                </table>
            </div>
          </div>

          <div className="pagination-box">
            <nav className="ms-auto me-auto" aria-label="Page navigation">
              <ul className="pagination pagination-primary">
                <li className="page-item disabled">
                  <button className="page-link">Previous</button>
                </li>
                <li className="page-item">
                  <button className="page-link">1</button>
                </li>
                <li className="page-item active">
                  <button className="page-link">2</button>
                </li>
                <li className="page-item">
                  <button className="page-link">3</button>
                </li>
                <li className="page-item">
                  <button className="page-link">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
