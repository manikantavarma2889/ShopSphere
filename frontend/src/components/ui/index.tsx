import type { ReactNode } from 'react';

export { Button } from './Button';
export { Card } from './Card';
export { Input } from './Input';
export { Loader } from './Loader';
export { Select } from './Select';
export { Separator } from './Separator';
export { Sheet } from './Sheet';
export { default as Skeleton } from './Skeleton';
export { default as SkeletonCard } from './SkeletonCard';
export { Step } from './Step';
export { Steps } from './Steps';

export const Label = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);
