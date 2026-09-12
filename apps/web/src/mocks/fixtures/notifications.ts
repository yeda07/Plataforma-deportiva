import type { Notification, NotificationType } from "@competencias-platform/contracts";
import { createMockId } from "./ids";
import { users } from "./users";

type NotificationInput = Readonly<{
  idNumber: number;
  userIndex: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}>;

function createNotification(input: NotificationInput): Notification {
  const user = users[input.userIndex];

  if (!user) {
    throw new Error("Notification fixture references a missing user");
  }

  return {
    id: createMockId(input.idNumber),
    userId: user.id,
    type: input.type,
    title: input.title,
    message: input.message,
    isRead: input.isRead,
    createdAt: input.createdAt
  };
}

export const notifications = ([
  { idNumber: 1001, userIndex: 0, type: "MATCH_STARTED", title: "Partido en vivo", message: "Capital FC vs Norte Unido acaba de comenzar.", isRead: false, createdAt: "2026-09-10T19:00:00.000Z" },
  { idNumber: 1002, userIndex: 1, type: "PREDICTION_RESULT", title: "Prediccion resuelta", message: "Tu prediccion sumo puntos virtuales.", isRead: false, createdAt: "2026-09-10T18:40:00.000Z" },
  { idNumber: 1003, userIndex: 2, type: "RANKING_CHANGED", title: "Subiste en el ranking", message: "Ahora estas dentro del top 3 semanal.", isRead: true, createdAt: "2026-09-10T18:10:00.000Z" },
  { idNumber: 1004, userIndex: 3, type: "ACHIEVEMENT_UNLOCKED", title: "Nuevo logro", message: "Desbloqueaste Racha de cinco.", isRead: false, createdAt: "2026-09-10T17:55:00.000Z" },
  { idNumber: 1005, userIndex: 4, type: "SYSTEM", title: "Predicciones gratuitas", message: "Recuerda que la plataforma no maneja dinero real.", isRead: true, createdAt: "2026-09-10T17:30:00.000Z" },
  { idNumber: 1006, userIndex: 5, type: "SCORE_CHANGED", title: "Marcador actualizado", message: "Meteoros BC vs Toros del Sur cambio de marcador.", isRead: false, createdAt: "2026-09-10T16:20:00.000Z" },
  { idNumber: 1007, userIndex: 6, type: "MATCH_STARTED", title: "Evento activo", message: "Caribe Stars ya esta jugando.", isRead: true, createdAt: "2026-09-10T15:50:00.000Z" },
  { idNumber: 1008, userIndex: 7, type: "RANKING_CHANGED", title: "Nuevo puesto", message: "Tu comunidad gano posiciones.", isRead: false, createdAt: "2026-09-10T15:20:00.000Z" },
  { idNumber: 1009, userIndex: 8, type: "PREDICTION_RESULT", title: "Sin puntos esta vez", message: "Tu prediccion quedo marcada como perdida.", isRead: true, createdAt: "2026-09-10T14:10:00.000Z" },
  { idNumber: 1010, userIndex: 9, type: "ACHIEVEMENT_UNLOCKED", title: "Insignia conseguida", message: "Ganaste el logro Voz comunidad.", isRead: false, createdAt: "2026-09-10T13:45:00.000Z" },
  { idNumber: 1011, userIndex: 0, type: "SYSTEM", title: "Nueva competencia", message: "La Superliga Atlantica ya esta disponible.", isRead: true, createdAt: "2026-09-10T13:00:00.000Z" },
  { idNumber: 1012, userIndex: 1, type: "MATCH_STARTED", title: "Baloncesto en vivo", message: "Halcones Basket esta en accion.", isRead: false, createdAt: "2026-09-10T12:40:00.000Z" },
  { idNumber: 1013, userIndex: 2, type: "SCORE_CHANGED", title: "Marcador final", message: "Tu prediccion ya puede resolverse.", isRead: true, createdAt: "2026-09-10T12:10:00.000Z" },
  { idNumber: 1014, userIndex: 3, type: "RANKING_CHANGED", title: "Ranking actualizado", message: "Se recalcularon los puntos semanales.", isRead: false, createdAt: "2026-09-10T11:45:00.000Z" },
  { idNumber: 1015, userIndex: 4, type: "SYSTEM", title: "Comunidad activa", message: "Hay nuevas votaciones deportivas disponibles.", isRead: true, createdAt: "2026-09-10T11:15:00.000Z" }
] as const satisfies readonly NotificationInput[]).map(createNotification) satisfies readonly Notification[];
