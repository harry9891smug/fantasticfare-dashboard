'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FiPlusSquare,FiEye, FiEdit,FiTrash2} from 'react-icons/fi'
import Link from 'next/link'

interface User {
    _id: string;       
    name: string; 
    email: string;  
    mobile_number: string; 
    role: string;     
    createdAt?: string;
    updatedAt?: string;
  }
  
  export default function AllUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [roleName, setRoleName] = useState('');
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
              setError('Unauthorized: No token found. Please log in.');
              return;
            }
          
            try {
              const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/list-users`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              
              // Use response.data.data instead of response.data
              setUsers(response.data.data || []); 
              
            } catch (error: any) {
              console.error('Fetch roles error:', error);
              setError(error.response?.data?.message || 'Failed to fetch users');
              setUsers([]); // Reset to empty array on error
            }
          };
  
      fetchUsers();
    }, []); // ✅ Fix: useEffect now properly calls fetchRoles only once
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?')
        if (!confirmDelete) return
      
        const token = localStorage.getItem('authToken')
      
        try {
          await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete-user/${id}`, {
            headers: { Authorization: `${token}` }
          })
          alert('user deleted successfully!')
          setUsers(users.filter(user => user._id !== id)) // Remove deleted role from list
        } catch (error:any) {
          alert(error.response?.data?.message || 'Failed to delete user')
        }
      }

  return (
    <div className="container-fluid">
    <div className="row">
      <div className="col-sm-12">
        <div className="card">
          <div className="card-header card-header--2">
            <div>
              <h5>All Users</h5>
            </div>
            <div className="d-inline-flex">
              <Link href="/dashboard/users/new" className="btn btn-theme">
                <FiPlusSquare className="me-2" />
                Add New User
              </Link>
            </div>
          </div>

          <div className="card-body">
            <div className="table-responsive table-desi">
            <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User Name</th>

                      <th>User Email</th>
                      <th>User Phone-no.</th>
                      <th>User Role</th>
                      <th>View</th>
                      {/* <th>Edit</th> */}
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                  {users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.name || "N/A"}</td>
                            <td>{user.email || "N/A"}</td>
                            <td>{user.mobile_number || "N/A"}</td>
                            <td>{user.role || "N/A"}</td>
                            {/* <td>{user.status || "Inactive"}</td> */}

                            <td>
                                <Link href={`/dashboard/users/view/${user._id}`}>
                                <FiEye className="text-primary" />
                                </Link>
                            </td>
                            {/* <td>
                                <Link href={`/dashboard/roles/edit/${role._id}`}>
                                <FiEdit className="text-warning" />
                                </Link>
                            </td> */}
                            <td>
                                <button className="btn btn-link p-0" onClick={() => handleDelete(user._id)}>
                                <FiTrash2 className="text-danger" />
                                </button>
                            </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan={6} className="text-center">
                            No users found.
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
