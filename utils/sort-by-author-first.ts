// utils/sortByAuthorFirst.ts

import { FeedConnectedUser, FeedReactedUser } from '@/types/feed';

type AuthorType = FeedConnectedUser | FeedReactedUser;

export const sortByAuthorFirst = (list: AuthorType[]): AuthorType[] => {
  return [...list].sort((a, b) => {
    const aIsAuthor = 'isAuthor' in a && a.isAuthor;
    const bIsAuthor = 'isAuthor' in b && b.isAuthor;
    if (aIsAuthor && !bIsAuthor) return -1;
    if (!aIsAuthor && bIsAuthor) return 1;
    return 0;
  });
};
