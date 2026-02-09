import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Leenk',
  slug: 'Leenk',
  version: '1.1.17',
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
        '피드 작성, 링크(모임) 개설 시 사진을 업로드하거나 프로필 사진을 설정하기 위해 사진 보관함 접근 권한에 동의가 필요합니다. 설정에서 이를 변경할 수 있습니다.',
      CFBundleURLTypes: [{ CFBundleURLSchemes: ['leenk'] }],
      ITSAppUsesNonExemptEncryption: false,
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
