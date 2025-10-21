import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Order from './pages/Order';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import WhatsAppBot from './components/WhatsAppBot';
import './App.css';

// Add this to include Font Awesome
const addFontAwesome = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  link.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';
  link.crossOrigin = 'anonymous';
  link.referrerPolicy = 'no-referrer';
  document.head.appendChild(link);
};

// Custom hook for active link
function useActiveLink() {
  const location = useLocation();
  return location.pathname;
}

// Navigation component
function Navigation() {
  const activeLink = useActiveLink();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking on a link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navContainer = document.querySelector('.nav-container');
      if (isMenuOpen && navContainer && !navContainer.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={handleLinkClick}>
          <img src="/CME.PNG" alt="Cleaning Made Easy Logo" className="logo-image" />
          <span className="logo-text">Cleaning Made Easy</span>
        </Link>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/" className={activeLink === '/' ? 'active' : ''} onClick={handleLinkClick}>Home</Link></li>
            <li><Link to="/about" className={activeLink === '/about' ? 'active' : ''} onClick={handleLinkClick}>About</Link></li>
            <li><Link to="/services" className={activeLink === '/services' ? 'active' : ''} onClick={handleLinkClick}>Services</Link></li>
            <li><Link to="/order" className={activeLink === '/order' ? 'active' : ''} onClick={handleLinkClick}>Order</Link></li>
            <li><Link to="/contact" className={activeLink === '/contact' ? 'active' : ''} onClick={handleLinkClick}>Contact</Link></li>
            <li><Link to="/admin" className={activeLink === '/admin' ? 'active' : ''} onClick={handleLinkClick}>Admin</Link></li>
          </ul>
        </div>
        
        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    addFontAwesome();
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <div className="App">
        <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
          <Navigation />
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/order" element={<Order />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        
        <WhatsAppBot />
        
        <footer className="site-footer">
          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-section">
                <h3><i className="fas fa-tshirt"></i> Cleaning Made Easy</h3>
                <p>Professional laundry service with free pickup and delivery in Mikocheni and nearby areas.</p>
              </div>
              
              <div className="footer-section">
                <h4>Quick Links</h4>
                <ul>
                  <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
                  <li><Link to="/services"><i className="fas fa-concierge-bell"></i> Services</Link></li>
                  <li><Link to="/order"><i className="fas fa-shopping-cart"></i> Order</Link></li>
                  <li><Link to="/contact"><i className="fas fa-envelope"></i> Contact</Link></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4>Contact Us</h4>
                <p><i className="fas fa-phone"></i> +255 XXX XXX XXX</p>
                <p><i className="fas fa-envelope"></i> info@cleaningmadeasy.com</p>
                <p><i className="fas fa-map-marker-alt"></i> Mikocheni, Dar es Salaam</p>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>&copy; 2025 Cleaning Made Easy. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;