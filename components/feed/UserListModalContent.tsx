import React from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import ProfileImageWithFallback from './ProfileImageWithFallback';
import { FlatList, Pressable, View } from 'react-native';
import { FeedConnectedUser, FeedReactedUser } from '@/types/feed';
import { fontSize, fonts, lineHeight } from '@/theme/globalStyles';
import { Badge } from '@/components';
import { width } from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import { sortByAuthorFirst } from '@/utils/sort-by-author-first';

export default function UserListModalContent({
  list,
  onClose,
}: {
  list: (FeedConnectedUser | FeedReactedUser)[];
  onClose: () => void;
}) {
  const router = useRouter();
  const sortedList = sortByAuthorFirst(list);

  return (
    <FlatList
      data={sortedList}
      keyExtractor={(item, index) => `${item.userId}-${index}`}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={true}
      renderItem={({ item }) => (
        <View onStartShouldSetResponder={() => true}>
          <Pressable
            onPress={() => {
              onClose();
              router.push(`/users/${item.userId}`);
            }}
          >
            <UserRow>
              <ProfileImageWithFallback uri={item.profileImage} size={45} />
              <NameRow>
                <RightContent>
                  <UserName>{item.name}</UserName>
                  {'isAuthor' in item && item.isAuthor && (
                    <Badge label="작성자" />
                  )}
                </RightContent>

                {'reactionCount' in item && (
                  <Count>{item.reactionCount.toLocaleString()}</Count>
                )}
              </NameRow>
            </UserRow>
          </Pressable>
        </View>
      )}
    />
  );
}

export const UserRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
`;

export const NameRow = styled.View`
  flex: 1;
  margin-left: ${12 * width}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const RightContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${2 * width}px;
`;

export const UserName = styled.Text`
  font-size: ${fontSize.lg};
  font-family: ${fonts.Regular};
  line-height: ${lineHeight.l};
  margin-right: ${8 * width}px;
`;

export const Count = styled.Text`
  color: ${colors.text[1]};
  font-size: ${fontSize.lg};
  font-family: ${fonts.ExtraBold};
`;
