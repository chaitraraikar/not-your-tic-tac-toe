
import React from 'react';

const ControllerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width="24" 
    height="24"
  >
    <path d="M19.501 6.001A4.501 4.501 0 0015 3.001H9a4.5 4.5 0 00-4.5 4.501v3.759c-.858.273-1.5.988-1.5 1.876v1.5c0 .888.642 1.603 1.5 1.876v3.759A4.501 4.501 0 009 21.001h6a4.501 4.501 0 004.5-4.501V9.736c.858-.273 1.5-.988 1.5-1.876v-1.5c0-.888-.642-1.603-1.5-1.876V6.001zM6 7.501A1.5 1.5 0 017.5 6.001h1.876a1.5 1.5 0 011.494 1.316l.006.185.001 1.5H7.501v-1.5zm9 0A1.5 1.5 0 0116.5 6.001H18a1.5 1.5 0 011.5 1.5v1.5h-3.376L15.001 7.5zM6 16.501a1.5 1.5 0 011.5 1.5h1.876L9.38 19.5H7.5v-1.501a1.5 1.5 0 01-1.5-1.5zm9 0a1.5 1.5 0 011.5 1.5v1.5h-1.876l-1.124-1.5H15a1.5 1.5 0 010-3z"/>
    <path d="M12 8.251a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zm0 5.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z"/>
    <path d="M9.376 11.251a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm3.75 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z"/>
  </svg>
);

export default ControllerIcon;
