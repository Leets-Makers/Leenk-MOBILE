import { useEffect } from 'react';
import { Header } from '@/components';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import {
  fontSize,
  fonts,
  width,
  height,
  lineHeight,
} from '@/theme/globalStyles';
import BirthdayLetterCard from '@/components/private/BirthdayLetterCard';
import { useBirthdayStore } from '@/stores/birthdayStore';
import { LeenkGrayIcon } from '@/assets';

export default function BirthdayLettersPage() {
  const { birthdayLetters, fetchBirthdayLetters } = useBirthdayStore();

  useEffect(() => {
    fetchBirthdayLetters();
  }, []);

  const letters = birthdayLetters ?? [];

  //  연도별로 편지 그룹화
  const groupedByYear = letters.reduce(
    (acc, letter) => {
      const year = new Date(letter.createdAt).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(letter);
      return acc;
    },
    {} as Record<number, typeof letters>,
  );

  // 최신 연도부터 표시
  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <>
      <Container>
        <Header LeftSection="BACK" RightSection="NONE">
          받은 편지
        </Header>

        {letters.length === 0 ? (
          <EmptyWrapper>
            <LeenkGrayIcon
              width={120 * width}
              height={120 * width}
              style={{ marginTop: 162 * height }}
            />
            <EmptyText>
              아직 받은 편지가 없어{'\n'}
              새로운 편지를 기다려볼까?
            </EmptyText>
          </EmptyWrapper>
        ) : (
          sortedYears.map((year) => (
            <YearSection key={year}>
              <YearHeader>
                <YearText>{year}</YearText>
                <DividerLine />
              </YearHeader>

              {groupedByYear[year].map((letter) => (
                <BirthdayLetterCard
                  key={letter.letterId}
                  username={letter.author.name}
                  profileImage={letter.author.thumbnail}
                  isUserBirthdayToday={letter.author.isUserBirthdayToday}
                  message={letter.message}
                />
              ))}
            </YearSection>
          ))
        )}
      </Container>
    </>
  );
}

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${colors.bg[2]};
  padding-horizontal: ${20 * width}px;
`;

const YearSection = styled.View`
  padding-vertical: ${12 * height}px;
  gap: ${8 * height}px;
`;

const YearHeader = styled.View`
  flex-direction: row;
  align-items: center;
  padding-bottom: ${12 * height}px;
  gap: ${4 * height}px;
`;

const DividerLine = styled.View`
  flex: 1;
  height: ${1 * height}px;
  background-color: ${colors.divider[2]};
`;

const YearText = styled.Text`
  color: ${colors.divider[2]};
  font-family: ${fonts.Bold};
  font-size: ${fontSize['xs']}px;
`;

const EmptyWrapper = styled.View`
  flex: 1;
  align-items: center;
  padding-horizontal: ${20 * width}px;
`;

const EmptyText = styled.Text`
  font-size: ${fontSize.lg}px;
  font-family: ${fonts.Bold};
  color: ${colors.text[3]};
  text-align: center;
  line-height: ${lineHeight.l}px;
`;
