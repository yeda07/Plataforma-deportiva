import type { Identifier, Notification, NotificationType } from "@competencias-platform/contracts";
import { developmentUserId } from "@/config/session";
import type {
  NotificationStreamListener,
  NotificationStreamService,
  NotificationStreamSubscription
} from "./notification-stream.service";

const intervalMs = 9000;

const notificationTemplates = [
  {
    message: "Capital FC acaba de iniciar su partido.",
    title: "Partido en vivo",
    type: "MATCH_STARTED"
  },
  {
    message: "El marcador cambió en Liga Andina.",
    title: "Marcador actualizado",
    type: "SCORE_CHANGED"
  },
  {
    message: "Tu predicción gratuita ya tiene resultado.",
    title: "Predicción resuelta",
    type: "PREDICTION_RESULT"
  },
  {
    message: "Subiste posiciones en la tabla semanal.",
    title: "Ranking actualizado",
    type: "RANKING_CHANGED"
  },
  {
    message: "Desbloqueaste una nueva insignia de comunidad.",
    title: "Logro desbloqueado",
    type: "ACHIEVEMENT_UNLOCKED"
  }
] as const satisfies readonly {
  message: string;
  title: string;
  type: NotificationType;
}[];

function createNotification(templateIndex: number): Notification {
  const template = notificationTemplates[templateIndex % notificationTemplates.length];

  if (!template) {
    throw new Error("Missing notification template");
  }

  return {
    id: crypto.randomUUID() as Identifier,
    userId: developmentUserId,
    type: template.type,
    title: template.title,
    message: template.message,
    isRead: false,
    createdAt: new Date().toISOString()
  };
}

export class MockNotificationStreamService implements NotificationStreamService {
  subscribe(listener: NotificationStreamListener): NotificationStreamSubscription {
    let tick = 0;
    const intervalId = window.setInterval(() => {
      listener({ notification: createNotification(tick) });
      tick += 1;
    }, intervalMs);

    return {
      unsubscribe: () => {
        window.clearInterval(intervalId);
      }
    };
  }
}
