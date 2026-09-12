import type { Ranking } from "@competencias-platform/contracts";
import { createMockId } from "./ids";
import { profiles } from "./users";

const rankingId = createMockId(901);

export const ranking = {
  id: rankingId,
  slug: "ranking-global-semanal",
  name: "Ranking global semanal",
  scope: "GLOBAL",
  startsAt: "2026-09-07T00:00:00.000Z",
  endsAt: "2026-09-13T23:59:59.000Z",
  entries: profiles.map((profile, index) => ({
    id: createMockId(910 + index),
    rankingId,
    userId: profile.userId,
    profile,
    position: index + 1,
    points: profile.points,
    predictionsCount: 24 - index,
    achievementsCount: profile.achievementsCount
  }))
} satisfies Ranking;
