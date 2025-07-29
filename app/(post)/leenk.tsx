import { Header, Input, PopupModal, Textarea } from '@/components';
import { Title } from '@/components/common/Input';
import LeenkImagePicker from '@/components/leenk/LeenkImagePicker';
import Stepper from '@/components/leenk/Stepper';
import colors from '@/theme/color';
import { fonts, fontSize, lineHeight, width } from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import styled from 'styled-components/native';

export default function PostLeenkPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleBackPress = () => {
    setIsModalOpen(true);
  };
  const handleConfirmExit = () => {
    setIsModalOpen(false);
    router.replace('/(page)/leenk');
  };
  return (
    <Conatiner>
      <Header signUpBackPress={handleBackPress} />
      <Row>
        <Title>사진선택</Title>
        <SubText>원하는 사진을 선택하거나, 새로운 사진을 올려줘.</SubText>
      </Row>
      <LeenkImagePicker />
      <Input
        title="제목"
        placeholder="제목을 입력해줘"
        value={title}
        onChangeText={setTitle}
        maxLength={36}
      />
      <Input
        title="장소"
        placeholder="모임 장소를 입력해줘"
        value={place}
        onChangeText={setPlace}
        maxLength={15}
      />
      <Input
        title="일시"
        placeholder="모임 일시를 선택해줘"
        value={date}
        onChangeText={setDate}
      />
      <Row>
        <Title>모임 인원</Title>
        <SubText>나 포함 최소 3명부터 모임을 만들 수 있어.</SubText>
      </Row>
      <Stepper />
      <Textarea
        title="내용"
        placeholder="자세한 내용을 입력해줘"
        maxLength={200}
        onChangeText={setContent}
      />

      <PopupModal
        isOpen={isModalOpen}
        onConfirm={() => setIsModalOpen(false)}
        onClose={handleConfirmExit}
        mainText="글 작성을 그만둘래?"
        subText="작성하던 내용은 저장되지 않아."
        isCancel={true}
        leftBtnText="확인"
        rightBtnText="취소"
      />
    </Conatiner>
  );
}

const Conatiner = styled.ScrollView`
  flex: 1;
  background-color: ${colors.bg[2]};
  padding-horizontal: ${20 * width}px;
`;
const Row = styled.View`
  flex-direction: row;
`;
export const SubText = styled.Text`
  font-size: ${fontSize.sm}px;
  color: ${colors.primary};
  margin-left: ${8 * width}px;
  line-height: ${lineHeight.s};
  font-family: ${fonts.Regular};
`;
