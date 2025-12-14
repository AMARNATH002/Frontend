import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = ({ cartItemsCount, user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🍛 TOMATO 🚚
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          {user && <Link to="/orders" className="nav-link">My Orders</Link>}
          <Link to="/cart" className="nav-link cart-link">
            🛒 Cart ({cartItemsCount})
          </Link>
          
          {user ? (
            <div className="user-menu">
              <span className="user-name">Hello, {user.name}</span>
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <span className="login-prompt">Please login to order</span>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar