import React, { useState } from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { width, height } from '@/theme/globalStyles';
import { Header } from '@/components';
import TabMenu from '@/components/common/TabMenu';
import LeenkListItem from '@/components/leenk/LeenkListItem';
import { mockLeenkData } from '@/constants/mockUserData';
import { ContainerWithNoPadding } from '../account/my-feed';
import { View } from 'react-native';
import { FEED_PADDING } from '@/constants';

export default function LeenkPage() {
  const [tab, setTab] = useState<'all' | 'recruiting' | 'completed'>('all');

  return (
    <ContainerWithNoPadding>
      <View style={{ paddingHorizontal: FEED_PADDING * width }}>
        <Header LeftSection="LOGO" RightSection="BELL" />
        <TabMenu
          type="leenk"
          activeTab={tab}
          onTabChange={(newTab: string) => {
            if (
              newTab === 'all' ||
              newTab === 'recruiting' ||
              newTab === 'completed'
            ) {
              setTab(newTab);
            }
          }}
        />
      </View>
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
        showsVerticalScrollIndicator
      />
    </ContainerWithNoPadding>
  );
}

const List = styled.FlatList.attrs({
  contentContainerStyle: {
    paddingBottom: height * 20,
    paddingHorizontal: FEED_PADDING * width,
  },
})``;

const Separator = styled.View`
  height: ${height * 8}px;
`;
