import { Tabs, useFocusEffect, usePathname } from 'expo-router';
import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWriteMenuStore } from '@/stores/writeMenuStore';
import MenuModal from '@/components/Modal/MenuModal';
import {
  FeedIcon,
  LeenkIcon,
  AdditionIcon,
  MypageIcon,
  PlusIcon,
} from '@/assets';
import { fontSize, radius, width, height, fonts } from '@/theme/globalStyles';
import { View, Platform } from 'react-native';

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
  { name: 'extra', label: '부가', icon: AdditionIcon },
  { name: 'mypage', label: '마이', icon: MypageIcon },
];

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const openWriteMenu = useWriteMenuStore((s) => s.open);
  const isWriteMenuOpen = useWriteMenuStore((s) => s.isVisible);
  const closeWriteMenu = useWriteMenuStore((s) => s.close);

  const isOnTabs = !pathname.startsWith('/(post)'); // (post) 스택일 땐 모달 숨기기

  useFocusEffect(
    useCallback(() => {
      // 탭이 다시 보일 때, 혹시 열려 있으면 닫아버림
      closeWriteMenu();
      return () => closeWriteMenu(); // 탭에서 벗어날 때도 닫기
    }, [closeWriteMenu]),
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg[2] }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 73 * height,
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: 'transparent',
          },
        }}
        tabBar={({ state, navigation }) => (
          <>
            <StyledSafeArea edges={['bottom']}>
              <TabContainer>
                {TAB_CONFIG.map((tab) => {
                  const isCustomTab = tab.name === 'write';
                  const route = state.routes.find((r) => r.name === tab.name);

                  if (!isCustomTab && !route) return null;

                  const isFocused = isCustomTab
                    ? false
                    : state.index ===
                      state.routes.findIndex((r) => r.name === tab.name);

                  const onPress = () => {
                    if (isCustomTab) {
                      openWriteMenu();
                      return;
                    }

                    if (!route) return;

                    const event = navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate(route.name);
                    }
                  };

                  const IconComponent = tab.icon;

                  return (
                    <TabButton
                      key={tab.name}
                      onPress={onPress}
                      $isSpecial={tab.isSpecial}
                    >
                      {IconComponent && (
                        <IconComponent
                          width={IconComponent === PlusIcon ? 28 : 24}
                          height={IconComponent === PlusIcon ? 28 : 24}
                          color={
                            tab.isSpecial
                              ? colors.white
                              : isFocused
                                ? colors.primary
                                : colors.black
                          }
                        />
                      )}

                      {tab.label !== '' && (
                        <TabLabel $focused={isFocused}>{tab.label}</TabLabel>
                      )}
                    </TabButton>
                  );
                })}
              </TabContainer>
            </StyledSafeArea>

            <MenuModal
              visible={isWriteMenuOpen && isOnTabs}
              onClose={closeWriteMenu}
              onPressFirst={() => {
                closeWriteMenu();
                router.push('/(post)/leenk');
              }}
              onPressSecond={() => {
                closeWriteMenu();
                router.push('/(post)/feed');
              }}
            />
          </>
        )}
      />

      {/* iOS 하단 배경 덮개 추가 */}
      {Platform.OS === 'ios' && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 36 * height,
            backgroundColor: colors.bg[2],
            zIndex: -1,
          }}
        />
      )}
    </View>
  );
}

const StyledSafeArea = styled(SafeAreaView)`
  background-color: ${colors.white};
  border-top-left-radius: ${radius.lg}px;
  border-top-right-radius: ${radius.lg}px;
`;

const TabContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: ${51 * height}px;
  padding: ${4 * height}px 0;
  background-color: ${colors.white};
  border-top-left-radius: ${radius.lg}px;
  border-top-right-radius: ${radius.lg}px;
  border-width: ${1 * width}px;
  border-color: transparent;
`;

const TabButton = styled.TouchableOpacity<{ $isSpecial?: boolean }>`
  ${({ $isSpecial }) =>
    $isSpecial
      ? `
    width: ${48 * width}px;
    height: ${48 * width}px;
    border-radius: ${radius.full}px;
    background-color: ${colors.primary};
    justify-content: center;
    align-items: center;
    margin-bottom: ${20 * height}px;
  `
      : `
    flex: 1;
    align-items: center;
    justify-content: center;
  `}
`;

const TabLabel = styled.Text<{ $focused: boolean }>`
  font-family: ${fonts.Bold};
  font-size: ${fontSize.sm}px;
  margin-top: ${4 * height}px;
  color: ${({ $focused }) => ($focused ? colors.primary : colors.gray[500])};
`;
