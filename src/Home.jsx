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

  const handleLogin = async (e) => {
    e.preventDefault()
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
    try {
      const response = await axios.post(`${API}/api/register`, registerData)
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
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
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
                  onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <textarea
                  value={registerData.address}
                  onChange={(e) => setRegisterData({...registerData, address: e.target.value})}
                  required
                  rows="3"
                />
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