'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Editor } from '@tinymce/tinymce-react'
import axios from 'axios'
import Image from 'next/image'

export default function AddOrEditArticle() {
  const router = useRouter()
  const params = useParams()
  const articleId = params?.id

  const [articleData, setArticleData] = useState({
    article_heading: '',
    article_description: '',
    article_images: [] as string[], // Changed to string[] since your API returns URLs
    faqs: [{ question: '', answer: '' }],
    article_slug:''
  })

  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        setIsLoading(false)
        return
      }
      
      const token = localStorage.getItem('authToken')
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/view-article/${articleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const data = res.data.data
        console.log('Fetched article data:', data)

        // Handle the article_images array from your API response
        const images = data.article_image ? 
          (Array.isArray(data.article_image) ? data.article_image : [data.article_image])
          : []

        setArticleData({
          article_heading: data.article_heading || '',
          article_description: data.article_description || '',
          article_images: images,
          faqs: Array.isArray(data.faqs) && data.faqs.length
            ? data.faqs
            : [{ question: '', answer: '' }],
            article_slug:data.article_slug
        })
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to load article')
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [articleId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setArticleData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const filesArray = Array.from(files)
    setNewImages(prev => [...prev, ...filesArray])
  }

  const removeImage = (index: number, isNew: boolean) => {
    if (isNew) {
      setNewImages(prev => prev.filter((_, i) => i !== index))
    } else {
      setArticleData(prev => ({
        ...prev,
        article_images: prev.article_images.filter((_, i) => i !== index)
      }))
    }
  }

  const handleQAChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedQAs = [...articleData.faqs]
    updatedQAs[index][field] = value
    setArticleData(prev => ({ ...prev, faqs: updatedQAs }))
  }

  const addQAField = () => {
    setArticleData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }))
  }

  const removeQAField = (index: number) => {
    const updatedQAs = [...articleData.faqs]
    updatedQAs.splice(index, 1)
    setArticleData(prev => ({ ...prev, faqs: updatedQAs }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const token = localStorage.getItem('authToken')
    const formData = new FormData()

    formData.append('article_heading', articleData.article_heading)
    formData.append('article_description', articleData.article_description)
    formData.append('article_slug', articleData.article_slug)

    // Append existing images
    articleData.article_images.forEach((img, index) => {
      formData.append(`existing_images[${index}]`, img)
    })

    // Append new images
    newImages.forEach((img, index) => {
      // ${index}
      formData.append(`article_images[]`, img)
    })

    articleData.faqs.forEach(q => {
      formData.append('questions[]', q.question)
      formData.append('answers[]', q.answer)
    })

    try {
      if (articleId) {
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/article-update/${articleId}`, formData, {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        alert('Article updated successfully!')
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/article-store`, formData, {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        alert('Article created successfully!')
      }

      router.push('/dashboard/blogs')
    } catch (error: any) {
      console.error(error)
      alert(error.response?.data?.message || 'Failed to save article')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div className="p-4">Loading...</div>

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              <h5>{articleId ? 'Edit Article' : 'Add New Article'}</h5>
            </div>
            <div className="card-body">
              <form className="theme-form mega-form" onSubmit={handleSubmit}>
               <div className="col-md-12 row">
                <div className="mb-3 col-md-6">
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
                 <div className="mb-3 col-md-6">
                  <label className="form-label-title">Article URL (<span className='text-danger'>spacing not allowed</span>)</label>
                  <input
                    className="form-control"
                    type="text"
                    name="article_slug"
                    value={articleData.article_slug}
                    onChange={handleChange}
                    required
                  />
                </div>
                </div>

                <div className="mb-3">
                  <label className="form-label-title">Article Images</label>
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                  />
                  <small className="text-muted">You can select multiple images</small>
                  
                  {/* Existing Images */}
                  <div className="d-flex flex-wrap gap-3 mt-3">
                    {articleData.article_images.map((img, index) => (
                      <div key={`existing-${index}`} className="position-relative" style={{ width: '150px', height: '150px' }}>
                        <Image
                          src={img}
                          alt={`Image ${index + 1}`}
                          fill
                          className="img-thumbnail"
                          style={{ objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                          onClick={() => removeImage(index, false)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* New Images */}
                  <div className="d-flex flex-wrap gap-3 mt-3">
                    {newImages.map((img, index) => (
                      <div key={`new-${index}`} className="position-relative" style={{ width: '150px', height: '150px' }}>
                        <img
                          src={URL.createObjectURL(img)}
                          alt={`Upload ${index + 1}`}
                          className="img-thumbnail h-100 w-100"
                          style={{ objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                          onClick={() => removeImage(index, true)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

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
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label-title">FAQs</label>
                  {articleData.faqs.map((qa, index) => (
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
                    {isSubmitting ? 'Processing...' : (articleId ? 'Update' : 'Submit')}
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