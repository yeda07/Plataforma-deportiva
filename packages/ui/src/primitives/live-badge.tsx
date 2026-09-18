import type { HTMLAttributes } from "react";
import { cn } from "../lib/class-name";

export type LiveBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  label?: string;
};

export function LiveBadge({ className, label = "En vivo", ...props }: LiveBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center gap-2 rounded-md bg-gradient-live px-2.5 text-caption font-extrabold uppercase tracking-[0.04em] text-live-foreground shadow-sm",
        className
      )}
      {...props}
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-live-foreground ring-4 ring-live-foreground/20" />
      {label}
    </span>
  );
}
