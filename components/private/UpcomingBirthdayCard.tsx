import { ScrollView } from 'react-native';
import ProfileImageWithFallback from '@/components/feed/ProfileImageWithFallback';
import { fonts, fontSize, height, radius, width } from '@/theme/globalStyles';
import colors from '@/theme/color';
import styled from 'styled-components/native';
import { formatMonthDay } from '@/utils/format-date';

export interface UpcomingBirthdayUser {
  userId: number;
  name: string;
  thumbnail: string;
  isUserBirthdayToday: boolean;
  birthday: string;
}

export default function BirthdayCloseCardList({
  data,
}: {
  data: UpcomingBirthdayUser[];
}) {
  return (
    <ScrollContainer horizontal showsHorizontalScrollIndicator={false}>
      {data.map((item, idx) => (
        <Card
          key={idx}
          style={{
            marginRight: idx === data.length - 1 ? 20 * width : 8, // 마지막 카드 마진
            marginLeft: idx === 0 ? 20 * width : 0, // 첫 번째 카드 마진
          }}
        >
          <ProfileImageWithFallback uri={item.thumbnail} size={40} />
          <UserName>{item.name}</UserName>
          <UserBirthday>{formatMonthDay(item.birthday)}</UserBirthday>
        </Card>
      ))}
    </ScrollContainer>
  );
}

const ScrollContainer = styled(ScrollView)`
  width: 100%;
`;

const Card = styled.View`
  min-width: ${95 * width}px;
  height: ${124 * height}px;
  padding: ${16 * height}px ${20 * width}px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${colors.white};
  border-radius: ${radius.lg}px;
  margin-right: ${8 * width}px;
`;

const UserName = styled.Text`
  margin-top: ${10 * height}px;
  font-family: ${fonts.Regular};
  font-size: ${fontSize.lg}px;
  color: ${colors.text[1]};
`;

const UserBirthday = styled.Text`
  margin-top: ${8 * height}px;
  font-family: ${fonts.Regular};
  font-size: ${fontSize.sm}px;
  color: ${colors.text[3]};
`;
