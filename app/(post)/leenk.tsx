import {
  CustomButton,
  Header,
  Input,
  Loading,
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
import { KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';

import { createLeenk } from '@/api/leenk/leenk.post.api';
import { UpdateLeenkPayload } from '@/types/leenk';
import { uploadImageToS3 } from '@/api/file/s3Upload';
import { getPresignedUrl } from '@/api/file/s3Upload';
import { useToastStore } from '@/stores/toastStore';

export default function PostLeenkPage() {
  const router = useRouter();

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [content, setContent] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number>(3);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToastStore();

  const { leenkImage, resetLeenkImage } = useLeenkImageStore();

  const handleBackPress = () => setIsBackModalOpen(true);

  const handleConfirmExit = () => {
    setIsBackModalOpen(false);
    router.push('/(page)/leenk');
  };

  const isRemoteUrl = (uri: string) => /^https?:\/\//i.test(uri);
  const stripQuery = (url: string) => url.split('?')[0];

  const handleSubmitCreate = async () => {
    if (!isFormValid || submitting) return;
    try {
      setSubmitting(true);

      // 1) 시간 형식 ISO로 포멧팅
      const startTime = date
        ? [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, '0'),
            String(date.getDate()).padStart(2, '0'),
          ].join('-') +
          'T' +
          [
            String(date.getHours()).padStart(2, '0'),
            String(date.getMinutes()).padStart(2, '0'),
            '00',
          ].join(':')
        : '';

      // 2) s3 url 준비
      let finalMediaUrl = '';
      if (leenkImage) {
        if (isRemoteUrl(leenkImage)) {
          finalMediaUrl = stripQuery(leenkImage);
        } else {
          // file S3에 등록
          const fileName = `leenk_${Date.now()}.jpg`;
          const presignedUrls = await getPresignedUrl(fileName);
          if (!presignedUrls || presignedUrls.length === 0) {
            throw new Error('Failed to get presigned URL.');
          }
          const signed = presignedUrls[0].mediaUrl;
          await uploadImageToS3(signed, leenkImage);
          finalMediaUrl = stripQuery(signed);
        }
      }

      // 3) payload 빌드
      const payload: UpdateLeenkPayload = {
        title: title.trim(),
        content: content.trim(),
        placeName: place.trim(),
        startTime,
        maxParticipants,
        mediaUrl: finalMediaUrl,
      };

      // 4) API 호출
      const res = await createLeenk(payload);

      setCompleteModalOpen(false);
      //TODO: 링크 상세 게시물 페이지로 바로 이동
      router.push('/(page)/leenk');
    } catch (e: any) {
      if (__DEV__) console.log('createLeenk error:', e?.response ?? e);
      showToast('등록에 실패했어. 잠시 후 다시 시도해 줘.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteOpen = () => setCompleteModalOpen(true);

  // 게시물 작성 시 이전에 선택한 이미지 삭제
  useEffect(() => {
    resetLeenkImage();
  }, [resetLeenkImage]);

  const isFormValid =
    title.trim().length > 0 &&
    place.trim().length > 0 &&
    content.trim().length > 0 &&
    date !== null;

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: colors.bg[2] }}
      contentContainerStyle={{
        paddingBottom: 60 * height,
        flexGrow: 1,
      }}
      enableOnAndroid={true}
      extraScrollHeight={180 * height}
      keyboardShouldPersistTaps="handled"
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

        <Stepper value={maxParticipants} onChange={setMaxParticipants} />

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
          onPress={handleCompleteOpen}
          fullWidth
          rounded="md"
          size="lg"
          disabled={!isFormValid}
        >
          모집하자
        </CustomButton>
      </ScrollView>

      {/* 뒤로가기 확인 */}
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

      {/* 최종 제출 확인 → 실제 API 호출 */}
      <PopupModal
        isOpen={completeModalOpen}
        onRightBtn={handleSubmitCreate}
        onLeftBtn={() => setCompleteModalOpen(false)}
        mainText="모집하러 가볼까?"
        isCancel={false}
        leftBtnText="취소"
        rightBtnText="모집하기"
        isLoading={submitting}
      />
    </KeyboardAwareScrollView>
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
