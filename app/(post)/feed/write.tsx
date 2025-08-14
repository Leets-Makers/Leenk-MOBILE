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
  const isEditParam = mode === 'edit' && !!feedId;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { showToast } = useToastStore();
  const { userInfo } = useUserStore();

  const {
    startCreate,
    startEditFromDetail,
    reset,
    mediaUrls,
    selectedImages,
    users,
    description,
    setDescription,
    reset: resetFeedWrite,
    feedId: storeFeedId,
  } = useFeedWriteStore();

  const connectedUsers = users;

  const buttonTranslateY = useKeyboardAnimation(
    Platform.OS === 'ios' ? -390 * height : -85,
  );

  const insets = useSafeAreaInsets();

  // 기존 서버 이미지 + 로컬 새 이미지 합쳐서 슬라이더에 전달
  const previewMedia: Media[] = [
    ...mediaUrls.map((m) => ({
      position: m.position,
      mediaUrl: m.mediaUrl,
      mediaType: m.mediaType,
    })),
    ...selectedImages.map((img, i) => ({
      position: mediaUrls.length + i, // 뒤에 이어붙이기
      mediaUrl: img.uri, // 로컬 uri
      mediaType: 'IMAGE' as const,
    })),
  ];

  const requestBody = {
    description,
    media: previewMedia,
    userId: connectedUsers.map((user) => user.userId),
  };

  const handleUpload = async () => {
    if (!description.trim()) return;

    if (connectedUsers.length === 0) {
      setIsModalOpen(true);
    } else {
      handleUploadFeed(); // 함께한 사람이 있는 경우 바로 업로드
    }
  };

  const handleConfirmUpload = async () => {
    setIsModalOpen(false);
    handleUploadFeed(); // 함께한 사람 없는 경우 모달에서 확인 후 업로드
  };

  // 업로드 로직 분리
  const handleUploadFeed = async () => {
    if (isEditParam) {
      setIsModalOpen(true);
      return;
    }

    setIsUploading(true);

    try {
      const res = await uploadFeed(requestBody);
      console.log('[피드 업로드 성공]:', res);

      resetFeedWrite();
      router.push('/(page)/feed');
    } catch (error) {
      console.error('업로드 실패:', error);
      showToast('피드 업로드에 실패했어!', 'error');
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

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!isEditParam) {
        // ------- 생성 모드 -------
        const s = useFeedWriteStore.getState();

        const hasDraft =
          s.selectedImages.length > 0 ||
          !!s.description?.trim() ||
          s.users.length > 0;

        const hasEditResidue = s.isEdit || !!s.feedId || s.mediaUrls.length > 0;

        if (hasEditResidue) {
          if (hasDraft) {
            // 초안은 유지하고, 수정 전용 잔상만 제거
            useFeedWriteStore.setState({
              isEdit: false,
              feedId: undefined,
              mediaUrls: [],
            });
          } else {
            // 초안이 없으면 완전 초기화
            startCreate(); // selectedImages/users/description도 비움
          }
        }
        return;
      }

      // ------- 수정 모드 보강 -------
      if (storeFeedId === Number(feedId) && mediaUrls.length > 0) return;

      reset();
      try {
        const detail = await getFeedDetail(Number(feedId));
        if (!cancelled) startEditFromDetail(detail);
      } catch {
        if (!cancelled) {
          showToast('피드 정보를 불러오지 못했어!', 'error');
          router.back();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isEditParam,
    feedId,
    mediaUrls.length,
    storeFeedId,
    startCreate,
    startEditFromDetail,
    reset,
    showToast,
  ]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
            <Animated.View
              style={{
                transform: [{ translateY: buttonTranslateY }],
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
                      ? `${userInfo?.name} 외 ${connectedUsers.length}명`
                      : '함께한 사람 추가'
                  }
                  onPress={onClickToAddMember}
                />
              </View>

              <Textarea
                variant="dark"
                placeholder="텍스트를 입력해주세요"
                maxLength={100}
                value={description}
                onChangeText={setDescription}
              />

              <CustomButton
                size="lg"
                onPress={handleUpload}
                style={{
                  marginTop: 20 * height,
                  marginBottom:
                    Platform.OS === 'android' ? insets.bottom : 8 * height,
                }}
                disabled={description.trim().length === 0}
              >
                {isEditParam ? '수정할래' : '업로드할래'}
              </CustomButton>
            </Animated.View>
          </View>

          <PopupModal
            isOpen={isModalOpen}
            onRightBtn={isEditParam ? handleConfirmEdit : handleConfirmUpload}
            onLeftBtn={
              isEditParam ? () => setIsModalOpen(false) : handleConfirmExit
            }
            mainText={
              isEditParam ? '수정할까?' : '이 내용으로 피드에 업로드할까?'
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
