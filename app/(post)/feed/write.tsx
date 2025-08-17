import {
  Header,
  BackgroundImageSlider,
  CustomButton,
  Textarea,
  Badge,
  ProfileImageWithFallback,
  Loading,
} from '@/components';
import colors from '@/theme/color';
import { router, useLocalSearchParams } from 'expo-router';
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Keyboard,
} from 'react-native';
import { Media } from '@/types/feed';
import { fonts, fontSize, height, width } from '@/theme/globalStyles';
import { useEffect, useState } from 'react';
import PopupModal from '@/components/Modal/PopupModal';
import styled from 'styled-components/native';
import { useFeedWriteStore } from '@/stores/feedWriteStore';
import FeedUploadModal from '@/components/Modal/FeedUploadingModal';
import { getFeedDetail, uploadFeed } from '@/api/feed/feed.api';
import { useToastStore } from '@/stores/toastStore';
import { useUserStore } from '@/stores/userStore';
import useKeyboardAnimation from '@/hooks/useKeyboardAnimation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FEED_PADDING } from '@/constants';

export default function FeedWritePage() {
  const { mode, feedId } = useLocalSearchParams<{
    mode?: 'edit' | 'create';
    feedId?: string;
  }>();
  const isEditParam = mode === 'edit';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { showToast } = useToastStore();
  const { userInfo } = useUserStore();

  const selectedImages = useFeedWriteStore((state) => state.selectedImages);
  const setSelectedImages = useFeedWriteStore((s) => s.setSelectedImages);
  const connectedUsers = useFeedWriteStore((state) => state.users);
  const description = useFeedWriteStore((state) => state.description);
  const setDescription = useFeedWriteStore((state) => state.setDescription);
  const mediaUrls = useFeedWriteStore((state) => state.mediaUrls);

  const resetFeedWrite = useFeedWriteStore((state) => state.reset);

  // const {
  //   startCreate,
  //   startEditFromDetail,
  //   reset,
  //   mediaUrls,
  //   selectedImages,
  //   users,
  //   description,
  //   setDescription,
  //   feedId: storeFeedId,
  // } = useFeedWriteStore();

  // const connectedUsers = users;

  const androidTranslateY = useKeyboardAnimation(-85);

  const insets = useSafeAreaInsets();

  const IOS_TEXTAREA_GAP = 50 * height;

  const [iosKeyboardBottom, setIosKeyboardBottom] = useState(0);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    const show = Keyboard.addListener('keyboardWillShow', (e) => {
      const h = e.endCoordinates?.height ?? 0;
      setIosKeyboardBottom(Math.max(0, h - insets.bottom - IOS_TEXTAREA_GAP));
    });
    const hide = Keyboard.addListener('keyboardWillHide', () => {
      setIosKeyboardBottom(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [insets.bottom]);

  // ✅ edit 모드에 들어오면 로컬 선택 이미지는 비워서 중복/혼선 제거
  useEffect(() => {
    if (isEditParam && selectedImages.length > 0) {
      setSelectedImages([]);
    }
  }, [isEditParam, selectedImages.length, setSelectedImages]);

  const hasAnyImage = mediaUrls.length > 0;
  // const media: Media[] = selectedImages.map((img, index) => ({
  //   position: index + 1,
  //   mediaUrl: img.uri,
  //   mediaType: 'IMAGE' as const,
  // }));

  const previewMedia: Media[] = mediaUrls.map((m, idx) => ({
    position: idx + 1,
    mediaUrl: m.mediaUrl,
    mediaType: m.mediaType,
  }));

  // // 기존 서버 이미지 + 로컬 새 이미지 합쳐서 슬라이더에 전달
  // const previewMedia: Media[] = [
  //   ...mediaUrls.map((m) => ({
  //     position: m.position,
  //     mediaUrl: m.mediaUrl,
  //     mediaType: m.mediaType,
  //   })),
  //   ...selectedImages.map((img, i) => ({
  //     position: mediaUrls.length + i, // 뒤에 이어붙이기
  //     mediaUrl: img.uri, // 로컬 uri
  //     mediaType: 'IMAGE' as const,
  //   })),
  // ];

  // const requestBody = {
  //   description,
  //   media: mediaUrls,
  //   userId: connectedUsers.map((user) => user.userId),
  // };

  const requestBodyCreate = {
    description,
    media: mediaUrls, // create는 이미지 포함
    userId: connectedUsers.map((u) => u.userId),
  };

  const requestBodyEdit = {
    feedId: Number(feedId),
    description,
    userId: connectedUsers.map((u) => u.userId),
    // 이미지 수정 없음: media 안 보냄
  };

  const handleUpload = async () => {
    if (!description.trim()) return;

    if (!isEditParam && !hasAnyImage) {
      showToast('이미지를 최소 1장 선택해줘!', 'error');
      return;
    }

    if (connectedUsers.length === 0 && !isEditParam) {
      setIsModalOpen(true);
    } else {
      handleUploadFeed(); // 함께한 사람이 있는 경우 바로 업로드
    }
  };

  const handleConfirmUpload = async () => {
    setIsModalOpen(false);
    handleUploadFeed(); // 함께한 사람 없는 경우 모달에서 확인 후 업로드
  };

  // // 업로드 로직 분리
  // const handleUploadFeed = async () => {
  //   if (isEditParam) {
  //     setIsModalOpen(true);
  //     return;
  //   }

  //   setIsUploading(true);

  //   console.log('피드 데이터: ', requestBody);
  //   try {
  //     const res = await uploadFeed(requestBody);
  //     console.log('[피드 업로드 성공]:', res);

  //     resetFeedWrite();
  //     router.push('/(page)/feed');
  //   } catch (error) {
  //     console.error('업로드 실패:', error);
  //     console.log('피드 업로드 요청 : ', requestBody);
  //     showToast('피드 업로드에 실패했어!', 'error');
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  // 2) 업로드 로직: 분기에 맞춰 올바른 바디 사용
  const handleUploadFeed = async () => {
    setIsUploading(true);
    try {
      if (isEditParam) {
        // ✅ 수정 모드: 이미지 수정 없음 → description, userId만 PATCH/PUT
        // await updateFeed(requestBodyEdit);  // 실제 API로 교체
        setIsModalOpen(true); // 모달 닫기
        showToast('수정 완료!', 'success');
        router.back();
        return;
      }

      // ✅ 생성 모드: 이미지 포함해서 업로드
      console.log('피드 데이터: ', requestBodyCreate);
      // const res = await uploadFeed(requestBodyCreate);
      // console.log('[피드 업로드 성공]:', res);

      resetFeedWrite();
      router.push('/(page)/feed');
    } catch (error) {
      console.error('업로드 실패:', error);
      showToast(
        isEditParam ? '수정에 실패했어!' : '피드 업로드에 실패했어!',
        'error',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmEdit = async () => {
    setIsModalOpen(false);
    // TODO: 수정 API 연결.

    showToast('수정 완료!', 'success');
    router.back();
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false);
    onClickToAddMember();
  };

  const onClickToAddMember = () => {
    router.push('/feed/link-members');
  };

  if (!userInfo) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? undefined : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1 }}>
          <BackgroundImageSlider
            mediaUrls={previewMedia}
            gradient={{ top: 120 * height, bottom: 420 * height }}
          />

          <Header
            isBackWhite
            style={{
              position: 'absolute',
              top: 35,
              width: '100%',
              zIndex: 9999,
              paddingHorizontal: 16 * width,
            }}
          />
          <View
            style={{
              paddingHorizontal: FEED_PADDING * width,
              marginBottom: 24,
              zIndex: 9999,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <ProfileImageWithFallback
                uri={userInfo?.profileImage}
                size={36}
              />
              <StyledText>{userInfo?.name}</StyledText>
              <Badge
                variant="gray"
                iconType="plus"
                label={
                  connectedUsers.length > 0
                    ? `${userInfo?.name} 외 ${connectedUsers.length - 1}명`
                    : '함께한 사람 추가'
                }
                onPress={onClickToAddMember}
              />
            </View>

            {/*  Textarea만 키보드에 반응하도록 분리 */}
            {Platform.OS === 'ios' ? (
              <View style={{ marginBottom: iosKeyboardBottom }}>
                <Textarea
                  variant="dark"
                  placeholder="텍스트를 입력해주세요"
                  maxLength={100}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            ) : (
              <Animated.View
                style={{
                  transform: [{ translateY: androidTranslateY }],
                }}
              >
                <Textarea
                  variant="dark"
                  placeholder="텍스트를 입력해주세요"
                  maxLength={100}
                  value={description}
                  onChangeText={setDescription}
                />
              </Animated.View>
            )}

            <CustomButton
              size="lg"
              onPress={handleUpload}
              style={{
                marginTop: 20 * height,
                marginBottom:
                  Platform.OS === 'android' ? insets.bottom : 8 * height,
              }}
              disabled={
                description.trim().length === 0 ||
                (!isEditParam && !hasAnyImage)
              }
            >
              {isEditParam ? '수정할래' : '업로드할래'}
            </CustomButton>
          </View>

          <PopupModal
            isOpen={isModalOpen}
            onRightBtn={isEditParam ? handleConfirmEdit : handleConfirmUpload}
            onLeftBtn={
              isEditParam ? () => setIsModalOpen(false) : handleConfirmExit
            }
            mainText={
              isEditParam
                ? '피드를 수정할까?'
                : '이 내용으로 피드에 업로드할까?'
            }
            subText={isEditParam ? undefined : '함께한 사람이 추가되지 않았어.'}
            isCancel={!isEditParam}
            leftBtnText={isEditParam ? '취소' : '추가할래'}
            rightBtnText={isEditParam ? '수정할래' : '그냥 업로드할래'}
          />
        </View>

        <FeedUploadModal isOpen={isUploading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const StyledText = styled.Text`
  color: ${colors.white};
  font-family: ${fonts.ExtraBold};
  font-size: ${fontSize.lg};
  margin-right: ${12 * width}px;
  margin-left: ${8 * width}px;
`;
