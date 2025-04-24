'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
type Addon = {
  _id: string
  name: string
  addon_icon: string
}

type Continent = { id: number; name: string }
type Region = { id: number; name: string }
type Country = { id: number; name: string }



export default function EditBasicInfo() {

  const [availableAddons, setAvailableAddons] = useState<Addon[]>([])

  const [loadingAddons, setLoadingAddons] = useState(true)
  const router = useRouter()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    package_name: '',
    package_heading: '',
    country: '',
    continent: '',
    region:'',
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
    const token = localStorage.getItem('authToken')
    const fetchPackageData = async () =>
    {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package_view/${id}`)
        if (response.data.status && response.data.data) {
          const pkg = response.data.data
          setFormData({
            package_name: pkg.package_name || '',
            package_heading: pkg.package_heading || '',
            continent: pkg.continent || '',
            region: pkg.region || '',
            country: pkg.country || '',
            total_price: pkg.total_price || '',
            discounted_price: pkg.discounted_price || '',
            package_image: null,
            existing_image: pkg.package_image ? 
              `${process.env.NEXT_PUBLIC_BACKEND_IMAGE}/uploads/packages/${pkg.package_image[0]}` : '',
            meta_name: pkg.meta_name || '',
            meta_description: pkg.meta_description || ''
          })
        }
      } catch (err:any) {
        setError(err.response?.data?.message || 'Failed to fetch package data')
      } finally {
        setLoading(false)
      }
    },
    fetchAddons = async () => {
      try {
        const res = await axios.get<{ data: Addon[] }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package-addons`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAvailableAddons(res.data.data)
      } catch (err) {
        setError('Failed to load addons')
      } finally {
        setLoadingAddons(false)
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
    formDataToSend.append('continent', formData.continent)
    formDataToSend.append('region', formData.region)
    formDataToSend.append('country', formData.country)
    formDataToSend.append('total_price', formData.total_price)
    formDataToSend.append('discounted_price', formData.discounted_price)
    formDataToSend.append('meta_name', formData.meta_name)
    formDataToSend.append('meta_description', formData.meta_description)
    
    if (formData.package_image) {
      formDataToSend.append('package_image', formData.package_image)
    }

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package_update/${id}/basic`, formDataToSend, {
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
        <h5>Create New Package</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <form className="theme-form mega-form" onSubmit={handleSubmit}>
          <div className="row">
            {/* Dynamic Dropdowns */}
            {/* <div className="col-sm-4">
              <label className="form-label-title mt-3">Continent</label>
              <select
                className="form-control"
                name="continent"
                value={formData.continent}
                onChange={handleChange}
              >
                <option value="">Select Continent</option>
                {continents.map(c => (
                  <option key={c.id} value={c.id} >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-4">
              <label className="form-label-title mt-3">Region</label>
              <select
                className="form-control"
                name="region"
                value={formData.region}
                onChange={handleChange}
                disabled={!formData.continent}
              >
                <option value="">Select Region</option>
                {regions.map(r => (
                  <option key={r.id} value={r.id} >
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-sm-4">
              <label className="form-label-title mt-3">Country</label>
              <select
                className="form-control"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!formData.region}
              >
                <option value="">Select Country</option>
                {countries.map(c => (
                  <option key={c.id} value={c.id} >
                    {c.name}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Other Fields */}
            {[
              ['Package Name*', 'package_name'],
              ['Package URL', 'package_url'],
              ['Package Heading', 'package_heading'],
              ['Total Price', 'total_price'],
              ['Discounted Price', 'discounted_price'],
              ['Meta Name', 'meta_name'],
              ['Meta Description', 'meta_description']
            ].map(([label, name]) => (
              <div key={name} className="col-sm-6">
                <label className="form-label-title mt-3">{label}</label>
                <input
                  className="form-control"
                  type={name.includes('price') ? 'number' : 'text'}
                  name={name}
                  placeholder={label}
                  value={formData[name as keyof FormData] as string}
                  onChange={handleChange}
                  required={name === 'package_name'}
                />
              </div>
            ))}

            <div className="col-sm-6">
              <label className="form-label-title mt-3">Package Images</label>
              <input
                className="form-control"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                multiple
              />
              <small className="text-muted">You can select multiple images</small>
              
              {/* Image Previews */}
              {/* <div className="d-flex flex-wrap gap-3 mt-3">
                {previewImages.map((preview, index) => (
                  <div key={index} className="position-relative" style={{ width: '150px', height: '150px' }}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="img-thumbnail h-100 w-100"
                      style={{ objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div> */}
            </div>

            <div className="col-12 mt-4">
              <label className="form-label-title">Available Addons</label>
              {loadingAddons ? (
                <p>Loading addons...</p>
              ) : (
                <div className="row">
                  {availableAddons.length === 0 ? (
                    <p className="text-muted">No addons available</p>
                  ) : (
                    availableAddons.map(addon => (
                      <div key={addon._id} className="col-sm-4 mb-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`addon-${addon._id}`}
                            checked={formData.addon_ids.includes(addon._id)}
                            onChange={() => handleAddonToggle(addon._id)}
                          />
                          <label className="form-check-label" htmlFor={`addon-${addon._id}`}>
                            <IconRenderer iconClass={addon.addon_icon} /> {addon.addon_name}
                          </label>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="card-footer text-end mt-4">
            <button type="submit" className="btn btn-primary me-3">
              Create
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => router.push('/dashboard/packages')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}