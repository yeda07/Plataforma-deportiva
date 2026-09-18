"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ComponentType } from "react";
import { CalendarDays, Crown, Gamepad2, Goal, Trophy } from "lucide-react";
import { sportsNavigationItems } from "./navigation-items";

type SportIconProps = Readonly<{
  className?: string;
}>;

type SportNavigationMeta = Readonly<{
  icon: ComponentType<SportIconProps>;
  sport: string | undefined;
}>;

const sportsNavigationMetaByHref = {
  "/matches": { icon: Trophy, sport: undefined },
  "/matches?sport=football": { icon: Goal, sport: "football" },
  "/matches?sport=basketball": { icon: BasketballIcon, sport: "basketball" },
  "/matches?sport=tennis": { icon: TennisIcon, sport: "tennis" },
  "/matches?sport=esports": { icon: Gamepad2, sport: "esports" },
  "/matches?sport=chess": { icon: Crown, sport: "chess" },
  "/events": { icon: CalendarDays, sport: undefined }
} as const satisfies Record<(typeof sportsNavigationItems)[number]["href"], SportNavigationMeta>;

export function SportsNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSport = searchParams.get("sport");

  return (
    <nav
      aria-label="Deportes"
      className="sticky top-16 z-30 border-b border-border/80 bg-background/90 shadow-xs backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl overflow-x-auto px-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-4 md:px-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
        <div className="flex min-h-12 flex-nowrap items-center gap-2 py-1.5 lg:min-h-14 lg:justify-start">
          {sportsNavigationItems.map((item) => {
            const meta = sportsNavigationMetaByHref[item.href];
            const Icon = meta.icon;
            const isActive = getIsActiveSportItem({
              activeSport,
              href: item.href,
              pathname,
              sport: meta.sport
            });

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={getSportsNavigationItemClass(isActive)}
                href={item.href}
                key={item.href}
              >
                <span className={getSportsNavigationIconShellClass(isActive)}>
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function getIsActiveSportItem({
  activeSport,
  href,
  pathname,
  sport
}: Readonly<{
  activeSport: string | null;
  href: string;
  pathname: string;
  sport: string | undefined;
}>): boolean {
  if (href === "/events") {
    return pathname === "/events";
  }

  if (sport) {
    return pathname === "/matches" && activeSport === sport;
  }

  return pathname === "/matches" && !activeSport;
}

function getSportsNavigationItemClass(isActive: boolean): string {
  const baseClass =
    "inline-flex min-h-9 shrink-0 items-center gap-2 rounded-xl border px-3 text-caption font-extrabold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-10 sm:px-3.5";
  const activeClass =
    "border-transparent bg-gradient-button text-primary-foreground shadow-card hover:-translate-y-0.5 hover:shadow-card-hover";
  const inactiveClass =
    "border-border bg-surface text-muted-foreground shadow-xs hover:-translate-y-0.5 hover:border-primary-200 hover:bg-card-hover hover:text-foreground hover:shadow-card";

  return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
}

function getSportsNavigationIconShellClass(isActive: boolean): string {
  const baseClass =
    "inline-flex size-6 shrink-0 items-center justify-center rounded-lg transition-colors duration-200";
  const activeClass = "bg-white/18 text-white";
  const inactiveClass = "bg-primary-50 text-primary dark:bg-primary-100/35 dark:text-primary-400";

  return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
}

function BasketballIcon({ className }: SportIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex size-4 items-center justify-center overflow-hidden rounded-full border-2 border-current ${className ?? ""}`}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
      <span className="absolute -left-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-current" />
      <span className="absolute -right-1 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-current" />
    </span>
  );
}

function TennisIcon({ className }: SportIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex size-4 items-center justify-center overflow-hidden rounded-full border-2 border-current ${className ?? ""}`}
    >
      <span className="absolute left-1/2 top-1/2 h-5 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current" />
    </span>
  );
}
