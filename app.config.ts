import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Leenk',
  slug: 'Leenk',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/ic_logo.png',
  scheme: 'leenk',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/ic_logo.png',
    resizeMode: 'cover',
    backgroundColor: '#F7F7FA',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.example.leenk',
    infoPlist: {
      NSPhotoLibraryUsageDescription:
        '사진을 선택하려면 접근 권한이 필요합니다.',
    },
  },
  android: {
    package: 'com.example.leenk',
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      foregroundImage: './assets/images/ic_logo.png',
      backgroundColor: '#ffffff',
    },
    permissions: [
      'READ_MEDIA_IMAGES',
      'READ_MEDIA_VIDEO',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
    ],
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/ic_logo.png',
  },
  plugins: [
    [
      '@react-native-kakao/core',
      {
        nativeAppKey: process.env.EXPO_PUBLIC_NATIVE_APP_KEY,
        android: {
          authCodeHandlerActivity: true,
        },
        ios: {
          handleKakaoOpenUrl: true,
        },
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          extraMavenRepos: [
            'https://devrepo.kakao.com/nexus/content/groups/public/',
          ],
          manifestPlaceholders: {
            EXPO_PUBLIC_NATIVE_APP_KEY: process.env.EXPO_PUBLIC_NATIVE_APP_KEY,
          },
        },
      },
    ],
    'expo-router',
  ],
  experiments: {
    typedRoutes: true,
  },
});
