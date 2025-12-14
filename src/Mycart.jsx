import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import config from './config'
import './Mycart.css'

const Mycart = ({ cartItems, removeFromCart, updateQuantity, clearCart, user }) => {
  const navigate = useNavigate()
  const [showCheckout, setShowCheckout] = useState(false)
  const [orderData, setOrderData] = useState({
    deliveryAddress: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    updateQuantity(itemId, newQuantity)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/
    return phoneRegex.test(phone.replace(/\D/g, ''))
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to place an order')
      return
    }

    // Validation
    if (orderData.deliveryAddress.trim().length < 10) {
      alert('Please enter a complete delivery address (at least 10 characters)')
      return
    }

    if (!validatePhone(orderData.phone)) {
      alert('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const orderItems = cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }))

      const response = await axios.post(`${config.API_BASE_URL}/api/orders`, {
        items: orderItems,
        totalAmount,
        deliveryAddress: orderData.deliveryAddress,
        phone: orderData.phone
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // Navigate to success page with order data
      navigate('/order-success', {
        state: {
          orderData: {
            orderId: response.data.order._id,
            items: orderItems,
            totalAmount,
            deliveryAddress: orderData.deliveryAddress,
            phone: orderData.phone
          }
        }
      })

      clearCart()
      setShowCheckout(false)
      setOrderData({ deliveryAddress: '', phone: '' })
    } catch (error) {
      console.error('Order placement error:', error)
      let errorMessage = 'Failed to place order. '
      
      if (error.response) {
        // Server responded with error status
        errorMessage += error.response.data?.message || `Server error: ${error.response.status}`
      } else if (error.request) {
        // Request was made but no response received
        errorMessage += 'Unable to connect to server. Please check your internet connection.'
      } else {
        // Something else happened
        errorMessage += error.message
      }
      
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <h2>Your Cart is Empty</h2>
          <p>Add some delicious items to your cart to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cart">
      <div className="container">
        <h2>My Cart</h2>
        
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">₹{item.price}</p>
              </div>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <div className="item-total">
                ₹{item.price * item.quantity}
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-btn"
              >
                DELETE
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="total-amount">
            <h3>Total: ₹{totalAmount}</h3>
          </div>
          <div className="cart-actions">
            <button 
              onClick={clearCart}
              className="btn btn-secondary"
            >
              Clear Cart
            </button>
            <button 
              onClick={() => setShowCheckout(true)}
              className="btn btn-primary"
              disabled={!user}
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
          </div>
        </div>

        
        {showCheckout && (
          <div className="modal-overlay" onClick={() => setShowCheckout(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>Checkout</h2>
              <div className="order-summary">
                <h3>Order Summary</h3>
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="summary-total">
                  <strong>Total: ₹{totalAmount}</strong>
                </div>
              </div>
              
              <form onSubmit={handleCheckout}>
                <div className="form-group">
                  <label>Delivery Address:</label>
                  <textarea
                    value={orderData.deliveryAddress}
                    onChange={(e) => setOrderData({...orderData, deliveryAddress: e.target.value})}
                    required
                    rows="3"
                    placeholder="Enter your complete delivery address"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number:</label>
                  <input
                    type="tel"
                    value={orderData.phone}
                    onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="modal-buttons">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowCheckout(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Mycart