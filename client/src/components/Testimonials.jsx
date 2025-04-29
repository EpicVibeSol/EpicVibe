import React from 'react';
import '../assets/testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'CyberDreamer',
      avatar: '/avatar1.png',
      text: 'Created my first racing game in 10 minutes! The AI understood exactly what I wanted with just a few prompts.'
    },
    {
      name: 'NeonArtist',
      avatar: '/avatar2.png',
      text: 'Finally a platform where I can bring my art concepts to life without learning to code. Absolutely revolutionary!'
    },
    {
      name: 'PixelWizard',
      avatar: '/avatar3.png',
      text: 'The speed of game generation is mind-blowing. From concept to playable game in minutes, not months!'
    },
    {
      name: 'VRExplorer',
      avatar: '/avatar4.png',
      text: 'My students love creating their own games. Has transformed how I teach creative technology in class.'
    },
    {
      name: 'GameJammer',
      avatar: '/avatar5.png',
      text: 'Won my first game jam using EpicVibe! The AI helped me iterate on ideas faster than any traditional tool.'
    },
    {
      name: 'SolanaBuilder',
      avatar: '/avatar6.png',
      text: 'The blockchain integration is seamless. My game was generating revenue within hours of creation.'
    },
    {
      name: 'RetroGamer',
      avatar: '/avatar7.png',
      text: 'Created a synthwave adventure that perfectly captures the 80s aesthetic I wanted. Absolutely impressed!'
    }
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">WHAT CREATORS SAY</h2>
          <h3 className="section-subtitle">Transforming Ideas Into Games</h3>
        </div>
        
        <div className="testimonials-slider">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-content">
                <p className="testimonial-text">"{testimonial.text}"</p>
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">
                  <div className="avatar-placeholder">{testimonial.name.charAt(0)}</div>
                </div>
                <div className="testimonial-name">{testimonial.name}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="testimonials-cta">
          <p>Join thousands of creators who are already transforming their imagination into playable games with our AI-driven platform.</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 