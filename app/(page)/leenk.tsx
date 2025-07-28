import React, { useState } from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { width, height } from '@/theme/globalStyles';
import { Header } from '@/components';
import TabMenu from '@/components/common/TabMenu';
import LeenkListItem from '@/components/leenk/LeenkListItem';

const mockData = [
  {
    id: '1',
    title: '전정도에서 모두모여잉',
    date: '12월 28일 22시',
    people: '3/20명',
    name: '김링크',
    leenkImageUri: null,
    profileImageUri: null,
  },
  {
    id: '2',
    title: '카공 할 사람 급구',
    date: '12월 02일 15시',
    people: '1/20명',
    name: '이유진',
    leenkImageUri: null,
    profileImageUri: null,
  },
  {
    id: '3',
    title: '볼링 모임 ㄱ',
    date: '11월 30일 19시',
    people: '6/20명',
    name: '계다현',
    leenkImageUri: null,
    profileImageUri: null,
  },
  {
    id: '4',
    title: '같이 점심 먹장',
    date: '12월 18일 11시',
    people: '3/20명',
    name: '김윙크',
    leenkImageUri: null,
    profileImageUri: null,
  },
];

export default function LeenkPage() {
  const [tab, setTab] = useState<'all' | 'recruting' | 'completed'>('all');

  return (
    <Container>
      <Header LeftSection="LOGO" RightSection="BELL" />
      <TabMenu
        activeTab={tab}
        onTabChange={(newTab: string) => {
          if (
            newTab === 'all' ||
            newTab === 'recruting' ||
            newTab === 'completed'
          ) {
            setTab(newTab);
          }
        }}
      />
      <List
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeenkListItem
            title={item.title}
            date={item.date}
            people={item.people}
            name={item.name}
            leenkImageUri={item.leenkImageUri}
            profileImageUri={item.profileImageUri}
          />
        )}
        ItemSeparatorComponent={() => <Separator />}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 0 ${20 * width}px;
  background-color: ${colors.bg[2]};
`;

const List = styled.FlatList.attrs({
  contentContainerStyle: {
    paddingBottom: height * 20,
  },
})``;

const Separator = styled.View`
  height: ${height * 8}px;
`;
