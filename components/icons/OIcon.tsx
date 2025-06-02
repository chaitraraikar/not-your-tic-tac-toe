
import React from 'react';

interface OIconProps {
  className?: string;
  size?: number;
}

const OIcon: React.FC<OIconProps> = ({ className, size = 100 }) => {
  const strokeWidth = size / 5; // Proportional stroke width
  const radius = (size - strokeWidth) / 2 - 2; // Radius considering stroke width and small padding
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg 
      viewBox={`0 0 ${size} ${size}`} 
      width={size} 
      height={size} 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="gradO" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#60A5FA' }} /> {/* blue-400 */}
          <stop offset="100%" style={{ stopColor: '#22D3EE' }} /> {/* cyan-400 */}
        </linearGradient>
      </defs>
      <circle 
        cx={cx} 
        cy={cy} 
        r={radius}
        fill="transparent"
        stroke="url(#gradO)" 
        strokeWidth={strokeWidth} 
      />
    </svg>
  );
};

export default OIcon;
