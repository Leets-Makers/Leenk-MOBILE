// 모달 -> 피드 글 쓰기 -> 피드 이미지 선택 페이지
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import colors from '@/theme/color';
import { Header, ImagePicker } from '@/components';
import { fontSize, fonts, height, width, radius } from '@/theme/globalStyles';
import PopupModal from '@/components/Modal/PopupModal';
import { useImageStore } from '@/stores/feedImageStore';
import { AspectRatio } from '@/types/aspect-ratio';
import { CONTAINER_PADDING } from '@/constants';
import { sizeStyles } from '@/components/common/Button/CustomButton.styled';

export default function PostFeedPage() {
  const selectedUrisLength = useImageStore(
    (state) => state.selectedImages.length,
  );

  console.log('[🔁 selectedUrisLength]:', selectedUrisLength);

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
      <View style={{ flex: 1 }}>
        <Header signUpBackPress={handleBackPress}>게시물 사진 선택</Header>
        <SubText>최대 3장까지 선택 가능해</SubText>
        <View style={{ flex: 1 }}>
          <ImagePicker
            maxSelect={3}
            aspectRatio={AspectRatio.PORTRAIT}
            mode="feed"
          />
        </View>
      </View>

      <View
        style={{
          paddingBottom: 32 * height,
          paddingTop: 16 * height,
        }}
      >
        <SubmitButton
          disabled={selectedUrisLength === 0}
          onPress={() => router.push('/(post)/feed/write')}
        >
          {selectedUrisLength > 0 && (
            <CircleBadge>
              <BadgeText>{selectedUrisLength}</BadgeText>
            </CircleBadge>
          )}
          <SubmitText>다음</SubmitText>
        </SubmitButton>
      </View>

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
    </Container>
  );
}

export const Container = styled.View`
  flex: 1;
  padding: 0 ${CONTAINER_PADDING * width}px;
`;

export const SubmitText = styled.Text`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.md}px;
  color: ${colors.white};
`;

export const CircleBadge = styled.View`
  background-color: ${colors.primaryDark};
  border-radius: ${radius.full}px;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

export const ButtonText = styled.Text<{ disabled?: boolean }>`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.sm}px;
  color: ${({ disabled }) => (disabled ? colors.gray[100] : colors.white)};
`;

export const SubText = styled.Text`
  font-family: ${fonts.Regular};
  font-size: ${fontSize.sm}px;
  color: ${colors.primary};
  padding-top: ${12 * height}px;
  padding-bottom: ${16 * height}px;
`;

export const SubmitButton = styled(TouchableOpacity)<{ disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${sizeStyles.lg.height}px;
  padding-vertical: ${sizeStyles.lg.paddingVertical}px;
  padding-horizontal: ${sizeStyles.lg.paddingHorizontal}px;
  border-radius: ${radius.md}px;
  background-color: ${({ disabled }) =>
    disabled ? colors.gray[200] : colors.primary};
`;

export const BadgeText = styled.Text`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.sm}px;
  color: ${colors.white};
`;
