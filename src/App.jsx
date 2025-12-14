import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Alert from './components/Alert'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import Mycart from './Mycart'
import OrderSuccess from './OrderSuccess'
import Orders from './Orders'
import './App.css'

function App() {
  const [cartItems, setCartItems] = useState([])
  const [user, setUser] = useState(null)
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }

    
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type })
  }

  const hideAlert = () => {
    setAlert({ show: false, message: '', type: 'success' })
  }

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        showAlert(`${item.name} quantity updated in cart!`, 'success')
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        showAlert(`${item.name} added to cart successfully!`, 'success')
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId)
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('cart')
    setCartItems([])
  }

  return (
    <div className="App">
      <Navbar 
        cartItemsCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        user={user}
        onLogout={logout}
      />
      <Alert 
        show={alert.show}
        message={alert.message}
        type={alert.type}
        onClose={hideAlert}
      />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              addToCart={addToCart} 
              user={user} 
              onLogin={login}
              showAlert={showAlert}
            />
          } 
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route 
          path="/cart" 
          element={
            <Mycart 
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              clearCart={clearCart}
              user={user}
            />
          } 
        />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders user={user} showAlert={showAlert} />} />
      </Routes>
    </div>
  )
}

export default App