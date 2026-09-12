import type { Identifier, Notification } from "@competencias-platform/contracts";
import { notifications } from "@/mocks";
import type { NotificationRepository } from "./notification.repository";

let notificationStore: Notification[] = [...notifications];

function sortNotifications(items: readonly Notification[]): readonly Notification[] {
  return [...items].sort((firstNotification, secondNotification) =>
    secondNotification.createdAt.localeCompare(firstNotification.createdAt)
  );
}

export class MockNotificationRepository implements NotificationRepository {
  findByUserId(userId: Identifier): Promise<readonly Notification[]> {
    return Promise.resolve(sortNotifications(notificationStore.filter((notification) => notification.userId === userId)));
  }

  findUnreadByUserId(userId: Identifier): Promise<readonly Notification[]> {
    return Promise.resolve(
      sortNotifications(notificationStore.filter((notification) => notification.userId === userId && !notification.isRead))
    );
  }

  markAllAsRead(userId: Identifier): Promise<readonly Notification[]> {
    notificationStore = notificationStore.map((notification) =>
      notification.userId === userId ? { ...notification, isRead: true } : notification
    );

    return this.findByUserId(userId);
  }

  markAsRead(notificationId: Identifier, userId: Identifier): Promise<Notification | null> {
    const existingNotification = notificationStore.find(
      (notification) => notification.id === notificationId && notification.userId === userId
    );

    if (!existingNotification) {
      return Promise.resolve(null);
    }

    const readNotification = { ...existingNotification, isRead: true };

    notificationStore = notificationStore.map((notification) =>
      notification.id === notificationId ? readNotification : notification
    );

    return Promise.resolve(readNotification);
  }

  save(notification: Notification): Promise<Notification> {
    notificationStore = [notification, ...notificationStore];

    return Promise.resolve(notification);
  }
}
