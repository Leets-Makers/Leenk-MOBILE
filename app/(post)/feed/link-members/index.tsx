import { Header } from '@/components';
import { View, Text } from 'react-native';
import { ContentWrapper } from '../../feed';
import SearchBar from '@/components/feed/SearchBar';

export default function LinkMembersPage() {
  return (
    <ContentWrapper>
      <Header>함께 한 사람 추가 </Header>
      <SearchBar />
    </ContentWrapper>
  );
}
