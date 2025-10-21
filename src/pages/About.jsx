import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function About() {
  return (
    <div className="about-page">
      <section className="section page-header-section">
        <div className="container">
          <div className="page-header-content">
            <h1>About FreshFold Laundry</h1>
            <p className="page-subtitle">Making student and city life easier, one garment at a time</p>
            <div className="header-buttons">
              <Link to="/services" className="btn btn-primary">Our Services</Link>
              <Link to="/order" className="btn btn-secondary">Book Now</Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section our-story">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>FreshFold Laundry was created to make student and city life easier — providing reliable, quick, and affordable laundry service with just one click. We understand the challenges of busy schedules and the importance of looking your best, which is why we've made laundry as simple and convenient as possible.</p>
              <p>Our professional team is dedicated to giving your clothes the care they deserve, using high-quality detergents and equipment to ensure the best results every time.</p>
              
              <div className="mission-vision">
                <div className="mission">
                  <div className="mission-icon">
                    <i className="fas fa-bullseye"></i>
                  </div>
                  <h3>Our Mission</h3>
                  <p>To provide exceptional laundry services that save time and enhance the quality of life for students and professionals in our community.</p>
                </div>
                
                <div className="vision">
                  <div className="vision-icon">
                    <i className="fas fa-eye"></i>
                  </div>
                  <h3>Our Vision</h3>
                  <p>To become the most trusted and convenient laundry service provider in Dar es Salaam, known for reliability, quality, and customer satisfaction.</p>
                </div>
              </div>
            </div>
            
            <div className="story-image">
              <div className="image-placeholder">
                <i className="fas fa-users"></i>
                <p>Professional laundry service team</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section coverage-areas">
        <div className="container">
          <div className="section-header">
            <h2>Our Coverage & Service Areas</h2>
            <p className="section-description">We currently serve areas around Mikocheni up to Makongo Juu, with free pickup and delivery for all our customers in these zones.</p>
          </div>
          
          <div className="map-placeholder">
            <div className="map-content">
              <i className="fas fa-map"></i>
              <p>Service area map showing Mikocheni, Kiota Hostels, Tumaini University, Mlimani City, Ardhi University, and Makongo Juu</p>
            </div>
          </div>
          
          <div className="service-areas">
            <h3>Highlighted Zones</h3>
            <div className="areas-grid">
              <div className="area-item">
                <div className="area-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h4>Mikocheni</h4>
                <p>Kairuki University</p>
              </div>
              <div className="area-item">
                <div className="area-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h4>Kiota Hostels</h4>
                <p>Student accommodation</p>
              </div>
              <div className="area-item">
                <div className="area-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h4>Tumaini University</h4>
                <p>Mwenge Campus</p>
              </div>
              <div className="area-item">
                <div className="area-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h4>Mlimani City</h4>
                <p>Commercial area</p>
              </div>
              <div className="area-item">
                <div className="area-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h4>Ardhi University</h4>
                <p>Academic institution</p>
              </div>
              <div className="area-item">
                <div className="area-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h4>Makongo Juu</h4>
                <p>Residential area</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section schedule-section">
        <div className="container">
          <div className="section-header">
            <h2>Pickup & Delivery Schedule</h2>
            <p className="section-description">We operate on a weekly schedule to ensure timely service for all our customers.</p>
          </div>
          
          <div className="schedule-content">
            <div className="schedule-day">
              <div className="day-header">
                <h3>Friday</h3>
                <span className="tag">Washing Day</span>
              </div>
              <ul className="schedule-list">
                <li>
                  <span className="time">Booking closes:</span>
                  <span className="detail">6 PM</span>
                </li>
                <li>
                  <span className="time">Pickups start:</span>
                  <span className="detail">7 PM</span>
                </li>
                <li>
                  <span className="time">Delivery:</span>
                  <span className="detail">Saturday 11 AM onward</span>
                </li>
              </ul>
            </div>
            
            <div className="schedule-day">
              <div className="day-header">
                <h3>Saturday</h3>
                <span className="tag">Washing Day</span>
              </div>
              <ul className="schedule-list">
                <li>
                  <span className="time">Pickups start:</span>
                  <span className="detail">11 AM</span>
                </li>
                <li>
                  <span className="time">Delivery:</span>
                  <span className="detail">Saturday night or Sunday morning</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="schedule-note">
            <p><strong>Note:</strong> When daily orders reach limit, bookings close automatically to ensure quality service for all customers.</p>
          </div>
        </div>
      </section>
      
      <section className="section our-promise">
        <div className="container">
          <div className="section-header">
            <h2>Our Promise</h2>
            <p className="section-description">We're committed to providing exceptional service with every interaction</p>
          </div>
          
          <div className="promise-content">
            <div className="promise-item">
              <div className="promise-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="promise-text">
                <h3>Customer Satisfaction Guarantee</h3>
                <p>We're committed to your complete satisfaction with every service</p>
              </div>
            </div>
            
            <div className="promise-item">
              <div className="promise-icon">
                <i className="fas fa-tshirt"></i>
              </div>
              <div className="promise-text">
                <h3>Professional Garment Care</h3>
                <p>Expert handling and care for all types of fabrics and garments</p>
              </div>
            </div>
            
            <div className="promise-item">
              <div className="promise-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="promise-text">
                <h3>Safe Handling & Timely Return</h3>
                <p>Your clothes are treated with respect and returned on time, every time</p>
              </div>
            </div>
            
            <div className="promise-item">
              <div className="promise-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <div className="promise-text">
                <h3>Eco-Friendly Practices</h3>
                <p>Using environmentally responsible detergents and processes</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;