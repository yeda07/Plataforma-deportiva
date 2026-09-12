import type { Identifier, Match, MatchEvent } from "@competencias-platform/contracts";
import { MockMatchRepository } from "@/repositories";
import type { LiveUpdateErrorListener } from "./live-update.service";
import type {
  LiveUpdateListener,
  LiveUpdateService,
  LiveUpdateSubscription
} from "./live-update.service";

const updateIntervalMs = 3500;

function createEventId(matchId: Identifier, tick: number): Identifier {
  return `${matchId.slice(0, 24)}${tick.toString().padStart(12, "0")}` as Identifier;
}

function getLatestMinute(match: Match): number {
  const minutes = match.events
    .map((event) => event.minute)
    .filter((minute): minute is number => typeof minute === "number");

  if (minutes.length === 0) {
    return match.status === "HALFTIME" ? 45 : 12;
  }

  return Math.max(...minutes);
}

function shouldScore(matchIndex: number, tick: number): boolean {
  return (matchIndex + tick) % 5 === 0;
}

function createTickEvent(match: Match, nextMinute: number, tick: number): MatchEvent {
  return {
    id: createEventId(match.id, tick),
    matchId: match.id,
    type: "OTHER",
    minute: nextMinute,
    description: "Actualizacion simulada en vivo",
    occurredAt: new Date().toISOString()
  };
}

function updateLiveMatch(match: Match, matchIndex: number, tick: number): Match {
  if (match.status === "HALFTIME") {
    return match;
  }

  const nextMinute = Math.min(getLatestMinute(match) + 1, 90);
  const scoresHome = shouldScore(matchIndex, tick) && tick % 2 === 0;
  const scoresAway = shouldScore(matchIndex, tick) && tick % 2 === 1;

  return {
    ...match,
    score: {
      home: match.score.home + (scoresHome ? 1 : 0),
      away: match.score.away + (scoresAway ? 1 : 0)
    },
    events: [...match.events, createTickEvent(match, nextMinute, tick)]
  };
}

export class MockLiveUpdateService implements LiveUpdateService {
  private readonly matchRepository = new MockMatchRepository();

  subscribe(
    listener: LiveUpdateListener,
    onError?: LiveUpdateErrorListener
  ): LiveUpdateSubscription {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let tick = 0;
    let currentMatches: readonly Match[] = [];
    let isDisposed = false;

    void this.matchRepository
      .findLive()
      .then((matches) => {
        if (isDisposed) {
          return;
        }

        currentMatches = matches;
        listener({ matches: currentMatches });

        intervalId = setInterval(() => {
          tick += 1;
          currentMatches = currentMatches.map((match, matchIndex) =>
            updateLiveMatch(match, matchIndex, tick)
          );
          listener({ matches: currentMatches });
        }, updateIntervalMs);
      })
      .catch((error: unknown) => {
        if (isDisposed || !onError) {
          return;
        }

        onError(error instanceof Error ? error : new Error("Live update failed"));
      });

    return {
      unsubscribe: () => {
        isDisposed = true;

        if (intervalId) {
          clearInterval(intervalId);
        }
      }
    };
  }
}
