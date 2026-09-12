import type { Match } from "@competencias-platform/contracts";

export type LiveUpdateSnapshot = Readonly<{
  matches: readonly Match[];
}>;

export type LiveUpdateListener = (snapshot: LiveUpdateSnapshot) => void;

export type LiveUpdateErrorListener = (error: Error) => void;

export type LiveUpdateSubscription = Readonly<{
  unsubscribe: () => void;
}>;

export type LiveUpdateService = Readonly<{
  subscribe: (
    listener: LiveUpdateListener,
    onError?: LiveUpdateErrorListener
  ) => LiveUpdateSubscription;
}>;
