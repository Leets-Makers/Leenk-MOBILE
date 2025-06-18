import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '@/theme/color';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWriteMenuStore } from '@/stores/writeMenuStore';
import WriteMenuModal from '@/components/Modal/WrietMenuModal';

import {
  FeedIcon,
  LeenkIcon,
  LockIcon,
  MypageIcon,
  PlusIcon,
} from '@/components/Index';

import { fontSize, radius, width, height, fonts } from '@/theme/globalStyles';

type TabConfigItem = {
  name: string;
  label: string;
  icon: React.FC<any>;
  isSpecial?: boolean;
};

const TAB_CONFIG: readonly TabConfigItem[] = [
  { name: 'leenk', label: '링크', icon: LeenkIcon },
  { name: 'feed', label: '피드', icon: FeedIcon },
  { name: 'write', label: '', icon: PlusIcon, isSpecial: true },
  { name: 'private', label: '부가', icon: LockIcon },
  { name: 'mypage', label: '마이', icon: MypageIcon },
];

// 네비게이션
export default function TabLayout() {
  const router = useRouter();
  const openWriteMenu = useWriteMenuStore((s) => s.open);
  // 글쓰기 메뉴 모달
  const isWriteMenuOpen = useWriteMenuStore((s) => s.isVisible);
  const closeWriteMenu = useWriteMenuStore((s) => s.close);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBarStyle,
      }}
      tabBar={({ state, navigation }) => {
        return (
          <>
            <SafeAreaView edges={['bottom']} style={styles.safeArea}>
              <View style={styles.tabContainer}>
                {TAB_CONFIG.map((tab) => {
                  const route = state.routes.find((r) => r.name === tab.name);
                  if (!route) return null;

                  const isFocused =
                    state.index ===
                    state.routes.findIndex((r) => r.name === tab.name);

                  const onPress = () => {
                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      if (route.name === 'write') {
                        openWriteMenu();
                      } else {
                        navigation.navigate(route.name);
                      }
                    }
                  };

                  const IconComponent = tab.icon;

                  return (
                    <TouchableOpacity
                      key={route.key}
                      onPress={onPress}
                      style={
                        tab.isSpecial ? styles.writeButton : styles.tabButton
                      }
                    >
                      {IconComponent && (
                        <IconComponent
                          width={24}
                          height={24}
                          stroke={
                            tab.isSpecial
                              ? '#fff'
                              : isFocused
                                ? colors.primary
                                : colors.black
                          }
                        />
                      )}
                      {tab.label !== '' && (
                        <Text
                          style={[
                            styles.tabLabel,
                            isFocused && styles.tabLabelFocused,
                          ]}
                        >
                          {tab.label}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </SafeAreaView>
            <WriteMenuModal
              visible={isWriteMenuOpen}
              onClose={closeWriteMenu}
              onPressLink={() => {
                closeWriteMenu();
                router.push('/post/leenk' as const);
              }}
              onPressFeed={() => {
                closeWriteMenu();
                router.push('/post/feed' as const);
              }}
            />
          </>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 73 * height,
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    overflow: 'hidden',
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 85 * height,
    paddingBottom: 34 * height,
    backgroundColor: colors.white,
    borderWidth: 1 * width,
    borderColor: 'transparent',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  writeButton: {
    width: 48 * width,
    height: 48 * width,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20 * height,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: fonts.Regular,
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginTop: 4 * height,
    fontWeight: '700',
  },
  tabLabelFocused: {
    color: colors.primary,
  },
});
