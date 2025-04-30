'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FiPlusSquare, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi'
import Link from 'next/link'

interface Addon {
  _id: string;
  addon_name: string;
  addon_icon: string; // Should be in format "fa-solid fa-plus" or similar
  createdAt?: string;
  updatedAt?: string;
}

export default function AllAddons() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Improved IconRenderer component
  function IconRenderer({ iconClass }: { iconClass: string }) {
    // Dynamically create the icon element
    return (
      <td>
        <i className={iconClass} style={{ fontSize: '1.2rem' }} />
      </td>
    )
  }

  useEffect(() => {
    const fetchAddons = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Unauthorized: No token found. Please log in.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/api/package-addons', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Ensure we have an array of addons
        const addonsData = Array.isArray(response.data?.data) ? response.data.data : [];
        setAddons(addonsData);
        
      } catch (error: any) {
        console.error('Fetch Addons error:', error);
        setError(error.response?.data?.message || 'Failed to fetch Addons');
        setAddons([]);
      }
    };

    fetchAddons();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this Addon?')
    if (!confirmDelete) return

    const token = localStorage.getItem('authToken')

    try {
      await axios.delete(`http://localhost:8000/api/package-addons-delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Addon deleted successfully!')
      setAddons(addons.filter(addon => addon._id !== id))
    } catch (error:any) {
      alert(error.response?.data?.message || 'Failed to delete Addon')
    }
  }

  // Load Font Awesome CSS dynamically
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header card-header--2">
              <div>
                <h5>All Addons</h5>
              </div>
              <div className="d-inline-flex">
                <Link href="/dashboard/addons/new" className="btn btn-theme">
                  <FiPlusSquare className="me-2" />
                  Add New
                </Link>
              </div>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}
              
              <div className="table-responsive table-desi">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Addons Title</th>
                      <th>Addons Icon</th>
                      <th>View</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addons.length > 0 ? (
                      addons.map((addon, index) => (
                        <tr key={addon._id}>
                          <td>{index + 1}</td>
                          <td>{addon.addon_name || "N/A"}</td>
                          <IconRenderer iconClass={addon.addon_icon} />
                          <td>
                            <Link href={`/dashboard/addons/edit/${addon._id}`}>
                              <FiEye className="text-primary" />
                            </Link>
                          </td>
                          <td>
                            <button 
                              className="btn btn-link p-0" 
                              onClick={() => handleDelete(addon._id)}
                            >
                              <FiTrash2 className="text-danger" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">
                          {error ? error : 'No Addons found.'}
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