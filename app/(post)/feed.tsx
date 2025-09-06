import { useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PostFeedPage() {
  const insets = useSafeAreaInsets();
  const selectedUrisLength = useFeedWriteStore(
    (state) => state.selectedImages.length,
  );
  const selectedImages = useFeedWriteStore((state) => state.selectedImages);
  const resetSelectedImages = useFeedWriteStore.getState().reset;

  const setMediaUrls = useFeedWriteStore.getState().setMediaUrls;

  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBackPress = () => {
    setIsModalOpen(true);
  };

  const handleConfirmExit = () => {
    setIsModalOpen(false);
    resetSelectedImages();
    router.push('/(page)/feed');
  };

  const handleNext = async () => {
    setIsUploading(true);

    try {
      const fileNames = selectedImages.map((img) => img.filename);

      const presignedUrls = await getPresignedUrl(fileNames);

      const mediaArray: Media[] = [];

      for (let i = 0; i < presignedUrls.length; i++) {
        const { fileName, mediaUrl } = presignedUrls[i];
        const foundImage = selectedImages.find(
          (img) => img.filename === fileName,
        );
        if (!foundImage) continue;
        const { uri } = foundImage;

        try {
          await uploadImageToS3(mediaUrl, uri);
        } catch (uploadError) {
          console.error(`S3 업로드 실패 (${fileName}):`, uploadError);
          continue;
        }

        mediaArray.push({
          position: i + 1,
          mediaUrl: mediaUrl.split('?')[0],
          mediaType: 'IMAGE',
        });
      }

      setMediaUrls(mediaArray);
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
        <View style={{ paddingHorizontal: CONTAINER_PADDING * width }}>
          <Header signUpBackPress={handleBackPress}>게시물 사진 선택</Header>
          <SubText>최대 3장까지 선택 가능해</SubText>
        </View>
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
          paddingBottom: 10 * height + insets.bottom,
          paddingTop: 16 * height,
          paddingHorizontal: CONTAINER_PADDING * width,
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
        onRightBtn={() => setIsModalOpen(false)}
        onLeftBtn={handleConfirmExit}
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
