import React from 'react';

interface SheetProps {
  className?: string;
  children: React.ReactNode;
}

const Sheet: React.FC<SheetProps> = ({ className, children }) => {
  return (
    <div className={`rounded-lg bg-white shadow-lg ${className}`}>
      {children}
    </div>
  );
};

Sheet.displayName = 'Sheet';

export { Sheet };
export type { SheetProps };