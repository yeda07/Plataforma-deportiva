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
    <div aria-label={ariaLabel} className="flex gap-1 overflow-x-auto rounded-md bg-muted p-1" role="tablist">
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
        "min-h-9 whitespace-nowrap rounded-sm px-3 text-caption font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-selected:bg-surface aria-selected:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
