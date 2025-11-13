import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Leenk',
  slug: 'Leenk',
  version: '1.1.6',
  orientation: 'portrait',
  icon: './assets/images/ic_logo.png',
  scheme: 'leenk',
  jsEngine: 'jsc',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.leetsmakers.leenk',
    infoPlist: {
      NSPhotoLibraryUsageDescription:
        '사진을 선택하려면 접근 권한이 필요합니다.',
      CFBundleURLTypes: [{ CFBundleURLSchemes: ['leenk'] }],
    },
    googleServicesFile: './GoogleService-Info.plist',
    usesAppleSignIn: true,
  },
  android: {
    icon: './assets/images/ic_logo_round.png',
    package: 'com.leetsmakers.leenk',
    googleServicesFile: './google-services.json',
    edgeToEdgeEnabled: true,
    intentFilters: [
      {
        action: 'VIEW',
        autoVerify: false,
        data: [{ scheme: 'leenk' }],
        category: ['BROWSABLE', 'DEFAULT'],
      },
    ],
    adaptiveIcon: {
      // foregroundImage: './assets/images/ic_logo_round.png',
      // backgroundColor: '#ffffff',
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
    favicon: './assets/images/ic_logo_round.png',
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
    ['@react-native-firebase/app'],
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
        ios: {
          'useFrameworks!': 'static',
        },
      },
    ],
    'expo-router',
    'expo-apple-authentication',
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: 'e15a0ece-03d1-48b2-939f-1e4b8b44b498',
    },
    googleServicesFile: './GoogleService-Info.plist',
  },
});
