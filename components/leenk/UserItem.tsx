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
import { useToastStore } from '@/stores/toastStore';
import { useParticipantStore } from '@/stores/participantStore';
import { LeenkParticipantItem } from '@/types/leenk';

export default function UserItem({ user }: { user: LeenkParticipantItem }) {
  const { showToast } = useToastStore();
  const { toggleUser, isSelectionMode, isSelected } = useParticipantStore();

  const checked = isSelected(user.participant.userId);

  const handleCopyClick = async () => {
    try {
      if (user.kakaoTalkId) {
        await Clipboard.setStringAsync(user.kakaoTalkId);
        showToast('kakao ID를 클립보드에 복사했어', 'success');
      }
    } catch {
      showToast('복사에 실패했어. 다시 시도해줘', 'error');
    }
  };

  return (
    <Wrapper>
      <ProfileImageWithFallback uri={user.participant.profileImage} />
      <MiddleWrapper>
        <NameRow>
          <UserName>{user.participant.name}</UserName>
          {user.isHost && <Badge label="작성자" profile />}
        </NameRow>
      </MiddleWrapper>

      <RightWrapper>
        {!user.isHost && !isSelectionMode && (
          <KakaoWrapper onPress={handleCopyClick}>
            <KakaoIdText>{user.kakaoTalkId || 'kakao ID'}</KakaoIdText>
            <CopyIcon width={20} height={20} style={{ marginLeft: 8 }} />
          </KakaoWrapper>
        )}
        {!user.isHost && isSelectionMode && (
          <CheckBox onPress={() => toggleUser(user)} checked={checked} />
        )}
      </RightWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${height * 14}px 0;
  width: 100%;
`;

const MiddleWrapper = styled.View`
  flex: 1;
  margin-left: ${width * 12}px;
`;

const NameRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UserName = styled.Text`
  font-size: ${fontSize.lg}px;
  font-family: ${fonts.Regular};
  color: ${colors.text[1]};
  margin-right: ${width * 8}px;
  line-height: ${lineHeight.l};
`;

const RightWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const KakaoWrapper = styled.Pressable`
  flex-direction: row;
  align-items: center;
`;

const KakaoIdText = styled.Text`
  font-size: ${fontSize.sm}px;
  color: ${colors.text[3]};
  line-height: ${lineHeight.s}px;
  font-family: ${fonts.Bold};
`;
