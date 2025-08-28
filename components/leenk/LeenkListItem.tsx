import React from 'react';
import styled from 'styled-components/native';
import ProfileImageWithFallback from '@/components/feed/ProfileImageWithFallback';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import { CheckerIcon, ClockIcon, PeopleIcon } from '@/assets';
import { useRouter } from 'expo-router';

import { Leenk } from '@/types/leenk';
import { formatMonthDayHour } from '@/utils/format-date';

interface Props {
  item: Leenk;
}

export default function LeenkListItem({ item }: Props) {
  const router = useRouter();
  return (
    <PressableContainer onPress={() => router.push(`/leenk/${item.leenkId}`)}>
      {({ pressed }) => (
        <StyledContainer $pressed={pressed}>
          {item.thumbNail ? (
            <StyledImage source={{ uri: item.thumbNail }} resizeMode="cover" />
          ) : (
            <FallbackWrapper>
              <CheckerIcon width={width * 80} />
            </FallbackWrapper>
          )}

          <ContentWrapper>
            <TopSection>
              <TitleText>
                {item.title.length > 12
                  ? `${item.title.slice(0, 12)}...`
                  : item.title}
              </TitleText>
              <Row>
                <ClockIcon />
                <TimeText>{formatMonthDayHour(item.startTime)}</TimeText>
                <PeopleIcon style={{ marginLeft: width * 12 }} />
                <TimeText style={{ marginLeft: width * 4 }}>
                  {item.currentParticipants}/{item.maxParticipants}
                </TimeText>
              </Row>
            </TopSection>

            <BottomRow>
              <ProfileImageWithFallback
                uri={item.author.profileImage}
                size={20}
              />
              <NameText>{item.author.name}</NameText>
            </BottomRow>
          </ContentWrapper>
        </StyledContainer>
      )}
    </PressableContainer>
  );
}

const PressableContainer = styled.Pressable``;

const StyledContainer = styled.View<{ $pressed: boolean }>`
  width: 100%;
  height: ${height * 104}px;
  padding: ${height * 12}px ${width * 12}px;
  flex-direction: row;
  border-radius: ${radius.md}px;
  background-color: ${({ $pressed }) =>
    $pressed ? colors.bg[3] : colors.white};
`;

const StyledImage = styled.Image`
  height: ${height * 80}px;
  width: ${width * 80}px;
  border-radius: ${radius.xs}px;
`;

const FallbackWrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.View`
  margin-left: ${width * 12}px;
  flex: 1;
  justify-content: space-between;
`;

const TopSection = styled.View``;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${height * 4}px;
`;

const BottomRow = styled(Row)`
  margin-top: 0;
`;

const TitleText = styled.Text`
  color: ${colors.black};
  font-family: ${fonts.ExtraBold};
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
`;

export const TimeText = styled.Text`
  color: ${colors.text[3]};
  font-family: ${fonts.Regular};
  font-size: ${fontSize.sm}px;
  line-height: ${lineHeight.s}px;
  margin-left: ${width * 4}px;
`;

const NameText = styled.Text`
  color: ${colors.text[1]};
  font-family: ${fonts.Regular};
  font-size: ${fontSize.sm}px;
  line-height: ${lineHeight.s}px;
  margin-left: ${width * 4}px;
`;
