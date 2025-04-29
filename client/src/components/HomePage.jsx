import React from 'react';
import Hero from './Hero';
import Features from './Features';
import Testimonials from './Testimonials';
import AppLayout from './AppLayout';

/**
 * Homepage component that includes various sections
 * @returns {JSX.Element}
 */
const HomePage = () => {
  return (
    <AppLayout>
      <Hero />
      <Features />
      <Testimonials />
    </AppLayout>
  );
};

export default HomePage; 