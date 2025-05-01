'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
interface FAQ {
  question: string;
  answer: string;
}
export default function NewFaqCreate() {
  const router = useRouter()
  const { id } = useParams()
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const handleAddFaq = () => {
    setFaqs([...faqs, {
      question: '',
      answer: '',
    }])
  }
  const updatedata = 1;


  const handleRemoveFaq = (index: number) => {
    if (faqs.length > 1) {
      setFaqs(faqs.filter((_, i) => i !== index))
    }
  }

  const handleChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs]
    updated[index][field] = value
    setFaqs(updated)
  }

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package_view/${id}`);
        setFaqs(response.data.data.faq[0].questions || []);
      } catch (error) {
        console.error('Error fetching faqs:', error);
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
    faqs.forEach((faq, index) => {
      formData.append(`question[${index}]`, faq.question)
      formData.append(`answer[${index}]`, faq.answer)
    })

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/package-faq-create`, formData, {
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

  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Update Package FAQs</h5>
        </div>
        <div className="card-body">
          <form className="theme-form mega-form" onSubmit={handleSubmit}>
            {faqs.map((faq, index) => (
              <div key={index} className="mb-4 border p-3 rounded">
                <h6>FAQ {index + 1}</h6>
                <div className="row">
                  <div className="col-sm-6">
                    <label className="form-label-title">Question*</label>
                    <input
                      className="form-control"
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleChange(index, 'question', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label-title">Answer*</label>
                    <input
                      className="form-control"
                      type="text"
                      value={faq.answer}
                      onChange={(e) => handleChange(index, 'answer', e.target.value)}
                      required
                    />
                  </div>
                </div>
                {faqs.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleRemoveFaq(index)}
                  >
                    Remove FAQ
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              className="btn btn-outline-primary mb-3"
              onClick={handleAddFaq}
            >
              Add Another FAQ
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
                {loading ? 'Updating...' : 'Update FAQ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
