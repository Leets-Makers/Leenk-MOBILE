import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import { FeedReactedUser, FeedConnectedUser } from '@/types/feed';
import { BlurView } from 'expo-blur';
import { Modal, Pressable, FlatList } from 'react-native';
import styled from 'styled-components/native';

interface Props {
  visible: boolean;
  title: string;
  list: (FeedConnectedUser | FeedReactedUser)[];
  onClose: () => void;
}

export default function UserListModal({
  visible,
  title,
  list,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Wrapper>
        <BlurSheet intensity={10} tint="light">
          <HandleBar />
          <Title>{title}</Title>
          <FlatList
            data={list}
            keyExtractor={(item) => item.userId.toString()}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <UserRow>
                <Avatar source={{ uri: item.profileImage || '' }} />
                <NameRow>
                  <UserName>{item.name}</UserName>
                  {'reactionCount' in item &&
                    item.reactionCount !== undefined && (
                      <Count>{item.reactionCount.toLocaleString()}</Count>
                    )}
                </NameRow>
              </UserRow>
            )}
          />
        </BlurSheet>
      </Wrapper>
    </Modal>
  );
}

const Wrapper = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const BlurSheet = styled(BlurView)`
  background-color: rgba(255, 255, 255, 0.6);
  border-top-left-radius: ${radius.md}px;
  border-top-right-radius: ${radius.md}px;
  margin-horizontal: ${12 * width}px;
  padding-horizontal: ${12 * width}px;
  padding-vertical: ${12 * height}px;
  max-height: 80%;
`;

// 핸들바
const HandleBar = styled.View`
  width: 40px;
  height: 4px;
  background-color: ${colors.gray[300]};
  border-radius: ${radius.xs}px;
  align-self: center;
  margin-bottom: 12px;
`;

// 제목
const Title = styled.Text`
  font-size: ${fontSize.xl};
  font-family: ${fonts.ExtraBold};
  color: ${colors.text[1]};
  margin-bottom: 16px;
`;

// 리스트 아이템
const UserRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #e5e5ea;
`;

const NameRow = styled.View`
  flex: 1;
  margin-left: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UserName = styled.Text`
  font-size: ${fontSize.lg};
  font-family: ${fonts.Regular};
  line-height: ${lineHeight.l};
`;

const Count = styled.Text`
  color: ${colors.text[1]};
  font-size: ${fontSize.xl};
  font-family: ${fonts.ExtraBold};
`;
