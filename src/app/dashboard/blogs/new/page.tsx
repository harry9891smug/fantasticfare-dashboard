"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Editor } from '@tinymce/tinymce-react'
import axios from 'axios'
import Image from 'next/image'

export default function AddArticle() {
  const router = useRouter()

  const [articleData, setArticleData] = useState({
    article_heading: '',
    article_description: '',
    article_images: [] as File[],
    questions: [{ question: '', answer: '' }]
  })

  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setArticleData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newImages = Array.from(files)
    setArticleData(prev => ({
      ...prev,
      article_images: [...prev.article_images, ...newImages]
    }))

    // Create previews for new images
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
      setImagePreviews(prev => [...prev, ...previews])
    })
  }

  const removeImage = (index: number) => {
    setArticleData(prev => ({
      ...prev,
      article_images: prev.article_images.filter((_, i) => i !== index)
    }))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleQAChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedQAs = [...articleData.questions]
    updatedQAs[index][field] = value
    setArticleData(prev => ({ ...prev, questions: updatedQAs }))
  }

  const addQAField = () => {
    setArticleData(prev => ({
      ...prev,
      questions: [...prev.questions, { question: '', answer: '' }]
    }))
  }

  const removeQAField = (index: number) => {
    const updatedQAs = [...articleData.questions]
    updatedQAs.splice(index, 1)
    setArticleData(prev => ({ ...prev, questions: updatedQAs }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const token = localStorage.getItem('authToken')

    try {
      const formData = new FormData()
      formData.append('article_heading', articleData.article_heading)
      formData.append('article_description', articleData.article_description)

      // Append all images
      articleData.article_images.forEach((image, index) => {
        // ${index}
        formData.append(`article_images[]`, image)
      })

      articleData.questions.forEach(q => {
        formData.append('questions[]', q.question)
        formData.append('answers[]', q.answer)
      })

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/article-store`, formData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      alert('Article created successfully!')
      router.push('/dashboard/blogs')
    } catch (error: any) {
      console.error(error)
      alert(error.response?.data?.message || 'Failed to create article')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header"><h5>Add New Article</h5></div>
            <div className="card-body">
              <form className="theme-form mega-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label-title">Article Heading</label>
                  <input
                    className="form-control"
                    type="text"
                    name="article_heading"
                    value={articleData.article_heading}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label-title">Article Images</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                    required={articleData.article_images.length === 0}
                  />
                  <small className="text-muted">You can select multiple images (Max 10)</small>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label-title">Image Previews</label>
                    <div className="d-flex flex-wrap gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="position-relative" style={{ width: '200px', height: '150px' }}>
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded border"
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                            onClick={() => removeImage(index)}
                            aria-label="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label-title">Article Description</label>
                  <Editor
                    apiKey="8brh26vfpwcwn8uphb1cilw3anjhw5ly5ghwc5js1gsl2vjh"
                    value={articleData.article_description}
                    onEditorChange={(newContent:any) => 
                      setArticleData(prev => ({ ...prev, article_description: newContent }))
                    }
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar: 'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      images_upload_handler: async (blobInfo:any, progress:any) => {
                        return new Promise((resolve, reject) => {
                          const formData = new FormData()
                          formData.append('file', blobInfo.blob(), blobInfo.filename())
                          
                          axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-image`, formData, {
                            headers: {
                              'Content-Type': 'multipart/form-data'
                            }
                          })
                          .then(response => {
                            resolve(response.data.location)
                          })
                          .catch(error => {
                            reject('Image upload failed')
                            console.error(error)
                          })
                        })
                      }
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label-title">FAQs</label>
                  {articleData.questions.map((qa, index) => (
                    <div key={index} className="mb-2 border p-2 rounded">
                      <input
                        className="form-control mb-2"
                        type="text"
                        placeholder="Enter Question"
                        value={qa.question}
                        onChange={(e) => handleQAChange(index, 'question', e.target.value)}
                        required
                      />
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter Answer"
                        value={qa.answer}
                        onChange={(e) => handleQAChange(index, 'answer', e.target.value)}
                        required
                      />
                      {index > 0 && (
                        <button 
                          type="button" 
                          className="btn btn-danger btn-sm mt-2" 
                          onClick={() => removeQAField(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    className="btn btn-outline-primary mt-2" 
                    onClick={addQAField}
                  >
                    Add More
                  </button>
                </div>

                <div className="card-footer text-end">
                  <button 
                    type="submit" 
                    className="btn btn-primary me-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-primary" 
                    onClick={() => router.push('/dashboard/blogs')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}