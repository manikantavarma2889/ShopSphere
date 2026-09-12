import React from 'react';

interface StepProps {
  step: number;
  total: number;
  className?: string;
  children: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ step, total, className, children }) => {
  const isCompleted = step <= total;
  const isCurrent = step === total + 1;

  return (
    <div className={`flex items-center justify-between ${
      className || ''
    }`}
    {...children.props}
  );
};

Step.displayName = 'Step';

export { Step };
export type { StepProps };