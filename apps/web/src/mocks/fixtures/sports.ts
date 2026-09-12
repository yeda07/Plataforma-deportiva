import type { Sport } from "@competencias-platform/contracts";
import { createMockId } from "./ids";

export const sports = [
  { id: createMockId(1), slug: "football", name: "Futbol", externalId: "fb", provider: "mock-sports" },
  { id: createMockId(2), slug: "basketball", name: "Baloncesto", externalId: "bk", provider: "mock-sports" },
  { id: createMockId(3), slug: "tennis", name: "Tenis", externalId: "tn", provider: "mock-sports" },
  { id: createMockId(4), slug: "volleyball", name: "Voleibol", externalId: "vb", provider: "mock-sports" },
  { id: createMockId(5), slug: "baseball", name: "Beisbol", externalId: "bb", provider: "mock-sports" },
  { id: createMockId(6), slug: "cycling", name: "Ciclismo", externalId: "cy", provider: "mock-sports" }
] as const satisfies readonly Sport[];
