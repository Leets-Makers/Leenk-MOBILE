import 'react-native-reanimated';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from '@/components/Toast';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 폰트 설정
  const [loaded, error] = useFonts({
    'NanumSquareNeo-Regular': require('../assets/fonts/NanumSquareNeo-bRg.ttf'),
    'NanumSquareNeo-Bold': require('../assets/fonts/NanumSquareNeo-cBd.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      {/* StatusBar 설정 */}
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'dark'}
        backgroundColor="#F0ECFE"
        translucent={Platform.OS === 'ios'}
      />

      {/* iOS 대응: SafeAreaView top 영역 배경 적용 */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#F0ECFE' }} />

      {/* 앱 전체 Theme 적용 */}
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <Toast />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
