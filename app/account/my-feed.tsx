import { Header } from '@/components';
import TabMenu from '@/components/common/TabMenu';
import { useState } from 'react';
import MyTotalReactionCount from '@/components/feed/MyTotalReactionCount';
import ProfileFeedList from '@/components/feed/ProfileFeedList';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { FEED_PADDING } from '@/constants';
import { width } from '@/theme/globalStyles';
import { View } from 'react-native';

export default function MyFeedPage() {
  const [tab, setTab] = useState<'uploaded' | 'joined'>('uploaded');
  const [totalReactionCount, setTotalReactionCount] = useState(0);

  return (
    <ContainerWithNoPadding>
      <View style={{ paddingHorizontal: FEED_PADDING * width }}>
        <Header RightSection="SETTING" />
        <TabMenu
          activeTab={tab}
          onTabChange={(newTab: string) => {
            if (newTab === 'uploaded' || newTab === 'joined') {
              setTab(newTab);
            }
          }}
        />
        {tab === 'uploaded' && (
          <MyTotalReactionCount totalReactionCount={totalReactionCount ?? 0} />
        )}
      </View>
      <ProfileFeedList
        key={tab}
        type={tab === 'uploaded' ? 'myFeed' : 'myJoined'}
        onTotalReactionCountChange={setTotalReactionCount}
      />
    </ContainerWithNoPadding>
  );
}

export const ContainerWithNoPadding = styled.View`
  flex: 1;
  background-color: ${colors.gray[50]};
`;
