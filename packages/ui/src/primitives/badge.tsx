import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/class-name";

export type BadgeTone = "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "muted";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneClassName: Record<BadgeTone, string> = {
  primary: "bg-primary/15 text-primary ring-primary/25",
  secondary: "bg-secondary/15 text-secondary ring-secondary/25",
  accent: "bg-accent/20 text-accent ring-accent/30",
  success: "bg-success/15 text-success ring-success/25",
  warning: "bg-warning/20 text-warning ring-warning/30",
  error: "bg-error/15 text-error ring-error/25",
  muted: "bg-muted text-muted-foreground ring-border"
};

export function Badge({ children, className, tone = "muted", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center rounded-sm px-2 text-caption font-semibold ring-1",
        toneClassName[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
