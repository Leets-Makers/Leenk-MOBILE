import colors from '@/theme/color';
import {
  fontSize,
  fonts,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import styled from 'styled-components/native';

export const ProfileEditButton = ({
  title,
  content,
  onPress,
  isTextarea = false,
}: {
  title: string;
  content: string;
  onPress: () => void;
  isTextarea?: boolean;
}) => (
  <EditWrapper>
    <Title>{title}</Title>
    {isTextarea ? (
      <TextareaWrapper onPress={onPress}>
        <ScrollableTextContainer>
          <TextareaText>{content}</TextareaText>
        </ScrollableTextContainer>
        <CharCount>{content.length}/200</CharCount>
      </TextareaWrapper>
    ) : (
      <Box onPress={onPress}>
        <BoxText numberOfLines={1}>{content}</BoxText>
      </Box>
    )}
  </EditWrapper>
);

const EditWrapper = styled.View`
  margin-top: ${20 * height}px;
`;

const Title = styled.Text`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.md}px;
  color: ${colors.text[2]};
  margin-bottom: ${12 * height}px;
`;

const Box = styled.Pressable`
  width: 100%;
  border-radius: ${radius.sm}px;
  padding: ${14 * height}px ${14 * width}px;
  background-color: transparent;
  border: 1px solid ${colors.gray[300]};
`;

const BoxText = styled.Text`
  font-family: ${fonts.Regular};
  font-size: ${fontSize.md}px;
  color: ${colors.black};
`;

const TextareaWrapper = styled.Pressable`
  width: 100%;
  height: ${76 * height}px;
  border-radius: 8px;
  padding: ${12 * height}px ${14 * width}px;
  border: 1px solid ${colors.gray[300]};
  position: relative;
  background-color: transparent;
`;

const ScrollableTextContainer = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  max-height: ${36 * height}px;
`;

const TextareaText = styled.Text`
  font-size: ${fontSize.md}px;
  color: ${colors.black};
  font-family: ${fonts.Regular};
  line-height: ${lineHeight.l}px;
`;

const CharCount = styled.Text`
  font-family: ${fonts.Regular};
  font-size: ${fontSize.sm}px;
  position: absolute;
  bottom: ${12 * height}px;
  right: ${12 * width}px;
  color: ${colors.gray[500]};
  margin-top: ${12 * height}px;
`;
