import { PeopleIcon } from '@/assets';
import { Header } from '@/components';
import UserItem from '@/components/leenk/UserItem';
import { CONTAINER_PADDING } from '@/constants';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import styled from 'styled-components/native';

import { useParticipantStore } from '@/stores/participantStore';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useToastStore } from '@/stores/toastStore';

import { getLeenkParticipants } from '@/api/leenk/leenk.get.api';
import { LeenkParticipantItem } from '@/types/leenk';

export default function ParticipantsList() {
  const {
    startSelection,
    isSelectionMode,
    participants,
    setParticipants,
    resetSelection,
  } = useParticipantStore();
  const { leenkId, isAuthor, maxParticipants } = useLocalSearchParams<{
    leenkId: string;
    isAuthor?: string;
    maxParticipants: string;
  }>();
  const parsedId = Number(leenkId);
  const userIsAuthor = isAuthor === 'true';
  const maxCountFromRoute = maxParticipants
    ? Number(maxParticipants)
    : undefined;

  const insets = useSafeAreaInsets();
  const { showToast } = useToastStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async () => {
    try {
      if (!Number.isFinite(parsedId)) throw new Error('Invalid leenkId');
      setLoading(true);
      const list = await getLeenkParticipants(parsedId);
      setParticipants(list);
      resetSelection();
    } catch (e) {
      console.error('참여자 목록 불러오기 실패:', e);
      showToast('참여자 목록을 불러오지 못했어.', 'error');
    } finally {
      setLoading(false);
    }
  }, [parsedId]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    if (!Number.isFinite(parsedId)) return;
    try {
      setRefreshing(true);
      const list = await getLeenkParticipants(parsedId);
      setParticipants(list);
      resetSelection();
    } catch (e) {
      showToast('다시 시도해줘.', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  // 서버 필드가 정확 카운트가 아니라면 일단 길이 사용
  const currentCount = participants.length;

  const handleKick = () => {
    if (!userIsAuthor) return;
    startSelection();
  };

  const isKickDisabled = useMemo(() => {
    return (
      userIsAuthor &&
      participants.length === 1 &&
      participants[0]?.isHost === true
    );
  }, [userIsAuthor, participants]);

  const keyExtractor = (item: LeenkParticipantItem) =>
    String(item.participant.userId);

  return (
    <Container>
      {userIsAuthor ? (
        <Header
          RightSection="KICK"
          kebabPress={handleKick}
          rightDisabled={isKickDisabled}
          leenkId={parsedId}
        >
          참여자
        </Header>
      ) : (
        <Header>참여자</Header>
      )}

      {userIsAuthor && (
        <InfoText>
          {isSelectionMode
            ? '내보낼 참여자를 선택해 줘'
            : '카카오톡 ID를 복사할 수 있어'}
        </InfoText>
      )}

      <RowWrapper>
        <PeopleIcon width={width * 16} />
        <CountText>
          {maxCountFromRoute != null
            ? `${currentCount}/${maxCountFromRoute}명`
            : `${currentCount}명`}
        </CountText>
      </RowWrapper>

      <FlatList
        data={participants}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 16,
          flexGrow: 1,
        }}
        renderItem={({ item }) => <UserItem user={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? <EmptyText>아직 참여자가 없어.</EmptyText> : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </Container>
  );
}

const Container = styled(SafeAreaView).attrs({
  edges: ['bottom'],
})`
  flex: 1;
  padding-horizontal: ${CONTAINER_PADDING};
  background-color: ${colors.white};
`;

const InfoText = styled.Text`
  margin-vertical: ${height * 10}px;
  font-family: ${fonts.Regular};
  color: ${colors.primary};
  line-height: ${lineHeight.s};
  font-size: ${fontSize.sm};
`;

const RowWrapper = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  margin-bottom: ${height * 8}px;
`;

const CountText = styled.Text`
  margin-left: ${width * 4}px;
  font-family: ${fonts.Regular};
  color: ${colors.text[3]};
  line-height: ${lineHeight.s}px;
  font-size: ${fontSize.sm}px;
`;

const EmptyText = styled.Text`
  text-align: center;
  margin-top: ${height * 40}px;
  color: ${colors.text[3]};
  font-family: ${fonts.Regular};
  font-size: ${fontSize.sm}px;
`;
