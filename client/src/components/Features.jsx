import React from 'react';
import '../assets/features.css';

const Features = () => {
  const features = [
    {
      icon: '🎮',
      title: 'MULTIPLE GAME GENRES',
      description: 'Create racing, adventure, puzzle, RPG, rhythm games and more with simple text prompts.'
    },
    {
      icon: '🎨',
      title: 'TRENDY ART STYLES',
      description: 'Choose from cyberpunk, retro synthwave, pixel art, and other popular visual styles.'
    },
    {
      icon: '⚡',
      title: 'INSTANT DEPLOYMENT',
      description: 'Games are automatically converted to Solana chain games, ready to play and share.'
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 