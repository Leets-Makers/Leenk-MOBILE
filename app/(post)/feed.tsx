// 모달 -> 피드 글 쓰기 -> 피드 이미지 선택 페이지
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import colors from '@/theme/color';
import { CustomButton, Header, ImagePicker } from '@/components';
import { BackArrowIcon } from '@/assets';
import { fontSize, fonts, height, width, radius } from '@/theme/globalStyles';
import PopupModal from '@/components/Modal/PopupModal';
import { useImageStore } from '@/stores/feedImageStore';
import { AspectRatio } from '@/types/aspect-ratio';

const SIDE_PADDING = 16;

export default function PostFeedPage() {
  const selectedUris = useImageStore((state) => state.selectedImages);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleBackPress = () => {
    setIsModalOpen(true);
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false);
    router.replace('/(page)/feed');
  };

  return (
    <Container>
      <ContentWrapper>
        <Header
          LeftSection={
            <TouchableOpacity onPress={handleBackPress}>
              <BackArrowIcon />
            </TouchableOpacity>
          }
          TitleSection="게시물 사진 선택"
        />
        <SubText>최대 3장까지 선택 가능해</SubText>
        <View style={{ flex: 1 }}>
          <ImagePicker
            maxSelect={3}
            aspectRatio={AspectRatio.PORTRAIT}
            mode="feed"
          />
        </View>
      </ContentWrapper>

      <View
        style={{
          paddingHorizontal: SIDE_PADDING * width,
          paddingBottom: 32 * height,
          paddingTop: 16 * height,
        }}
      >
        <CustomButton
          variant="primary"
          size="lg"
          disabled={selectedUris.length === 0}
          onPress={() => router.push('/(post)/feed/write')}
        >
          {selectedUris.length > 0 && (
            <CircleBadge>
              <ButtonText>{selectedUris.length}</ButtonText>
            </CircleBadge>
          )}
          다음
        </CustomButton>
      </View>

      <PopupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmExit}
        mainText="글 작성을 그만둘래?"
        subText="작성하던 내용은 저장되지 않아."
        isCancel={true}
        rightBtnText="취소"
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const ContentWrapper = styled.View`
  flex: 1;
  padding: 0 ${SIDE_PADDING}px;
`;

const SubText = styled.Text`
  font-family: ${fonts.Regular};
  font-size: ${fontSize.sm}px;
  color: ${colors.primary};
  padding-top: ${12 * height}px;
  padding-bottom: ${16 * height}px;
`;

const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CircleBadge = styled.View`
  background-color: ${colors.primaryDark};
  border-radius: ${radius.full}px;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const ButtonText = styled.Text<{ disabled?: boolean }>`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.sm}px;
  color: ${({ disabled }) => (disabled ? colors.gray[100] : colors.white)};
`;
