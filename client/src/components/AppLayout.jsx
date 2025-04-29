import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../assets/global.css';

/**
 * Main layout wrapper component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element}
 */
const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout; 