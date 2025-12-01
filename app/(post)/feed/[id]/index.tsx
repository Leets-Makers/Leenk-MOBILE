import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useDetailFirstLaunch } from '@/hooks/useFirstLaunch';
import OnBoardingModal from '@/components/Modal/OnBoardingModal';
import FeedDetailList from '@/components/feed/FeedDetailList';

export default function FeedDetailPage() {
  const { id } = useLocalSearchParams();
  const firstLaunch = useDetailFirstLaunch();
  const [showOnBoarding, setShowOnBoarding] = useState(false);

  useEffect(() => {
    if (firstLaunch === true) {
      setShowOnBoarding(true);
    }
  }, [firstLaunch]);

  if (!id) return null;

  return (
    <View style={{ flex: 1 }}>
      <FeedDetailList initialFeedId={Number(id)} />

      {/* 온보딩 */}
      {showOnBoarding && (
        <OnBoardingModal
          visible={showOnBoarding}
          onClose={() => setShowOnBoarding(false)}
        />
      )}
    </View>
  );
}
