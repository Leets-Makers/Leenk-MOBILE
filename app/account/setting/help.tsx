import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { BackArrowIcon } from '@/assets';
import { CustomButton, Header, Textarea } from '@/components';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';

export default function HelpPage() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <Wrapper>
        <Container>
          <Header isBack TitleSection="의견 남기기" />
          <MarginContainer>
            <Textarea
              title="LEENK에 대한 의견을 입력해줘"
              placeholder="텍스트를 입력해 주세요"
              maxLength={200}
              subMessage="불편한 점, 좋은 점 등 자유로운 의견을 적어줘"
              minHeight={1}
            />
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
            제출하기
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
  padding: ${28 * height}px ${20 * width}px;
`;

const MarginContainer = styled.View`
  margin-top: ${12 * height}px;
  gap: ${8 * height}px;
`;

const BottomArea = styled.View`
  position: absolute;
  bottom: ${44 * height}px;
  width: 100%;
  padding: 0 ${20 * width}px;
`;
