import React from 'react';
import { View, Text } from 'react-native';
import { CustomButton } from '@/components';

export default function ButtonExamples() {
  return (
    <View>
      {/** variant = 'primary' , size = 'md' , rounded = 'md' 가 기본값으로 설정되어 있음 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        ✅ 기본 버튼
      </Text>
      <CustomButton
        onPress={() => console.log('클릭됨')}
        style={{ marginBottom: 24 }}
      >
        기본 버튼
      </CustomButton>

      {/** size = xs, sm, md, lg, xl */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        📏 사이즈별
      </Text>
      <CustomButton
        size="xs"
        rounded="full"
        onPress={() => {}}
        style={{ marginBottom: 12 }}
      >
        XS 버튼
      </CustomButton>
      <CustomButton size="lg" onPress={() => {}} style={{ marginBottom: 24 }}>
        Large 버튼
      </CustomButton>

      {/** variant = primary / secondary / text */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        🎨 스타일 (variant)
      </Text>
      <CustomButton
        variant="primary"
        onPress={() => {}}
        style={{ marginBottom: 12 }}
      >
        Primary
      </CustomButton>
      <CustomButton
        variant="secondary"
        onPress={() => {}}
        style={{ marginBottom: 12 }}
      >
        Secondary
      </CustomButton>
      <CustomButton
        variant="text"
        textColor="black"
        onPress={() => {}}
        style={{ marginBottom: 12 }}
      >
        Text - Black
      </CustomButton>
      <CustomButton
        variant="text"
        textColor="primary"
        onPress={() => {}}
        style={{ marginBottom: 24 }}
      >
        Text - Primary
      </CustomButton>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        🚫 Disabled
      </Text>
      <CustomButton disabled onPress={() => {}} style={{ marginBottom: 24 }}>
        비활성화된 버튼
      </CustomButton>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        ↔ Full Width
      </Text>
      <CustomButton fullWidth onPress={() => {}}>
        전체 너비 버튼
      </CustomButton>
    </View>
  );
}
