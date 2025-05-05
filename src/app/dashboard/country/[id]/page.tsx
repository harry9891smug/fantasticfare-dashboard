'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'

let debounceTimeout: ReturnType<typeof setTimeout>;

export default function CountryForm() {
  const router = useRouter();
  const { id } = useParams() // Use `useParams` to get the `id` from the URL if available.
  
  const [name, setName] = useState('')
  const [countryId, setCountryId] = useState<string | number | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [filteredCountries, setFilteredCountries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState<{ name?: string; image?: string }>({})

  // Fetch country data when editing
  useEffect(() => {
    if (id) {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-country/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const country = response.data.data;
          setCountryId(country._id);
          setName(country.country_name);
          setImagePreview(country.image); // Assuming the image URL is stored here
        })
        .catch((error) => {
          console.error('Error fetching country data:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const filterCountries = async (term: string) => {
    if (term.length === 0) {
      setFilteredCountries([])
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/filter-country`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { query: term }
        }
      )
      setFilteredCountries(response.data.data || [])
    } catch (error) {
      console.error('Error fetching filtered countries:', error)
      setFilteredCountries([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    setCountryId(null)
    setErrors((prev) => ({ ...prev, name: undefined })) // Clear error

    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      filterCountries(value)
    }, 400)
  }

  const handleSelectCountry = (country: any) => {
    setName(country.name)
    setCountryId(country.id || country._id)
    setFilteredCountries([])
    setErrors((prev) => ({ ...prev, name: undefined })) // Clear error
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file)) // Set the image preview
      setErrors((prev) => ({ ...prev, image: undefined })) // Clear error
    }
  }

  const validate = () => {
    const newErrors: { name?: string; image?: string } = {}
    if (!name.trim()) newErrors.name = 'Country name is required.'
    if (!image && !imagePreview) newErrors.image = 'Country image is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const formData = new FormData()
    formData.append('name', name)
    if (countryId) formData.append('country_id', countryId.toString())
    if (image) formData.append('image', image)
    if(id) formData.append('id',id.toString());
    try {
      const token = localStorage.getItem('authToken')
      const endpoint = id
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/add-country-image`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/add-country-image`
      
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      router.push(`/dashboard/country`)
    } catch (error) {
      console.error('Error saving country:', error)
    }
  }

  return (
    <div className="container mt-5">
      <h3>{id ? 'Edit Country' : 'Add Country'}</h3>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-3 position-relative">
          <label className="form-label">Country Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            value={name}
            onChange={handleInputChange}
            placeholder="Search country..."
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          {loading && <div className="mt-2 text-muted">Loading...</div>}
          {!loading && filteredCountries.length > 0 && (
            <ul className="list-group mt-2">
              {filteredCountries.map((country) => (
                <li
                  key={country.id || country._id}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSelectCountry(country)}
                >
                  {country.name || 'Unnamed Country'}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Country Image</label>
          <input
            type="file"
            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
            accept="image/*"
            onChange={handleImageChange}
          />
          {errors.image && <div className="invalid-feedback">{errors.image}</div>}
          
          {/* Display Image Preview */}
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Image Preview"
                className="img-fluid"
                style={{ maxWidth: '300px', maxHeight: '300px', objectFit: 'contain' }}
              />
            </div>
          )}
        </div>

        <button className="btn btn-success" type="submit">
          {id ? 'Update Country' : 'Save Country'}
        </button>
      </form>
    </div>
  )
}
