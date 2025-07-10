import FeedDetailList from '@/components/feed/FeedDetailList';
import { useLocalSearchParams } from 'expo-router';

export default function FeedDetailPage() {
  const { id } = useLocalSearchParams();

  if (!id) return null;

  return <FeedDetailList initialFeedId={Number(id)} />;
}
