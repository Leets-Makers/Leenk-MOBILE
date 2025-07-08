export type NotificationType =
  | 'FEED_TAG'
  | 'NEW_FEED'
  | 'FEED_FIRST_REACTION'
  | 'FEED_REACTION_COUNT';

export interface NotificationContent {
  title: string;
  body: string;
}

export interface Notification {
  id: string;
  userId: number;
  notificationType: NotificationType;
  isRead: boolean;
  content: NotificationContent;
  updateDate: string;
}
