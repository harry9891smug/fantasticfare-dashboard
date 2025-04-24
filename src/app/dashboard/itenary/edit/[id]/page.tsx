'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'

interface Day {
  day_name: string
  day_description: string
  itinerary_type: string
  day_images: File[] // for new uploads
  existing_images: string[] // for already uploaded image URLs
}

export default function EditItinerary() {
  const router = useRouter()
  const { id } = useParams() as { id: string }

  const [itinerary, setItinerary] = useState<Day[]>([{
    day_name: '',
    day_description: '',
    itinerary_type: 'solo',
    day_images: [],
    existing_images: []
  }])

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItinerary = async () => {
      const token = localStorage.getItem('authToken')
      try {
        const response = await axios.get(`https://backend.fantasticfare.com/api/package_view/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.data.data.itineraries && response.data.data.itineraries.length > 0) {
          const existingItinerary: Day[] = response.data.data.itineraries[0].days.map((day: any) => ({
            ...day,
            existing_images: day.day_images || [],
            day_images: []
          }))
          setItinerary(existingItinerary)
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch itinerary')
      } finally {
        setLoading(false)
      }
    }

    fetchItinerary()
  }, [id])

  const handleAddDay = () => {
    setItinerary([...itinerary, {
      day_name: '',
      day_description: '',
      itinerary_type: 'solo',
      day_images: [],
      existing_images: []
    }])
  }

  const handleRemoveDay = (index: number) => {
    if (itinerary.length > 1) {
      setItinerary(itinerary.filter((_, i) => i !== index))
    }
  }

  const handleDayChange = (index: number, field: keyof Day, value: any) => {
    const updated = [...itinerary]
    updated[index][field] = value
    setItinerary(updated)
  }

  const handleFileChange = (index: number, files: FileList) => {
    const updated = [...itinerary]
    updated[index].day_images = Array.from(files)
    setItinerary(updated)
  }

  const removeExistingImage = (dayIndex: number, imageIndex: number) => {
    const updated = [...itinerary]
    updated[dayIndex].existing_images = updated[dayIndex].existing_images.filter(
      (_, i) => i !== imageIndex
    )
    setItinerary(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')
    const formData = new FormData()

    formData.append('package_id', id)

    itinerary.forEach((day, index) => {
      formData.append(`days[${index}][day_name]`, day.day_name)
      formData.append(`days[${index}][day_description]`, day.day_description)
      formData.append(`days[${index}][itinerary_type]`, day.itinerary_type)

      day.existing_images.forEach((img, imgIndex) => {
        formData.append(`days[${index}][existing_images][${imgIndex}]`, img)
      })

      day.day_images.forEach(file => {
        formData.append(`days[${index}][day_images]`, file)
      })
    })

    try {
      await axios.post(`https://backend.fantasticfare.com/api/itenary-create/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      router.push('/dashboard/packages')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update itinerary')
    }
  }

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="card">
          <div className="card-body text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading itinerary data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Edit Itinerary for Package #{id}</h5>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form className="theme-form mega-form" onSubmit={handleSubmit}>
            {itinerary.map((day, index) => (
              <div key={index} className="mb-4 border p-3 rounded">
                <h6>Day {index + 1}</h6>
                <div className="row">
                  <div className="col-sm-4">
                    <label className="form-label-title">Day Name*</label>
                    <input
                      className="form-control"
                      type="text"
                      value={day.day_name}
                      onChange={(e) => handleDayChange(index, 'day_name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-sm-4">
                    <label className="form-label-title">Type*</label>
                    <select
                      className="form-control"
                      value={day.itinerary_type}
                      onChange={(e) => handleDayChange(index, 'itinerary_type', e.target.value)}
                    >
                      <option value="solo">Solo</option>
                      <option value="family">Family</option>
                      <option value="couple">Couple</option>
                    </select>
                  </div>
                  <div className="col-sm-4">
                    <label className="form-label-title">Add New Images</label>
                    <input
                      className="form-control"
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(index, e.target.files!)}
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="form-label-title">Description*</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={day.day_description}
                    onChange={(e) => handleDayChange(index, 'day_description', e.target.value)}
                    required
                  />
                </div>

                {day.existing_images.length > 0 && (
                  <div className="mt-3">
                    <label className="form-label-title">Existing Images</label>
                    <div className="d-flex flex-wrap gap-2">
                      {day.existing_images.map((img, imgIndex) => (
                        <div key={imgIndex} className="position-relative" style={{ width: '100px' }}>
                          <Image
                            src={img}
                            alt={`Day ${index + 1} Image ${imgIndex + 1}`}
                            className="img-thumbnail"
                            style={{ height: '100px', objectFit: 'cover' }}
                            width={300}
                            height={200}
                          />
                          <button
                            type="button"
                            className="position-absolute top-0 end-0 btn btn-danger btn-sm p-0"
                            style={{ width: '20px', height: '20px' }}
                            onClick={() => removeExistingImage(index, imgIndex)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {itinerary.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleRemoveDay(index)}
                  >
                    Remove Day
                  </button>
                )}
              </div>
            ))}

            <div className="d-flex justify-content-between mt-3">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAddDay}
              >
                Add Another Day
              </button>

              <div>
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={() => router.push('/dashboard/packages')}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Itinerary
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
