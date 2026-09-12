import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/class-name";

export type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export function SearchInput({ className, label, ...props }: SearchInputProps) {
  return (
    <label className="grid gap-2 text-label text-foreground">
      <span>{label}</span>
      <span className="relative block">
        <span
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          /
        </span>
        <input
          className={cn(
            "min-h-11 w-full rounded-md border border-input bg-surface px-9 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55",
            className
          )}
          type="search"
          {...props}
        />
      </span>
    </label>
  );
}
