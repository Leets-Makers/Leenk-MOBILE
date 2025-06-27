import {
  Header,
  BackgroundImageSlider,
  CustomButton,
  Textarea,
  Badge,
} from '@/components';
import colors from '@/theme/color';
import { useRouter } from 'expo-router';
import { Text, View, Image, ScrollView, Platform } from 'react-native';
import { generateMockFeeds } from '@/__mocks__/mockFeed';
import { Author } from '@/types/feed';
import { fonts, fontSize, height, width } from '@/theme/globalStyles';
import { KeyboardAvoidingView } from 'react-native';
import { useState } from 'react';
import PopupModal from '@/components/Modal/PopupModal';
import styled from 'styled-components/native';
import { useImageStore } from '@/stores/feedImageStore';

const mockFeed = generateMockFeeds();
const { userId, name, profileImage } = mockFeed[0].author;

const mockProfile: Author = {
  userId,
  name: '계다현',
  profileImage,
};

export default function FeedWritePage() {
  const [content, setContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedImages = useImageStore((state) => state.selectedImages);

  const handleUpload = () => {
    if (content.trim()) {
      setIsModalOpen(true); // 추후 조건: 함께한 사람 없을 때만 띄우도록 변경
    }
  };

  const handleConfirmExit = () => {
    console.log('추가할래');
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
            isBack
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
                label={'함께한 사람 추가'}
              />
            </View>
            <Textarea
              variant="dark"
              placeholder="텍스트를 입력해주세요"
              maxLength={100}
              value={content}
              onChangeText={setContent}
            />
            <CustomButton
              size="lg"
              onPress={handleUpload}
              style={{ marginTop: 16 * height, marginBottom: 8 * height }}
              disabled={content.trim().length === 0}
            >
              업로드할래
            </CustomButton>
          </View>

          <PopupModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmExit}
            mainText="이 내용으로 피드에 업로드할까?"
            subText="함께한 사람이 추가되지 않았어."
            isCancel={true}
            leftBtnText="추가할래"
            rightBtnText="그냥 업로드할래"
          />
        </View>
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
