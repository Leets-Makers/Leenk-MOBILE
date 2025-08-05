import React, { useState } from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { width, height } from '@/theme/globalStyles';
import { Header } from '@/components';
import TabMenu from '@/components/common/TabMenu';
import LeenkListItem from '@/components/leenk/LeenkListItem';
import { mockLeenkData } from '@/constants/mockUserData';

export default function LeenkPage() {
  const [tab, setTab] = useState<'all' | 'recruting' | 'completed'>('all');

  return (
    <Container>
      <Header LeftSection="LOGO" RightSection="BELL" />
      <TabMenu
        type="leenk"
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
        data={mockLeenkData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeenkListItem
            id={item.id}
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
