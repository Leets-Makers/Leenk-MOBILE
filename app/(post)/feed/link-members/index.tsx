import { CustomButton, Header } from '@/components';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { ButtonText, CircleBadge, ContentWrapper } from '@/app/(post)/feed';
import SearchBar from '@/components/feed/SearchBar';
import { generateMockUsers } from '@/__mocks__/mockFeed';
import UserList from '@/components/feed/UserList';
import { useRouter } from 'expo-router';
import { FeedConnectedUser } from '@/types/feed';
import MemberBadgeList from '@/components/feed/MemberBadgeList';

export default function LinkMembersPage() {
  const router = useRouter();
  const mockUsers = generateMockUsers(20);
  const [selectedUsers, setSelectedUsers] = useState<FeedConnectedUser[]>([]);

  const handleToggleUser = (user: FeedConnectedUser) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.userId === user.userId)
        ? prev.filter((u) => u.userId !== user.userId)
        : [...prev, user],
    );
  };

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((u) => u.userId !== userId));
  };

  return (
    <ContentWrapper>
      <Header>함께 한 사람 추가</Header>
      <SearchBar />
      <MemberBadgeList members={selectedUsers} onRemove={handleRemoveUser} />

      <UserList
        users={mockUsers}
        selectedUsers={selectedUsers}
        onToggleUser={handleToggleUser}
      />
      <CustomButton
        variant="primary"
        size="lg"
        disabled={selectedUsers.length === 0}
        onPress={() => router.push('/(post)/feed/write')}
      >
        {selectedUsers.length > 0 && (
          <CircleBadge>
            <ButtonText>{selectedUsers.length}</ButtonText>
          </CircleBadge>
        )}
        다음
      </CustomButton>
    </ContentWrapper>
  );
}
