import React from 'react';

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

const Separator: React.FC<SeparatorProps> = ({ className, ...props }) => {
  return <hr className={`my-4 border-border ${className || ''}`} {...props} />;
};

Separator.displayName = 'Separator';

export { Separator };
export type { SeparatorProps };
