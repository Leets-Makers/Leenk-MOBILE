import { Header } from '@/components';
import { useState } from 'react';
import { View } from 'react-native';
import {
  BadgeText,
  CircleBadge,
  SubmitButton,
  SubmitText,
  Container,
} from '@/app/(post)/feed';
import SearchBar from '@/components/feed/SearchBar';
import { generateMockUsers } from '@/__mocks__/mockFeed';
import UserList from '@/components/feed/UserList';
import { useRouter } from 'expo-router';
import { FeedConnectedUser } from '@/types/feed';
import MemberBadgeList from '@/components/feed/MemberBadgeList';
import { useConnectedUserStore } from '@/stores/connectedUserStore';
import { height, width } from '@/theme/globalStyles';

export default function LinkMembersPage() {
  const router = useRouter();
  const mockUsers = generateMockUsers(20);
  const { setUsers } = useConnectedUserStore();
  const [selectedUsers, setSelectedUsers] = useState<FeedConnectedUser[]>([]);
  const [searchUser, setSearchUser] = useState('');

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

  const handleComplete = () => {
    setUsers(selectedUsers); // 전역 상태에 저장
    console.log('추가된 사람: ', selectedUsers);
    router.push('/(post)/feed/write'); // 글쓰기 페이지로 이동
  };

  const isSearching = searchUser.trim().length > 0;
  const filteredUsers = isSearching
    ? // 검색 중이면 검색 결과만
      mockUsers.filter((user) =>
        user.name.toLowerCase().includes(searchUser.toLowerCase()),
      )
    : // 검색 안 하면 선택된 멤버 + 나머지
      [
        ...selectedUsers,
        ...mockUsers.filter(
          (user) =>
            !selectedUsers.some((selected) => selected.userId === user.userId),
        ),
      ];

  return (
    <Container>
      <Header>함께 한 사람 추가</Header>
      <SearchBar value={searchUser} onChange={setSearchUser} />
      <MemberBadgeList members={selectedUsers} onRemove={handleRemoveUser} />

      <UserList
        users={filteredUsers}
        selectedUsers={selectedUsers}
        onToggleUser={handleToggleUser}
      />

      {/* 버튼 */}
      <View
        style={{
          paddingBottom: 32 * height,
          paddingTop: 16 * height,
        }}
      >
        <SubmitButton
          disabled={selectedUsers.length === 0}
          onPress={handleComplete}
        >
          {selectedUsers.length > 0 && (
            <CircleBadge>
              <BadgeText>{selectedUsers.length}</BadgeText>
            </CircleBadge>
          )}
          <SubmitText>완료</SubmitText>
        </SubmitButton>
      </View>
    </Container>
  );
}
