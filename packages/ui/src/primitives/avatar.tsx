import type { HTMLAttributes } from "react";
import { cn } from "../lib/class-name";

export type AvatarProps = HTMLAttributes<HTMLDivElement> & {
  fallback: string;
  imageAlt?: string;
  imageSrc?: string;
};

export function Avatar({ className, fallback, imageAlt = "", imageSrc, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-strong bg-gradient-brand text-label font-extrabold text-primary-foreground shadow-sm ring-2 ring-surface",
        className
      )}
      {...props}
    >
      {imageSrc ? (
        <img alt={imageAlt} className="size-full object-cover" src={imageSrc} />
      ) : (
        <span aria-hidden={fallback.length === 0}>{fallback.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  );
}
