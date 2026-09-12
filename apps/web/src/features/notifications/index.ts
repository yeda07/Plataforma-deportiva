export const notificationsFeature = {
  key: "notifications",
  label: "Notificaciones"
} as const;

export { NotificationsPage } from "./components/notifications-page";
export { NotificationService, notificationService } from "./services/notification.service";
export type {
  NotificationStreamListener,
  NotificationStreamService,
  NotificationStreamSnapshot,
  NotificationStreamSubscription
} from "./services/notification-stream.service";
export type { NotificationFeedSnapshot, NotificationsPageData } from "./types/notifications-page";
