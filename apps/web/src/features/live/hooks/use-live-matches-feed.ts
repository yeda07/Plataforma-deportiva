"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MockLiveUpdateService } from "../services/mock-live-update.service";
import { groupLiveMatches } from "../services/live-page.service";
import type { LiveFeedState } from "../types/live-page-data";

const liveUpdateService = new MockLiveUpdateService();

function isBrowserOffline(): boolean {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

export function useLiveMatchesFeed(): LiveFeedState {
  const [isOnline, setIsOnline] = useState(() => !isBrowserOffline());
  const [state, setState] = useState<LiveFeedState>({ status: "loading" });
  const latestLoadedStateRef = useRef<Extract<LiveFeedState, { status: "loaded" }> | null>(null);

  useEffect(() => {
    if (!isOnline) {
      setState({
        matches: latestLoadedStateRef.current?.matches ?? [],
        status: "offline"
      });
      return;
    }

    setState(latestLoadedStateRef.current ?? { status: "loading" });

    const subscription = liveUpdateService.subscribe(
      (snapshot) => {
        if (snapshot.matches.length === 0) {
          setState({ status: "empty" });
          return;
        }

        const loadedState: Extract<LiveFeedState, { status: "loaded" }> = {
          groups: groupLiveMatches(snapshot.matches),
          matches: snapshot.matches,
          status: "loaded"
        };

        latestLoadedStateRef.current = loadedState;
        setState(loadedState);
      },
      () => {
        setState({
          message: "No pudimos iniciar la actualizacion de partidos en vivo.",
          status: "error"
        });
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [isOnline]);

  useEffect(() => {
    function handleOffline() {
      setIsOnline(false);
    }

    function handleOnline() {
      setIsOnline(true);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return useMemo(() => state, [state]);
}
