import React from 'react';

const RobotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width="24" 
    height="24"
  >
    {/* Corrected path data: "v робот8a2" changed to "v8a2" */}
    <path d="M12 2a2 2 0 00-2 2v2H8a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zm0 4h.01M12 8a4 4 0 110 8 4 4 0 010-8zm-6 8a2 2 0 100 4 2 2 0 000-4zm12 0a2 2 0 100 4 2 2 0 000-4zM8 5h8v1H8V5z" />
    <path d="M7 10.5A1.5 1.5 0 018.5 9h7a1.5 1.5 0 010 3h-7A1.5 1.5 0 017 10.5zM9 14a1 1 0 011-1h4a1 1 0 110 2H10a1 1 0 01-1-1z" />
  </svg>
);

export default RobotIcon;