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
import dayjs from 'dayjs';

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
}) => {
  const placeholders: Record<string, string> = {
    '카톡 아이디': '모임원들과의 연락을 위해 필요해',
    MBTI: 'MBTI를 입력해줘',
    생일: '생일을 입력해줘',
    자기소개: '자기소개를 입력해줘',
  };

  const isEmpty = !content || content.trim().length === 0;
  const placeholderText = placeholders[title] || '';

  // 생일이면 MM월 DD일 포맷 (연도 제외)
  const formattedContent =
    title === '생일' && !isEmpty
      ? dayjs(content, 'YYYY-MM-DD').format('MM월 DD일')
      : content;

  const displayText = isEmpty ? placeholderText : formattedContent;
  const textColor = isEmpty ? colors.gray[400] : colors.black;

  return (
    <EditWrapper>
      <Title>{title}</Title>
      {isTextarea ? (
        <TextareaWrapper onPress={onPress}>
          <ScrollableTextContainer>
            <TextareaText style={{ color: textColor }}>
              {displayText}
            </TextareaText>
          </ScrollableTextContainer>
          <CharCount>{content.length}/200</CharCount>
        </TextareaWrapper>
      ) : (
        <Box onPress={onPress}>
          <BoxText numberOfLines={1} style={{ color: textColor }}>
            {displayText}
          </BoxText>
        </Box>
      )}
    </EditWrapper>
  );
};

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
