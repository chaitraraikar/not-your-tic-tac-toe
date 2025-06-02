
import React from 'react';

interface XIconProps {
  className?: string;
  size?: number;
}

const XIcon: React.FC<XIconProps> = ({ className, size = 100 }) => {
  const strokeWidth = size / 5; // Proportional stroke width
  const padding = strokeWidth / 2 + 2; // Padding to prevent clipping
  const actualSize = size - 2 * padding;

  return (
    <svg 
      viewBox={`0 0 ${size} ${size}`} 
      width={size} 
      height={size} 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        <linearGradient id="gradX" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#FDBA74' }} /> {/* orange-300 */}
          <stop offset="100%" style={{ stopColor: '#FDE047' }} /> {/* yellow-400 */}
        </linearGradient>
      </defs>
      <line 
        x1={padding} y1={padding} 
        x2={padding + actualSize} y2={padding + actualSize} 
        stroke="url(#gradX)" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
      <line 
        x1={padding} y1={padding + actualSize} 
        x2={padding + actualSize} y2={padding} 
        stroke="url(#gradX)" 
        strokeWidth={strokeWidth} 
        strokeLinecap="round"
      />
    </svg>
  );
};

export default XIcon;
