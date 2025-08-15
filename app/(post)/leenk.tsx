import {
  CustomButton,
  Header,
  Input,
  PopupModal,
  Textarea,
} from '@/components';
import { Title } from '@/components/common/Input';
import { Asterisk } from '@/components/common/Textarea';
import CalendarButton from '@/components/leenk/CalendarButton';
import LeenkImagePicker from '@/components/leenk/LeenkImagePicker';
import Stepper from '@/components/leenk/Stepper';
import { useLeenkImageStore } from '@/stores/leenkStore';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export default function PostLeenkPage() {
  const router = useRouter();

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [content, setContent] = useState('');

  const { resetLeenkImage } = useLeenkImageStore();
  const handleBackPress = () => setIsBackModalOpen(true);

  const handleConfirmExit = () => {
    setIsBackModalOpen(false);
    router.push('/(page)/leenk');
  };

  const handleComplete = () => {
    setCompleteModalOpen(false);
    router.push('/(page)/leenk');
  };

  useEffect(() => {
    resetLeenkImage();
  }, []);

  const isFormValid =
    title.trim().length > 0 &&
    place.trim().length > 0 &&
    content.trim().length > 0 &&
    date !== null;

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
        <LeenkImagePicker />
        <Margin />
        <Input
          title="제목"
          placeholder="제목을 입력해줘"
          value={title}
          onChangeText={setTitle}
          maxLength={30}
          isRequired
        />
        <Margin />
        <Input
          title="장소"
          placeholder="모임 장소를 입력해줘"
          value={place}
          onChangeText={setPlace}
          maxLength={25}
          isRequired
        />
        <Margin />
        <Title>
          일시<Asterisk> *</Asterisk>
        </Title>

        <CalendarButton value={date} onChange={setDate} />
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
          minHeight={40}
          maxHeight={50}
          value={content}
          onChangeText={setContent}
          fontSizeKey="lg"
          isRequired
        />
        <Margin />

        <CustomButton
          variant="primary"
          onPress={() => setCompleteModalOpen(true)}
          fullWidth
          rounded="md"
          size="lg"
          disabled={!isFormValid}
        >
          모집하자
        </CustomButton>
      </ScrollView>

      <PopupModal
        isOpen={isBackModalOpen}
        onRightBtn={handleConfirmExit}
        onLeftBtn={() => setIsBackModalOpen(false)}
        mainText="글 작성을 그만둘래?"
        subText="작성하던 내용은 저장되지 않아."
        isCancel={true}
        leftBtnText="취소"
        rightBtnText="그만두기"
      />
      <PopupModal
        isOpen={completeModalOpen}
        onRightBtn={handleComplete}
        onLeftBtn={() => setCompleteModalOpen(false)}
        mainText="모집하러 가볼까?"
        isCancel={false}
        leftBtnText="취소"
        rightBtnText="모집하기"
      />
    </KeyboardAvoidingView>
  );
}

const Row = styled.View`
  flex-direction: row;
  margin-bottom: ${6 * height}px;
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
