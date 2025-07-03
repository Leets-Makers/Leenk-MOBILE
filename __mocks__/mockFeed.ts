// utils/mock/feed.ts
import { faker } from '@faker-js/faker';
import {
  FeedConnectedUser,
  FeedDetail,
  FeedItem,
  FeedReactedUser,
} from '@/types/feed';

export const generateMockFeeds = (count: number = 30): FeedItem[] => {
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

export const generateMockFeedDetail = (): FeedDetail => {
  const feedId = faker.number.int({ min: 1, max: 999 });
  const authorSeed = faker.string.uuid();
  const authorName = faker.person.firstName();
  const linkedUserCount = faker.number.int({ min: 1, max: 20 });

  return {
    feedId,
    author: {
      userId: faker.number.int({ min: 1, max: 1000 }),
      name: authorName,
      profileImage: `https://picsum.photos/seed/author-${authorSeed}/100/100`,
    },
    description:
      '맛있는거 먹었지롱ㅇㅇㅇㅇ ㅇ ㅇ ㅇ ㅇㅇㅇㅇㅇㅇ부럽지 부러우면 하트눌르삼',
    totalReactionCount: faker.number.int({ min: 1, max: 5000 }),
    createdAt: faker.date.recent().toISOString(),
    media: Array.from({ length: 2 }, (_, idx) => ({
      position: idx + 1,
      mediaUrl: `https://picsum.photos/seed/media-${faker.string.uuid()}/600/800`,
      mediaType: 'IMAGE',
    })),
    linkedUserCount,
    linkedUser: Array.from({ length: linkedUserCount }, (_, idx) => {
      const isAuthor = idx === 0;
      return {
        userId: faker.number.int({ min: 1, max: 1000 }),
        name: isAuthor ? authorName : faker.person.firstName(),
        isAuthor,
        profileImage: isAuthor
          ? `https://picsum.photos/seed/author-${authorSeed}/100/100`
          : `https://picsum.photos/seed/friend-${faker.string.uuid()}/100/100`,
      };
    }),
  };
};

export const generateMockUsers = (count: number = 10): FeedConnectedUser[] => {
  return Array.from({ length: count }, (_, i) => ({
    userId: i + 1,
    name: faker.person.firstName(),
    profileImage: `https://picsum.photos/seed/user-${faker.string.uuid()}/100/100`,
  }));
};

export const generateMockReactedUsers = (
  count: number = 10,
): FeedReactedUser[] => {
  return Array.from({ length: count }, (_, i) => ({
    userId: i + 1,
    name: faker.person.firstName(),
    profileImage: `https://picsum.photos/seed/reacted-${faker.string.uuid()}/100/100`,
    reactionCount: faker.number.int({ min: 1, max: 9999 }),
  }));
};
