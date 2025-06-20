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
