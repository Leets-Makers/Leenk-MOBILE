import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text } from 'react-native';

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

        return (
          <View style={styles.tabContainer}>
            {orderedRoutes.map((name, index) => {
              const route = state.routes.find((r) => r.name === name);
              if (!route) return null;

              const { options } = descriptors[route.key];
              const isFocused =
                state.index === state.routes.findIndex((r) => r.name === name);

              if (route.name === 'write') {
                return (
                  <TouchableOpacity
                    key={route.key}
                    onPress={() => router.push('/write' as const)}
                    style={styles.writeButton}
                  >
                    <Ionicons name="add" size={28} color="#fff" />
                  </TouchableOpacity>
                );
              }

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const iconMap: Record<string, any> = {
                home: 'link-outline',
                feed: 'heart-outline',
                private: 'lock-closed-outline',
                mypage: 'person-outline',
              };

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={onPress}
                  style={styles.tabButton}
                >
                  <Ionicons
                    name={iconMap[route.name] || 'ellipse'}
                    size={22}
                    color={isFocused ? '#000' : '#888'}
                  />
                  <Text
                    style={[
                      styles.tabLabel,
                      isFocused && styles.tabLabelFocused,
                    ]}
                  >
                    {route.name === 'home'
                      ? '홈'
                      : route.name === 'feed'
                        ? '피드'
                        : route.name === 'private'
                          ? '부가'
                          : route.name === 'mypage'
                            ? '마이'
                            : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#fff',
  },
  writeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8E44FF',
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
    fontSize: 10,
    color: '#888',
    marginTop: 4,
  },

  tabLabelFocused: {
    color: '#000',
    fontWeight: '600',
  },
});
