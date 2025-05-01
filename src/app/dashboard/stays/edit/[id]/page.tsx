'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'

interface Day {
  hotel_name: string
  hotel_description: string
  stay_type: string
  hotel_images: File[] // for new uploads
  existing_images: string[] // for already uploaded image URLs
  preview_images?: string[]
  category: string
  city: string
}

export default function EditStay() {
  const { id } = useParams() as { id: string };
  const router = useRouter()
  const [stay_id, setStayId] = useState<string | null>(null);
  const [packageId, setPackageId] = useState('')
  const [stays, setStays] = useState<Day[]>([{
    hotel_name: '',
    hotel_description: '',
    stay_type: 'solo',
    city: '',
    category: '',
    hotel_images: [],
    existing_images: [],

  }])

  const handleAddStay = () => {
    setStays([...stays, {
      hotel_name: '',
      hotel_description: '',
      stay_type: 'solo',
      city: '',
      category: '',
      hotel_images: [],
      existing_images: []
    }])
  }

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const handleRemoveStay = (index: any) => {
    if (stays.length > 1) {
      setStays(stays.filter((_, i) => i !== index))
    }
  }

  const removeExistingImage = (dayIndex: number, imageIndex: number) => {
    const updated = [...stays]
    updated[dayIndex].existing_images = updated[dayIndex].existing_images.filter(
      (_, i) => i !== imageIndex
    )
    setStays(updated)
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

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      
      
      const updated = [...stays];
      updated[index] = {
        ...updated[index],
        hotel_images: [...updated[index].hotel_images, ...files],
        preview_images: [...(updated[index].preview_images || []), ...previews],
      };
      console.log('htereereeree');
      setStays(updated);
    } else {
      console.warn("No files selected");
    }
  };

  useEffect(() => {
    const fetchStay = async () => {
      const token = localStorage.getItem('authToken')
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package_view/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (response.data.data.stays && response.data.data.stays.length > 0) {
          setStayId(response.data.data.stays[0]._id)
          const existingStay: Day[] = response.data.data.stays[0].days.map((day: any) => ({
            hotel_name: day.hotel_name || '',
            hotel_description: day.hotel_description || '',
            stay_type: day.stay_type || 'solo',
            existing_images: day.hotel_images || [],
            hotel_images: [],
            preview_images: [],
            category: day.category,
            city: day.city,
          }))
          setStays(existingStay)
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch itinerary')
      } finally {
        setLoading(false)
      }
    }

    fetchStay()
  }, [id])

  const removeNewImage = (dayIndex: number, imageIndex: number) => {
    const updated = [...stays]

    // Revoke the object URL to prevent memory leaks
    if (updated[dayIndex].preview_images?.[imageIndex]) {
      URL.revokeObjectURL(updated[dayIndex].preview_images![imageIndex])
    }

    updated[dayIndex].hotel_images.splice(imageIndex, 1)
    updated[dayIndex].preview_images?.splice(imageIndex, 1)
    setStays(updated)

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
    if (stays.length === 0) {
      setError('At least one day is required');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();

    // REQUIRED: Add package_id
    formData.append('package_id', id);

    // Add itenary_id if exists
    if (stay_id) {
      formData.append('stay_id', stay_id);
    }

    // Append each day's data
    stays.forEach((day, index) => {
      // REQUIRED fields for each day
      if (!day.hotel_name || !day.hotel_description || !day.stay_type) {
        setError(`Day ${index + 1} is missing required fields`);
        return;
      }

      formData.append(`hotel_name[${index}]`, day.hotel_name);
      formData.append(`hotel_description[${index}]`, day.hotel_description);
      formData.append(`stay_type[${index}]`, day.stay_type);
      formData.append(`city[${index}]`, day.city);
      formData.append(`category[${index}]`, day.category);

      // Existing images as JSON string
      if (day.existing_images.length > 0) {
        day.existing_images.forEach((imageName) => {
          formData.append(`hotel_images[${index}]`, imageName);
        });
        // formData.append(`hotel_images[${index}]`, JSON.stringify(day.existing_images));
      }

      // New images
      day.hotel_images.forEach((file) => {
        formData.append(`hotel_images[${index}]`, file);
      });
    });

    // Debug: Verify all required fields
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? value.name : value);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/stay-create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert(response.data.message || 'Success!');
     router.push(`/dashboard/packages/edit/${id}`)

    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Edit Stay</h5>
        </div>
        <div className="card-body">
          <form className="theme-form mega-form" onSubmit={handleSubmit} >


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
                      onChange={(e) => handleFileChange(index, e)}
                      ref={(el) => fileInputRefs.current[index] = el}  
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
                {stay.existing_images.length > 0 && (
                  <div className="mt-3">
                    <label className="form-label-title">Existing Images</label>
                    <div className="d-flex flex-wrap gap-2">
                      {stay.existing_images.map((img, imgIndex) => (
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
                {stay.preview_images && stay.preview_images.length > 0 && (
                  <div className="mt-3">
                    <label className="form-label-title">New Images to Upload</label>
                    <div className="d-flex flex-wrap gap-2">
                      {stay.preview_images.map((preview, previewIndex) => (
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
                  {isSubmitting ? 'Updating...' : 'Update Stay'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}