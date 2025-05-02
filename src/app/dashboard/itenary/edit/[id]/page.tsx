'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import { Editor } from '@tinymce/tinymce-react'

interface Day {
  day_name: string
  day_description: string
  itinerary_type: string
  day_images: File[] // for new uploads
  existing_images: string[] // for already uploaded image URLs
  preview_images?: string[] // for preview of newly uploaded images
}

export default function EditItinerary() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [itenary_id, setItenaryId] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Day[]>([{
    day_name: '',
    day_description: '',
    itinerary_type: 'solo',
    day_images: [],
    existing_images: [],
    preview_images: []
  }])

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const fetchItinerary = async () => {
      const token = localStorage.getItem('authToken')
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package_view/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }) 
        if (response.data.data.itineraries && response.data.data.itineraries.length > 0) {
          setItenaryId(response.data.data.itineraries[0]._id)
          const existingItinerary: Day[] = response.data.data.itineraries[0].days.map((day: any) => ({
            day_name: day.day_name || '',
            day_description: day.day_description || '',
            itinerary_type: day.itinerary_type || 'solo',
            existing_images: day.day_images || [],
            day_images: [],
            preview_images: []
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
      existing_images: [],
      preview_images: []
    }])
  }

  const handleRemoveDay = (index: number) => {
    if (itinerary.length > 1) {
      const updated = [...itinerary]
      updated.splice(index, 1)
      setItinerary(updated)
      fileInputRefs.current.splice(index, 1)
    }
  }

  const handleDayChange = (index: number, field: keyof Day, value: any) => {
    const updated = [...itinerary]
    updated[index] = {
      ...updated[index],
      [field]: value
    }
    setItinerary(updated)
  }

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const updated = [...itinerary]
      
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file))
      
      updated[index] = {
        ...updated[index],
        day_images: [...updated[index].day_images, ...files],
        preview_images: [...(updated[index].preview_images || []), ...previews]
      }
      
      setItinerary(updated)
    }
  }

  const removeExistingImage = (dayIndex: number, imageIndex: number) => {
    const updated = [...itinerary]
    updated[dayIndex].existing_images = updated[dayIndex].existing_images.filter(
      (_, i) => i !== imageIndex
    )
    setItinerary(updated)
  }

  const removeNewImage = (dayIndex: number, imageIndex: number) => {
    const updated = [...itinerary]
    
    // Revoke the object URL to prevent memory leaks
    if (updated[dayIndex].preview_images?.[imageIndex]) {
      URL.revokeObjectURL(updated[dayIndex].preview_images![imageIndex])
    }
    
    updated[dayIndex].day_images.splice(imageIndex, 1)
    updated[dayIndex].preview_images?.splice(imageIndex, 1)
    setItinerary(updated)
    
    // Reset file input
    if (fileInputRefs.current[dayIndex]) {
      fileInputRefs.current[dayIndex]!.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
  
    // Validate at least one day exists
    if (itinerary.length === 0) {
      setError('At least one day is required');
      setIsSubmitting(false);
      return;
    }
  
    const formData = new FormData();
    
    // REQUIRED: Add package_id
    formData.append('package_id', id);
    
    // Add itenary_id if exists
    if (itenary_id) {
      formData.append('itenary_id', itenary_id);
    }
  
    // Append each day's data
    itinerary.forEach((day, index) => {
      // REQUIRED fields for each day
      if (!day.day_name || !day.day_description || !day.itinerary_type) {
        setError(`Day ${index + 1} is missing required fields`);
        return;
      }
  
      formData.append(`day_name[${index}]`, day.day_name);
      formData.append(`day_description[${index}]`, day.day_description);
      formData.append(`itenary_type[${index}]`, day.itinerary_type);
  
      // Existing images as JSON string
      if (day.existing_images.length > 0) {
        day.existing_images.forEach((imageName) => {
          formData.append(`day_images[${index}]`, imageName);
        });
        // formData.append(`day_images[${index}]`, JSON.stringify(day.existing_images));
      }
  
      // New images
      day.day_images.forEach((file) => {
        formData.append(`day_images[${index}]`, file);
      });
    });
  
    // Debug: Verify all required fields
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? value.name : value);
    }
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/itenary-create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      alert(response.data.message || 'Success!');
     router.push(`/dashboard/packages/${id}`)

    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      itinerary.forEach(day => {
        day.preview_images?.forEach(url => URL.revokeObjectURL(url))
      })
    }
  }, [itinerary])

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
                      onChange={(e) => handleFileChange(index, e)}
                      ref={el => fileInputRefs.current[index] = el}
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <label className="form-label-title">Description*</label>
                  {/* <textarea
                    className="form-control"
                    rows={3}
                    value={day.day_description}
                    onChange={(e) => handleDayChange(index, 'day_description', e.target.value)}
                    required
                  /> */}
                  <Editor
                      apiKey="8brh26vfpwcwn8uphb1cilw3anjhw5ly5ghwc5js1gsl2vjh"
                      value={day.day_description}
                      onEditorChange={(newContent: any) =>
                        handleDayChange(index, 'day_description', newContent)
                      }
                      init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                          'advlist autolink lists link image charmap print preview anchor',
                          'searchreplace visualblocks code fullscreen',
                          'insertdatetime media table paste code help wordcount',
                        ],
                        toolbar:
                          'undo redo | formatselect | ' +
                          'bold italic backcolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | help',
                        content_style:
                          'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        images_upload_handler: async (blobInfo: any, progress: any) => {
                          return new Promise((resolve, reject) => {
                            const formData = new FormData();
                            formData.append('file', blobInfo.blob(), blobInfo.filename());

                            axios
                              .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-image`, formData, {
                                headers: {
                                  'Content-Type': 'multipart/form-data',
                                },
                              })
                              .then((response) => {
                                resolve(response.data.location);
                              })
                              .catch((error) => {
                                reject('Image upload failed');
                                console.error(error);
                              });
                          });
                        },
                      }}
                    />
                </div>

                {/* Existing Images */}
                {day.existing_images.length > 0 && (
                  <div className="mt-3">
                    <label className="form-label-title">Existing Images</label>
                    <div className="d-flex flex-wrap gap-2">
                      {day.existing_images.map((img, imgIndex) => (
                        <div key={`existing-${imgIndex}`} className="position-relative" style={{ width: '100px' }}>
                          <Image
                            src={img}
                            alt={`Day ${index + 1} Image ${imgIndex + 1}`}
                            className="img-thumbnail"
                            style={{ height: '100px', objectFit: 'cover' }}
                            width={100}
                            height={100}
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

                {/* New Image Previews */}
                {day.preview_images && day.preview_images.length > 0 && (
                  <div className="mt-3">
                    <label className="form-label-title">New Images to Upload</label>
                    <div className="d-flex flex-wrap gap-2">
                      {day.preview_images.map((preview, previewIndex) => (
                        <div key={`preview-${previewIndex}`} className="position-relative" style={{ width: '100px' }}>
                          <img
                            src={preview}
                            alt={`New image preview ${previewIndex + 1}`}
                            className="img-thumbnail"
                            style={{ height: '100px', objectFit: 'cover', width: '100%' }}
                          />
                          <button
                            type="button"
                            className="position-absolute top-0 end-0 btn btn-danger btn-sm p-0"
                            style={{ width: '20px', height: '20px' }}
                            onClick={() => removeNewImage(index, previewIndex)}
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
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Itinerary'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}