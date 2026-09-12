import Link from "next/link";
import { sportsNavigationItems } from "./navigation-items";

export function SportsNavigation() {
  return (
    <nav
      aria-label="Deportes"
      className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur"
    >
      <div className="mx-auto max-w-7xl overflow-x-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex min-h-12 items-center gap-2">
          {sportsNavigationItems.map((item) => (
            <Link
              className="inline-flex min-h-9 shrink-0 items-center rounded-md border border-border bg-surface px-3 text-caption font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
