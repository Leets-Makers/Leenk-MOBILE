import {
  ClockIcon,
  LocateIcon,
  PeopleIcon,
  RightArrowIcon,
  ShareIcon,
} from '@/assets';
import { ProfileImageWithFallback } from '@/components';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import colors from '@/theme/color';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { formatMonthDayHour, formatRelativeTime } from '@/utils/format-date';
import { TimeText } from '@/components/leenk/LeenkListItem';
import { LeenkDetail } from '@/types/leenk';

interface Props {
  data: LeenkDetail;
  insetBottom: number;
  onShare: () => void;
  onParticipants: () => void;
}

export default function LeenkContentSection({
  data,
  insetBottom,
  onShare,
  onParticipants,
}: Props) {
  return (
    <Container showsVerticalScrollIndicator={false}>
      <TitleRow>
        <Title>{data.title}</Title>
        {/* <ShareButton onPress={onShare}>
          <ShareIcon width={24 * width} />
        </ShareButton> */}
      </TitleRow>

      <RowWrapper>
        <ProfileImageWithFallback uri={data.author.profileImage} size={24} />
        <TimeText style={{ marginLeft: width * 8 }}>
          {data.author.name}・{formatRelativeTime(data.createdAt)}
        </TimeText>
      </RowWrapper>

      <Line />

      <RowWrapper>
        <PeopleIcon width={width * 16} />
        <TimeText>
          {data.currentParticipants}/{data.maxParticipants}명
        </TimeText>
        <Pressable onPress={onParticipants}>
          <RightArrowIcon width={width * 16} />
        </Pressable>
      </RowWrapper>

      <RowWrapper>
        <LocateIcon width={width * 16} />
        <TimeText>{data.placeName}</TimeText>
      </RowWrapper>

      <RowWrapper>
        <ClockIcon width={width * 16} />
        <TimeText>{formatMonthDayHour(data.startTime)}</TimeText>
      </RowWrapper>

      <ContentWrapper $insetBottom={insetBottom}>
        <ContentText>{data.content}</ContentText>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.ScrollView`
  flex: 1;
  padding-horizontal: ${width * 16}px;
  padding-top: ${height * 16}px;
`;

const TitleRow = styled.View`
  position: relative;
`;

const Title = styled.Text`
  font-family: ${fonts.ExtraBold};
  color: ${colors.black};
  font-size: ${fontSize.lg};
  line-height: ${lineHeight.l};
  padding-right: ${width * 52}px;
  align-items: center;
`;

const ShareButton = styled.Pressable`
  position: absolute;
  top: 0;
  right: 0;
  width: ${width * 44}px;
  height: ${height * 44}px;
  background-color: ${colors.bg[4]};
  border-radius: 99px;
  align-items: center;
  justify-content: center;
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${12 * height}px;
`;

const Line = styled.View`
  height: ${height * 1}px;
  background-color: ${colors.divider[2]};
  margin-top: ${16 * height}px;
`;

const ContentWrapper = styled.ScrollView<{ $insetBottom: number }>`
  padding-bottom: ${({ $insetBottom }) => $insetBottom + 100 * height}px;
`;

const ContentText = styled.Text`
  margin-top: ${height * 20}px;
  font-family: ${fonts.Bold};
  color: ${colors.text[1]};
  line-height: ${lineHeight.m};
  font-size: ${fontSize.md};
`;
