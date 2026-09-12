import type { Competition } from "@competencias-platform/contracts";
import { createMockId } from "./ids";
import { sports } from "./sports";

export const competitions = [
  { id: createMockId(101), slug: "liga-andina", sportId: sports[0].id, name: "Liga Andina", country: "Colombia", externalId: "la-2026", provider: "mock-sports" },
  { id: createMockId(102), slug: "copa-sur", sportId: sports[0].id, name: "Copa Sur", country: "Argentina", externalId: "cs-2026", provider: "mock-sports" },
  { id: createMockId(103), slug: "basket-pro-series", sportId: sports[1].id, name: "Basket Pro Series", country: "Mexico", externalId: "bps-2026", provider: "mock-sports" },
  { id: createMockId(104), slug: "open-pacifico", sportId: sports[2].id, name: "Open Pacifico", country: "Chile", externalId: "op-2026", provider: "mock-sports" },
  { id: createMockId(105), slug: "voleibol-elite", sportId: sports[3].id, name: "Voleibol Elite", country: "Peru", externalId: "ve-2026", provider: "mock-sports" },
  { id: createMockId(106), slug: "serie-caribe", sportId: sports[4].id, name: "Serie Caribe", country: "Republica Dominicana", externalId: "sc-2026", provider: "mock-sports" },
  { id: createMockId(107), slug: "tour-montana", sportId: sports[5].id, name: "Tour Montana", country: "Colombia", externalId: "tm-2026", provider: "mock-sports" },
  { id: createMockId(108), slug: "superliga-atlantica", sportId: sports[0].id, name: "Superliga Atlantica", country: "Brasil", externalId: "sa-2026", provider: "mock-sports" }
] as const satisfies readonly Competition[];
