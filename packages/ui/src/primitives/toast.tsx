import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/class-name";

export type ToastTone = "success" | "warning" | "error" | "info";

export type ToastProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  title: string;
  tone?: ToastTone;
};

const toastClassName: Record<ToastTone, string> = {
  success: "border-success/40",
  warning: "border-warning/40",
  error: "border-error/40",
  info: "border-primary/40"
};

export function Toast({ children, className, title, tone = "info", ...props }: ToastProps) {
  return (
    <div
      className={cn(
        "rounded-md border bg-card p-3 text-card-foreground shadow-md",
        toastClassName[tone],
        className
      )}
      role="status"
      {...props}
    >
      <p className="text-label">{title}</p>
      <div className="mt-1 text-caption text-muted-foreground">{children}</div>
    </div>
  );
}
