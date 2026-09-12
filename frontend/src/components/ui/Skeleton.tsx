import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({
  className = 'h-64 w-full rounded-lg bg-border/50',
}) => {
  return (
    <div className={className} />
  );
};

export default Skeleton;