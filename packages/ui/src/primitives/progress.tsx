import type { HTMLAttributes } from "react";
import { cn } from "../lib/class-name";

export type ProgressTone = "primary" | "live" | "success" | "warning" | "info";

export type ProgressProps = HTMLAttributes<HTMLDivElement> & {
  label?: string;
  max?: number;
  tone?: ProgressTone;
  value: number;
};

const toneClassName: Record<ProgressTone, string> = {
  info: "bg-info",
  live: "bg-gradient-live",
  primary: "bg-gradient-button",
  success: "bg-success",
  warning: "bg-warning"
};

export function Progress({
  className,
  label,
  max = 100,
  tone = "primary",
  value,
  ...props
}: ProgressProps) {
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = max > 0 ? (normalizedValue / max) * 100 : 0;

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      {label ? (
        <div className="flex items-center justify-between gap-3 text-caption text-muted-foreground">
          <span>{label}</span>
          <span className="font-semibold text-foreground">{Math.round(percentage).toString()}%</span>
        </div>
      ) : null}
      <div
        aria-label={label}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={normalizedValue}
        className="h-2.5 overflow-hidden rounded-full bg-surface-subtle shadow-inner"
        role="progressbar"
      >
        <div
          className={cn("h-full rounded-full transition-all duration-200", toneClassName[tone])}
          style={{ width: `${percentage.toString()}%` }}
        />
      </div>
    </div>
  );
}
