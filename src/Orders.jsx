import { useState, useEffect } from 'react'
import axios from 'axios'
import config from './config'
import './Orders.css'

const Orders = ({ user, showAlert }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancellingOrder, setCancellingOrder] = useState(null)

  useEffect(() => {
    if (user) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${config.API_BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setOrders(response.data)
      setLoading(false)
    } catch (error) {
      setError('Failed to fetch orders')
      setLoading(false)
    }
  }

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    setCancellingOrder(orderId)
    try {
      const token = localStorage.getItem('token')
      await axios.put(`${config.API_BASE_URL}/api/orders/${orderId}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      // Update the order status in the local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? { ...order, status: 'cancelled' }
            : order
        )
      )
      
      showAlert('Order cancelled successfully!', 'success')
    } catch (error) {
      showAlert(error.response?.data?.message || 'Failed to cancel order', 'error')
    } finally {
      setCancellingOrder(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800'
      case 'confirmed': return '#2196f3'
      case 'preparing': return '#ff5722'
      case 'delivered': return '#4caf50'
      case 'cancelled': return '#f44336'
      default: return '#666'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="no-user">
            <h2>Please login to view your orders</h2>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="error">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <h2>No orders yet</h2>
            <p>Start ordering some delicious food!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <strong>Order #{order._id.slice(-8)}</strong>
                  </div>
                  <div className="order-date">
                    {formatDate(order.createdAt)}
                  </div>
                  <div 
                    className="order-status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>
                
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                      </div>
                      <div className="item-price">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
                
                <div className="order-footer">
                  <div className="delivery-info">
                    <strong>Delivery to:</strong> {order.deliveryAddress}
                  </div>
                  <div className="order-actions">
                    <div className="order-total">
                      <strong>Total: ₹{order.totalAmount}</strong>
                    </div>
                    {(order.status === 'pending' || order.status === 'confirmed') && (
                      <button 
                        className="cancel-order-btn"
                        onClick={() => cancelOrder(order._id)}
                        disabled={cancellingOrder === order._id}
                      >
                        {cancellingOrder === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders