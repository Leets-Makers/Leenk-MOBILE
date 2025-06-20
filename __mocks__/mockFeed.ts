// utils/mock/feed.ts
import { faker } from '@faker-js/faker';

export interface FeedItem {
  feedId: number;
  author: {
    userId: number;
    name: string;
    profileImage: string;
  };
  thumbNail: string;
  totalReactionCount: number;
}

export const generateMockFeeds = (count: number = 10): FeedItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    feedId: i + 1,
    author: {
      userId: faker.number.int({ min: 1, max: 1000 }),
      name: faker.person.fullName(),
      profileImage: faker.image.urlLoremFlickr({
        width: 100,
        height: 100,
        category: 'people',
      }),
    },
    thumbNail: faker.image.urlLoremFlickr({
      width: 300,
      height: 400,
      category: 'city',
    }),
    totalReactionCount: faker.number.int({ min: 1, max: 9999 }),
  }));
};
