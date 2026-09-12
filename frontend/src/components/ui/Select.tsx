import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  placeholder?: string;
  onValueChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>({
  placeholder,
  onValueChange,
  ...props
}) {
  return (
    <div {...props} className="relative w-full">
      {/* Placeholder/selected value display */}
      {placeholder && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted pointer-events-none">
          {placeholder}
        </div>
      )}

      {/* Selected value */}
      <div
        className="
          w-full rounded-lg border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        "
      >
        {/* Click to open dropdown */}
        <div onClick={() => {}} className="cursor-pointer select-none">
          {placeholder}
        </div>
      </div>

      {/* Dropdown options */}
      <div
        className="
          absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-lg border-border bg-white shadow-lg
          z-10
        "
      >
        {/* No options message */}
        {props.children?.length === 0 && (
          <div className="p-4 text-muted">No options</div>
        )}

        {/* Options */}
        {React.Children.toArray(props.children as React.ReactNode).map(
          (child) => child
        )}
      </div>
    </div>
  );
});

Select.displayName = 'Select';

// Option component
Select.Item = React.forwardRef<HTMLDivElement, { value: string; label: string }>({
  value,
  label,
  ...props
}) => {
  return (
    <div
      className="
        rounded-md px-3 py-2 cursor-pointer select-none
        hover:bg-primary/10
      "
      onClick={() => {
        props.onValueChange?.(value);
      }}
    >
      {label}
    </div>
  );
});

Select.Item.displayName = 'Select.Item';

export { Select };
export type { SelectProps, SelectOption };