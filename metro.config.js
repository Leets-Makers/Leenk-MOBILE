// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// SVG 설정
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer',
);
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// svg 확장자 제거하고 sourceExts에 추가
const { assetExts, sourceExts } = config.resolver;
config.resolver.assetExts = assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...sourceExts, 'svg'];

module.exports = config;
