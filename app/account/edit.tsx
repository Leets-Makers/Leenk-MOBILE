import { CustomButton, Header, Input, Textarea } from '@/components';
import { mockUserData } from '@/constants/mockUserData';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { BackArrowIcon } from '@/assets';

export default function AccountEdit() {
  const { type } = useLocalSearchParams();
  const router = useRouter();

  const headerText =
    type === 'kakaoTalkId'
      ? '카톡 ID'
      : type === 'mbti'
        ? 'MBTI'
        : type === 'introduction'
          ? '자기소개'
          : '프로필 수정';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <Wrapper>
        <Container>
          <Header isBack TitleSection={headerText} />
          <MarginContainer>
            {type === 'kakaoTalkId' && (
              <Input
                title="카카오톡 ID를 입력해줘"
                subMessage="모임원들과의 연락을 위해 필요해."
                placeholder={mockUserData.kakaoTalkId}
              />
            )}

            {type === 'mbti' && (
              <Input title="MBTI를 입력해줘" placeholder={mockUserData.mbti} />
            )}

            {type === 'introduction' && (
              <Textarea
                title="자기소개를 입력해줘"
                placeholder={mockUserData.introduction}
              />
            )}
          </MarginContainer>
        </Container>
        <BottomArea>
          <CustomButton
            variant="primary"
            fullWidth
            onPress={() => {
              console.log('제출');
            }}
          >
            완료할래
          </CustomButton>
        </BottomArea>
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

const BottomArea = styled.View`
  position: absolute;
  bottom: ${44 * height}px;
  width: 100%;
  padding: 0 ${20 * width}px;
`;
