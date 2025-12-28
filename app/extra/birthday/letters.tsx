import { useCallback } from 'react';
import { Header, Loading } from '@/components';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { View, FlatList } from 'react-native';
import {
  fontSize,
  fonts,
  width,
  height,
  lineHeight,
} from '@/theme/globalStyles';
import BirthdayLetterCard from '@/components/extra/birthday/BirthdayLetterCard';
import { useBirthdayStore } from '@/stores/birthdayStore';
import { LeenkGrayIcon } from '@/assets';
import { useFocusEffect } from 'expo-router';
import { postMarkBirthdayLetters } from '@/api/extra/birthday/birthday.post.api';
import { useDelayedLoading } from '@/hooks/useDelayedLoading';

export default function BirthdayLettersPage() {
  const {
    birthdayLetters,
    fetchBirthdayLetters,
    hasNewLetters,
    birthdayLettersLoading,
  } = useBirthdayStore();

  const showLoading = useDelayedLoading(
    birthdayLettersLoading && birthdayLetters === null,
    { delay: 250 },
  );

  useFocusEffect(
    useCallback(() => {
      fetchBirthdayLetters();

      if (hasNewLetters) {
        postMarkBirthdayLetters()
          .then(() => {
            useBirthdayStore.setState({ hasNewLetters: false });
          })
          .catch((err) => console.log('편지 읽음 처리 실패:', err));
      }
    }, [hasNewLetters]),
  );

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
        <View style={{ paddingHorizontal: 20 * width }}>
          <Header LeftSection="BACK" RightSection="NONE">
            받은 편지
          </Header>
        </View>

        {showLoading && <Loading />}

        {!birthdayLettersLoading && letters.length === 0 ? (
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
          <FlatList
            style={{ flex: 1, marginTop: 12 * height }}
            data={sortedYears}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item: year }) => (
              <YearSection>
                <YearHeader>
                  <YearText>{year}</YearText>
                  <DividerLine />
                </YearHeader>

                {groupedByYear[year].map((letter) => (
                  <BirthdayLetterCard
                    key={letter.letterId}
                    username={letter.name ?? '사용자'}
                    profileImage={letter.thumbnail ?? ''}
                    isUserBirthdayToday={letter.isUserBirthdayToday ?? false}
                    message={letter.message}
                  />
                ))}
              </YearSection>
            )}
          />
        )}
      </Container>
    </>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
`;

const YearSection = styled.View`
  padding-vertical: ${12 * height}px;
  gap: ${8 * height}px;
  padding-horizontal: ${20 * width}px;
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
  font-size: ${fontSize.xs}px;
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
