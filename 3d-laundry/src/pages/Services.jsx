import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Services() {
  const services = [
    {
      category: "Regular Clothes",
      items: "T-shirts, Shirts, Dresses, Skirts",
      price: "300/= each"
    },
    {
      category: "Whites / Jeans / Heavy",
      items: "White coats, jeans, towels, hoodies, sweaters",
      price: "500/= each"
    },
    {
      category: "Accessories",
      items: "Boxers, underwear, socks, leso",
      price: "Free"
    },
    {
      category: "Extra-Care",
      items: "Delicate garments",
      price: "1000/= each"
    },
    {
      category: "Curtain (small)",
      items: "–",
      price: "1000/= each"
    },
    {
      category: "Basket Wash (Tenga)",
      items: "–",
      price: "9000/= per basket"
    },
    {
      category: "Ironing Add-on",
      items: "Optional",
      price: "+200/= per item"
    }
  ];

  return (
    <div className="services-page">
      <section className="section page-header-section">
        <div className="container">
          <div className="page-header-content">
            <h1>Our Laundry Services</h1>
            <p className="page-subtitle">Professional care for all your garments</p>
            <div className="header-buttons">
              <Link to="/order" className="btn btn-primary">Book Service</Link>
              <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section services-overview">
        <div className="container">
          <div className="services-intro">
            <div className="intro-content">
              <h2>Free Pickups & Delivery</h2>
              <p>Pickups are free within our mapped zones. You can choose your preferred pickup day and time when booking. Our reliable service ensures your clothes are handled with care from pickup to delivery.</p>
              
              <div className="services-image">
                <div className="image-placeholder">
                  <i className="fas fa-truck-pickup"></i>
                  <p>Professional laundry service with free pickup and delivery</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">
                <i className="fas fa-tshirt"></i>
              </div>
              <div className="service-details">
                <h3>Washing</h3>
                <p>Thorough cleaning with premium detergents suitable for all fabric types</p>
              </div>
            </div>
            
            <div className="service-item">
              <div className="service-icon">
                <i className="fas fa-iron"></i>
              </div>
              <div className="service-details">
                <h3>Ironing</h3>
                <p>Professional pressing to ensure crisp, wrinkle-free garments</p>
              </div>
            </div>
            
            <div className="service-item">
              <div className="service-icon">
                <i className="fas fa-soap"></i>
              </div>
              <div className="service-details">
                <h3>Dry Cleaning</h3>
                <p>Specialized care for delicate fabrics and high-end garments</p>
              </div>
            </div>
            
            <div className="service-item">
              <div className="service-icon">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <div className="service-details">
                <h3>Free Pickup</h3>
                <p>Convenient collection and delivery at your doorstep</p>
              </div>
            </div>
            
            <div className="service-item">
              <div className="service-icon">
                <i className="fas fa-shopping-basket"></i>
              </div>
              <div className="service-details">
                <h3>Tenga (Basket Wash)</h3>
                <p>Complete washing solution for bulk items and bedding</p>
              </div>
            </div>
            
            <div className="service-item">
              <div className="service-icon">
                <i className="fas fa-home"></i>
              </div>
              <div className="service-details">
                <h3>Curtain Wash</h3>
                <p>Specialized cleaning for curtains and drapes</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section pricing-section">
        <div className="container">
          <div className="section-header">
            <h2>Transparent Pricing</h2>
            <p className="section-description">All prices include pickup and delivery. No hidden fees.</p>
          </div>
          
          <div className="pricing-table-container">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Example Items</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index}>
                    <td className="pricing-category">{service.category}</td>
                    <td>{service.items}</td>
                    <td className="pricing-amount">{service.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="additional-notes">
            <div className="note-card">
              <h4>Special Instructions</h4>
              <p>Special garment requests can be added in the order form.</p>
            </div>
            
            <div className="note-card">
              <h4>Inclusive Pricing</h4>
              <p>All prices are inclusive of pickup and delivery.</p>
            </div>
          </div>
          
          <div className="section-cta">
            <Link to="/order" className="btn btn-primary">Book Your Laundry Service</Link>
          </div>
        </div>
      </section>
      
      <section className="section service-areas">
        <div className="container">
          <div className="section-header">
            <h2>Service Areas</h2>
            <p className="section-description">We currently serve these areas with free pickup and delivery</p>
          </div>
          
          <div className="areas-grid">
            <div className="area-card">
              <div className="area-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Mikocheni</h3>
              <p>Kairuki University</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Kiota Hostels</h3>
              <p>Student accommodation</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Tumaini University</h3>
              <p>Mwenge Campus</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Mlimani City</h3>
              <p>Commercial area</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Ardhi University</h3>
              <p>Academic institution</p>
            </div>
            
            <div className="area-card">
              <div className="area-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Makongo Juu</h3>
              <p>Residential area</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;