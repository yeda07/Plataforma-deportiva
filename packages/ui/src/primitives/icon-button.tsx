import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/class-name";
import { Spinner } from "./spinner";

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  icon: ReactNode;
  label: string;
  isLoading?: boolean;
};

export function IconButton({
  className,
  disabled,
  icon,
  isLoading = false,
  label,
  type = "button",
  ...props
}: IconButtonProps) {
  const isDisabled = disabled === true || isLoading;

  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-55",
        className
      )}
      disabled={isDisabled}
      title={label}
      type={type}
      {...props}
    >
      {isLoading ? <Spinner aria-hidden="true" /> : icon}
    </button>
  );
}
