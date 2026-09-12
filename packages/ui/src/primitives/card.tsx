import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/class-name";

export type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <section
      className={cn("rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm", className)}
      {...props}
    >
      {children}
    </section>
  );
}
