import {
  Modal,
  Pressable,
  FlatList,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import styled from 'styled-components/native';
import { BlurView } from 'expo-blur';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  lineHeight,
  radius,
  height,
  width,
} from '@/theme/globalStyles';
import { FeedReactedUser, FeedConnectedUser } from '@/types/feed';

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
    <Modal visible={visible} transparent animationType="slide">
      <Backdrop>
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <SheetContainer>
            <SheetBox>
              <BlurBackground intensity={20} tint="light">
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
              </BlurBackground>
            </SheetBox>
          </SheetContainer>
        </KeyboardAvoidingView>
      </Backdrop>
    </Modal>
  );
}

const Backdrop = styled.Pressable`
  flex: 1;
  justify-content: flex-end;
`;

const SheetContainer = styled.View`
  padding-horizontal: ${16 * width}px;
  margin-bottom: ${30 * height}px;
`;

const SheetBox = styled.View`
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: ${radius.md}px;
  overflow: hidden;
`;

const BlurBackground = styled(BlurView)`
  background-color: rgba(255, 255, 255, 0.1);
  padding: ${8 * height}px ${16 * width}px;
  min-height: ${425 * height}px;
  max-height: ${425 * height}px;
`;
const BackdropTouchable = styled.Pressable`
  flex: 1;
`;

const HandleBar = styled.View`
  width: ${40 * width}px;
  height: ${4 * height}px;
  background-color: ${colors.gray[300]};
  border-radius: ${radius.xs}px;
  align-self: center;
  margin-bottom: 12px;
`;

const Title = styled.Text`
  font-size: ${fontSize.xl};
  font-family: ${fonts.ExtraBold};
  color: ${colors.text[1]};
  margin-bottom: ${16 * height}px;
  padding-top: ${10 * height}px;
`;

const UserRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
`;

const Avatar = styled.Image`
  width: ${40 * width}px;
  height: ${40 * height}px;
  border-radius: ${radius.full}px;
  background-color: ${colors.gray[1]};
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
