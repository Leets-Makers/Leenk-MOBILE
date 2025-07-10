interface FeedFirstReaction {
  title: string;
  body: string;
  userId: number;
  name: string;
}

interface FeedReactionCount {
  title: string;
  body: string;
  reactionCount: number;
}

interface NotificationContent {
  title: string | null;
  body: string | null;
  feedId?: number;
  feedFirstReactions?: FeedFirstReaction[];
  feedReactionCounts?: FeedReactionCount[];
  authorUserId?: number;
  authorName?: string;
}

type NotificationType =
  | 'FEED_FIRST_REACTION'
  | 'FEED_REACTION_COUNT'
  | 'NEW_FEED'
  | 'FEED_TAG'
  | string;

interface Notification {
  id: string;
  userId: number;
  notificationType: NotificationType;
  isRead: boolean;
  content: NotificationContent;
  updateDate: string;
}

interface GetNotificationsResponse {
  code: number;
  message: string;
  data: {
    notificationResponses: Notification[];
  };
}
type ModalData = FeedReactionCount | FeedFirstReaction;

export type {
  GetNotificationsResponse,
  Notification,
  NotificationContent,
  FeedFirstReaction,
  NotificationType,
  ModalData,
};
