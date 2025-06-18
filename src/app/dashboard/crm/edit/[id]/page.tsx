'use client'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'react-toastify'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const EditPage = () => {
  const router = useRouter()
  const params = useParams()
  const pageId = params?.id as string

  const [formData, setFormData] = useState({
    page_url: '',
    page_name: '',
    page_content_1: '',
    page_content_2: '',
    page_content_3: '',
    page_meta_name: '',
    page_meta_description: '',
    page_priority: '',
    page_status: 'active'
  })

  const [loading, setLoading] = useState(true)

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleEditorChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken')
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/view_page/${pageId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setFormData(res.data.data)
        setLoading(false)
      } catch (err) {
        toast.error('Failed to fetch page data.')
        setLoading(false)
      }
    }

    if (pageId) fetchData()
  }, [pageId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')
        const excludedKeys = ['_id', 'createdAt', 'updatedAt', '__v'];

        const cleanedFormData = Object.fromEntries(
        Object.entries(formData).filter(([key]) => !excludedKeys.includes(key))
        );
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/crm/update-page/${pageId}`, cleanedFormData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success('Page updated successfully!')
      router.push('/dashboard/crm')
    } catch (err) {
      toast.error('Error updating page')
    }
  }

  if (loading) return <div className="container mt-4">Loading...</div>

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Edit Page</h4>

      <form onSubmit={handleSubmit} className="row">
        <div className="col-sm-6">
          <label className="form-label-title mt-3">Page URL</label>
          <input
            type="text"
            name="page_url"
            className="form-control"
            value={formData.page_url}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-sm-6">
          <label className="form-label-title mt-3">Page Name</label>
          <input
            type="text"
            name="page_name"
            className="form-control"
            value={formData.page_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12">
          <label className="form-label-title mt-3">Page Content 1</label>
          <div className="border rounded">
            <ReactQuill
              value={formData.page_content_1}
              onChange={(value) => handleEditorChange('page_content_1', value)}
            />
          </div>
        </div>

        <div className="col-12">
          <label className="form-label-title mt-3">Page Content 2</label>
          <div className="border rounded">
            <ReactQuill
              value={formData.page_content_2}
              onChange={(value) => handleEditorChange('page_content_2', value)}
            />
          </div>
        </div>

        <div className="col-12">
          <label className="form-label-title mt-3">Page Content 3</label>
          <div className="border rounded">
            <ReactQuill
              value={formData.page_content_3}
              onChange={(value) => handleEditorChange('page_content_3', value)}
            />
          </div>
        </div>

        <div className="col-sm-6">
          <label className="form-label-title mt-3">Meta Name</label>
          <input
            type="text"
            name="page_meta_name"
            className="form-control"
            value={formData.page_meta_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-sm-6">
          <label className="form-label-title mt-3">Meta Description</label>
          <input
            type="text"
            name="page_meta_description"
            className="form-control"
            value={formData.page_meta_description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-sm-4">
          <label className="form-label-title mt-3">Priority</label>
          <select
            name="page_priority"
            className="form-control"
            value={formData.page_priority}
            onChange={handleChange}
            required
          >
            <option value="">Select Priority</option>
            {[...Array(10).keys()].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="col-sm-4">
          <label className="form-label-title mt-3">Status</label>
          <select
            name="page_status"
            className="form-control"
            value={formData.page_status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-success">Update Page</button>
        </div>
      </form>
    </div>
  )
}

export default EditPage
