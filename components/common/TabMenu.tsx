import colors from '@/theme/color';
import { height, width, fontSize, fonts } from '@/theme/globalStyles';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

interface TabMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  type?: 'feed' | 'leenk'; // 추후 확장 시 다른 타입 추가
}

export default function TabMenu({
  activeTab,
  onTabChange,
  type = 'feed',
}: TabMenuProps) {
  const tabs =
    type === 'feed'
      ? [
          { label: '올린 피드', value: 'uploaded' },
          { label: '함께한 피드', value: 'joined' },
        ]
      : [
          { label: '전체', value: 'all' },
          { label: '모집중', value: 'open' },
          { label: '모집완료', value: 'close' },
        ];

  return (
    <TabContainer>
      {tabs.map((tab) => (
        <TabButton
          key={tab.value}
          onPress={() => onTabChange(tab.value)}
          $isActive={activeTab === tab.value}
        >
          <TabText $isActive={activeTab === tab.value}>{tab.label}</TabText>
        </TabButton>
      ))}
    </TabContainer>
  );
}

const TabContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  padding: ${8 * height}px 0;
`;

const TabButton = styled(Pressable)<{ $isActive: boolean }>`
  padding: ${8 * height}px 0;
  padding-right: ${20 * width}px;
`;

const TabText = styled.Text<{ $isActive: boolean }>`
  font-size: ${fontSize.lg}px;
  font-family: ${({ $isActive }) => ($isActive ? fonts.ExtraBold : fonts.Bold)};
  color: ${({ $isActive }) => ($isActive ? colors.text[1] : colors.text[4])};
`;
