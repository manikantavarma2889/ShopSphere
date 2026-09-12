import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  placeholder?: string;
  suffixIcon?: React.ReactNode;
  prefixIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>({
  type = 'text',
  placeholder,
  suffixIcon,
  prefixIcon,
  ...props
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-lg border-border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
export type { InputProps };