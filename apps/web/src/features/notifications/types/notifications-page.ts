import type { Notification } from "@competencias-platform/contracts";

export type NotificationsPageData = Readonly<{
  notifications: readonly Notification[];
  unreadCount: number;
}>;

export type NotificationFeedSnapshot = Readonly<{
  notifications: readonly Notification[];
}>;
