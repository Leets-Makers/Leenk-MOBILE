import { KeyboardAvoidingView, Platform, Animated } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { Header, CustomButton, Textarea } from '@/components';
import colors from '@/theme/color';
import { width, height } from '@/theme/globalStyles';
import { postUserFeedback } from '@/api/users/postFeedback.api';
import { useState } from 'react';
import { useToastStore } from '@/stores/toastStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useKeyboardAnimation from '@/hooks/useKeyboardAnimation';

export default function HelpPage() {
  const router = useRouter();
  const [feedback, setFeedback] = useState('');
  const { showToast } = useToastStore();
  const insets = useSafeAreaInsets();
  const buttonTranslateY = useKeyboardAnimation(10);

  const handleConfirm = async () => {
    try {
      await postUserFeedback({ feedback });
      showToast('의견이 성공적으로 제출됐어!', 'success');

      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <Wrapper>
        <Container>
          <Header>의견 남기기</Header>
          <MarginContainer>
            <Textarea
              title="LEENK에 대한 의견을 입력해줘"
              placeholder="텍스트를 입력해 주세요"
              maxLength={200}
              subMessage="불편한 점, 좋은 점 등 자유로운 의견을 적어줘"
              minHeight={1}
              value={feedback}
              onChangeText={setFeedback}
            />
          </MarginContainer>
        </Container>

        <Animated.View
          style={{ transform: [{ translateY: buttonTranslateY }] }}
        >
          <BottomArea $bottomInset={insets.bottom}>
            <CustomButton
              variant="primary"
              fullWidth
              onPress={handleConfirm}
              disabled={feedback.trim() === ''}
            >
              제출하기
            </CustomButton>
          </BottomArea>
        </Animated.View>
      </Wrapper>
    </KeyboardAvoidingView>
  );
}

const Wrapper = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
  position: relative;
`;

const Container = styled.ScrollView.attrs({
  keyboardShouldPersistTaps: 'handled',
})`
  flex: 1;
  padding-horizontal: ${20 * width}px;
`;

const MarginContainer = styled.View`
  margin-top: ${12 * height}px;
  gap: ${8 * height}px;
`;

const BottomArea = styled.View<{ $bottomInset: number }>`
  position: absolute;
  bottom: ${(props) => props.$bottomInset}px;
  width: 100%;
  padding: 0 ${20 * width}px;
`;
