import type { ReactNode } from 'react';

interface StepProps {
  step: number;
  total: number;
  className?: string;
  children: ReactNode;
}

const Step = ({ className, children }: StepProps) => {
  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      {children}
    </div>
  );
};

Step.displayName = 'Step';

export { Step };
export type { StepProps };