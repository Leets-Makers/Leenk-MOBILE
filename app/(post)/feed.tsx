// 모달 -> 피드 글 쓰기 -> 피드 이미지 선택 페이지
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import colors from '@/theme/color';
import { Header, ImagePicker, Loading } from '@/components';
import { fontSize, fonts, height, width, radius } from '@/theme/globalStyles';
import PopupModal from '@/components/Modal/PopupModal';
import { AspectRatio } from '@/types/aspect-ratio';
import { CONTAINER_PADDING } from '@/constants';
import { sizeStyles } from '@/components/common/Button/CustomButton.styled';
import { useFeedWriteStore } from '@/stores/feedWriteStore';
import { getPresignedUrl, uploadImageToS3 } from '@/utils/s3Upload';
import { Media } from '@/types/feed';

export default function PostFeedPage() {
  const selectedUrisLength = useFeedWriteStore(
    (state) => state.selectedImages.length,
  );
  const selectedImages = useFeedWriteStore((state) => state.selectedImages);
  const resetSelectedImages = useFeedWriteStore.getState().reset;

  const setMediaUrls = useFeedWriteStore.getState().setMediaUrls;
  const [isUploading, setIsUploading] = useState(false);

  console.log('[🔁 selectedUrisLength]:', selectedUrisLength);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleBackPress = () => {
    setIsModalOpen(true);
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false);
    resetSelectedImages();
    router.replace('/(page)/feed');
  };

  const handleNext = async () => {
    setIsUploading(true);

    try {
      // 1. 파일명 추출
      const fileNames = selectedImages.map((img) => img.filename);
      console.log('파일명: ', fileNames);
      // 2. presigned url 요청
      const presignedUrls = await getPresignedUrl(fileNames);
      console.log('presigned url : ', presignedUrls);

      // 3. S3 업로드 및 mediaUrl 배열 생성
      const mediaArray: Media[] = [];

      for (let i = 0; i < presignedUrls.length; i++) {
        const { fileName, mediaUrl } = presignedUrls[i];
        const foundImage = selectedImages.find(
          (img) => img.filename === fileName,
        );
        if (!foundImage) continue;
        const { uri } = foundImage;

        // S3 업로드
        try {
          await uploadImageToS3(mediaUrl, uri);
        } catch (uploadError) {
          console.error(`S3 업로드 실패 (${fileName}):`, uploadError);
          continue; // 실패한 이미지는 media 에 추가하지 않음
        }

        // media 배열에 추가
        mediaArray.push({
          position: i + 1,
          mediaUrl: mediaUrl.split('?')[0],
          mediaType: 'IMAGE',
        });
      }
      // 4. 전역 상태 업데이트
      setMediaUrls(mediaArray);
      console.log('MediaUrls : ', mediaArray);
      // 다음 페이지 이동
      router.push('/(post)/feed/write');
    } catch (error) {
      console.error('이미지 업로드 중 에러 발생:', error);
    } finally {
      setIsUploading(false);
    }
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
        <SubmitButton disabled={selectedUrisLength === 0} onPress={handleNext}>
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

      {isUploading && <Loading />}
    </Container>
  );
}

export const Container = styled.View`
  flex: 1;
  padding: 0 ${CONTAINER_PADDING * width}px;
  background-color: ${colors.gray[50]};
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
