'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface ItineraryDay {
  day_name: string
  day_description: string
  itinerary_type: string
  day_images: File[]
}

export default function NewItinerary() {
  const router = useRouter()
  const [packageId, setPackageId] = useState('')
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([{
    day_name: '',
    day_description: '',
    itinerary_type: 'solo',
    day_images: []
  }])
  const [error, setError] = useState('')

  const handleAddDay = () => {
    setItinerary([...itinerary, {
      day_name: '',
      day_description: '',
      itinerary_type: 'solo',
      day_images: []
    }])
  }

  const handleRemoveDay = (index: number) => {
    if (itinerary.length > 1) {
      setItinerary(itinerary.filter((_, i) => i !== index))
    }
  }

  const handleDayChange = (index: number, field: keyof ItineraryDay, value: string) => {
    const updated = [...itinerary]
    updated[index][field] = value as never // type cast to never since field could be any key
    setItinerary(updated)
  }

  const handleFileChange = (index: number, files: FileList | null) => {
    if (!files) return
    const updated = [...itinerary]
    updated[index].day_images = Array.from(files)
    setItinerary(updated)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')
    const formData = new FormData()

    formData.append('package_id', packageId)
    itinerary.forEach((day, index) => {
      formData.append(`day_name[${index}]`, day.day_name)
      formData.append(`day_description[${index}]`, day.day_description)
      formData.append(`itinerary_type[${index}]`, day.itinerary_type)
      day.day_images.forEach(file => {
        formData.append(`day_images[${index}][]`, file)
      })
    })

    try {
      await axios.post(`${process.env.NET_PUBLIC_BACKEND_URL}/itenary-create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      router.push('/dashboard/packages')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create itinerary')
    }
  }

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Create Itinerary</h5>
        </div>
        <div className="card-body">
          <form className="theme-form mega-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label-title">Package ID*</label>
              <input
                className="form-control"
                type="text"
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                required
              />
            </div>

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
                    <label className="form-label-title">Images</label>
                    <input
                      className="form-control"
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(index, e.target.files)}
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

            <button
              type="button"
              className="btn btn-outline-primary mb-3"
              onClick={handleAddDay}
            >
              Add Another Day
            </button>

            <div className="card-footer text-end">
              <button type="submit" className="btn btn-primary me-3">Submit</button>
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
