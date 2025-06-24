
import React from 'react';

interface IconProps {
  className?: string;
}

const SparkleIcon: React.FC<IconProps> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 2l2.35 7.16h7.65l-6.18 4.48 2.35 7.16-6.17-4.48-6.17 4.48 2.35-7.16-6.18-4.48h7.65L12 2z" />
  </svg>
);

export default SparkleIcon;
