import React, { useState } from 'react';
import '../App.css';

function Contact() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send data to backend API
    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('Thank you for your message! We will get back to you soon at info@cleaningmadeasy.com.');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        alert(`Error sending message: ${result.message}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again later.');
    }
  };

  return (
    <div className="contact-page">
      <section className="section page-header-section">
        <div className="container">
          <div className="page-header-content">
            <h1>Get in Touch</h1>
            <p className="page-subtitle">We're always ready to help or schedule your next pickup</p>
          </div>
        </div>
      </section>
      
      <section className="section contact-content">
        <div className="container">
          <div className="contact-layout">
            <div className="contact-form-section">
              <div className="form-header">
                <h2>Send us a Message</h2>
                <p>Have questions or need assistance? Reach out to us using the form below.</p>
              </div>
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="contactName">Name</label>
                  <input 
                    type="text" 
                    id="contactName" 
                    placeholder="Your name" 
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="contactEmail">Email</label>
                  <input 
                    type="email" 
                    id="contactEmail" 
                    placeholder="Your email" 
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="contactMessage">Message</label>
                  <textarea 
                    id="contactMessage" 
                    placeholder="Your message" 
                    rows="5"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required 
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary full-width">Send Message</button>
              </form>
            </div>
            
            <div className="contact-info-section">
              <div className="info-card">
                <h2>Contact Information</h2>
                
                <div className="contact-details">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="contact-text">
                      <h3>Phone / WhatsApp</h3>
                      <p>+255 XXX XXX XXX</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="contact-text">
                      <h3>Email</h3>
                      <p>info@cleaningmadeasy.com</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="contact-text">
                      <h3>Location</h3>
                      <p>Mikocheni, Dar es Salaam</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="contact-text">
                      <h3>Working Hours</h3>
                      <p>Monday – Sunday: 8 AM – 9 PM</p>
                      <p>Pickups: Friday (evening) & Saturday (morning)</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="social-links">
                <h3>Connect With Us</h3>
                <div className="social-icons">
                  <a href="#" className="social-link">
                    <i className="fab fa-instagram"></i>
                    <span>Instagram</span>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-whatsapp"></i>
                    <span>WhatsApp</span>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-facebook"></i>
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section map-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Location</h2>
            <p className="section-description">Find us in Mikocheni, Dar es Salaam</p>
          </div>
          
          <div className="map-placeholder">
            <div className="map-content">
              <i className="fas fa-map"></i>
              <p>Map showing our location in Mikocheni</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section faq-section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p className="section-description">Find answers to common questions about our service</p>
          </div>
          
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How long does the service take?</h3>
              <p>Our standard service takes 24-48 hours. Pickup days are Friday and Saturday, with delivery the following day.</p>
            </div>
            
            <div className="faq-item">
              <h3>Do you offer same-day service?</h3>
              <p>We don't offer same-day service, but our 24-48 hour turnaround is among the fastest in the area.</p>
            </div>
            
            <div className="faq-item">
              <h3>What areas do you serve?</h3>
              <p>We serve Mikocheni, Kiota Hostels, Tumaini University, Mlimani City, Ardhi University, and Makongo Juu.</p>
            </div>
            
            <div className="faq-item">
              <h3>How do I schedule a pickup?</h3>
              <p>You can schedule a pickup through our website by filling out the order form or by calling us directly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;