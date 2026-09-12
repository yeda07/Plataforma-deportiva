import type { Notification } from "@competencias-platform/contracts";

export type NotificationStreamSnapshot = Readonly<{
  notification: Notification;
}>;

export type NotificationStreamListener = (snapshot: NotificationStreamSnapshot) => void;

export type NotificationStreamSubscription = Readonly<{
  unsubscribe: () => void;
}>;

export type NotificationStreamService = Readonly<{
  subscribe: (listener: NotificationStreamListener) => NotificationStreamSubscription;
}>;
