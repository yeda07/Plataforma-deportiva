import type { SelectHTMLAttributes } from "react";
import { cn } from "../lib/class-name";

export type SelectOption = Readonly<{
  label: string;
  value: string;
}>;

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: readonly SelectOption[];
};

export function Select({ className, id, label, options, ...props }: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className="grid gap-2 text-label text-foreground" htmlFor={selectId}>
      <span>{label}</span>
      <select
        className={cn(
          "min-h-11 w-full rounded-md border border-input bg-surface px-3 text-body text-foreground outline-none transition-colors hover:border-primary/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55",
          className
        )}
        id={selectId}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
