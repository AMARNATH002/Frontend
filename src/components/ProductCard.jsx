import './ProductCard.css'

const ProductCard = ({ product, onAddToCart, user, showAlert }) => {
  const handleAddToCart = () => {
    if (!user) {
      showAlert('Please login to add items to cart', 'warning')
      return
    }
    onAddToCart(product)
  }

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
        <p className="product-category">{product.category}</p>
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={!user}
        >
          {user ? 'Add to Cart' : 'Login to Order'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard