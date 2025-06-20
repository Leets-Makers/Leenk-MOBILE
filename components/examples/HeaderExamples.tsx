import { Header } from '@/components';
import { View, Text, TouchableOpacity } from 'react-native';
import { LogoText, BackArrowIcon, KebabIcon, BellIcon } from '@/assets';
import { useRouter } from 'expo-router';
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
      {/** 1. 왼쪽, 오른쪽만 있는 경우 */}
      <Header
        LeftSection={<LogoText width={66} height={30} />}
        RightSection={<BellIcon />}
      />
      {/** 왼쪽(뒤로가기)만 있는 경우  */}
      <Header
        LeftSection={
          <TouchableOpacity onPress={() => router.back()}>
            <BackArrowIcon />
          </TouchableOpacity>
        }
      />

      {/* 모두 있는 경우 */}
      <Header
        LeftSection={<BackArrowIcon />}
        TitleSection={
          <Text style={{ fontWeight: 600, fontSize: 16 }}>프로필 편집</Text>
        }
        RightSection={<KebabIcon />}
      />
    </View>
  );
}
