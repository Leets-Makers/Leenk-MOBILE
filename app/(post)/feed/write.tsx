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
import { router } from 'expo-router';
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { Media } from '@/types/feed';
import { fonts, fontSize, height, width } from '@/theme/globalStyles';
import { useState } from 'react';
import PopupModal from '@/components/Modal/PopupModal';
import styled from 'styled-components/native';
import { useFeedWriteStore } from '@/stores/feedWriteStore';
import FeedUploadModal from '@/components/Modal/FeedUploadingModal';
import { uploadFeed } from '@/api/feed/feed.api';
import { useToastStore } from '@/stores/toastStore';
import { useUserStore } from '@/stores/userStore';
import GradientOverlay from '@/components/feed/GradientOverlay';
import useKeyboardAnimation from '@/hooks/useKeyboardAnimation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeedWritePage() {
  const selectedImages = useFeedWriteStore((state) => state.selectedImages);
  const connectedUsers = useFeedWriteStore((state) => state.users);
  const description = useFeedWriteStore((state) => state.description);
  const setDescription = useFeedWriteStore((state) => state.setDescription);
  const mediaUrls = useFeedWriteStore((state) => state.mediaUrls);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const resetFeedWrite = useFeedWriteStore((state) => state.reset);

  const { showToast } = useToastStore();
  const { userInfo } = useUserStore();

  const buttonTranslateY = useKeyboardAnimation(
    Platform.OS === 'ios' ? -390 * height : -85,
  );

  const insets = useSafeAreaInsets();

  const media: Media[] = selectedImages.map((img, index) => ({
    position: index + 1,
    mediaUrl: img.uri,
    mediaType: 'IMAGE' as const,
  }));

  const requestBody = {
    description,
    media: mediaUrls,
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1 }}>
          <BackgroundImageSlider
            mediaUrls={media}
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
            style={{ paddingHorizontal: 16, marginBottom: 24, zIndex: 9999 }}
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
                  marginTop: 16 * height,
                  marginBottom:
                    Platform.OS === 'android' ? insets.bottom : 8 * height,
                }}
                disabled={description.trim().length === 0}
              >
                업로드할래
              </CustomButton>
            </Animated.View>
          </View>

          <PopupModal
            isOpen={isModalOpen}
            onRightBtn={handleConfirmUpload}
            onLeftBtn={handleConfirmExit}
            mainText="이 내용으로 피드에 업로드할까?"
            subText="함께한 사람이 추가되지 않았어."
            isCancel={true}
            leftBtnText="추가할래"
            rightBtnText="그냥 업로드할래"
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
