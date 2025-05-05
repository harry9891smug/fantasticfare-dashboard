'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FiEye } from 'react-icons/fi'
import Link from 'next/link'

interface Enquiry {
  _id: string
  first_name: string
  last_name: string
  email?: string
  mobile_number: string
  country_code?: string
  enquiry_from?: string
  createdAt?: string
}

export default function AllEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const limit = 10

  useEffect(() => {
    const fetchEnquiries = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Unauthorized: No token found. Please log in.')
        return
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/list-enquiries?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setEnquiries(response.data.data || [])
        setTotalPages(response.data.pagination.totalPages || 1)
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch enquiries')
        setEnquiries([])
      }
    }

    fetchEnquiries()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
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

            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Enquiry From</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.length > 0 ? (
                      enquiries.map((enquiry, index) => (
                        <tr key={enquiry._id}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>{enquiry.first_name} {enquiry.last_name}</td>
                          <td>{enquiry.enquiry_from}</td>
                          <td>
                            <Link href={`/dashboard/enquiries/view/${enquiry._id}`}>
                              <FiEye className="text-primary" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">No Enquiries found.</td>
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
