import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/class-name";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string;
  label?: string;
};

export function Input({ className, errorMessage, id, label, ...props }: InputProps) {
  const inputId = id ?? props.name;
  const errorId = errorMessage && inputId ? `${inputId}-error` : undefined;

  return (
    <label className="grid gap-2 text-label text-foreground" htmlFor={inputId}>
      {label ? <span>{label}</span> : null}
      <input
        aria-describedby={errorId}
        aria-invalid={Boolean(errorMessage)}
        className={cn(
          "min-h-11 w-full rounded-md border border-input bg-surface px-3 text-body text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55",
          className
        )}
        id={inputId}
        {...props}
      />
      {errorMessage ? (
        <span className="text-caption text-error" id={errorId}>
          {errorMessage}
        </span>
      ) : null}
    </label>
  );
}
