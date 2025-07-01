// 함께한 사람 추가 유저 아이템

import { FeedConnectedUser } from '@/types/feed';
import colors from '@/theme/color';
import { fonts, fontSize, width, height } from '@/theme/globalStyles';
import styled from 'styled-components/native';
import { CheckBox } from '@/components';

interface UserItemProps {
  user: FeedConnectedUser;
  checked: boolean;
  onToggle: () => void;
}

export default function UserItem({ user, checked, onToggle }: UserItemProps) {
  return (
    <Wrapper onPress={onToggle}>
      <ProfileImage source={{ uri: user.profileImage }} />
      <UserName>{user.name}</UserName>
      <CheckBox checked={checked} />
    </Wrapper>
  );
}

const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${14 * height}px 0px;
`;

const ProfileImage = styled.Image`
  width: ${40 * width}px;
  height: ${40 * width}px;
  border-radius: ${20 * width}px;
  background-color: ${colors.gray[200]};
`;

const UserName = styled.Text`
  flex: 1;
  margin-left: ${12 * width}px;
  font-size: ${fontSize.lg}px;
  font-family: ${fonts.Regular};
  color: ${colors.text[1]};
`;
