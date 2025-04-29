import React from 'react';
import '../assets/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="footer-logo">EpicVibe</h2>
            <p className="footer-slogan">Creating legendary games that define the future of play</p>
            <div className="footer-social">
              <a href="https://www.epicvibe.fun" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="website-icon"></i>
                Website
              </a>
              <a href="https://x.com/EpicVibeSOL" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="twitter-icon"></i>
                Twitter
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h3 className="footer-links-title">Platform</h3>
              <ul className="footer-links-list">
                <li><a href="#">Features</a></li>
                <li><a href="#">Games</a></li>
                <li><a href="#">Getting Started</a></li>
                <li><a href="#">Creators</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">Resources</h3>
              <ul className="footer-links-list">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">API</a></li>
                <li><a href="#">Community</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3 className="footer-links-title">Company</h3>
              <ul className="footer-links-list">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Mission</a></li>
                <li><a href="#">Team</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} EpicVibe. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 