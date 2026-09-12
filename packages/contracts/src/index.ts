export type Identifier = `${string}-${string}-${string}-${string}-${string}`;
export type Slug = string;
export type IsoDateTime = string;

export type ExternalProviderRef = Readonly<{
  externalId?: string;
  provider?: string;
}>;

export type UserRole = "USER" | "MODERATOR" | "ADMIN";

export type User = Readonly<{
  id: Identifier;
  email: string;
  username: string;
  role: UserRole;
  profileId?: Identifier;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}>;

export type Profile = Readonly<{
  id: Identifier;
  userId: Identifier;
  displayName: string;
  slug: Slug;
  avatarUrl?: string;
  bio?: string;
  points: number;
  achievementsCount: number;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}>;

export type Sport = Readonly<
  ExternalProviderRef & {
    id: Identifier;
    slug: Slug;
    name: string;
  }
>;

export type Team = Readonly<
  ExternalProviderRef & {
    id: Identifier;
    slug: Slug;
    sportId: Identifier;
    name: string;
    shortName?: string;
    logoUrl?: string;
    country?: string;
  }
>;

export type Player = Readonly<
  ExternalProviderRef & {
    id: Identifier;
    slug: Slug;
    teamId?: Identifier;
    sportId: Identifier;
    name: string;
    position?: string;
    avatarUrl?: string;
    country?: string;
  }
>;

export type Competition = Readonly<
  ExternalProviderRef & {
    id: Identifier;
    slug: Slug;
    sportId: Identifier;
    name: string;
    country?: string;
    logoUrl?: string;
  }
>;

export type Season = Readonly<
  ExternalProviderRef & {
    id: Identifier;
    slug: Slug;
    competitionId: Identifier;
    name: string;
    startsAt: IsoDateTime;
    endsAt?: IsoDateTime;
    isActive: boolean;
  }
>;

export type MatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "HALFTIME"
  | "FINISHED"
  | "POSTPONED"
  | "CANCELLED";

export type MatchScore = Readonly<{
  home: number;
  away: number;
}>;

export type MatchVenue = Readonly<{
  name: string;
  city?: string;
  country?: string;
}>;

export type MatchStatistics = Readonly<{
  possessionHomePercent?: number;
  possessionAwayPercent?: number;
  shotsHome?: number;
  shotsAway?: number;
  shotsOnTargetHome?: number;
  shotsOnTargetAway?: number;
  cornersHome?: number;
  cornersAway?: number;
  foulsHome?: number;
  foulsAway?: number;
}>;

export type MatchEventType =
  | "GOAL"
  | "YELLOW_CARD"
  | "RED_CARD"
  | "SUBSTITUTION"
  | "PERIOD_START"
  | "PERIOD_END"
  | "OTHER";

export type MatchEvent = Readonly<{
  id: Identifier;
  matchId: Identifier;
  type: MatchEventType;
  minute?: number;
  teamId?: Identifier;
  playerId?: Identifier;
  description?: string;
  occurredAt: IsoDateTime;
}>;

export type Match = Readonly<
  ExternalProviderRef & {
    id: Identifier;
    slug: Slug;
    sport: Sport;
    competition: Competition;
    homeTeam: Team;
    awayTeam: Team;
    status: MatchStatus;
    startTime: IsoDateTime;
    score: MatchScore;
    venue?: MatchVenue;
    statistics?: MatchStatistics;
    events: readonly MatchEvent[];
  }
>;

export type PredictionOption = "HOME_WIN" | "DRAW" | "AWAY_WIN" | "OVER" | "UNDER" | "CUSTOM";

export type PredictionStatus = "PENDING" | "LOCKED" | "WON" | "LOST" | "VOID";

export type Prediction = Readonly<{
  id: Identifier;
  userId: Identifier;
  matchId: Identifier;
  selectedOption: PredictionOption;
  possiblePoints: number;
  earnedPoints: number;
  status: PredictionStatus;
  createdAt: IsoDateTime;
}>;

export type Ranking = Readonly<{
  id: Identifier;
  slug: Slug;
  name: string;
  scope: "GLOBAL" | "SPORT" | "COMPETITION" | "SEASON" | "COMMUNITY";
  sportId?: Identifier;
  competitionId?: Identifier;
  seasonId?: Identifier;
  startsAt?: IsoDateTime;
  endsAt?: IsoDateTime;
  entries: readonly RankingEntry[];
}>;

export type RankingEntry = Readonly<{
  id: Identifier;
  rankingId: Identifier;
  userId: Identifier;
  profile: Profile;
  position: number;
  points: number;
  predictionsCount: number;
  achievementsCount: number;
}>;

export type Achievement = Readonly<{
  id: Identifier;
  slug: Slug;
  name: string;
  description: string;
  iconUrl?: string;
  pointsReward: number;
  unlockedAt?: IsoDateTime;
}>;

export type NotificationType =
  | "MATCH_STARTED"
  | "SCORE_CHANGED"
  | "PREDICTION_RESULT"
  | "RANKING_CHANGED"
  | "ACHIEVEMENT_UNLOCKED"
  | "SYSTEM";

export type Notification = Readonly<{
  id: Identifier;
  userId: Identifier;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: IsoDateTime;
}>;

export type VotingOption = Readonly<{
  id: Identifier;
  votingId: Identifier;
  label: string;
  votesCount: number;
}>;

export type Voting = Readonly<{
  id: Identifier;
  slug: Slug;
  title: string;
  description?: string;
  matchId?: Identifier;
  competitionId?: Identifier;
  options: readonly VotingOption[];
  startsAt: IsoDateTime;
  endsAt?: IsoDateTime;
  isActive: boolean;
}>;

export const exampleSport = {
  id: "018f6f08-5f98-7b64-9c5a-11e65775f0a1",
  slug: "football",
  name: "Futbol"
} as const satisfies Sport;

export const examplePrediction = {
  id: "018f6f08-5f98-7b64-9c5a-11e65775f0a2",
  userId: "018f6f08-5f98-7b64-9c5a-11e65775f0a3",
  matchId: "018f6f08-5f98-7b64-9c5a-11e65775f0a4",
  selectedOption: "HOME_WIN",
  possiblePoints: 120,
  earnedPoints: 0,
  status: "PENDING",
  createdAt: "2026-09-10T12:00:00.000Z"
} as const satisfies Prediction;
