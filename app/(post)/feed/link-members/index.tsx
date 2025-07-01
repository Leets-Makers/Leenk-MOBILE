import { CustomButton, Header } from '@/components';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { ButtonText, CircleBadge, ContentWrapper } from '../../feed';
import SearchBar from '@/components/feed/SearchBar';
import { generateMockUsers } from '@/__mocks__/mockFeed';
import UserList from '@/components/feed/UserList';
import { useRouter } from 'expo-router';

export default function LinkMembersPage() {
  const router = useRouter();
  const mockUsers = generateMockUsers(20);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  return (
    <ContentWrapper>
      <Header>함께 한 사람 추가 </Header>
      <SearchBar />

      <UserList
        users={mockUsers}
        selectedUserIds={selectedUserIds}
        setSelectedUserIds={setSelectedUserIds}
      />
      <CustomButton
        variant="primary"
        size="lg"
        disabled={selectedUserIds.length === 0}
        onPress={() => router.push('/(post)/feed/write')}
      >
        {selectedUserIds.length > 0 && (
          <CircleBadge>
            <ButtonText>{selectedUserIds.length}</ButtonText>
          </CircleBadge>
        )}
        다음
      </CustomButton>
    </ContentWrapper>
  );
}
