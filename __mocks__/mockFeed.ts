// utils/mock/feed.ts
import { faker } from '@faker-js/faker';
import { FeedItem } from '@/types/feed';

export const generateMockFeeds = (count: number = 10): FeedItem[] => {
  return Array.from({ length: count }, (_, i) => {
    const randomSeed = faker.string.uuid(); // seed용
    return {
      feedId: i + 1,
      author: {
        userId: faker.number.int({ min: 1, max: 1000 }),
        name: faker.person.fullName(),
        profileImage: `https://picsum.photos/seed/profile-${randomSeed}/100/100`,
      },
      thumbNail: `https://picsum.photos/seed/thumb-${randomSeed}/300/400`,
      totalReactionCount: faker.number.int({ min: 1, max: 9999 }),
    };
  });
};
