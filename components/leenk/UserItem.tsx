// 링크 내보내기 UserItem
import * as Clipboard from 'expo-clipboard';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  width,
  height,
  lineHeight,
} from '@/theme/globalStyles';
import styled from 'styled-components/native';
import { Badge, CheckBox, ProfileImageWithFallback } from '@/components';
import { CopyIcon } from '@/assets';
import { LeenkDataType } from '@/constants/mockUserData';
import { useToastStore } from '@/stores/toastStore';
import { useParticipantStore } from '@/stores/participantStore';

export default function UserItem({
  user,
  isKakao,
}: {
  user: LeenkDataType;
  isKakao: boolean;
}) {
  const { showToast } = useToastStore();
  const { selectedUsers, toggleUser } = useParticipantStore();

  const checked = selectedUsers.some((u) => u.id === user.id);

  const handleCopyClick = async () => {
    try {
      await Clipboard.setStringAsync(user.kakaoTalkId);
      showToast('kakao ID를 클립보드에 복사했어', 'success');
    } catch (error) {
      showToast('복사에 실패했어. 다시 시도해줘', 'error');
    }
  };

  return (
    <Wrapper>
      <ProfileImageWithFallback uri={user.profileImageUri} />
      <RowWrapper>
        <UserName>{user.name}</UserName>
        {user.isWrite && <Badge label="작성자" profile />}
      </RowWrapper>

      {isKakao ? (
        <KakaoWrapper onPress={handleCopyClick}>
          <CopyIcon />
          <KakaoIdText>{user.kakaoTalkId}</KakaoIdText>
        </KakaoWrapper>
      ) : (
        <CheckBox onPress={() => toggleUser(user)} checked={checked} />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${14 * height}px 0px;
`;

const UserName = styled.Text`
  flex: 1;
  margin-left: ${12 * width}px;
  font-size: ${fontSize.lg}px;
  font-family: ${fonts.Regular};
  color: ${colors.text[1]};
`;

const RowWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const KakaoWrapper = styled.Pressable`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const KakaoIdText = styled.Text`
  font-size: ${fontSize.md}px;
  font-weight: 700;
  color: ${colors.text[2]};
  line-height: ${lineHeight.m}px;
  font-family: ${fonts.Regular};
`;
