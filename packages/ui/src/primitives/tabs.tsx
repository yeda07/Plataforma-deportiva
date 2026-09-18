import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/class-name";

export type TabItem = Readonly<{
  label: string;
  value: string;
}>;

export type TabsProps = Readonly<{
  ariaLabel: string;
  items: readonly TabItem[];
  onValueChange?: (value: string) => void;
  value: string;
}>;

export function Tabs({ ariaLabel, items, onValueChange, value }: TabsProps) {
  return (
    <div
      aria-label={ariaLabel}
      className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-surface-subtle p-1 shadow-xs"
      role="tablist"
    >
      {items.map((item) => (
        <TabButton
          aria-selected={item.value === value}
          key={item.value}
          onClick={() => onValueChange?.(item.value)}
          role="tab"
          type="button"
        >
          {item.label}
        </TabButton>
      ))}
    </div>
  );
}

function TabButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "min-h-9 whitespace-nowrap rounded-md px-3 text-caption font-bold text-muted-foreground transition duration-200 hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] aria-selected:bg-gradient-button aria-selected:text-primary-foreground aria-selected:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
