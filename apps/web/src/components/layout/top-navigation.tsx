import Link from "next/link";
import { Bell, Search, Trophy } from "lucide-react";
import { Avatar } from "@competencias-platform/ui";

export function TopNavigation() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 px-3 sm:gap-4 sm:px-4 md:px-6 lg:px-8">
        <Link
          aria-label="Ir al inicio"
          className="inline-flex min-h-10 items-center gap-2 rounded-md text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
            <Trophy className="size-5" aria-hidden="true" />
          </span>
          <span className="hidden text-label font-bold sm:inline">Competencias</span>
        </Link>

        <form action="/explore" className="min-w-0" role="search">
          <label className="relative block">
            <span className="sr-only">Buscar</span>
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              className="h-10 w-full min-w-0 rounded-md border border-input bg-surface px-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
              name="q"
              placeholder="Buscar"
              type="search"
            />
          </label>
        </form>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            aria-label="Notificaciones"
            className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href="/notifications"
            title="Notificaciones"
          >
            <Bell className="size-5" aria-hidden="true" />
          </Link>
          <Link
            aria-label="Ir al perfil"
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/profile"
          >
            <Avatar className="size-10" fallback="CP" />
          </Link>
        </div>
      </div>
    </header>
  );
}
