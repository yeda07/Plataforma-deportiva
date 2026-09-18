import type { HTMLAttributes } from "react";
import { cn } from "../lib/class-name";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-gradient-to-r from-muted via-surface-subtle to-muted", className)}
      role="status"
      {...props}
    />
  );
}
