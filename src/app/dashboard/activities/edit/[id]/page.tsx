'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'

// Define types for your data structure
type ActivityDay = {
  day_name: string
  day_activities: string
  activity_type: 'solo' | 'family' | 'couple'
  activity_images: string[]
  _id: string
}

type ActivityGroup = {
  _id: string
  package_id: string
  days: ActivityDay[]
  createdAt: string
  updatedAt: string
  __v: number
}

type Activity = {
  day_name: string
  day_activity: string
  activity_type: 'solo' | 'family' | 'couple'
  day_images: File[]
  existing_images: string[]
  _id?: string
}

type ApiResponse = {
  status: boolean;
  message: string;
  data: {
    _id: string;
    package_name: string;
    // ... other package fields
    activities: ActivityGroup[];
  };
};

export default function EditActivities() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [activities, setActivities] = useState<Activity[]>([{
    day_name: '',
    day_activity: '',
    activity_type: 'solo',
    day_images: [],
    existing_images: []
  }])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch existing activities data
  useEffect(() => {
    const fetchActivities = async () => {
      const token = localStorage.getItem('authToken')
      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/package_view/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
  console.log(response,'responseresponseresponseresponse')
        if (response.data.data.activities && response.data.data.activities.length > 0) {
          const existingActivities = response.data.data.activities.flatMap(
            (activityGroup: ActivityGroup) =>
              activityGroup.days.map((day: ActivityDay) => ({
                day_name: day.day_name,
                day_activity: day.day_activities,
                activity_type: day.activity_type,
                day_images: [],
                existing_images: day.activity_images || [],
                _id: day._id
              }))
          )
          setActivities(existingActivities)
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch activities')
      } finally {
        setLoading(false)
      }
    }
  
    fetchActivities()
  }, [id])
  
  const handleAddActivity = () => {
    setActivities([...activities, {
      day_name: '',
      day_activity: '',
      activity_type: 'solo',
      day_images: [],
      existing_images: []
    }])
  }

  const handleRemoveActivity = (index: number) => {
    if (activities.length > 1) {
      setActivities(activities.filter((_, i) => i !== index))
    }
  }

  const handleActivityChange = (
    index: number,
    field: keyof Activity,
    value: string
  ) => {
    const updated = [...activities];
  
    if (field === 'activity_type' && ['solo', 'family', 'couple'].includes(value)) {
      updated[index].activity_type = value as 'solo' | 'family' | 'couple';
    } else if (field === 'day_name' || field === 'day_activity') {
      updated[index][field] = value;
    }
  
    setActivities(updated);
  };
  

  const handleFileChange = (index: number, files: FileList | null) => {
    if (!files) return
    const updated = [...activities]
    updated[index].day_images = Array.from(files)
    setActivities(updated)
  }

  const removeExistingImage = (activityIndex: number, imageIndex: number) => {
    const updated = [...activities]
    updated[activityIndex].existing_images = updated[activityIndex].existing_images.filter(
      (_, i) => i !== imageIndex
    )
    setActivities(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')
    if (!token) {
      router.push('/login')
      return
    }

    const formData = new FormData()
    let hasError = false
  
    activities.forEach((activity, index) => {
      if (!activity.day_name) {
        console.error(`Activity ${index + 1}: day_name is empty`)
        hasError = true
      }
      if (!activity.day_activity) {
        console.error(`Activity ${index + 1}: day_activity is empty`)
        hasError = true
      }
      if (!activity.activity_type) {
        console.error(`Activity ${index + 1}: activity_type is empty`)
        hasError = true
      }
    })
  
    if (hasError) {
      alert('Please fill all required fields')
      return
    }

    formData.append('package_id', id)
    activities.forEach((activity, index) => {
      formData.append(`days[${index}][day_name]`, activity.day_name)
      formData.append(`days[${index}][day_activity]`, activity.day_activity)
      formData.append(`days[${index}][activity_type]`, activity.activity_type)
      
      // Append existing images that haven't been removed
      activity.existing_images.forEach((img, imgIndex) => {
        formData.append(`days[${index}][existing_images][${imgIndex}]`, img)
      })
      
      // Append new files
      activity.day_images.forEach(file => {
        formData.append(`days[${index}][day_images]`, file)
      })
    })

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/activity-update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      alert('Activities updated successfully!')
      router.push(`/dashboard/packages/${id}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update activities')
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
            <p>Loading activities data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Edit Activities for Package #{id}</h5>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form className="theme-form mega-form" onSubmit={handleSubmit}>
            {activities.map((activity, index) => (
              <div key={index} className="mb-4 border p-3 rounded">
                <h6>Activity {index + 1}</h6>
                <div className="row">
                  <div className="col-sm-4">
                    <label className="form-label-title">Day Name*</label>
                    <input
                      className="form-control"
                      type="text"
                      value={activity.day_name}
                      onChange={(e) => handleActivityChange(index, 'day_name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-sm-4">
                    <label className="form-label-title">Activity Type*</label>
                    <select
                      className="form-control"
                      value={activity.activity_type}
                      onChange={(e) => handleActivityChange(index, 'activity_type', e.target.value)}
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
                      onChange={(e) => handleFileChange(index, e.target.files)}
                      accept="image/*"
                    />
                  </div>
                </div>
                
                <div className="mt-2">
                  <label className="form-label-title">Activity Description*</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={activity.day_activity}
                    onChange={(e) => handleActivityChange(index, 'day_activity', e.target.value)}
                    required
                  />
                </div>
                
                {/* Display existing images */}
                {activity.existing_images.length > 0 && (
                  <div className="mt-3">
                    <label className="form-label-title">Existing Images</label>
                    <div className="d-flex flex-wrap gap-2">
                      {activity.existing_images.map((img, imgIndex) => (
                        <div key={imgIndex} className="position-relative" style={{ width: '100px' }}>
                          <Image 
                            src={img} 
                            alt={`Activity ${index + 1} Image ${imgIndex + 1}`}
                            width={100}
                            height={100}
                            className="img-thumbnail"
                            style={{ height: '100px', objectFit: 'cover' }}
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
                
                {activities.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleRemoveActivity(index)}
                  >
                    Remove Activity
                  </button>
                )}
              </div>
            ))}

            <div className="d-flex justify-content-between mt-3">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAddActivity}
              >
                Add Another Activity
              </button>
              
              <div>
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2"
                  onClick={() => router.push(`/dashboard/packages/${id}`)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Activities
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}