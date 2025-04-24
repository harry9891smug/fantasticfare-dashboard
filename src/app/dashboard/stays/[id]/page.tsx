'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'

export default function NewStay() {
  const { id } = useParams() as { id: string };
  const router = useRouter()
  const [packageId, setPackageId] = useState('')
  const [stays, setStays] = useState([{
    hotel_name: '',
    hotel_description: '',
    stay_type: 'solo',
    city: '',
      category: '',
    day_images: []
  }])

  const handleAddStay = () => {
    setStays([...stays, {
      hotel_name: '',
      hotel_description: '',
      stay_type: 'solo',
      city: '',
      category: '',
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
    field: 'hotel_name' | 'hotel_description' | 'stay_type' | 'city' | 'category',
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
  
    let hasError = false
  
    if (!id) {
      console.error('Package ID is missing')
      hasError = true
    } else {
        formData.append('package_id', id)
    }
   
    stays.forEach((stay, index) => {
      if (!stay.city) {
        console.error(`Stay ${index + 1}: city is empty`)
        hasError = true
      } else {
        formData.append(`city[${index}]`, stay.city)
      }

      if (!stay.category) {
        console.error(`Stay ${index + 1}: category is empty`)
        hasError = true
      } else {
        formData.append(`category[${index}]`, stay.category)
      }
      if (!stay.hotel_name) {
        console.error(`Stay ${index + 1}: hotel_name is empty`)
        hasError = true
      } else {
        formData.append(`hotel_name[${index}]`, stay.hotel_name)
      }
  
      if (!stay.hotel_description) {
        console.error(`Stay ${index + 1}: hotel_description is empty`)
        hasError = true
      } else {
        formData.append(`hotel_description[${index}]`, stay.hotel_description)
      }
  
      if (!stay.stay_type) {
        console.error(`Stay ${index + 1}: stay_type is empty`)
        hasError = true
      } else {
        formData.append(`stay_type[${index}]`, stay.stay_type)
      }
  
      if (!stay.day_images.length) {
        console.warn(`Stay ${index + 1}: No images selected (optional)`)
      }
  
      stay.day_images.forEach((file) => {
        formData.append(`hotel_images[${index}]`, file)
      })
    })
  
    if (hasError) {
      alert('Please fill all required fields.')
      return
    }
  
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stay-create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      alert('Stays created successfully!')
      router.push(`/dashboard/inclusions/${id}`)
    } catch (err:any) {
      alert(err.response?.data?.message || 'Failed to create stays')
      console.error('API Error:', err)
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

            {stays.map((stay, index) => (
              <div key={index} className="mb-4 border p-3 rounded">
                <h6>Stay {index + 1}</h6>
                <div className='row'>
                <div className="col-sm-4 mt-3">
                    <label className="form-label-title">City*</label>
                    <input
                      className="form-control"
                      type="text"
                      value={stay.city}
                      onChange={(e) => handleStayChange(index, 'city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-sm-4 mt-3">
                    <label className="form-label-title">Stay Category*</label>
                    <input
                      className="form-control"
                      type="text"
                      value={stay.category}
                      onChange={(e) => handleStayChange(index, 'category', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4">
                    <label className="form-label-title">Hotel Name*</label>
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
                  <label className="form-label-title">Hotel Description*</label>
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

            {/* <button
              type="button"
              className="btn btn-outline-primary mb-3"
              onClick={handleAddStay}
            >
              Add Another Stay
            </button> */}

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