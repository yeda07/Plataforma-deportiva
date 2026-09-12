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
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  accent: "bg-accent text-accent-foreground hover:bg-accent/90",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  danger: "bg-error text-error-foreground hover:bg-error/90"
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
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-55",
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
