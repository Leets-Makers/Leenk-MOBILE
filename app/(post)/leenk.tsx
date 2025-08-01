import {
  CustomButton,
  Header,
  Input,
  PopupModal,
  Textarea,
} from '@/components';
import { Title } from '@/components/common/Input';
import CalendarButton from '@/components/leenk/CalendarButton';
import LeenkImagePicker from '@/components/leenk/LeenkImagePicker';
import Stepper from '@/components/leenk/Stepper';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export default function PostLeenkPage() {
  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleBackPress = () => setIsBackModalOpen(true);
  const handleConfirmExit = () => {
    setIsBackModalOpen(false);
    router.replace('/(page)/leenk');
  };
  const handleComplete = () => {
    setCompleteModalOpen(false);
    router.replace('/(page)/leenk');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bg[2] }}
        contentContainerStyle={{
          paddingHorizontal: 20 * width,
          paddingBottom: 60 * height,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Header signUpBackPress={handleBackPress} />
        <Row style={{ marginTop: height * 10 }}>
          <Title>사진선택</Title>
          <SubText>원하는 사진을 선택하거나, 새로운 사진을 올려줘.</SubText>
        </Row>
        <Margin />
        <Input
          title="제목"
          placeholder="제목을 입력해줘"
          value={title}
          onChangeText={setTitle}
          maxLength={36}
        />
        <Margin />
        <Input
          title="장소"
          placeholder="모임 장소를 입력해줘"
          value={place}
          onChangeText={setPlace}
          maxLength={15}
        />
        <Margin />
        <Title>일시</Title>
        <CalendarButton />
        <Margin />
        <Row>
          <Title>모임 인원</Title>
          <SubText>나 포함 최소 3명부터 모임을 만들 수 있어.</SubText>
        </Row>
        <Stepper />
        <Margin />
        <Textarea
          title="내용"
          placeholder="자세한 내용을 입력해줘"
          maxLength={200}
          onChangeText={setContent}
        />
        <Margin />

        <CustomButton
          variant="primary"
          onPress={() => setCompleteModalOpen(true)}
          fullWidth
          rounded="md"
          size="lg"
          disabled={place.trim() === '' || title.trim() === ''}
        >
          모집하자
        </CustomButton>
      </ScrollView>

      {/* 모달들 */}
      <PopupModal
        isOpen={isBackModalOpen}
        onRightBtn={() => setIsBackModalOpen(false)}
        onLeftBtn={handleConfirmExit}
        mainText="글 작성을 그만둘래?"
        subText="작성하던 내용은 저장되지 않아."
        isCancel={true}
        leftBtnText="확인"
        rightBtnText="취소"
      />
      <PopupModal
        isOpen={completeModalOpen}
        onRightBtn={handleComplete}
        onLeftBtn={() => setCompleteModalOpen(false)}
        mainText="모집하러 가볼까?"
        leftBtnText="취소"
        rightBtnText="모집하기"
      />
    </KeyboardAvoidingView>
  );
}

const Row = styled.View`
  flex-direction: row;
`;

const Margin = styled.View`
  height: ${height * 32}px;
`;
export const SubText = styled.Text`
  font-size: ${fontSize.sm}px;
  color: ${colors.primary};
  margin-left: ${8 * width}px;
  line-height: ${lineHeight.s};
  font-family: ${fonts.Regular};
`;
