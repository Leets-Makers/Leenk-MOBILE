import { View } from 'react-native';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { fonts, fontSize, width } from '@/theme/globalStyles';
import { Badge, ProfileImageWithFallback } from '@/components';

interface Props {
  profileImage?: string | null;
  name?: string | null;
  label: string | null; // "OOO 외 N명" 또는 null
  onPressBadge: () => void;
}

export default function AuthorContent({
  profileImage,
  name,
  label,
  onPressBadge,
}: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <ProfileImageWithFallback uri={profileImage} size={36} />
      <StyledText>{name}</StyledText>

      <Badge
        variant="gray"
        iconType="plus"
        label={label ?? '함께한 사람 추가'}
        onPress={onPressBadge}
      />
    </View>
  );
}

export const StyledText = styled.Text`
  color: ${colors.white};
  font-family: ${fonts.ExtraBold};
  font-size: ${fontSize.lg}px;
  margin-right: ${12 * width}px;
  margin-left: ${8 * width}px;
`;
