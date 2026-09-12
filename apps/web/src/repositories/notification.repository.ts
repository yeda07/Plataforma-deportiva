import type { Identifier, Notification } from "@competencias-platform/contracts";

export type NotificationRepository = Readonly<{
  findByUserId: (userId: Identifier) => Promise<readonly Notification[]>;
  findUnreadByUserId: (userId: Identifier) => Promise<readonly Notification[]>;
  markAllAsRead: (userId: Identifier) => Promise<readonly Notification[]>;
  markAsRead: (notificationId: Identifier, userId: Identifier) => Promise<Notification | null>;
  save: (notification: Notification) => Promise<Notification>;
}>;
