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

interface NewLeenkParticipantDetails {
  participantId: number;
  participantName: string;
}

interface NotificationContent {
  title: string | null;
  body: string | null;
  feedId?: number;
  leenkId?: number;
  feedFirstReactions?: FeedFirstReaction[];
  feedReactionCounts?: FeedReactionCount[];
  newLeenkParticipantDetails?: NewLeenkParticipantDetails[];
  leenkDetail?: LeenkDetail[];
  authorUserId?: number;
  authorName?: string;
  leenkTitle?: string;
  newParticipantId?: number;
  newParticipantName?: string;
  placeName?: string;
  startTime?: string;
}

type NotificationType =
  | 'FEED_FIRST_REACTION'
  | 'FEED_REACTION_COUNT'
  | 'NEW_FEED'
  | 'FEED_TAG'
  | 'NEW_LEENK'
  | 'NEW_LEENK_PARTICIPANT'
  | 'LEENK_JOIN_COMPLETED'
  | 'LEENK_STARTING_SOON'
  | 'LEENK_CLOSED'
  | 'KICKED_FROM_LEENK'
  | 'LEENK_FINISHED'
  | 'LEENK_STARTED_HOST_REMINDER'
  | string;

interface Notification {
  id: string;
  userId: number;
  path: string;
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
type ModalData =
  | FeedReactionCount
  | FeedFirstReaction
  | NewLeenkParticipantDetails;

export type {
  GetNotificationsResponse,
  Notification,
  NotificationContent,
  FeedFirstReaction,
  FeedReactionCount,
  NotificationType,
  NewLeenkParticipantDetails,
  ModalData,
};
