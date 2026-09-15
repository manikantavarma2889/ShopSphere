import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder?: string;
  suffixIcon?: React.ReactNode;
  prefixIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    type = 'text',
    placeholder,
    suffixIcon,
    prefixIcon,
    className,
    'aria-invalid': ariaInvalid,
    ...props
  }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        className={`w-full min-h-10 rounded-lg border border-border px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${ariaInvalid ? 'border-destructive' : ''} ${className || ''}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };