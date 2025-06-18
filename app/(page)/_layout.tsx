import { Tabs } from 'expo-router';
import React from 'react';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import colors from '@/theme/color';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWriteMenuStore } from '@/stores/writeMenuStore';
import WriteMenuModal from '@/components/Modal/WriteMenuModal';
import { FeedIcon, LeenkIcon, LockIcon, MypageIcon, PlusIcon } from '@/assets';
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

export default function TabLayout() {
  const router = useRouter();
  const openWriteMenu = useWriteMenuStore((s) => s.open);
  const isWriteMenuOpen = useWriteMenuStore((s) => s.isVisible);
  const closeWriteMenu = useWriteMenuStore((s) => s.close);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 73 * height,
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          overflow: 'hidden',
        },
      }}
      tabBar={({ state, navigation }) => (
        <>
          <StyledSafeArea edges={['bottom']}>
            <TabContainer>
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
                  <TabButton
                    key={route.key}
                    onPress={onPress}
                    $isSpecial={tab.isSpecial}
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
                      <TabLabel $focused={isFocused}>{tab.label}</TabLabel>
                    )}
                  </TabButton>
                );
              })}
            </TabContainer>
          </StyledSafeArea>

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
      )}
    />
  );
}

const StyledSafeArea = styled(SafeAreaView)`
  background-color: transparent;
`;

const TabContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: ${85 * height}px;
  padding-bottom: ${34 * height}px;
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
  font-family: ${fonts.Regular};
  font-size: ${fontSize.sm}px;
  font-weight: 700;
  margin-top: ${4 * height}px;
  color: ${({ $focused }) => ($focused ? colors.primary : colors.gray[500])};
`;
