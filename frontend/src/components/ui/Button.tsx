import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    asChild = false,
    ...props
  }, ref) => {
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-background text-foreground hover:bg-gray-100',
      ghost: 'hover:bg-gray-100',
      destructive: 'bg-destructive text-destructive-foreground',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm rounded',
      md: 'h-10 px-4 text-base rounded',
      lg: 'h-12 px-6 text-lg rounded',
    };

    const baseClassName = `
      inline-flex items-center justify-center
      rounded-md
      transition-colors
      ${variants[variant]}
      ${sizes[size]}
      ${className || ''}
    `;

    return asChild ? (
      <button ref={ref} {...props} className={baseClassName} />
    ) : (
      <button ref={ref} className={baseClassName} {...props} />
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };