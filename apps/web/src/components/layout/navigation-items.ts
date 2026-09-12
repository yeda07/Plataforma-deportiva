import type { LucideIcon } from "lucide-react";
import { Compass, Home, Radio, Trophy, UserRound } from "lucide-react";

export type NavigationItem = Readonly<{
  href: string;
  icon: LucideIcon;
  label: string;
}>;

export const bottomNavigationItems = [
  { href: "/", icon: Home, label: "Inicio" },
  { href: "/explore", icon: Compass, label: "Explorar" },
  { href: "/live", icon: Radio, label: "En vivo" },
  { href: "/ranking", icon: Trophy, label: "Ranking" },
  { href: "/profile", icon: UserRound, label: "Perfil" }
] as const satisfies readonly NavigationItem[];

export const sportsNavigationItems = [
  { href: "/matches", label: "Todos" },
  { href: "/matches?sport=football", label: "Fútbol" },
  { href: "/matches?sport=basketball", label: "Baloncesto" },
  { href: "/matches?sport=tennis", label: "Tenis" },
  { href: "/matches?sport=esports", label: "eSports" },
  { href: "/matches?sport=chess", label: "Ajedrez" },
  { href: "/events", label: "Eventos" }
] as const;
