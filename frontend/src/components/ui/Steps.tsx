import React from 'react';

interface StepProps {
  className?: string;
  children: React.ReactNode;
}

const Steps: React.FC<StepProps> = ({ className, children }) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className || ''}`}>
      {children}
    </div>
  );
};

Steps.displayName = 'Steps';

export { Steps };
export type { StepProps };