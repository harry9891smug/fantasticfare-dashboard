'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FiPlusSquare, FiEye, FiTrash2 } from 'react-icons/fi'
import Link from 'next/link'

interface Article {
  _id: string
  article_heading: string
  article_description: string
  article_image?: string
  status: string
  createdAt?: string
}

export default function AllArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Unauthorized: No token found. Please log in.')
        return
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/articles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setArticles(response.data.data || [])
      } catch (error: any) {
        console.error('Fetch articles error:', error)
        setError(error.response?.data?.message || 'Failed to fetch articles')
        setArticles([])
      }
    }

    fetchArticles()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this article?')
    if (!confirmDelete) return

    const token = localStorage.getItem('authToken')

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/delete-article/${id}`, {
        headers: { Authorization: `${token}` },
      })
      alert('Article deleted successfully!')
      setArticles(articles.filter(article => article._id !== id))
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete article')
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header card-header--2 d-flex justify-content-between align-items-center">
              <h5>All Articles</h5>
              <Link href="/dashboard/blogs/new" className="btn btn-theme">
                <FiPlusSquare className="me-2" />
                Add New
              </Link>
            </div>

            <div className="card-body">
              <div className="table-responsive table-desi">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>View</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.length > 0 ? (
                      articles.map((article, index) => (
                        <tr key={article._id}>
                          <td>{index + 1}</td>
                          <td>{article.article_heading}</td>
                          <td>
                            {article.article_description
                                .split(' ')
                                .slice(0, 20)
                                .join(' ')}...
                            </td>
                          
                          <td>
                            <Link href={`/dashboard/blogs/view/${article._id}`}>
                              <FiEye className="text-primary" />
                            </Link>
                          </td>
                          <td>
                            <button className="btn btn-link p-0" onClick={() => handleDelete(article._id)}>
                              <FiTrash2 className="text-danger" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center">
                          No articles found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Optional Pagination UI */}
            <div className="pagination-box">
              <nav className="ms-auto me-auto" aria-label="Page navigation">
                <ul className="pagination pagination-primary">
                  <li className="page-item disabled">
                    <button className="page-link">Previous</button>
                  </li>
                  <li className="page-item active">
                    <button className="page-link">1</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link">2</button>
                  </li>
                  <li className="page-item">
                    <button className="page-link">Next</button>
                  </li>
                </ul>
              </nav>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
