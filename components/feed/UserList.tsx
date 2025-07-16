// 피드 - 함께하는 사람 추가 페이지의 유저리스트

import React from 'react';
import { FlatList } from 'react-native';
import UserItem from '@/components/feed/UserItem';
import { FeedConnectedUser } from '@/types/feed';

interface UserListProps {
  users: FeedConnectedUser[];
  selectedUsers: FeedConnectedUser[];
  onToggleUser: (user: FeedConnectedUser) => void;
}

export default function UserList({
  users,
  selectedUsers,
  onToggleUser,
}: UserListProps) {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.userId.toString()}
      contentContainerStyle={{
        justifyContent: 'flex-start',
      }}
      renderItem={({ item }) => (
        <UserItem
          user={item}
          checked={selectedUsers.some((u) => u.userId === item.userId)}
          onToggle={() => onToggleUser(item)}
        />
      )}
    />
  );
}
