import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/class-name";
import { Spinner } from "./spinner";

export type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  isLoading?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-gradient-button text-primary-foreground shadow-sm hover:shadow-card-hover active:scale-[0.98]",
  secondary:
    "border border-border-strong bg-surface-elevated text-foreground shadow-xs hover:border-primary/40 hover:bg-card-hover active:scale-[0.98]",
  accent: "bg-gradient-level text-accent-foreground shadow-sm hover:shadow-card-hover active:scale-[0.98]",
  ghost: "bg-transparent text-foreground hover:bg-primary-soft active:bg-primary/10",
  danger: "bg-error text-error-foreground shadow-sm hover:bg-error/90 active:scale-[0.98]"
};

const sizeClassName: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-caption",
  md: "min-h-11 px-4 text-label",
  lg: "min-h-12 px-6 text-label"
};

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled === true || isLoading;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:scale-100 disabled:opacity-55",
        variantClassName[variant],
        sizeClassName[size],
        className
      )}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {isLoading ? <Spinner aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}
