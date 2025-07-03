import {
  Header,
  BackgroundImageSlider,
  CustomButton,
  Textarea,
  Badge,
} from '@/components';
import colors from '@/theme/color';
import { router, useRouter } from 'expo-router';
import { Text, View, Image, ScrollView, Platform } from 'react-native';
import { generateMockFeeds } from '@/__mocks__/mockFeed';
import { Author } from '@/types/feed';
import { fonts, fontSize, height, width } from '@/theme/globalStyles';
import { KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import PopupModal from '@/components/Modal/PopupModal';
import styled from 'styled-components/native';
import { useFeedWriteStore } from '@/stores/feedWriteStore';
import FeedUploadModal from '@/components/Modal/FeedUploadingModal';

const mockFeed = generateMockFeeds();
const { userId, profileImage } = mockFeed[0].author;

const mockProfile: Author = {
  userId,
  name: '계다현',
  profileImage,
};

export default function FeedWritePage() {
  const selectedImages = useFeedWriteStore((state) => state.selectedImages);
  const connectedUsers = useFeedWriteStore((state) => state.users);
  const description = useFeedWriteStore((state) => state.description);
  const setDescription = useFeedWriteStore((state) => state.setDescription);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const resetFeedWrite = useFeedWriteStore((state) => state.reset);

  const handleUpload = async () => {
    if (!description.trim()) return;

    if (connectedUsers.length === 0) {
      setIsModalOpen(true);
    } else {
      uploadFeed(); // 함께한 사람이 있는 경우 바로 업로드
    }
  };

  const handleConfirmUpload = async () => {
    setIsModalOpen(false);
    uploadFeed(); // 함께한 사람 없는 경우 모달에서 확인 후 업로드
  };

  // 업로드 로직 분리
  const uploadFeed = async () => {
    setIsUploading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // TODO: 피드 업로드 api 요청

      resetFeedWrite();
      router.push('/(page)/feed');
    } catch (error) {
      console.error('업로드 실패:', error);
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -40 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1 }}>
          <BackgroundImageSlider mediaUrls={selectedImages} />
          <Header
            isBackWhite
            style={{
              position: 'absolute',
              top: 0,
              width: '100%',
              zIndex: 20,
              paddingHorizontal: 16 * width,
            }}
          />
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Image
                source={{ uri: mockProfile.profileImage }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  marginRight: 8,
                }}
              />
              <StyledText>{mockProfile.name}</StyledText>
              <Badge
                variant="gray"
                iconType="plus"
                label={
                  connectedUsers.length > 0
                    ? `${mockProfile.name} 외 ${connectedUsers.length}명`
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
              style={{ marginTop: 16 * height, marginBottom: 8 * height }}
              disabled={description.trim().length === 0}
            >
              업로드할래
            </CustomButton>
          </View>

          <PopupModal
            isOpen={isModalOpen}
            onConfirm={handleConfirmUpload}
            onClose={handleConfirmExit}
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
`;
