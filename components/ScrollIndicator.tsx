import React from 'react';

interface ScrollIndicatorProps {
  totalSections: number;
  activeSection: number;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ totalSections, activeSection }) => {
  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-2">
      {Array.from({ length: totalSections }).map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full ${
            index === activeSection ? 'bg-black' : 'bg-gray-400'
          }`}
        ></div>
      ))}
    </div>
  );
};

export default ScrollIndicator;

