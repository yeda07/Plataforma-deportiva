import type { Achievement, Prediction, Profile, Sport } from "@competencias-platform/contracts";

export type ProfileEditValues = Readonly<{
  bio: string;
  city: string;
  displayName: string;
  favoriteSportSlug: string;
}>;

export type ProfileStats = Readonly<{
  accuracyPercent: number;
  bestStreak: number;
  correctPredictions: number;
  currentStreak: number;
  predictionsCount: number;
  rankingPosition: number;
  totalPoints: number;
}>;

export type ProfileActivityItem = Readonly<{
  description: string;
  id: string;
  title: string;
  type: "achievement" | "prediction";
}>;

export type ProfilePageData = Readonly<{
  achievements: readonly Achievement[];
  activity: readonly ProfileActivityItem[];
  city: string;
  favoriteSport: Sport;
  history: readonly Prediction[];
  profile: Profile;
  sports: readonly Sport[];
  stats: ProfileStats;
}>;
