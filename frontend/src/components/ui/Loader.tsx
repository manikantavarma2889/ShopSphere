import React from 'react';

const Loader: React.FC = () => {
  return (
    <svg
      className="h-6 w-6 text-current animate-spin"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
    </svg>
  );
};

Loader.displayName = 'Loader';

export { Loader };