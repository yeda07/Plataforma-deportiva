import type { Identifier, Notification } from "@competencias-platform/contracts";
import { MockNotificationRepository } from "@/repositories";
import type { NotificationRepository } from "@/repositories";
import { MockNotificationStreamService } from "./mock-notification-stream.service";
import type {
  NotificationStreamListener,
  NotificationStreamService,
  NotificationStreamSubscription
} from "./notification-stream.service";
import type { NotificationsPageData } from "../types/notifications-page";

export type NotificationServiceDependencies = Readonly<{
  notificationRepository?: NotificationRepository;
  notificationStreamService?: NotificationStreamService;
}>;

export class NotificationService {
  private readonly notificationRepository: NotificationRepository;
  private readonly notificationStreamService: NotificationStreamService;

  constructor(dependencies: NotificationServiceDependencies = {}) {
    this.notificationRepository =
      dependencies.notificationRepository ?? new MockNotificationRepository();
    this.notificationStreamService =
      dependencies.notificationStreamService ?? new MockNotificationStreamService();
  }

  async getNotifications(userId: Identifier): Promise<NotificationsPageData> {
    const notifications = await this.notificationRepository.findByUserId(userId);

    return {
      notifications,
      unreadCount: notifications.filter((notification) => !notification.isRead).length
    };
  }

  async markAsRead(notificationId: Identifier, userId: Identifier): Promise<NotificationsPageData> {
    await this.notificationRepository.markAsRead(notificationId, userId);
    return this.getNotifications(userId);
  }

  async markAllAsRead(userId: Identifier): Promise<NotificationsPageData> {
    const notifications = await this.notificationRepository.markAllAsRead(userId);

    return {
      notifications,
      unreadCount: 0
    };
  }

  async saveIncomingNotification(notification: Notification): Promise<Notification> {
    return this.notificationRepository.save(notification);
  }

  subscribe(listener: NotificationStreamListener): NotificationStreamSubscription {
    return this.notificationStreamService.subscribe(listener);
  }
}

export const notificationService = new NotificationService();
