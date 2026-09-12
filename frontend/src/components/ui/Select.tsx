import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  label: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ placeholder, children, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className={`relative w-full ${props.className || ''}`}>
        <div className="w-full rounded-lg border border-border px-3 py-2 text-sm">
          {placeholder}
        </div>

        <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-lg border border-border bg-white shadow-lg z-10">
          {React.Children.count(children) === 0 ? (
            <div className="p-4 text-muted">No options</div>
          ) : (
            children
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, label, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={`rounded-md px-3 py-2 cursor-pointer select-none hover:bg-primary/10 ${props.className || ''}`}
        onClick={(event) => {
          onClick?.(event);
        }}
        data-value={value}
      >
        {label}
      </div>
    );
  }
);

SelectItem.displayName = 'Select.Item';

const SelectWithItem = Object.assign(Select, { Item: SelectItem });

export { SelectWithItem as Select };
export type { SelectProps, SelectOption, SelectItemProps };