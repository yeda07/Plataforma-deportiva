export type RepositoryResult<TData> =
  | Readonly<{
      status: "success";
      data: TData;
    }>
  | Readonly<{
      status: "error";
      message: string;
    }>;

export { MockMatchRepository } from "./mock-match.repository";
export { MockNotificationRepository } from "./mock-notification.repository";
export { MockPredictionRepository } from "./mock-prediction.repository";
export { MockRankingRepository } from "./mock-ranking.repository";
export type { MatchFilters, MatchRepository } from "./match.repository";
export type { NotificationRepository } from "./notification.repository";
export type { PredictionRepository, SavePredictionInput } from "./prediction.repository";
export type { RankingRepository } from "./ranking.repository";
