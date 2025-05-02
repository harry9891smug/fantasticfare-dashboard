'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Role {
  createdAt: string
  role_name: string
  status: string
  updatedAt: string
  __v: string
  _id: string
}

interface User {
  name: string;
  email: string;
  mobile_number: string;
  role: string;
  password: string;
  country_code: string;
  profile_picture: string;
}

export default function CreateUser() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    mobile_number: '',
    role: '',
    password: '',
    country_code: '+91',
    profile_picture: ''
  })
  const [roles, setRoles] = useState<Role[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string }>({});
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter()

  // Fetch roles from the API
  useEffect(() => {
    const fetchRoles = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Unauthorized: No token found. Please log in.')
        return
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        setRoles(response.data.data)

      } catch (error: any) {
        console.error('Error fetching roles:', error)
        setError('Failed to fetch roles')
      }
    }
    fetchRoles()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser(prevState => ({
      ...prevState,
      role: e.target.value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    if (file) {
      // Assuming you will upload the file later and return the URL for profile picture
      const fileURL = URL.createObjectURL(file)
      setUser(prevState => ({
        ...prevState,
        profile_picture: fileURL
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let validationErrors: { password?: string } = {};

    if (!user.password || user.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters long.';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true)

    const token = localStorage.getItem('authToken')
    if (!token) {
      setError('Unauthorized: No token found. Please log in.')
      return
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/create-user`,
        user,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      alert('User created successfully!')
      router.push('/dashboard/users')
    } catch (error: any) {
      setLoading(false)
      setError(error.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="container-fluid">
      <div className="card">
        <div className="card-header">
          <h5>Create New User</h5>
        </div>
        <div className="card-body">
          <form className="theme-form mega-form" onSubmit={handleSubmit}>
            <div className="personal-info">
              <div className="personal-info__img">
                <Image
                  src={user.profile_picture || '/assets/images/users/4.jpg'}
                  alt="User Image"
                  width={150}
                  height={150}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-control mt-2"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6">
                <label className="form-label-title mt-3">Name</label>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label-title mt-3">Email</label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label-title mt-3">Mobile Number</label>
                <input
                  className="form-control"
                  type="text"
                  name="mobile_number"
                  value={user.mobile_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label-title mt-3">Password</label>
                <div className="position-relative">
                  <input
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
              </div>

              <div className="col-sm-6">
                <label className="form-label-title mt-3">Confirm Password</label>
                <div className="position-relative">
                  <input
                    className="form-control"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </span>
                </div>
              </div>

              <div className="col-sm-6">
                <label className="form-label-title mt-3">Role</label>
                <select
                  className="form-control"
                  value={user.role}
                  onChange={handleRoleChange}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="admin">Admin</option>
                  {roles?.map(role => (
                    <option key={role._id} value={role.role_name}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-sm-6">
                <label className="form-label-title mt-3">Country Code</label>
                <input
                  className="form-control"
                  type="text"
                  name="country_code"
                  value={user.country_code}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {error && <div className="text-red-500 p-4">{error}</div>}
            {success && <div className="text-green-500 p-4">{success}</div>}

            <div className="card-footer text-end">
              <button type="submit" className="btn btn-primary me-3">Create User</button>
              <button type="button" className="btn btn-outline-primary" onClick={() => router.push('/dashboard/users')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
