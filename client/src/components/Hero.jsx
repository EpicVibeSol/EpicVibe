import React from 'react';
import Button from './Button';
import '../assets/hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">ONE WORD.</span>
            <span className="gradient-text">A GAME.</span>
          </h1>
          <p className="hero-subtitle">
            Transform your imagination into playable Solana blockchain games with just a few words.
            No coding required.
          </p>
          <div className="hero-cta">
            <Button type="primary" size="large">
              Get Started
            </Button>
            <Button type="outline" size="large">
              Explore Games
            </Button>
          </div>
        </div>
        <div className="hero-image">
          <div className="controller-image">
            {/* Controller image will be added via CSS */}
          </div>
          <div className="ai-prompt">
            <div className="prompt-header">
              <span className="prompt-dot"></span>
              <span className="prompt-dot"></span>
              <span className="prompt-dot"></span>
              <span className="prompt-title">AI Command</span>
            </div>
            <div className="prompt-content">
              <p>Create a cyberpunk racing game with neon hoverbikes and a futuristic city track</p>
            </div>
            <div className="prompt-footer">
              <div className="prompt-status">
                <span className="status-icon"></span>
                <span className="status-text">Game created successfully!</span>
              </div>
              <button className="play-button">PLAY NOW</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 