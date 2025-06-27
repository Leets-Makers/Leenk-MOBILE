export interface Author {
  userId: number;
  name: string;
  profileImage: string;
}

export interface FeedItem {
  feedId: number;
  author: Author;
  thumbNail: string;
  totalReactionCount: number;
}

export interface FeedDetail {
  feedId: number;
  author: Author;
  description: string;
  totalReactionCount: number;
  createdAt: string;
  media: {
    position: number;
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO';
  }[];
  linkedUserCount: number;
  linkedUser: {
    userId: number;
    name: string;
    isAuthor: boolean;
    profileImage?: string; // isAuthor = false일 경우 없을 수 있음
  }[];
}

export interface FeedReactedUser {
  userId: number;
  name: string;
  profileImage?: string;
  reactionCount: number;
}

export interface FeedConnectedUser {
  userId: number;
  name: string;
  profileImage?: string;
}
