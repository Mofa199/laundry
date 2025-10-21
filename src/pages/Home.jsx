import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Premium Laundry Service",
      subtitle: "Smart, Fast & Fresh",
      description: "We Pick, Wash & Deliver! Enjoy free pickup and delivery around Mikocheni and nearby areas.",
      cta: "View Services"
    },
    {
      title: "Eco-Friendly Cleaning",
      subtitle: "Sustainable & Safe",
      description: "Using environmentally friendly detergents and sustainable practices for a cleaner planet.",
      cta: "Learn More"
    },
    {
      title: "Professional Ironing",
      subtitle: "Crisp & Perfect",
      description: "Expert pressing to ensure your garments look their best every time.",
      cta: "See Pricing"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="home-page">
      {/* Hero Section with Carousel */}
      <section className="hero-section">
        <div className="hero-slider">
          <div className="slide-track">
            {slides.map((slide, index) => (
              <div 
                key={index} 
                className={`slide ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="slide-content">
                  <h1 className="hero-title">{slide.title}</h1>
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <p className="hero-description">{slide.description}</p>
                  <div className="hero-buttons">
                    <Link to="/services" className="btn btn-primary">{slide.cta}</Link>
                    <Link to="/order" className="btn btn-secondary">Book Now</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="slider-dots">
          {slides.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </section>
      
      {/* Services Preview */}
      <section className="section services-preview">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Premium Services</h2>
            <p className="section-description">Experience professional laundry care with our comprehensive service offerings</p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-tshirt"></i>
              </div>
              <h3>Washing</h3>
              <p>Professional washing with premium detergents for all fabric types</p>
              <Link to="/services" className="btn btn-outline">Learn More</Link>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-iron"></i>
              </div>
              <h3>Ironing</h3>
              <p>Crisp, perfectly pressed garments with professional finishing</p>
              <Link to="/services" className="btn btn-outline">Learn More</Link>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-soap"></i>
              </div>
              <h3>Dry Cleaning</h3>
              <p>Specialized care for delicate and high-end garments</p>
              <Link to="/services" className="btn btn-outline">Learn More</Link>
            </div>
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h3>Free Pickup</h3>
              <p>Convenient collection and delivery at your doorstep</p>
              <Link to="/services" className="btn btn-outline">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">Simple steps to fresh, clean clothes</p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">
                <i className="fas fa-laptop"></i>
              </div>
              <h3>Book Online</h3>
              <p>Schedule your pickup with our easy online form</p>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">
                <i className="fas fa-truck-pickup"></i>
              </div>
              <h3>We Collect</h3>
              <p>Free pickup from your location at scheduled time</p>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">
                <i className="fas fa-bath"></i>
              </div>
              <h3>Professional Care</h3>
              <p>Expert cleaning with premium products</p>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-icon">
                <i className="fas fa-truck"></i>
              </div>
              <h3>Fresh Delivery</h3>
              <p>Clean, folded clothes delivered to your door</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="section why-choose-us">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose FreshFold</h2>
            <p className="section-description">We're committed to providing exceptional laundry service</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-truck-pickup"></i>
              </div>
              <h3>Free Pickups</h3>
              <p>Free pickup and delivery around key universities and hostels</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3>Fast Delivery</h3>
              <p>Fast same-day or next-day delivery for your convenience</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-tags"></i>
              </div>
              <h3>Affordable Pricing</h3>
              <p>Competitive per-item pricing with no hidden costs</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <h3>Eco-Friendly</h3>
              <p>Eco-friendly detergents and sustainable practices</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="section testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-description">Real experiences from our valued customers</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"FreshFold has saved me so much time! Their service is reliable and my clothes always come back looking perfect."</p>
              </div>
              <div className="testimonial-author">
                <h4>Sarah Johnson</h4>
                <p>Student at Kairuki University</p>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The best laundry service in Mikocheni! Professional, affordable, and their pickup/delivery is super convenient."</p>
              </div>
              <div className="testimonial-author">
                <h4>Michael Chen</h4>
                <p>Hostel Resident</p>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"I've tried several laundry services, but FreshFold is by far the best. Great quality and excellent customer service!"</p>
              </div>
              <div className="testimonial-author">
                <h4>Emma Wilson</h4>
                <p>Working Professional</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to refresh your wardrobe?</h2>
            <p>Book your laundry service today and experience the FreshFold difference</p>
            <div className="cta-buttons">
              <Link to="/order" className="btn btn-primary">Book Now</Link>
              <Link to="/services" className="btn btn-secondary">View Services</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;