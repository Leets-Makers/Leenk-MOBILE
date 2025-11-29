export interface Author {
  userId: number;
  name: string;
  thumbnail: string;
  isUserBirthdayToday: boolean;
}

export interface FeedItem {
  feedId: number;
  author: Author;
  thumbNail: string;
  totalReactionCount: number;
}

export interface Media {
  position: number;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
}

export interface FeedDetail {
  feedId: number;
  author: Author;
  description: string;
  totalReactionCount: number;
  createdAt: string;
  media: Media[];
  linkedUserCount: number;
  linkedUser: {
    userId: number;
    name: string;
    isAuthor: boolean;
    thumbnail?: string; // isAuthor = false일 경우 없을 수 있음
    isUserBirthdayToday: boolean;
  }[];
}

export interface FeedReactedUser {
  userId: number;
  name: string;
  thumbnail?: string;
  reactionCount: number;
  isUserBirthdayToday: boolean;
}

export interface FeedConnectedUser {
  userId: number;
  name: string;
  thumbnail?: string;
  isUserBirthdayToday: boolean;
}

// 피드 업로드
export interface UploadFeedPayload {
  description: string;
  media: Media[];
  userId?: number[];
}
