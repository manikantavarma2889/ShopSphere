import React from 'react';
import Skeleton from './Skeleton';

const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-lg bg-border/50 p-6">
      <Skeleton className="h-24 w-full mb-3" />
      <Skeleton className="h-10 w-60 mb-2" />
      <Skeleton className="h-6 w-80 mb-1" />
      <Skeleton className="h-6 w-50 mb-1" />
      <Skeleton className="h-5 w-70" />
    </div>
  );
};

export default SkeletonCard;