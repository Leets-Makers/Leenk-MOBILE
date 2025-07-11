import { Container } from '@/app/(post)/feed';
import { Header } from '@/components';
import TabMenu from '@/components/feed/TabMenu';
import { useState } from 'react';
import MyTotalReactionCount from '@/components/feed/MyTotalReactionCount';
import ProfileFeedList from '@/components/feed/ProfileFeedList';

export default function MyFeedPage() {
  const [tab, setTab] = useState<'uploaded' | 'joined'>('uploaded');
  const [totalReactionCount, setTotalReactionCount] = useState(0);

  return (
    <Container>
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
      <ProfileFeedList
        key={tab}
        type={tab === 'uploaded' ? 'myFeed' : 'myJoined'}
        onTotalReactionCountChange={setTotalReactionCount}
      />
    </Container>
  );
}
