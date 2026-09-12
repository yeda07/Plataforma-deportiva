import type { HTMLAttributes } from "react";
import { cn } from "../lib/class-name";

export type StatusTone = "live" | "success" | "warning" | "error" | "muted";

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  label: string;
  tone?: StatusTone;
};

const statusClassName: Record<StatusTone, string> = {
  live: "bg-live",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  muted: "bg-muted-foreground"
};

export function StatusIndicator({
  className,
  label,
  tone = "muted",
  ...props
}: StatusIndicatorProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-caption", className)} {...props}>
      <span aria-hidden="true" className={cn("size-2.5 rounded-full", statusClassName[tone])} />
      {label}
    </span>
  );
}
