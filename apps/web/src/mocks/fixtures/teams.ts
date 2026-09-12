import type { Team } from "@competencias-platform/contracts";
import { createMockId } from "./ids";
import { sports } from "./sports";

export const teams = [
  { id: createMockId(201), slug: "capital-fc", sportId: sports[0].id, name: "Capital FC", shortName: "CAP", country: "Colombia", externalId: "team-cap", provider: "mock-sports" },
  { id: createMockId(202), slug: "norte-unido", sportId: sports[0].id, name: "Norte Unido", shortName: "NOR", country: "Colombia", externalId: "team-nor", provider: "mock-sports" },
  { id: createMockId(203), slug: "titanes-fc", sportId: sports[0].id, name: "Titanes FC", shortName: "TIT", country: "Colombia", externalId: "team-tit", provider: "mock-sports" },
  { id: createMockId(204), slug: "aurora-club", sportId: sports[0].id, name: "Aurora Club", shortName: "AUR", country: "Ecuador", externalId: "team-aur", provider: "mock-sports" },
  { id: createMockId(205), slug: "puerto-real", sportId: sports[0].id, name: "Puerto Real", shortName: "PUR", country: "Peru", externalId: "team-pur", provider: "mock-sports" },
  { id: createMockId(206), slug: "montana-verde", sportId: sports[0].id, name: "Montana Verde", shortName: "MON", country: "Chile", externalId: "team-mon", provider: "mock-sports" },
  { id: createMockId(207), slug: "halcones-basket", sportId: sports[1].id, name: "Halcones Basket", shortName: "HAL", country: "Mexico", externalId: "team-hal", provider: "mock-sports" },
  { id: createMockId(208), slug: "toros-del-sur", sportId: sports[1].id, name: "Toros del Sur", shortName: "TDS", country: "Mexico", externalId: "team-tds", provider: "mock-sports" },
  { id: createMockId(209), slug: "meteoros-bc", sportId: sports[1].id, name: "Meteoros BC", shortName: "MET", country: "Colombia", externalId: "team-met", provider: "mock-sports" },
  { id: createMockId(210), slug: "condores-basket", sportId: sports[1].id, name: "Condores Basket", shortName: "CON", country: "Argentina", externalId: "team-con", provider: "mock-sports" },
  { id: createMockId(211), slug: "valle-racket", sportId: sports[2].id, name: "Valle Racket", shortName: "VAL", country: "Chile", externalId: "team-val", provider: "mock-sports" },
  { id: createMockId(212), slug: "costa-tennis", sportId: sports[2].id, name: "Costa Tennis", shortName: "COS", country: "Uruguay", externalId: "team-cos", provider: "mock-sports" },
  { id: createMockId(213), slug: "andes-voley", sportId: sports[3].id, name: "Andes Voley", shortName: "AND", country: "Peru", externalId: "team-and", provider: "mock-sports" },
  { id: createMockId(214), slug: "playa-voley", sportId: sports[3].id, name: "Playa Voley", shortName: "PLA", country: "Colombia", externalId: "team-pla", provider: "mock-sports" },
  { id: createMockId(215), slug: "caribe-stars", sportId: sports[4].id, name: "Caribe Stars", shortName: "CAR", country: "Republica Dominicana", externalId: "team-car", provider: "mock-sports" },
  { id: createMockId(216), slug: "diamantes-bc", sportId: sports[4].id, name: "Diamantes BC", shortName: "DIA", country: "Venezuela", externalId: "team-dia", provider: "mock-sports" },
  { id: createMockId(217), slug: "ruta-norte", sportId: sports[5].id, name: "Ruta Norte", shortName: "RUN", country: "Colombia", externalId: "team-run", provider: "mock-sports" },
  { id: createMockId(218), slug: "pedal-andino", sportId: sports[5].id, name: "Pedal Andino", shortName: "PED", country: "Ecuador", externalId: "team-ped", provider: "mock-sports" },
  { id: createMockId(219), slug: "llanos-fc", sportId: sports[0].id, name: "Llanos FC", shortName: "LLA", country: "Colombia", externalId: "team-lla", provider: "mock-sports" },
  { id: createMockId(220), slug: "bahia-club", sportId: sports[0].id, name: "Bahia Club", shortName: "BAH", country: "Brasil", externalId: "team-bah", provider: "mock-sports" }
] as const satisfies readonly Team[];
