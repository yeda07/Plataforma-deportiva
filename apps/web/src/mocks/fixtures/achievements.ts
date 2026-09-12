import type { Achievement } from "@competencias-platform/contracts";
import { createMockId } from "./ids";

export const achievements = [
  { id: createMockId(601), slug: "primer-pronostico", name: "Primer pronostico", description: "Registro su primera prediccion gratuita.", pointsReward: 50, unlockedAt: "2026-09-02T13:00:00.000Z" },
  { id: createMockId(602), slug: "racha-de-cinco", name: "Racha de cinco", description: "Acerto cinco predicciones seguidas.", pointsReward: 250 },
  { id: createMockId(603), slug: "ojo-en-vivo", name: "Ojo en vivo", description: "Participo durante un partido en vivo.", pointsReward: 120 },
  { id: createMockId(604), slug: "top-diez", name: "Top diez", description: "Ingreso al top diez semanal.", pointsReward: 300 },
  { id: createMockId(605), slug: "explorador", name: "Explorador", description: "Siguio tres deportes diferentes.", pointsReward: 180 },
  { id: createMockId(606), slug: "final-perfecto", name: "Final perfecto", description: "Acerto el resultado de un partido finalizado.", pointsReward: 400 },
  { id: createMockId(607), slug: "voz-comunidad", name: "Voz comunidad", description: "Participo en una votacion comunitaria.", pointsReward: 90 },
  { id: createMockId(608), slug: "analista-premium", name: "Analista premium", description: "Alcanzo una semana con alto rendimiento.", pointsReward: 500 }
] as const satisfies readonly Achievement[];
