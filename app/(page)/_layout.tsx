import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/theme/color';
import { SafeAreaView } from 'react-native-safe-area-context';

import FeedIcon from '@/assets/images/ic_navi_feed.svg';
import HomeIcon from '@/assets/images/ic_navi_leenk.svg';
import LockIcon from '@/assets/images/ic_navi_lock.svg';
import MypageIcon from '@/assets/images/ic_navi_mypage.svg';
import PlusIcon from '@/assets/images/ic_navi_plus.svg';

// 네비게이션
export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 70,
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
      tabBar={({ state, descriptors, navigation }) => {
        const orderedRoutes = ['home', 'feed', 'write', 'private', 'mypage'];

        const iconMap: Record<string, React.FC<any>> = {
          home: HomeIcon,
          feed: FeedIcon,
          write: PlusIcon,
          private: LockIcon,
          mypage: MypageIcon,
        };

        return (
          <SafeAreaView edges={['bottom']} style={styles.safeArea}>
            <View style={styles.tabContainer}>
              {orderedRoutes.map((name) => {
                const route = state.routes.find((r) => r.name === name);
                if (!route) return null;

                const isFocused =
                  state.index ===
                  state.routes.findIndex((r) => r.name === name);

                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    if (route.name === 'write') {
                      router.push('/write' as const);
                    } else {
                      navigation.navigate(route.name);
                    }
                  }
                };

                const IconComponent = iconMap[route.name];

                return (
                  <TouchableOpacity
                    key={route.key}
                    onPress={onPress}
                    style={
                      route.name === 'write'
                        ? styles.writeButton
                        : styles.tabButton
                    }
                  >
                    {IconComponent && (
                      <IconComponent
                        width={22}
                        height={22}
                        fill={
                          route.name === 'write'
                            ? '#fff'
                            : isFocused
                              ? colors.primary
                              : colors.gray[500]
                        }
                      />
                    )}
                    {route.name !== 'write' && (
                      <Text
                        style={[
                          styles.tabLabel,
                          isFocused && styles.tabLabelFocused,
                        ]}
                      >
                        {route.name === 'home'
                          ? '링크'
                          : route.name === 'feed'
                            ? '피드'
                            : route.name === 'private'
                              ? '부가'
                              : route.name === 'mypage'
                                ? '마이'
                                : ''}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </SafeAreaView>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: colors.white,
  },
  writeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: colors.black,
    marginTop: 4,
  },
  tabLabelFocused: {
    color: colors.primary,
    fontWeight: '600',
  },
});
