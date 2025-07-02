import { Header } from '@/components';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
/**
 *  헤더는 왼쪽, 가운데, 오른쪽 영역으로 구분되어 있음.
 *  각각 영역에 원하는 요소를 넣어주면 됨.
 *
 *  LeftSection , TitleSection, RightSection
 */

export default function HeaderExamples() {
  const router = useRouter();

  return (
    <View>
      {/* LeftSection의 기본 값은 BACK, RightSection의 기본값은 NONE */}
      <Header LeftSection="LOGO" RightSection="BELL" />
      {/** 2. 왼쪽(뒤로가기)만 있는 경우  */}
      <Header />

      {/* 3. 모두 있는 경우 */}
      <Header RightSection="KEBAB">프로필</Header>
    </View>
  );
}
