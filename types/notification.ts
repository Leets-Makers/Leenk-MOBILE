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

interface LeenkDetail {
  title: string;
  body: string;
  place: string;
  date: string;
}

interface LeenkParticipants {
  title: string;
  body: string;
  name: string;
}

interface NotificationContent {
  title: string | null;
  body: string | null;
  feedId?: number;
  leenkId?: number;
  feedFirstReactions?: FeedFirstReaction[];
  feedReactionCounts?: FeedReactionCount[];
  leenkParticipants?: LeenkParticipants[];
  leenkDetail?: LeenkDetail[];
  authorUserId?: number;
  authorName?: string;
}

type NotificationType =
  | 'FEED_FIRST_REACTION'
  | 'FEED_REACTION_COUNT'
  | 'NEW_FEED'
  | 'FEED_TAG'
  | 'NEW_LEENK'
  | 'NEW_LEENK_JOIN'
  | 'LEENK_DETAIL'
  | 'LEENK_CLOSE'
  | 'LEENK_NEW_PARTICIPANTS'
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
type ModalData = FeedReactionCount | FeedFirstReaction | LeenkParticipants;

export type {
  GetNotificationsResponse,
  Notification,
  NotificationContent,
  FeedFirstReaction,
  NotificationType,
  ModalData,
};
