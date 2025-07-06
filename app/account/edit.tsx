import { CustomButton, Header, Input, Textarea } from '@/components';
import colors from '@/theme/color';
import { height, width } from '@/theme/globalStyles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Animated } from 'react-native';
import styled from 'styled-components/native';
import { useState } from 'react';
import {
  updateKakaoTalkId,
  updateMbti,
  updateIntroduction,
} from '@/api/users/patchUserEachInfo.api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useKeyboardAnimation from '@/hooks/useKeyboardAnimation';
import { useProfileStore } from '@/stores/profileStore';

export default function AccountEdit() {
  const { type } = useLocalSearchParams();
  const [edituserInfo, setEdituserInfo] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const buttonTranslateY = useKeyboardAnimation(10);

  const {
    kakaoTalkId,
    setkakaoTalkId,
    introduction,
    setintroduction,
    mbti,
    setMbti,
  } = useProfileStore();

  const headerText =
    type === 'kakaoTalkId'
      ? '카톡 ID'
      : type === 'mbti'
        ? 'MBTI'
        : type === 'introduction'
          ? '자기소개'
          : '프로필 수정';

  const handleSubmit = async () => {
    try {
      if (type === 'kakaoTalkId') {
        setkakaoTalkId(edituserInfo);
        await updateKakaoTalkId({ kakaoTalkId: edituserInfo });
      } else if (type === 'mbti') {
        setMbti(edituserInfo);
        await updateMbti({ mbti: edituserInfo });
      } else if (type === 'introduction') {
        setintroduction(edituserInfo);
        await updateIntroduction({ introduction: edituserInfo });
      } else {
        console.warn('알 수 없는 수정 타입입니다:', type);
      }

      router.back();
    } catch (error) {
      console.error('[AccountEdit] 수정 실패:', error);
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
          <Header>{headerText}</Header>
          <MarginContainer>
            {type === 'kakaoTalkId' && (
              <Input
                title="카카오톡 ID를 입력해줘"
                subMessage="모임원들과의 연락을 위해 필요해."
                value={edituserInfo}
                placeholder={kakaoTalkId}
                onChangeText={(text) => {
                  const filtered = text.replace(/[^a-zA-Z0-9]/g, '');
                  setEdituserInfo(filtered);
                }}
                maxLength={20}
              />
            )}

            {type === 'mbti' && (
              <Input
                title="MBTI를 입력해줘"
                placeholder={mbti}
                maxLength={4}
                value={edituserInfo}
                autoCapitalize="characters"
                autoCorrect={false}
                textContentType="none"
                onChangeText={(text) => {
                  const filtered = text.replace(/[^a-zA-Z]/g, '').toUpperCase();
                  setEdituserInfo(filtered);
                }}
              />
            )}

            {type === 'introduction' && (
              <Textarea
                title="자기소개를 입력해줘"
                placeholder={introduction}
                onChangeText={setEdituserInfo}
                maxLength={200}
              />
            )}
          </MarginContainer>
        </Container>

        <Animated.View
          style={{ transform: [{ translateY: buttonTranslateY }] }}
        >
          <BottomArea $bottomInset={insets.bottom}>
            <CustomButton
              style={{ marginBottom: 10 * height }}
              variant="primary"
              fullWidth
              onPress={handleSubmit}
              disabled={
                (type === 'kakaoTalkId' &&
                  (edituserInfo.trim() === '' ||
                    edituserInfo.length < 4 ||
                    edituserInfo.length > 20)) ||
                (type === 'mbti' &&
                  (edituserInfo.trim() === '' || edituserInfo.length !== 4))
              }
            >
              완료할래
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
  margin-top: ${28 * height}px;
`;

const BottomArea = styled.View<{ $bottomInset: number }>`
  position: absolute;
  bottom: ${(props) => props.$bottomInset}px;
  width: 100%;
  padding: 0 ${20 * width}px;
`;
