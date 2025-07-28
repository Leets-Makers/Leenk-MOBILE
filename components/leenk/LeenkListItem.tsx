import React from 'react';
import styled from 'styled-components/native';
import ProfileImageWithFallback from '@/components/feed/ProfileImageWithFallback';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { ClockIcon, PeopleIcon } from '@/assets';

interface LeenkListItemProps {
  title: string;
  date: string;
  people: string;
  name: string;
  leenkImageUri?: string | null;
  profileImageUri?: string | null;
}

export default function LeenkListItem({
  title,
  date,
  people,
  name,
  leenkImageUri,
  profileImageUri,
}: LeenkListItemProps) {
  return (
    <Container>
      <StyledImage source={leenkImageUri} resizeMode="cover" />
      <ContentWrapper>
        <TitleText>{title}</TitleText>

        <Row>
          <ClockIcon />
          <TimeText>{date}</TimeText>
          <PeopleIcon style={{ marginLeft: width * 12 }} />
          <TimeText style={{ marginLeft: width * 4 }}>{people}</TimeText>
        </Row>

        <Row style={{ marginTop: height * 8 }}>
          <ProfileImageWithFallback uri={profileImageUri} size={20} isDark />
          <NameText>{name}</NameText>
        </Row>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.View`
  width: 100%;
  height: ${height * 104}px;
  padding: ${height * 12}px ${width * 12}px;
  flex-direction: row;
  align-items: center;
`;

const StyledImage = styled.Image`
  height: ${height * 80}px;
`;

const ContentWrapper = styled.View`
  margin-left: ${width * 12}px;
  flex: 1;
`;

const TitleText = styled.Text`
  color: ${colors.black};
  font-family: ${fonts.ExtraBold};
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${height * 4}px;
`;

const TimeText = styled.Text`
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
