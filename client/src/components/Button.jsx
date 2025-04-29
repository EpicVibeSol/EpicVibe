import React from 'react';
import '../assets/button.css';

/**
 * Reusable Button component
 * @param {Object} props - Component props
 * @param {string} props.type - Button type (primary, secondary, outline)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {React.ReactNode} props.children - Button content
 * @returns {JSX.Element}
 */
const Button = ({ 
  type = 'primary', 
  size = 'medium', 
  onClick, 
  disabled = false, 
  children,
  className = '',
  ...rest 
}) => {
  const buttonClass = `btn btn-${type} btn-${size} ${className}`;
  
  return (
    <button 
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button; 