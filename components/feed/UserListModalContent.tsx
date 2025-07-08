import React from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import ProfileImageWithFallback from './ProfileImageWithFallback';
import { FlatList, View } from 'react-native';
import { FeedConnectedUser, FeedReactedUser } from '@/types/feed';
import { fontSize, fonts, lineHeight } from '@/theme/globalStyles';
import { Badge } from '@/components';
import { width } from '@/theme/globalStyles';

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
          {/* TODO: 클릭 시 해당 유저의 프로필로 넘어가도록 추가 */}
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
