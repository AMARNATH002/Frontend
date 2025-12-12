import './About.css'

const About = () => {
  return (
    <div className="about">
      <div className="container">
        <div className="about-header">
          <h1>About FoodOrder</h1>
          <p className="about-subtitle">Bringing delicious food to your doorstep</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Our Story</h2>
            <p>
              FoodOrder was founded with a simple mission: to make delicious, quality food 
              accessible to everyone. We believe that great food brings people together and 
              creates memorable experiences.
            </p>
            
          </div>

          <div className="about-section">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon"> 🍛</div>
                <h3>Quality Food</h3>
                <p>We partner with the best restaurants to ensure every meal meets our high standards.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🚐</div>
                <h3>Fast Delivery</h3>
                <p>Quick and reliable delivery service to get your food to you while it's still hot.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">📱</div>
                <h3>Easy Ordering</h3>
                <p>Simple and intuitive ordering process through our user-friendly platform.</p>
              </div>
              
            </div>
          </div>

          

          <div className="about-section">
            <h2>Why Choose Us?</h2>
            <ul className="benefits-list">
              <li>Wide variety of cuisines and dishes</li>
              <li>Competitive pricing with regular offers</li>
              <li>Real-time order tracking</li>
              <li>24/7 customer support</li>
              <li>Fresh ingredients and hygienic preparation</li>
              <li>Contactless delivery options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About