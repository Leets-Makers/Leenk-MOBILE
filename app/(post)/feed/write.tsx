import { Header, BackgroundImageSlider, Loading } from '@/components';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Media } from '@/types/feed';
import { height, width } from '@/theme/globalStyles';
import { useCallback, useEffect, useRef, useState } from 'react';
import PopupModal from '@/components/Modal/PopupModal';
import { useFeedWriteStore } from '@/stores/feedWriteStore';
import FeedUploadModal from '@/components/Modal/FeedUploadingModal';
import { patchMyFeed, uploadFeed } from '@/api/feed/feed.api';
import { useToastStore } from '@/stores/toastStore';
import { useUserStore } from '@/stores/userStore';
import { FEED_PADDING } from '@/constants';
import AuthorContent from '@/components/feed/write/AuthorContent';
import DescriptionContent from '@/components/feed/write/DescriptionContent';
import useIOSKeyboardSpacer from '@/hooks/useIOSKeyboardSpacer';
import ButtonContent from '@/components/feed/write/ButtonContent';

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

  const writeBadgeLabel =
    connectedUsers.length > 0
      ? `${userInfo?.name} 외 ${connectedUsers.length}명`
      : null;

  const IOS_TEXTAREA_GAP = 50 * height;
  const iosKeyboardBottom = useIOSKeyboardSpacer(IOS_TEXTAREA_GAP);

  const didInitRef = useRef(false);

  const [kbVisible, setKbVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKbVisible(true),
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKbVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // edit 모드에 들어오면 로컬 선택 이미지는 비워서 중복/혼선 제거
  useEffect(() => {
    if (isEditParam && selectedImages.length > 0) {
      setSelectedImages([]);
    }
  }, [isEditParam]);

  useFocusEffect(
    useCallback(() => {
      if (!isEditParam && !didInitRef.current) {
        useFeedWriteStore.getState().startCreate();
        didInitRef.current = true; // 이후부터는 재초기화 방지
      }
      return () => {};
    }, [isEditParam]),
  );

  const hasAnyImage = mediaUrls.length > 0;

  const previewMedia: Media[] = mediaUrls.map((m, idx) => ({
    position: idx + 1,
    mediaUrl: m.mediaUrl,
    mediaType: m.mediaType,
  }));

  const requestBodyCreate = {
    description,
    media: mediaUrls, // create는 이미지 포함
    userIds: connectedUsers.map((u) => u.userId),
  };

  const requestBodyEdit = {
    description,
    userIds: connectedUsers.map((u) => u.userId),
  };

  const handleUpload = async () => {
    if (!description.trim()) return;

    if (!isEditParam && !hasAnyImage) {
      showToast('이미지를 최소 1장 선택해줘!', 'error');
      return;
    }

    if (isEditParam) {
      setIsModalOpen(true);
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

  // 피드 업로드 함수
  const handleUploadFeed = async () => {
    setIsUploading(true);
    try {
      // 생성 api 호출
      await uploadFeed(requestBodyCreate);

      resetFeedWrite();
      didInitRef.current = false;
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

  // 피드 수정
  const handleConfirmEdit = async () => {
    setIsModalOpen(false);
    setIsUploading(true);
    try {
      // if (__DEV__) console.log('수정 내용 : ', requestBodyEdit);

      const idNum = typeof feedId === 'string' ? Number(feedId) : NaN;
      if (Number.isNaN(idNum) || idNum <= 0) {
        showToast('잘못된 피드 아이디야!', 'error');
        return;
      }

      await patchMyFeed(Number(feedId), requestBodyEdit);
      showToast('수정 완료!', 'success');
      resetFeedWrite();
      router.dismissAll();

      router.replace({
        pathname: '/(post)/feed/[id]',
        params: { id: String(feedId), rev: Date.now().toString() },
      });
    } catch (e) {
      console.error(e);
      showToast('수정에 실패했어!', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false);
    onClickToAddMember();
  };

  const onClickToAddMember = () => {
    router.push({
      pathname: '/feed/link-members',
      params: { mode, feedId },
    });
  };

  if (!userInfo) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? undefined : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <View style={{ flex: 1 }}>
          <BackgroundImageSlider
            mediaUrls={previewMedia}
            gradient={{ top: 120 * height, bottom: 420 * height }}
          />

          {/* 헤더  */}
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
              marginBottom: 36 * height,
              zIndex: 9999,
            }}
          >
            {/* 작성자 관련 영역 */}
            <AuthorContent
              profileImage={userInfo?.profileImage}
              name={userInfo?.name}
              label={writeBadgeLabel}
              isUserBirthdayToday={userInfo?.isUserBirthdayToday}
              onPressBadge={onClickToAddMember}
            />

            {/*  내용 영역 */}
            <DescriptionContent
              value={description}
              onChange={setDescription}
              iosBottomGap={iosKeyboardBottom}
            />

            {/* 버튼 영역 */}
            <ButtonContent
              isEditMode={isEditParam}
              onPress={handleUpload}
              disabled={
                isUploading ||
                description.trim().length === 0 ||
                (!isEditParam && !hasAnyImage)
              }
            />
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

          {kbVisible && (
            <Pressable
              style={StyleSheet.absoluteFillObject}
              onPress={Keyboard.dismiss}
              pointerEvents="auto"
              accessible={false}
            />
          )}
        </View>

        <FeedUploadModal isOpen={isUploading && !isEditParam} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
