'use client' 
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'

type Addon = {
  _id: string
  addon_name: string
  addon_icon: string
}

type Continent = { id: number; name: string }
type Region = { id: number; name: string }
type Country = { id: number; name: string }

type FormData = {
  package_name: string
  package_url: string
  package_heading: string
  package_image: File[] // Array of File objects
  total_price: string
  discounted_price: string
  meta_name: string
  meta_description: string
  addon_ids: string[]
  continent: string
  region: string
  country: string
  package_id: string
}

export default function UpdatePackage() {
  const router = useRouter()
  const { id } = useParams() // Get the package id from the URL

  const [formData, setFormData] = useState<FormData>({
    package_name: '',
    package_url: '',
    package_heading: '',
    package_image: [], // Array of File objects
    total_price: '',
    discounted_price: '',
    meta_name: '',
    meta_description: '',
    addon_ids: [],
    continent: '',
    region: '',
    country: '',
    package_id: ''
  })

  const [availableAddons, setAvailableAddons] = useState<Addon[]>([])
  const [continents, setContinents] = useState<Continent[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [error, setError] = useState('')
  const [loadingAddons, setLoadingAddons] = useState(true)
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const fetchPackageData = async () => {
    const token = localStorage.getItem('authToken')
    try {
      const res = await axios.get<{ data: FormData }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package_view/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const packageData = res.data.data
      setFormData({
        ...packageData,
        package_image: [], // Reset package images for update
        continent: packageData.continent, // Pre-select continent
        region: packageData.region, // Pre-select region
        country: packageData.country, // Pre-select country
      })
  
      const selectedContinent = packageData.continent
      if (selectedContinent) {
        // Fetch regions for the selected continent
        const regionRes = await axios.get<{ data: Region[] }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/regions/${selectedContinent}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setRegions(regionRes.data.data)
      }
      // setPreviewImages(Array.isArray(packageData.package_image) ? packageData.package_image : []) // Preload images
      setPreviewImages(
        Array.isArray(packageData.package_image)
          ? packageData.package_image.map((file: File | string) =>
              typeof file === 'string' ? file : URL.createObjectURL(file)
            )
          : []
      )
      

    } catch (err) {
      setError('Failed to load package data')
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('authToken')

    const fetchAddons = async () => {
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

    const fetchContinents = async () => {
      try {
        const res = await axios.get<{ data: Continent[] }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/continents`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setContinents(res.data.data)
      } catch (err) {
        setError('Failed to load continents')
      }
    }

    fetchAddons()
    fetchContinents()
    if (id) {
      fetchPackageData()
    }
  }, [id])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (formData.continent) {
      axios
        .get<{ data: Region[] }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/regions/${formData.continent}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          setRegions(res.data.data)
          setFormData(prev => ({ ...prev, region: '', country: '' })) // Reset region and country
          setCountries([]) // Clear countries on continent change
        })
        .catch(() => setError('Failed to load regions'))
    }
  }, [formData.continent]) // Trigger when continent changes

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (formData.region) {
      axios
        .get<{ data: Country[] }>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/countries/${formData.region}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
          setCountries(res.data.data)
        })
        .catch(() => setError('Failed to load countries'))
    }
  }, [formData.region]) 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
  
    const newImages = Array.from(files)
    setSelectedImages(prev => [...prev, ...newImages])
  
    const newPreviews: Promise<string>[] = newImages.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve(reader.result as string)
        }
        reader.readAsDataURL(file)
      })
    })
  
    Promise.all(newPreviews).then(previews => {
      setPreviewImages(prev => [...prev, ...previews])
    })
  }

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.package_image]
      newImages.splice(index, 1)
      return { ...prev, package_images: newImages }
    })
    setPreviewImages(prev => {
      const newPreviews = [...prev]
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const handleAddonToggle = (addonId: string) => {
    setFormData(prev => ({
      ...prev,
      addon_ids: prev.addon_ids.includes(addonId)
        ? prev.addon_ids.filter(id => id !== addonId)
        : [...prev.addon_ids, addonId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
      return
    }

    const formDataObj = new FormData()
    // Append all regular fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'package_images' && key !== 'addon_ids' && value !== null) {
        formDataObj.append(key, String(value))
      }
    })

    // Append all images
    formData.package_image.forEach((image, index) => {
      formDataObj.append(`package_image[]`, image)
    })

    // Append addon IDs
    formData.addon_ids.forEach(id => {
      formDataObj.append('addon_ids[]', id)
    })

    try {
      const response = await axios.post<{ package_id: string }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/package-create`,
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      alert('Package Updated Successfully')
      router.push(`/dashboard/packages/edit/${response.data.package_id}`)
    } catch (err) {
      setError('Failed to update package')
    }
  }
  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Update Package</h5>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form className="theme-form mega-form" onSubmit={handleSubmit}>
            <div className="row">
              {/* Dynamic Dropdowns */}
              <div className="col-sm-4">
                <label className="form-label-title mt-3">Continent</label>
                <select
                  className="form-control"
                  name="continent"
                  value={formData.continent}
                  onChange={handleChange}
                >
                  <option value="">Select Continent</option>
                  {continents.map(c => (
                    <option key={c.id} value={c.id}>
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
                    <option key={r.id} value={r.id}>
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
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled={!formData.region}
                >
                  <option value="">Select Country</option>
                  {countries.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

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
                <div className="d-flex flex-wrap gap-3 mt-3">
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
                </div>
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
                              {addon.addon_name}
                            </label>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="card-footer text-end">
              <button type="submit" className="btn btn-primary">Update Package</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
