import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './OrderSuccess.css'

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    // Get order data from navigation state
    if (location.state && location.state.orderData) {
      setOrderData(location.state.orderData)
    } else {
      // If no order data, redirect to home
      navigate('/')
    }
  }, [location.state, navigate])

  const handleContinueShopping = () => {
    navigate('/')
  }

  if (!orderData) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="order-success">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">
            <div className="checkmark">✓</div>
          </div>
          
          <h1>Order Placed Successfully!</h1>
          <p className="success-message">
            Thank you for your order! Your delicious food is being prepared and will be delivered soon.
          </p>

          <div className="order-details">
            <h2>Order Summary</h2>
            <div className="order-info">
              <div className="info-row">
                <span className="label">Order ID:</span>
                <span className="value">#{orderData.orderId}</span>
              </div>
              <div className="info-row">
                <span className="label">Total Amount:</span>
                <span className="value">₹{orderData.totalAmount}</span>
              </div>
              <div className="info-row">
                <span className="label">Delivery Address:</span>
                <span className="value">{orderData.deliveryAddress}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone:</span>
                <span className="value">{orderData.phone}</span>
              </div>
              <div className="info-row">
                <span className="label">Estimated Delivery:</span>
                <span className="value">30-45 minutes</span>
              </div>
            </div>
          </div>

          <div className="ordered-items">
            <h3>Your Order</h3>
            <div className="items-list">
              {orderData.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                    <p className="item-price">₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-status">
            <h3>Order Status</h3>
            <div className="status-timeline">
              <div className="status-step active">
                <div className="step-icon">✓</div>
                <div className="step-text">Order Confirmed</div>
              </div>
              <div className="status-step">
                <div className="step-icon">🍳</div>
                <div className="step-text">Preparing</div>
              </div>
              <div className="status-step">
                <div className="step-icon">🚚</div>
                <div className="step-text">Out for Delivery</div>
              </div>
              <div className="status-step">
                <div className="step-icon">🏠</div>
                <div className="step-text">Delivered</div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
          </div>

          <div className="contact-info">
            <p>Need help with your order?</p>
            <p>Call us at: <strong>+1 (555) 123-4567</strong></p>
            <p>Or email: <strong>support@foodorder.com</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess