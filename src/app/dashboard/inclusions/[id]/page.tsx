'use client'
import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'

export default function NewInclusionExclusion() {
 
  const { id } = useParams() as { id: string };
  type InclusionItem = {
    type: 'inclusion' | 'exclusion'
    description: string
  }
  
  const router = useRouter()
  const [packageId, setPackageId] = useState('')
  const [items, setItems] = useState<InclusionItem[]>([
    { type: 'inclusion', description: '' }
  ])
  
  const handleAddItem = () => {
    setItems([...items, { type: 'inclusion', description: '' }])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleChange = (
    index: number,
    field: keyof InclusionItem,
    value: string
  ) => {
    const updated = [...items]
    if (field === 'type' && (value === 'inclusion' || value === 'exclusion')) {
      updated[index][field] = value
    } else if (field === 'description') {
      updated[index][field] = value
    }
    setItems(updated)
  }
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')
    const formData = new FormData()

    formData.append('package_id', id)
    items.forEach((item, index) => {
      formData.append(`type[${index}]`, item.type)
      formData.append(`description[${index}]`, item.description)
    })

    try {
      await axios.post('https://backend.fantasticfare.com/api/inclusion-create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      alert("Hotel stays added successfully!")
      router.push(`/dashboard/faq/${id}`);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save Inclusions/exclusions')
    }
  }

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Create Inclusions & Exclusions</h5>
        </div>
        <div className="card-body">
          <form className="theme-form mega-form" onSubmit={handleSubmit}>
           

            {items.map((item, index) => (
              <div key={index} className="mb-4 border p-3 rounded">
                <h6>Item {index + 1}</h6>
                <div className="row">
                  <div className="col-sm-4">
                    <label className="form-label-title">Type*</label>
                    <select
                      className="form-control"
                      value={item.type}
                      onChange={(e) => handleChange(index, 'type', e.target.value)}
                    >
                      <option value="inclusion">Inclusion</option>
                      <option value="exclusion">Exclusion</option>
                    </select>
                  </div>
                  <div className="col-sm-8">
                    <label className="form-label-title">Description*</label>
                    <input
                      className="form-control"
                      type="text"
                      value={item.description}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      required
                    />
                  </div>
                </div>
                {items.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove Item
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary mb-3"
              onClick={handleAddItem}
            >
              Add Another Item
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
