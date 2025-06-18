'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FiEdit, FiEdit3, FiEye, FiTrash } from 'react-icons/fi'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

interface Pages {
  _id: string
  page_name: string
  page_url: string
  page_priority: string
  page_status?: string
  createdAt?: string
}

export default function AllPages() {
  const router = useRouter()
  const [pages, setPages] = useState<Pages[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const limit = 10

  useEffect(() => {
    const fetchPages = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Unauthorized: No token found. Please log in.')
        return
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/list-pages?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setPages(response.data.data || [])
        setTotalPages(response.data.totalPages || 1)
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch pages')
        setPages([])
      }
    }

    fetchPages()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }
  const formatDate = (datedata: string | number | Date): string => {
   return  new Date(datedata).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit'
});
}
const handleDelete = async (id: string) => {
  const token = localStorage.getItem('authToken')

  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/delete-page/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    toast.success('Page deleted successfully!')
   router.push('/dashboard/crm')
  } catch (error) {
    console.error('Delete failed:', error)
    toast.error('Failed to delete the page.')
  }
}
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>All Enquiries</h5>
            </div>

              <div className="link">
                <Link href='/dashboard/crm/new' className='btn btn-primary' style={{float:'right',marginRight:'40px',marginTop:'10px'}}>Add Page</Link>
              </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Page Name</th>
                      <th>Page Priority</th>
                      <th>Page Status</th>
                      <th>Created On</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.length > 0 ? (
                      pages.map((page, index) => (
                        <tr key={page._id}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>{page.page_name}</td>
                          <td>{page.page_priority}</td>
                          <td style={{
                              color: page.page_status === 'active' ? 'green' : 'red',
                              fontWeight: 'bold'
                            }}
                            >{page.page_status === 'active' ? 'Active' : 'Inactive'}</td>
                          <td>{page.createdAt ? formatDate(page.createdAt) : 'N/A'}</td>
                          <td>
                             <Link href={`/dashboard/crm/edit/${page._id}`}>
                              <FiEdit className="text-info" />
                            </Link>&nbsp;&nbsp;&nbsp;
                          <button  onClick={() => {
                              if (window.confirm('Are you sure you want to delete this page?')) {
                                handleDelete(page._id)
                              }
                            }} className="btn p-0" title="Delete">
                            <FiTrash className="text-danger" />
                          </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">No Pages found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="card-footer d-flex justify-content-center">
                <nav aria-label="Page navigation">
                  <ul className="pagination pagination-primary">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
