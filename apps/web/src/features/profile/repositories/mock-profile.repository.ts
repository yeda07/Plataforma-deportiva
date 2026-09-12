import type { Achievement, Identifier, Match, Prediction, Profile, Ranking, Sport } from "@competencias-platform/contracts";
import { developmentUserId } from "@/config/session";
import { achievements, matches, predictions, profiles, ranking, sports } from "@/mocks";
import type { ProfileRepository } from "./profile.repository";
import type { ProfileActivityItem, ProfileEditValues, ProfilePageData, ProfileStats } from "../types/profile-page";

type ProfilePreferences = Readonly<{
  city: string;
  favoriteSportSlug: string;
}>;

let profileStore: readonly Profile[] = profiles;
const achievementStore: readonly Achievement[] = achievements;
const matchStore: readonly Match[] = matches;
const predictionStore: readonly Prediction[] = predictions;
const rankingStore: Ranking = ranking;
const sportStore: readonly Sport[] = sports;
let preferenceStore = new Map<Identifier, ProfilePreferences>([
  [
    developmentUserId,
    {
      city: "Bogotá",
      favoriteSportSlug: "football"
    }
  ]
]);

function getCurrentStreak(userPredictions: readonly Prediction[]): number {
  let streak = 0;

  for (const prediction of userPredictions) {
    if (prediction.status === "WON") {
      streak += 1;
    } else if (prediction.status === "LOST") {
      break;
    }
  }

  return streak;
}

function getBestStreak(userPredictions: readonly Prediction[]): number {
  let bestStreak = 0;
  let currentStreak = 0;

  for (const prediction of userPredictions) {
    if (prediction.status === "WON") {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else if (prediction.status === "LOST") {
      currentStreak = 0;
    }
  }

  return bestStreak;
}

function buildStats(profile: Profile, userPredictions: readonly Prediction[]): ProfileStats {
  const resolvedPredictions = userPredictions.filter(
    (prediction) => prediction.status === "WON" || prediction.status === "LOST"
  );
  const correctPredictions = resolvedPredictions.filter((prediction) => prediction.status === "WON").length;
  const accuracyPercent =
    resolvedPredictions.length > 0 ? Math.round((correctPredictions / resolvedPredictions.length) * 100) : 0;
  const rankingEntry = rankingStore.entries.find((entry) => entry.userId === profile.userId);

  return {
    accuracyPercent,
    bestStreak: getBestStreak(userPredictions),
    correctPredictions,
    currentStreak: getCurrentStreak(userPredictions),
    predictionsCount: userPredictions.length,
    rankingPosition: rankingEntry?.position ?? 0,
    totalPoints: profile.points
  };
}

function getPredictionTitle(prediction: Prediction): string {
  const match = matchStore.find((item) => item.id === prediction.matchId);

  if (!match) {
    return "Predicción registrada";
  }

  return `${match.homeTeam.name} vs ${match.awayTeam.name}`;
}

function buildActivity(userPredictions: readonly Prediction[]): readonly ProfileActivityItem[] {
  const predictionItems = userPredictions.slice(0, 4).map((prediction) => ({
    description: `${prediction.possiblePoints.toString()} puntos potenciales`,
    id: `prediction-${prediction.id}`,
    title: getPredictionTitle(prediction),
    type: "prediction"
  })) satisfies readonly ProfileActivityItem[];
  const achievementItems = achievementStore.slice(0, 3).map((achievement) => ({
    description: achievement.description,
    id: `achievement-${achievement.id}`,
    title: achievement.name,
    type: "achievement"
  })) satisfies readonly ProfileActivityItem[];

  return [...predictionItems, ...achievementItems];
}

function getFavoriteSport(slug: string) {
  const fallbackSport = sportStore[0];

  if (!fallbackSport) {
    throw new Error("Missing sports fixtures");
  }

  return sportStore.find((sport) => sport.slug === slug) ?? fallbackSport;
}

function getUserPredictions(userId: Identifier): readonly Prediction[] {
  return predictionStore
    .filter((prediction) => prediction.userId === userId)
    .sort((firstPrediction, secondPrediction) =>
      secondPrediction.createdAt.localeCompare(firstPrediction.createdAt)
    );
}

function buildProfilePageData(profile: Profile, preferences: ProfilePreferences): ProfilePageData {
  const userPredictions = getUserPredictions(profile.userId);

  return {
    achievements: achievementStore,
    activity: buildActivity(userPredictions),
    city: preferences.city,
    favoriteSport: getFavoriteSport(preferences.favoriteSportSlug),
    history: userPredictions,
    profile,
    sports: sportStore,
    stats: buildStats(profile, userPredictions)
  };
}

export class MockProfileRepository implements ProfileRepository {
  findCurrent(userId: Identifier): Promise<ProfilePageData | null> {
    const profile = profileStore.find((item) => item.userId === userId);

    if (!profile) {
      return Promise.resolve(null);
    }

    const preferences = preferenceStore.get(userId) ?? {
      city: "Bogotá",
      favoriteSportSlug: "football"
    };

    return Promise.resolve(buildProfilePageData(profile, preferences));
  }

  updateCurrent(userId: Identifier, values: ProfileEditValues): Promise<ProfilePageData> {
    const profile = profileStore.find((item) => item.userId === userId);

    if (!profile) {
      return Promise.reject(new Error("Profile not found"));
    }

    const updatedProfile: Profile = {
      ...profile,
      bio: values.bio,
      displayName: values.displayName,
      updatedAt: new Date().toISOString()
    };

    profileStore = profileStore.map((item) => (item.userId === userId ? updatedProfile : item));
    preferenceStore = new Map(preferenceStore).set(userId, {
      city: values.city,
      favoriteSportSlug: values.favoriteSportSlug
    });

    return Promise.resolve(
      buildProfilePageData(updatedProfile, {
        city: values.city,
        favoriteSportSlug: values.favoriteSportSlug
      })
    );
  }
}
