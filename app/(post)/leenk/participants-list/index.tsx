import { PeopleIcon } from '@/assets';
import { Header } from '@/components';
import UserItem from '@/components/leenk/UserItem';
import { CONTAINER_PADDING } from '@/constants';
import { mockLeenkData } from '@/constants/mockUserData';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  width,
} from '@/theme/globalStyles';
import { FlatList } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import { useParticipantStore } from '@/stores/participantStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ParticipantsList() {
  const { selectedUsers, startSelection, isSelectionMode } =
    useParticipantStore();

  const users = mockLeenkData;
  const isAuthor = true;

  const insets = useSafeAreaInsets();

  const handleKick = () => {
    startSelection();
  };

  console.log('선택 모드:', isSelectionMode);

  console.log('내보내기 참여자:', selectedUsers);
  return (
    <Container>
      {isAuthor ? (
        <Header RightSection="KICK" kebabPress={handleKick}>
          참여자
        </Header>
      ) : (
        <Header>참여자</Header>
      )}

      {isAuthor && (
        <InfoText>
          {isSelectionMode
            ? '내보낼 참여자를 선택해 줘'
            : '카카오톡 ID를 복사할 수 있어'}
        </InfoText>
      )}

      <RowWrapper>
        <PeopleIcon width={width * 16} />
        <CountText>3/4명</CountText>
      </RowWrapper>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingBottom: insets.bottom,
        }}
        renderItem={({ item }) => <UserItem user={item} />}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding-horizontal: ${CONTAINER_PADDING};
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
