export interface Author {
  userId: number;
  name: string;
  profileImage: string;
}

export interface Feed {
  feedId: number;
  author: Author;
  thumbNail: string;
  totalReactionCount: number;
}
