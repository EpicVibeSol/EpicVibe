import React from 'react';
import '../assets/header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>EpicVibe</h1>
      </div>
      <nav className="navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/create">Create</a></li>
          <li><a href="/explore">Explore</a></li>
          <li><a href="/community">Community</a></li>
        </ul>
      </nav>
      <div className="auth-buttons">
        <button className="connect-wallet">Connect Wallet</button>
      </div>
    </header>
  );
};

export default Header; 