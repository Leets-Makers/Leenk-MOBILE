import React, { useState } from 'react';
import { FlatList } from 'react-native';
import UserItem from './UserItem';
import { FeedConnectedUser } from '@/types/feed';
import { height } from '@/theme/globalStyles';

interface UserListProps {
  users: FeedConnectedUser[];
  selectedUserIds: number[];
  setSelectedUserIds: (ids: number[]) => void;
}

export default function UserList({
  users,
  selectedUserIds,
  setSelectedUserIds,
}: UserListProps) {
  const handleToggleUser = (userId: number) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  return (
    <FlatList
      style={{ marginTop: 16 * height, maxHeight: 576 * height }}
      data={users}
      keyExtractor={(item) => item.userId.toString()}
      renderItem={({ item }) => (
        <UserItem
          user={item}
          checked={selectedUserIds.includes(item.userId)}
          onToggle={() => handleToggleUser(item.userId)}
        />
      )}
    />
  );
}
