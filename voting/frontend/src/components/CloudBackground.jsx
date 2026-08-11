import React from 'react';

const CloudBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col z-0">
      {/* Sun Glow */}
      <div className="absolute top-12 right-24 w-72 h-72 rounded-full bg-yellow-100 opacity-30 blur-3xl pointer-events-none"></div>

      {/* Floating Clouds */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Fast Cloud */}
        <div className="absolute top-[10%] left-[-15%] w-60 opacity-60 animate-cloud-fast">
          <svg viewBox="0 0 100 40" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20, 20 a 15,15 0 0,1 22,-5 a 12,12 0 0,1 22,0 a 12,12 0 0,1 22,5 a 10,10 0 0,1 -4,15 C 70,35 15,35 15,30 a 10,10 0 0,1 5,-10 z" />
          </svg>
        </div>

        {/* Medium Cloud 1 */}
        <div className="absolute top-[35%] left-[-20%] w-80 opacity-70 animate-cloud-medium">
          <svg viewBox="0 0 100 40" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20, 20 a 15,15 0 0,1 22,-5 a 12,12 0 0,1 22,0 a 12,12 0 0,1 22,5 a 10,10 0 0,1 -4,15 C 70,35 15,35 15,30 a 10,10 0 0,1 5,-10 z" />
          </svg>
        </div>

        {/* Slow Large Cloud */}
        <div className="absolute top-[60%] left-[-30%] w-96 opacity-50 animate-cloud-slow">
          <svg viewBox="0 0 100 40" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20, 20 a 15,15 0 0,1 22,-5 a 12,12 0 0,1 22,0 a 12,12 0 0,1 22,5 a 10,10 0 0,1 -4,15 C 70,35 15,35 15,30 a 10,10 0 0,1 5,-10 z" />
          </svg>
        </div>

        {/* Fast Cloud 2 */}
        <div className="absolute top-[80%] left-[-10%] w-48 opacity-40 animate-cloud-fast" style={{ animationDelay: '-25s' }}>
          <svg viewBox="0 0 100 40" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20, 20 a 15,15 0 0,1 22,-5 a 12,12 0 0,1 22,0 a 12,12 0 0,1 22,5 a 10,10 0 0,1 -4,15 C 70,35 15,35 15,30 a 10,10 0 0,1 5,-10 z" />
          </svg>
        </div>

        {/* Medium Cloud 2 */}
        <div className="absolute top-[18%] left-[-25%] w-72 opacity-65 animate-cloud-medium" style={{ animationDelay: '-40s' }}>
          <svg viewBox="0 0 100 40" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
            <path d="M 20, 20 a 15,15 0 0,1 22,-5 a 12,12 0 0,1 22,0 a 12,12 0 0,1 22,5 a 10,10 0 0,1 -4,15 C 70,35 15,35 15,30 a 10,10 0 0,1 5,-10 z" />
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full flex-grow flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default CloudBackground;
