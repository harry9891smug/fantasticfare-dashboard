'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function NewStay() {
  const router = useRouter()
  const [packageId, setPackageId] = useState('')
  const [stays, setStays] = useState([{
    hotel_name: '',
    hotel_description: '',
    stay_type: 'solo',
    day_images: []
  }])

  const handleAddStay = () => {
    setStays([...stays, {
      hotel_name: '',
      hotel_description: '',
      stay_type: 'solo',
      day_images: []
    }])
  }

  const handleRemoveStay = (index:any) => {
    if (stays.length > 1) {
      setStays(stays.filter((_, i) => i !== index))
    }
  }

  const handleStayChange = (
    index: number,
    field: 'hotel_name' | 'hotel_description' | 'stay_type',
    value: string
  ) => {
    const updated = [...stays]
    updated[index][field] = value
    setStays(updated)
  }

  const handleFileChange = (index:any, files:any) => {
    const updated = [...stays]
    updated[index].day_images = Array.from(files)
    setStays(updated)
  }
 

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')
    const formData = new FormData()
    
    formData.append('package_id', packageId)
    stays.forEach((stay, index) => {
      formData.append(`hotel_name[${index}]`, stay.hotel_name)
      formData.append(`hotel_description[${index}]`, stay.hotel_description)
      formData.append(`stay_type[${index}]`, stay.stay_type)
      stay.day_images.forEach(file => {
        formData.append(`day_images[${index}]`, file)
      })
    })

    try {
      await axios.post('http://localhost:8000/api/stay-create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      router.push('/dashboard/packages')
    } catch (err:any) {
      alert(err.response?.data?.message || 'Failed to create stays')
    }
  }

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Create Stays</h5>
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

            {stays.map((stay, index) => (
              <div key={index} className="mb-4 border p-3 rounded">
                <h6>Stay {index + 1}</h6>
                <div className="row">
                  <div className="col-sm-4">
                    <label className="form-label-title">Day Name*</label>
                    <input
                      className="form-control"
                      type="text"
                      value={stay.hotel_name}
                      onChange={(e) => handleStayChange(index, 'hotel_name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-sm-4">
                    <label className="form-label-title">Stay Type*</label>
                    <select
                      className="form-control"
                      value={stay.stay_type}
                      onChange={(e) => handleStayChange(index, 'stay_type', e.target.value)}
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
                  <label className="form-label-title">Stay Description*</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={stay.hotel_description}
                    onChange={(e) => handleStayChange(index, 'hotel_description', e.target.value)}
                    required
                  />
                </div>
                {stays.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleRemoveStay(index)}
                  >
                    Remove Stay
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary mb-3"
              onClick={handleAddStay}
            >
              Add Another Stay
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