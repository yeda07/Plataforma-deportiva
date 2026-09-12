import type { HTMLAttributes } from "react";
import { cn } from "../lib/class-name";

export type LiveBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  label?: string;
};

export function LiveBadge({ className, label = "En vivo", ...props }: LiveBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 items-center gap-2 rounded-sm bg-live px-2 text-caption font-bold uppercase text-live-foreground",
        className
      )}
      {...props}
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-live-foreground" />
      {label}
    </span>
  );
}
