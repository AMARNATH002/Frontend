import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from './components/ProductCard'
import config from './config'
import './Home.css'
const Home = ({ addToCart, user, onLogin }) => {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')


  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  })

  // Validation error states
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    fetchFoods()
  }, [])

  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/foods`)
      setFoods(response.data)
      setLoading(false)
    } catch (error) {
      setError('Failed to fetch food items')
      setLoading(false)
    }
  }

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  }

  const validateName = (name) => {
    return name.trim().length >= 2
  }

  const validatePassword = (password) => {
    return password.length >= 6
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!validateEmail(loginData.email)) {
      alert('Please enter a valid email address')
      return
    }
    
    if (!validatePassword(loginData.password)) {
      alert('Password must be at least 6 characters long')
      return
    }
    
    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/login`, loginData)
      onLogin(response.data.user, response.data.token)
      setShowLoginModal(false)
      setLoginData({ email: '', password: '' })
      alert('Login successful!')
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!validateName(registerData.name)) {
      alert('Name must be at least 2 characters long')
      return
    }
    
    if (!validateEmail(registerData.email)) {
      alert('Please enter a valid email address')
      return
    }
    
    if (!validatePassword(registerData.password)) {
      alert('Password must be at least 6 characters long')
      return
    }
    
    if (!validatePhone(registerData.phone)) {
      alert('Please enter a valid 10-digit phone number')
      return
    }
    
    if (registerData.address.trim().length < 10) {
      alert('Please enter a complete address (at least 10 characters)')
      return
    }
    
    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/register`, registerData)
      onLogin(response.data.user, response.data.token)
      setShowRegisterModal(false)
      setRegisterData({ name: '', email: '', password: '', phone: '', address: '' })
      alert('Registration successful!')
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed')
    }
  }

  const categories = ['all', ...new Set(foods.map(food => food.category))]

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="home">
      
      <section className="hero">
        <div className="hero-content">
          <h1>Delicious Food Delivered</h1>
          <p>Order your favorite meals from the comfort of your home</p>
          {!user && (
            <div className="hero-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowRegisterModal(true)}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </section>

    

      
      <section className="food-items">
        <div className="container">
          <h2>Our Menu</h2>
          <div className="food-grid">
            {filteredFoods.map(food => (
              <ProductCard
                key={food.id}
                product={food}
                onAddToCart={addToCart}
                user={user}
              />
            ))}
          </div>
          {filteredFoods.length === 0 && (
            <p className="no-results">No food items found matching your criteria.</p>
          )}
        </div>
      </section>

      
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => {
                    const value = e.target.value
                    setLoginData({...loginData, email: value})
                    if (value && !validateEmail(value)) {
                      setValidationErrors({...validationErrors, loginEmail: 'Please enter a valid email address'})
                    } else {
                      const newErrors = {...validationErrors}
                      delete newErrors.loginEmail
                      setValidationErrors(newErrors)
                    }
                  }}
                  className={validationErrors.loginEmail ? 'error' : loginData.email && validateEmail(loginData.email) ? 'success' : ''}
                  required
                />
                {validationErrors.loginEmail && <div className="validation-error">{validationErrors.loginEmail}</div>}
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => {
                    const value = e.target.value
                    setLoginData({...loginData, password: value})
                    if (value && !validatePassword(value)) {
                      setValidationErrors({...validationErrors, loginPassword: 'Password must be at least 6 characters'})
                    } else {
                      const newErrors = {...validationErrors}
                      delete newErrors.loginPassword
                      setValidationErrors(newErrors)
                    }
                  }}
                  className={validationErrors.loginPassword ? 'error' : loginData.password && validatePassword(loginData.password) ? 'success' : ''}
                  required
                />
                {validationErrors.loginPassword && <div className="validation-error">{validationErrors.loginPassword}</div>}
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">Login</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowLoginModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
            <p>
              Don't have an account? 
              <button 
                className="link-btn"
                onClick={() => {
                  setShowLoginModal(false)
                  setShowRegisterModal(true)
                }}
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      )}

      
      {showRegisterModal && (
        <div className="modal-overlay" onClick={() => setShowRegisterModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => {
                    const value = e.target.value
                    setRegisterData({...registerData, name: value})
                    if (value && !validateName(value)) {
                      setValidationErrors({...validationErrors, name: 'Name must be at least 2 characters'})
                    } else {
                      const newErrors = {...validationErrors}
                      delete newErrors.name
                      setValidationErrors(newErrors)
                    }
                  }}
                  className={validationErrors.name ? 'error' : registerData.name && validateName(registerData.name) ? 'success' : ''}
                  required
                />
                {validationErrors.name && <div className="validation-error">{validationErrors.name}</div>}
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => {
                    const value = e.target.value
                    setRegisterData({...registerData, email: value})
                    if (value && !validateEmail(value)) {
                      setValidationErrors({...validationErrors, email: 'Please enter a valid email address'})
                    } else {
                      const newErrors = {...validationErrors}
                      delete newErrors.email
                      setValidationErrors(newErrors)
                    }
                  }}
                  className={validationErrors.email ? 'error' : registerData.email && validateEmail(registerData.email) ? 'success' : ''}
                  required
                />
                {validationErrors.email && <div className="validation-error">{validationErrors.email}</div>}
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => {
                    const value = e.target.value
                    setRegisterData({...registerData, password: value})
                    if (value && !validatePassword(value)) {
                      setValidationErrors({...validationErrors, password: 'Password must be at least 6 characters'})
                    } else {
                      const newErrors = {...validationErrors}
                      delete newErrors.password
                      setValidationErrors(newErrors)
                    }
                  }}
                  className={validationErrors.password ? 'error' : registerData.password && validatePassword(registerData.password) ? 'success' : ''}
                  required
                />
                {validationErrors.password && <div className="validation-error">{validationErrors.password}</div>}
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '') // Only allow numbers
                    setRegisterData({...registerData, phone: value})
                    if (value && !validatePhone(value)) {
                      setValidationErrors({...validationErrors, phone: 'Please enter a valid 10-digit phone number'})
                    } else {
                      const newErrors = {...validationErrors}
                      delete newErrors.phone
                      setValidationErrors(newErrors)
                    }
                  }}
                  className={validationErrors.phone ? 'error' : registerData.phone && validatePhone(registerData.phone) ? 'success' : ''}
                  placeholder="1234567890"
                  maxLength="10"
                  required
                />
                {validationErrors.phone && <div className="validation-error">{validationErrors.phone}</div>}
              </div>
              <div className="form-group">
                <label>Address:</label>
                <textarea
                  value={registerData.address}
                  onChange={(e) => {
                    const value = e.target.value
                    setRegisterData({...registerData, address: value})
                    if (value && value.trim().length < 10) {
                      setValidationErrors({...validationErrors, address: 'Address must be at least 10 characters'})
                    } else {
                      const newErrors = {...validationErrors}
                      delete newErrors.address
                      setValidationErrors(newErrors)
                    }
                  }}
                  className={validationErrors.address ? 'error' : registerData.address && registerData.address.trim().length >= 10 ? 'success' : ''}
                  placeholder="Enter your complete address"
                  required
                  rows="3"
                />
                {validationErrors.address && <div className="validation-error">{validationErrors.address}</div>}
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">Register</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowRegisterModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
            <p>
              Already have an account? 
              <button 
                className="link-btn"
                onClick={() => {
                  setShowRegisterModal(false)
                  setShowLoginModal(true)
                }}
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home