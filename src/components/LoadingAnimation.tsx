import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="loading-animation">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingAnimation;