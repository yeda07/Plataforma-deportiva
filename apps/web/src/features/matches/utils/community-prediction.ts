import type { Match } from "@competencias-platform/contracts";

export function getCommunityPredictionPercent(match: Match): number {
  const seed = match.id
    .replaceAll("-", "")
    .slice(-4)
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return 52 + (seed % 39);
}
