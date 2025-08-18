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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';

import { createLeenk } from '@/api/leenk/leenk.post.api';
import { LeenkDetail, UpdateLeenkPayload } from '@/types/leenk';
import { uploadImageToS3 } from '@/api/file/s3Upload';
import { getPresignedUrl } from '@/api/file/s3Upload';
import { useToastStore } from '@/stores/toastStore';
import { updateLeenk } from '@/api/leenk/leenk.patch.api';
import { getLeenkDetail } from '@/api/leenk/leenk.get.api';

export default function PostLeenkPage() {
  const router = useRouter();
  const { mode, leenkId: leenkIdParam } = useLocalSearchParams<{
    mode?: string;
    leenkId?: string;
  }>();

  const isEdit = mode === 'edit';
  const leenkId = Number(leenkIdParam);

  const [isBackModalOpen, setIsBackModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [content, setContent] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number>(3);
  const [submitting, setSubmitting] = useState(false);
  const [hydrating, setHydrating] = useState(isEdit);
  const { showToast } = useToastStore();

  const { leenkImage, resetLeenkImage, setLeenkImage } = useLeenkImageStore();
  // setLeenkImage가 없다면 leenkStore에 아래 setter 하나만 추가:
  // setLeenkImage: (uri: string | null) => set({ leenkImage: uri })

  // ISO 문자열로 변환
  const toISODateTime = (d: Date) =>
    [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0'),
    ].join('-') +
    'T' +
    [
      String(d.getHours()).padStart(2, '0'),
      String(d.getMinutes()).padStart(2, '0'),
      '00',
    ].join(':');

  const isRemoteUrl = (uri: string) => /^https?:\/\//i.test(uri);
  const stripQuery = (url: string) => url.split('?')[0];

  // 수정 모드일 때 기존 데이터로 폼 채우기
  useEffect(() => {
    // 새 글쓰기일 때만 이전 선택 이미지 초기화
    if (!isEdit) resetLeenkImage();
  }, [isEdit, resetLeenkImage]);

  useEffect(() => {
    if (!isEdit || !Number.isFinite(leenkId)) return;

    let mounted = true;
    (async () => {
      try {
        setHydrating(true);
        const detail: LeenkDetail = await getLeenkDetail(leenkId);
        if (!mounted) return;

        setTitle(detail.title ?? '');
        setPlace(detail.placeName ?? '');
        setContent(detail.content ?? '');
        setMaxParticipants(detail.maxParticipants ?? 3);

        // startTime(예: '2025-08-17T12:30:00')을 Date로 변환
        if (detail.startTime) {
          const d = new Date(detail.startTime);
          if (!isNaN(d.getTime())) setDate(d);
        }

        // 이미지 셋
        if (detail.mediaUrl) {
          // 편집 시 기존 이미지 유지
          setLeenkImage(stripQuery(detail.mediaUrl));
        } else {
          setLeenkImage(null);
        }
      } catch (e) {
        showToast('수정 정보를 불러오지 못했어.', 'error');
        router.back();
      } finally {
        setHydrating(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isEdit, leenkId]);

  const handleBackPress = () => setIsBackModalOpen(true);

  const handleConfirmExit = () => {
    setIsBackModalOpen(false);
    router.push('/(page)/leenk');
  };

  const isFormValid =
    title.trim().length > 0 &&
    place.trim().length > 0 &&
    content.trim().length > 0 &&
    date !== null;

  // 공통: S3 업로드 or 기존 URL 재사용
  const prepareMediaUrl = async (): Promise<string> => {
    if (!leenkImage) return '';
    if (isRemoteUrl(leenkImage)) return stripQuery(leenkImage);

    const fileName = `leenk_${Date.now()}.jpg`;
    const presignedUrls = await getPresignedUrl(fileName);
    if (!presignedUrls || presignedUrls.length === 0) {
      throw new Error('Failed to get presigned URL.');
    }
    const signed = presignedUrls[0].mediaUrl;
    await uploadImageToS3(signed, leenkImage);
    return stripQuery(signed);
  };

  // 작성 / 수정 분기
  const handleSubmit = async () => {
    if (!isFormValid || submitting) return;

    try {
      setSubmitting(true);

      const startTime = date ? toISODateTime(date) : '';
      const finalMediaUrl = await prepareMediaUrl();

      const payload: UpdateLeenkPayload = {
        title: title.trim(),
        content: content.trim(),
        placeName: place.trim(),
        startTime,
        maxParticipants,
        mediaUrl: finalMediaUrl,
      };

      if (isEdit) {
        // 수정 API
        await updateLeenk(leenkId, payload);
        showToast('수정 완료!', 'success');
        setCompleteModalOpen(false);
        router.back();
      } else {
        // 작성 API
        const res = await createLeenk(payload);
        console.log('링크 등록 응답: ', res);
        showToast('등록 완료!', 'success');
        setCompleteModalOpen(false);
        router.push('/(page)/leenk');
      }
    } catch (e: any) {
      if (__DEV__) console.log('submit error:', e?.response ?? e);
      showToast(isEdit ? '수정에 실패했어.' : '등록에 실패했어.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteOpen = () => setCompleteModalOpen(true);

  if (hydrating) {
    return <Loading />;
  }

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
          {isEdit ? '수정할래' : '모집하자'}
        </CustomButton>
      </ScrollView>

      {/* 뒤로가기 확인 */}
      <PopupModal
        isOpen={isBackModalOpen}
        onRightBtn={handleConfirmExit}
        onLeftBtn={() => setIsBackModalOpen(false)}
        mainText={isEdit ? '수정을 그만둘래?' : '글 작성을 그만둘래?'}
        subText="작성하던 내용은 저장되지 않아."
        isCancel
        leftBtnText="취소"
        rightBtnText="그만두기"
      />
      {/* 최종 제출 확인 */}
      <PopupModal
        isOpen={completeModalOpen}
        onRightBtn={handleSubmit}
        onLeftBtn={() => setCompleteModalOpen(false)}
        mainText={isEdit ? '수정할까?' : '모집하러 가볼까?'}
        isCancel={false}
        leftBtnText="취소"
        rightBtnText={isEdit ? '수정할래' : '모집하기'}
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
