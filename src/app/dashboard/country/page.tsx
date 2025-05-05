'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FiEdit, FiTrash, FiTrash2 } from 'react-icons/fi'
import ImageModal from '../components/ImageModal';
import { useRouter } from 'next/navigation'

interface Country {
  _id: string
  country_name: string
  image: string
}

export default function CountryList() {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const fetchCountries = async (page: number) => {
    setLoading(true)
    const token = localStorage.getItem('authToken')
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-countries`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 10 }
      })
      setCountries(res.data.data || [])
      setTotalPages(res.data.pagination.totalPages)
    } catch (error) {
      console.error('Error fetching countries:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCountries(currentPage)
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setCurrentPage(newPage)
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }
  const deleteCountry = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken')
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete-country/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      router.refresh()
    } catch (error) {
      console.error('Error deleting country:', error)
      alert('Failed to delete country.')
    }
  }
  const handleDeleteClick = (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this country?');
    if (confirmDelete) {
      deleteCountry(id);
    }
  };
  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Countries</h3>
        <Link href="/dashboard/country/new" className="btn btn-primary">Add Country Image</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Country Name</th>
              <th>Image</th>
              <th colSpan={2}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {countries.length > 0 ? (
              countries.map((country, index) => (
                <tr key={country._id}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                  <td>{country.country_name}</td>
                  <td>
                    <img
                      src={country.image}
                      alt={country.country_name}
                      height="40"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleImageClick(country.image)}
                    />
                  </td>
                  <td>
                    <Link href={`/dashboard/country/${country._id}`} className="btn btn-sm btn-secondary">
                      <FiEdit />
                    </Link>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteClick(country._id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-muted py-3">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div className="pagination-box">
        <nav className="ms-auto me-auto" aria-label="Page navigation">
          <ul className="pagination pagination-primary justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, idx) => (
              <li
                key={idx}
                className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Use the ImageModal component here */}
      <ImageModal imageUrl={selectedImage} onClose={closeModal} />
    </div>
  )
}
