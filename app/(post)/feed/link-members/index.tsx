import { Header } from '@/components';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  BadgeText,
  CircleBadge,
  SubmitButton,
  SubmitText,
} from '@/app/(post)/feed';
import SearchBar from '@/components/feed/SearchBar';
import UserList from '@/components/feed/UserList';
import { useRouter } from 'expo-router';
import { FeedConnectedUser } from '@/types/feed';
import MemberBadgeList from '@/components/feed/MemberBadgeList';
import { height, width } from '@/theme/globalStyles';
import { useFeedWriteStore } from '@/stores/feedWriteStore';
import { getAllUsers } from '@/api/feed/feed.api';
import { CONTAINER_PADDING } from '@/constants';
import colors from '@/theme/color';
import styled from 'styled-components/native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function LinkMembersPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [allUsers, setAllUsers] = useState<FeedConnectedUser[]>([]);
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
    console.log('추가된 사람: ', tempSelectedUsers);
    router.push('/(post)/feed/write'); // 글쓰기 페이지로 이동
  };

  const isSearching = searchUser.trim().length > 0;
  const filteredUsers = isSearching
    ? allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchUser.toLowerCase()),
      )
    : [
        ...tempSelectedUsers,
        ...allUsers.filter(
          (user) =>
            !tempSelectedUsers.some(
              (selected) => selected.userId === user.userId,
            ),
        ),
      ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        console.log('getAllUsers 응답:', response);
        setAllUsers(response);
      } catch (error) {
        console.error('함께한 사람 추가를 위한 사용자 목록 조회 실패:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Container>
      <Header>함께 한 사람 추가</Header>
      <SearchBar value={searchUser} onChange={setSearchUser} />
      <MemberBadgeList
        members={tempSelectedUsers}
        onRemove={handleRemoveUser}
      />

      <View
        style={{
          height: (tempSelectedUsers.length === 0 ? 560 : 530) * height,
        }}
      >
        <UserList
          users={filteredUsers}
          selectedUsers={tempSelectedUsers}
          onToggleUser={handleToggleUser}
        />
      </View>
      {/* 버튼 */}

      <View
        style={{
          paddingBottom: 10 * height + insets.bottom,
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

const Container = styled(SafeAreaView)`
  flex: 1;
  padding: 0 ${CONTAINER_PADDING * width}px;
  background-color: ${colors.gray[50]};
`;
