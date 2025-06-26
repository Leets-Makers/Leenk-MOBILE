import { CopyIcon } from '@/assets';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import styled from 'styled-components/native';
import * as Clipboard from 'expo-clipboard';
import { useToastStore } from '@/stores/toastStore';

export default function KakaoIdButton({
  kakaoTalkId,
}: {
  kakaoTalkId: string;
}) {
  const { showToast } = useToastStore();

  const handleCopyClick = async () => {
    try {
      await Clipboard.setStringAsync(kakaoTalkId);
      showToast('kakao ID를 클립보드에 복사했어', 'success');
    } catch (error) {
      showToast('복사에 실패했어. 다시 시도해줘', 'error');
    }
  };

  return (
    <Container onPress={handleCopyClick}>
      <KakaoIdWrapper>
        <TitleText>카카오톡 ID</TitleText>
        <CopyIcon />
      </KakaoIdWrapper>
      <KakaoIdText>{kakaoTalkId}</KakaoIdText>
    </Container>
  );
}

const Container = styled.Pressable`
  background-color: ${colors.bg[2]};
  width: 100%;
  border-radius: ${radius.md}px;
  padding: ${12 * height}px ${16 * width}px;
  justify-content: center;
  align-items: center;
`;

const KakaoIdWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: ${4 * height}px;
`;

const TitleText = styled.Text`
  font-size: ${fontSize.sm}px;
  font-weight: 700;
  color: ${colors.primary};
  font-family: ${fonts.Regular};
`;

const KakaoIdText = styled.Text`
  font-size: ${fontSize.md}px;
  font-weight: 700;
  color: ${colors.text[2]};
  line-height: ${lineHeight.m}px;
  font-family: ${fonts.Regular};
`;
