import {
  authFeature,
  competitionsFeature,
  exploreFeature,
  matchesFeature,
  notificationsFeature,
  predictionsFeature,
  profileFeature,
  rankingsFeature
} from "@features";

export const enabledFeatures = [
  authFeature,
  matchesFeature,
  competitionsFeature,
  predictionsFeature,
  rankingsFeature,
  exploreFeature,
  profileFeature,
  notificationsFeature
] as const;
