import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div className={`rounded-lg bg-white shadow-sm border-border ${className}`}>
      {children}
    </div>
  );
};

Card.displayName = 'Card';

export { Card };
export type { CardProps };