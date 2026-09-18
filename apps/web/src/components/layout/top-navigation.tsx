"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Moon, Search, Sun, Trophy } from "lucide-react";
import type { Profile } from "@competencias-platform/contracts";
import { Avatar } from "@competencias-platform/ui";
import { developmentUserId } from "@/config/session";
import { profileService } from "@/features/profile/services/profile.service";

type ThemePreference = "light" | "dark";

export function TopNavigation() {
  const [theme, setTheme] = useState<ThemePreference>("light");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = () => {
      void profileService.getCurrentProfile(developmentUserId)
        .then((data) => {
          if (isMounted) {
            setProfile(data?.profile ?? null);
          }
        })
        .catch(() => {
          if (isMounted) {
            setProfile(null);
          }
        });
    };

    loadProfile();
    window.addEventListener("profile-updated", loadProfile);

    return () => {
      isMounted = false;
      window.removeEventListener("profile-updated", loadProfile);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemePreference = theme === "dark" ? "light" : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    setTheme(nextTheme);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 shadow-xs backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 sm:gap-3 sm:px-4 md:px-6 lg:gap-5 lg:px-8">
        <Link
          aria-label="Ir al inicio"
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl text-foreground transition-all duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          href="/"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-card transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-card-hover sm:size-11">
            <Trophy className="size-5" aria-hidden="true" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-title font-extrabold leading-tight tracking-normal">
              Competencias
            </span>
            <span className="hidden truncate text-caption font-medium leading-tight text-muted-foreground xl:block">
              Vive el deporte, suma puntos
            </span>
          </span>
        </Link>

        <form action="/explore" className="min-w-0 justify-self-stretch" role="search">
          <label className="relative block">
            <span className="sr-only">Buscar equipos, competiciones y eventos</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-4"
            />
            <input
              className="h-10 w-full min-w-0 rounded-xl border border-border bg-surface/95 px-9 text-body-small font-medium text-foreground shadow-xs outline-none transition-all duration-200 placeholder:text-muted-foreground hover:border-primary-300 hover:bg-card focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 sm:h-11 sm:px-10 lg:pr-20"
              name="q"
              placeholder="Buscar equipos, competiciones, eventos..."
              type="search"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-surface-subtle px-2 py-0.5 text-[0.68rem] font-bold text-muted-foreground shadow-xs lg:inline-flex"
            >
              Ctrl K
            </span>
          </label>
        </form>

        <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-2">
          <Link
            aria-label="Notificaciones"
            className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-card-hover hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:size-11"
            href="/notifications"
            title="Notificaciones"
          >
            <Bell className="size-5" aria-hidden="true" />
            <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full border-2 border-background bg-live px-1 text-[0.65rem] font-extrabold leading-none text-white">
              3
            </span>
          </Link>
          <button
            aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
            className="hidden size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-foreground shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-card-hover hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:inline-flex"
            onClick={toggleTheme}
            title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            type="button"
          >
            {theme === "dark" ? (
              <Sun className="size-5" aria-hidden="true" />
            ) : (
              <Moon className="size-5" aria-hidden="true" />
            )}
          </button>
          <Link
            aria-label={profile ? `Ir al perfil de ${profile.displayName}` : "Ir al perfil"}
            className="group inline-flex min-w-0 shrink-0 items-center gap-2 rounded-full border border-transparent p-0.5 transition-all duration-200 hover:border-primary-200 hover:bg-card-hover hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:rounded-2xl lg:border-border lg:bg-surface lg:px-2 lg:py-1 lg:shadow-xs"
            href="/profile"
          >
            <Avatar
              className="size-9 sm:size-10"
              fallback={profile?.displayName ?? "Perfil"}
              {...(profile?.avatarUrl ? { imageSrc: profile.avatarUrl } : {})}
            />
            <span className="hidden min-w-0 xl:block">
              <span className="block truncate text-body-small font-extrabold leading-tight text-foreground">
                {profile?.displayName ?? "Perfil"}
              </span>
              <span className="block truncate text-caption font-semibold leading-tight text-muted-foreground">
                {profile ? `Nivel 12 · ${profile.points.toLocaleString("es-CO")} pts` : "Cargando perfil"}
              </span>
            </span>
            <ChevronDown
              className="hidden size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-y-0.5 lg:block"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
