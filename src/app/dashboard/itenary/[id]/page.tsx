'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import { Editor } from '@tinymce/tinymce-react'

export default function NewItinerary() {
  const router = useRouter()
  const { id } = useParams() as { id: string };
  const [error, setError] = useState('')

  const [itinerary, setItinerary] = useState([
    {
      day_name: '',
      day_description: '',
      itenary_type: 'solo',
      day_images: []
    }
  ])

  const handleAddDay = () => {
    setItinerary([
      ...itinerary,
      {
        day_name: '',
        day_description: '',
        itenary_type: 'solo',
        day_images: []
      }
    ])
  }

  const handleRemoveDay = (index:any) => {
    if (itinerary.length > 1) {
      setItinerary(itinerary.filter((_, i) => i !== index))
    }
  }

  const handleDayChange = (
    index: number,
    field: 'day_name' | 'day_description' | 'itenary_type',
    value: string
  ) => {
    const updated = [...itinerary]
    updated[index][field] = value
    setItinerary(updated)
  }
  

  const handleFileChange = (index:any, files:any) => {
    const updated = [...itinerary]
    updated[index].day_images = Array.from(files)
    setItinerary(updated)
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')
    const formData = new FormData()

    // ✅ Append package_id only once
    formData.append('package_id', id)

    itinerary.forEach((day, index) => {
      formData.append(`day_name[${index}]`, day.day_name)
      formData.append(`day_description[${index}]`, day.day_description)
      formData.append(`itenary_type[${index}]`, day.itenary_type)
      day.day_images.forEach((file) => {
        formData.append(`day_images[${index}][]`, file)
      })
    })

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/itenary-create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      alert("Itinerary added successfully!")
      router.push(`/dashboard/activities/${id}`)
    } catch (err:any) {
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
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          <form className="theme-form mega-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label-title">Package ID*</label>
              <input
                className="form-control"
                type="text"
                value={id}
                disabled
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
                      value={day.itenary_type}
                      onChange={(e) => handleDayChange(index, 'itenary_type', e.target.value)}
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
