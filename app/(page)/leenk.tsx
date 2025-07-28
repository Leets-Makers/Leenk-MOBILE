import React, { useState } from 'react';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import {
  fontSize,
  lineHeight,
  fonts,
  width,
  height,
} from '@/theme/globalStyles';
import { Header } from '@/components';
import TabMenu from '@/components/common/TabMenu';
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
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding-horizontal: ${20 * width}px;
  align-items: center;
  background-color: ${colors.bg[2]};
  gap: ${20 * height};
`;

const MessageText = styled.Text`
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l}px;
  font-family: ${fonts.Regular};
  font-weight: 600;
  color: ${colors.text[3]};
  text-align: center;
`;
