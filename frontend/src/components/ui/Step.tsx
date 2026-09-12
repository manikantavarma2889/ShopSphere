import React from 'react';

interface StepProps {
  step: number;
  total: number;
  className?: string;
  children: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ className, children }) => {
  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      {children}
    </div>
  );
};

Step.displayName = 'Step';

export { Step };
export type { StepProps };
