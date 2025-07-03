import React, { useState } from 'react';
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
  const sortedUsers = [
    ...selectedUsers,
    ...users.filter(
      (user) =>
        !selectedUsers.some((selected) => selected.userId === user.userId),
    ),
  ];

  return (
    <FlatList
      data={sortedUsers}
      keyExtractor={(item) => item.userId.toString()}
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
