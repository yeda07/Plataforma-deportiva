"use client";

import { useSyncExternalStore } from "react";

const simulatedStates = [
  "loading",
  "loaded",
  "empty",
  "error",
  "offline",
  "unauthorized",
  "forbidden"
] as const;

export type SimulatedInterfaceState = (typeof simulatedStates)[number];
type RenderableSimulatedInterfaceState = Exclude<SimulatedInterfaceState, "loaded">;

export function useInterfaceStateSimulation(): RenderableSimulatedInterfaceState | null {
  return useSyncExternalStore(subscribeToUrlChanges, getSnapshot, getServerSnapshot);
}

function isSimulatedInterfaceState(value: string | null): value is SimulatedInterfaceState {
  return value !== null && simulatedStates.includes(value as SimulatedInterfaceState);
}

function subscribeToUrlChanges(onStoreChange: () => void): () => void {
  if (process.env.NODE_ENV === "production") {
    return () => undefined;
  }

  window.addEventListener("popstate", onStoreChange);

  return () => {
    window.removeEventListener("popstate", onStoreChange);
  };
}

function getSnapshot(): RenderableSimulatedInterfaceState | null {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const state = new URLSearchParams(window.location.search).get("uiState");

  if (!isSimulatedInterfaceState(state) || state === "loaded") {
    return null;
  }

  return state;
}

function getServerSnapshot(): RenderableSimulatedInterfaceState | null {
  return null;
}
