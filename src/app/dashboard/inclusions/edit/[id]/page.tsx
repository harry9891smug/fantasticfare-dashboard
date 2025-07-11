'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
interface FAQ {
  type: string;
  description: string;
}
export default function NewFaqCreate() {
  const router = useRouter()
  const { id } = useParams()
  const [inclusions, setInclusion] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const handleAddFaq = () => {
    setInclusion([...inclusions, {
      type: 'inclusion | exclusion',
      description: '',
    }])
  }
  const updatedata = 1;


  const handleRemoveFaq = (index: number) => {
    if (inclusions.length > 1) {
      setInclusion(inclusions.filter((_, i) => i !== index))
    }
  }

  const handleChange = (
    index: number,
    field: keyof FAQ,
    value: string
  ) => {
    const updated = [...inclusions]
    if (field === 'type' && (value === 'inclusion' || value === 'exclusion')) {
      updated[index][field] = value
    } else if (field === 'description') {
      updated[index][field] = value
    }
    setInclusion(updated)
  }

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package_view/${id}`);
        setInclusion(response.data.data.inclusionData[0].types || []);
      } catch (error) {
        console.error('Error fetching inclusions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, [id]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('authToken')
    const formData = new FormData()
    formData.append('package_id', id as string)
    formData.append('update', JSON.stringify(updatedata))
    inclusions.forEach((inclusion, index) => {
      formData.append(`type[${index}]`, inclusion.type)
      formData.append(`description[${index}]`, inclusion.description)
    })

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/inclusion-create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      alert(response.data.message)
      router.push(`/dashboard/packages/edit/${id}`)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to create FAQs')
    }
  }
console.log(inclusions)
  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Update Package Inclusion/Exclusions</h5>
        </div>
        <div className="card-body">
          <form className="theme-form mega-form" onSubmit={handleSubmit}>
            {inclusions.map((inclusion, index) => (
              <div key={index} className="mb-4 border p-3 rounded">
                <h6>Inclusion {index + 1}</h6>
                <div className="row">
                  <div className="col-sm-6">
                    <label className="form-label-title">Type*</label>
                    <select
                      className="form-control"
                      value={inclusion.type}
                      onChange={(e) => handleChange(index, 'type', e.target.value)}
                    >
                      <option value="inclusion">Inclusion</option>
                      <option value="exclusion">Exclusion</option>
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label-title">Answer*</label>
                    <input
                      className="form-control"
                      type="text"
                      value={inclusion.description}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      required
                    />
                  </div>
                </div>
                {inclusions.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleRemoveFaq(index)}
                  >
                    Remove Inclusion/Exclusion
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary mb-3"
              onClick={handleAddFaq}
            >
              Add Another 
            </button>

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
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Inclusion/Exclusions'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
