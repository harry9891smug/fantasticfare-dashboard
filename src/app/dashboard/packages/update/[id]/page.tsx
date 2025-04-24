'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
export default function EditBasicInfo() {
  const router = useRouter()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    package_name: '',
    package_heading: '',
    from_country: '',
    to_country: '',
    total_price: '',
    discounted_price: '',
    package_image: null as File | null,
    existing_image: '',
    meta_name: '',
    meta_description: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await axios.get(`https://backend.fantasticfare.com/api/package_view/${id}`)
        if (response.data.status && response.data.data) {
          const pkg = response.data.data
          setFormData({
            package_name: pkg.package_name || '',
            package_heading: pkg.package_heading || '',
            from_country: pkg.from_country || '',
            to_country: pkg.to_country || '',
            total_price: pkg.total_price || '',
            discounted_price: pkg.discounted_price || '',
            package_image: null,
            existing_image: pkg.package_image ? 
              `http://50.66.250.20/uploads/packages/${pkg.package_image}` : '',
            meta_name: pkg.meta_name || '',
            meta_description: pkg.meta_description || ''
          })
        }
      } catch (err:any) {
        setError(err.response?.data?.message || 'Failed to fetch package data')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchPackageData()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, package_image: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const token = localStorage.getItem('authToken')
    const formDataToSend = new FormData()

    // Append all fields
    formDataToSend.append('package_name', formData.package_name)
    formDataToSend.append('package_heading', formData.package_heading)
    formDataToSend.append('from_country', formData.from_country)
    formDataToSend.append('to_country', formData.to_country)
    formDataToSend.append('total_price', formData.total_price)
    formDataToSend.append('discounted_price', formData.discounted_price)
    formDataToSend.append('meta_name', formData.meta_name)
    formDataToSend.append('meta_description', formData.meta_description)
    
    if (formData.package_image) {
      formDataToSend.append('package_image', formData.package_image)
    }

    try {
      await axios.put(`https://backend.fantasticfare.com/api/package_update/${id}/basic`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      router.push(`/dashboard/packages/edit/${id}`)
    } catch (err:any) {
      setError(err.response?.data?.message || 'Failed to update package')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading package data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Edit Basic Package Information</h5>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Package Name*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="package_name"
                    value={formData.package_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Package Heading*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="package_heading"
                    value={formData.package_heading}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">From Country*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="from_country"
                    value={formData.from_country}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">To Country*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="to_country"
                    value={formData.to_country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Total Price*</label>
                  <input
                    type="number"
                    className="form-control"
                    name="total_price"
                    value={formData.total_price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Discounted Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="discounted_price"
                    value={formData.discounted_price}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Package Image</label>
                  {formData.existing_image && (
                    <div className="mb-2">
                      <Image 
                        src={formData.existing_image} 
                        alt="Current package" 
                        className="img-thumbnail"
                        style={{ maxHeight: '150px' }}
                        height={200}
                        width={300}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Meta Title (SEO)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="meta_name"
                    value={formData.meta_name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Meta Description (SEO)</label>
                  <textarea
                    className="form-control"
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="card-footer text-end">
              <button 
                type="button" 
                className="btn btn-secondary me-2"
                onClick={() => router.push(`/dashboard/packages/edit/${id}`)}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}