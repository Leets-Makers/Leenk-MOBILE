import React from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import ProfileImageWithFallback from './ProfileImageWithFallback';
import { FlatList, View } from 'react-native';
import { FeedConnectedUser, FeedReactedUser } from '@/types/feed';
import { fontSize, fonts, lineHeight } from '@/theme/globalStyles';

export default function UserListModalContent({
  list,
}: {
  list: (FeedConnectedUser | FeedReactedUser)[];
}) {
  return (
    <FlatList
      data={list}
      keyExtractor={(item, index) => `${item.userId}-${index}`}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={true}
      renderItem={({ item }) => (
        <View onStartShouldSetResponder={() => true}>
          <UserRow>
            <ProfileImageWithFallback uri={item.profileImage} size={45} />
            <NameRow>
              <UserName>{item.name}</UserName>
              {'reactionCount' in item && (
                <Count>{item.reactionCount.toLocaleString()}</Count>
              )}
            </NameRow>
          </UserRow>
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
  margin-left: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const UserName = styled.Text`
  font-size: ${fontSize.lg};
  font-family: ${fonts.Regular};
  line-height: ${lineHeight.l};
`;

export const Count = styled.Text`
  color: ${colors.text[1]};
  font-size: ${fontSize.lg};
  font-family: ${fonts.ExtraBold};
`;
