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
import { height } from '@/theme/globalStyles';
import { useFeedWriteStore } from '@/stores/feedWriteStore';

export default function LinkMembersPage() {
  const router = useRouter();
  const mockUsers = generateMockUsers(20);
  const selectedUsers = useFeedWriteStore((state) => state.users);
  const setUsers = useFeedWriteStore((state) => state.setUsers);
  const [searchUser, setSearchUser] = useState('');
  const [tempSelectedUsers, setTempSelectedUsers] =
    useState<FeedConnectedUser[]>(selectedUsers); //  이 페이지 안에서만 쓰이는 상태값(완료 누르기전까지 저장 x)

  const handleToggleUser = (user: FeedConnectedUser) => {
    setTempSelectedUsers((prev) =>
      prev.some((u) => u.userId === user.userId)
        ? prev.filter((u) => u.userId !== user.userId)
        : [...prev, user],
    );
  };

  const handleRemoveUser = (userId: number) => {
    setTempSelectedUsers((prev) => prev.filter((u) => u.userId !== userId));
  };

  const handleComplete = () => {
    setUsers(tempSelectedUsers); // 전역 상태에 저장
    console.log('추가된 사람: ', selectedUsers);
    router.push('/(post)/feed/write'); // 글쓰기 페이지로 이동
  };

  const isSearching = searchUser.trim().length > 0;
  const filteredUsers = isSearching
    ? mockUsers.filter((user) =>
        user.name.toLowerCase().includes(searchUser.toLowerCase()),
      )
    : [
        ...tempSelectedUsers,
        ...mockUsers.filter(
          (user) =>
            !tempSelectedUsers.some(
              (selected) => selected.userId === user.userId,
            ),
        ),
      ];

  return (
    <Container>
      <Header>함께 한 사람 추가</Header>
      <SearchBar value={searchUser} onChange={setSearchUser} />
      <MemberBadgeList
        members={tempSelectedUsers}
        onRemove={handleRemoveUser}
      />

      <UserList
        users={filteredUsers}
        selectedUsers={tempSelectedUsers}
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
          disabled={tempSelectedUsers.length === 0}
          onPress={handleComplete}
        >
          {tempSelectedUsers.length > 0 && (
            <CircleBadge>
              <BadgeText>{tempSelectedUsers.length}</BadgeText>
            </CircleBadge>
          )}
          <SubmitText>완료</SubmitText>
        </SubmitButton>
      </View>
    </Container>
  );
}
