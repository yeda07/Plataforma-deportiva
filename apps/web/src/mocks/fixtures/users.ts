import type { Profile, User } from "@competencias-platform/contracts";
import { createMockId } from "./ids";

const createdAt = "2026-09-01T10:00:00.000Z";

export const profiles = [
  { id: createMockId(401), userId: createMockId(501), displayName: "Capitan Andino", slug: "capitan-andino", points: 9820, achievementsCount: 12, createdAt, updatedAt: createdAt },
  { id: createMockId(402), userId: createMockId(502), displayName: "Gol Maestro", slug: "gol-maestro", points: 9410, achievementsCount: 10, createdAt, updatedAt: createdAt },
  { id: createMockId(403), userId: createMockId(503), displayName: "Cancha Pro", slug: "cancha-pro", points: 8990, achievementsCount: 9, createdAt, updatedAt: createdAt },
  { id: createMockId(404), userId: createMockId(504), displayName: "Ranking Norte", slug: "ranking-norte", points: 8605, achievementsCount: 8, createdAt, updatedAt: createdAt },
  { id: createMockId(405), userId: createMockId(505), displayName: "Puntos Libres", slug: "puntos-libres", points: 8210, achievementsCount: 7, createdAt, updatedAt: createdAt },
  { id: createMockId(406), userId: createMockId(506), displayName: "Vision Deportiva", slug: "vision-deportiva", points: 7925, achievementsCount: 7, createdAt, updatedAt: createdAt },
  { id: createMockId(407), userId: createMockId(507), displayName: "Finalista", slug: "finalista", points: 7550, achievementsCount: 6, createdAt, updatedAt: createdAt },
  { id: createMockId(408), userId: createMockId(508), displayName: "Tribuna Elite", slug: "tribuna-elite", points: 7310, achievementsCount: 6, createdAt, updatedAt: createdAt },
  { id: createMockId(409), userId: createMockId(509), displayName: "Marcador Vivo", slug: "marcador-vivo", points: 6980, achievementsCount: 5, createdAt, updatedAt: createdAt },
  { id: createMockId(410), userId: createMockId(510), displayName: "Comunidad FC", slug: "comunidad-fc", points: 6725, achievementsCount: 5, createdAt, updatedAt: createdAt }
] as const satisfies readonly Profile[];

export const users = profiles.map((profile, index) => ({
  id: profile.userId,
  email: `usuario${(index + 1).toString()}@competencias.local`,
  username: profile.slug,
  role: "USER",
  profileId: profile.id,
  createdAt,
  updatedAt: createdAt
})) satisfies readonly User[];
