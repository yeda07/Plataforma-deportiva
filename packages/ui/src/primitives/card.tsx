import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/class-name";

export type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-card p-4 text-card-foreground shadow-card transition duration-200",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
