import React, { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import {
  fontSize,
  fonts,
  width,
  height,
  lineHeight,
} from '@/theme/globalStyles';
import { useRouter } from 'expo-router';
import { Header, Loading } from '@/components';
import BirthdayCard from '@/components/extra/birthday/BirthdayCard';
import UpcomingBirthdayCard from '@/components/extra/birthday/UpcomingBirthdayCard';
import { useModalStore } from '@/stores/modalStore';
import TextInputModal from '@/components/Modal/TextInputModal';
import { formatTodayMonthDay } from '@/utils/format-date';
import { useBirthdayStore } from '@/stores/birthdayStore';
import { useUserInfo } from '@/hooks/useUserInfo';
import ImageModal from '@/components/Modal/ImageModal';
import { BirthdayUser } from '@/types/birthday';
import { LeenkGrayIcon } from '@/assets';
import { useDelayedLoading } from '@/hooks/useDelayedLoading';

export default function ExtraPage() {
  const router = useRouter();
  const { userInfo, refetch: refetchUserInfo } = useUserInfo();
  const [selectedUserName, setSelectedUserName] = React.useState<string>('');
  const { openModal } = useModalStore();
  const {
    birthdayUsers,
    myBirthdayLettersCounts,
    hasNewLetters,
    upcomingBirthdayUsers,
    fetchBirthdayUsers,
    fetchUpcomingBirthdayUsers,
    loading,
  } = useBirthdayStore();
  const showLoading = useDelayedLoading(loading);

  useFocusEffect(
    useCallback(() => {
      fetchBirthdayUsers();
      fetchUpcomingBirthdayUsers();
      refetchUserInfo();
    }, [fetchBirthdayUsers, fetchUpcomingBirthdayUsers, refetchUserInfo]),
  );

  const handleBirthdayCardPress = useCallback(
    (user: BirthdayUser) => {
      const isOwn = user.userId === userInfo?.userId;

      if (isOwn) {
        router.push('/extra/birthday/letters');
        return;
      }

      setSelectedUserName(user.name);

      // 다른 사람 생일인 경우 (편지 작성 모달)
      openModal('birthdayLetter', user.userId);
    },
    [userInfo?.userId, openModal, router, setSelectedUserName],
  );

  //  오늘 생일자
  const todayBirthdayUsers = birthdayUsers.filter((u) => u.isUserBirthdayToday);

  // empty 조건
  const isEmpty =
    todayBirthdayUsers.length === 0 && upcomingBirthdayUsers.length === 0;

  return (
    <>
      <HeaderWrapper>
        <Header LeftSection="LOGO" RightSection="BELL" />
      </HeaderWrapper>
      <Container>
        {showLoading ? (
          <Loading />
        ) : isEmpty ? (
          <EmptyWrapper>
            <LeenkGrayIcon
              width={120 * width}
              height={120 * width}
              style={{ marginTop: 162 * height }}
            />
            <MessageText>
              아직 생일인 친구가 없어{'\n'}
              새로운 생일 소식을 기다려볼까?
            </MessageText>
          </EmptyWrapper>
        ) : (
          <>
            <ScrollArea>
              {/* 오늘 생일 */}
              <BirthdayCardContainer>
                {todayBirthdayUsers.length > 0 && (
                  <Title>{`${formatTodayMonthDay()} 오늘의 생일자! 🎉`}</Title>
                )}
                {todayBirthdayUsers.map((user) => {
                  const isOwn = user.userId === userInfo?.userId;
                  return (
                    <BirthdayCard
                      key={user.userId}
                      username={user.name}
                      profileImage={user.thumbnail}
                      isUserBirthdayToday={user.isUserBirthdayToday}
                      isOwnBirthdayToday={isOwn}
                      myBirthdayLettersCounts={
                        isOwn ? myBirthdayLettersCounts : 0
                      }
                      hasNewLetters={isOwn ? hasNewLetters : false}
                      onPress={() => handleBirthdayCardPress(user)}
                    />
                  );
                })}
              </BirthdayCardContainer>

              {/* 곧 생일 */}
              {upcomingBirthdayUsers.length > 0 && (
                <>
                  <UpcomingBirthdayCardContainer>
                    <Title>곧 생일이야</Title>
                  </UpcomingBirthdayCardContainer>
                  <UpcomingBirthdayCard data={upcomingBirthdayUsers} />
                </>
              )}
            </ScrollArea>
          </>
        )}
      </Container>

      <TextInputModal type="birthday" />
      <ImageModal
        titleText={`생일 축하해 ${selectedUserName.length >= 2 ? selectedUserName.slice(-2) : selectedUserName}!`}
        subText={`편지가 날아가는 중이야 💌\n또 보내볼까?`}
        ImageComponent={null}
        onClose={() => setSelectedUserName('')}
      />
    </>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.bg[2]};
`;

const HeaderWrapper = styled.View`
  padding-horizontal: ${20 * width}px;
  background-color: ${colors.bg[2]};
`;

const ScrollArea = styled.ScrollView`
  flex: 1;
`;

const Title = styled.Text`
  color: ${colors.text[1]};
  font-family: ${fonts.ExtraBold};
  font-size: ${fontSize.lg}px;
  align-self: flex-start;
  padding-top: ${24 * height}px;
  padding-bottom: ${12 * height}px;
`;

const BirthdayCardContainer = styled.View`
  padding-horizontal: ${20 * width}px;
  gap: ${8 * height}px;
`;

const UpcomingBirthdayCardContainer = styled.View`
  padding-horizontal: ${20 * width}px;
`;

const EmptyWrapper = styled.View`
  flex: 1;
  align-items: center;
  padding-horizontal: ${20 * width}px;
`;

const MessageText = styled.Text`
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
  font-family: ${fonts.Bold};
  color: ${colors.text[3]};
  text-align: center;
`;
