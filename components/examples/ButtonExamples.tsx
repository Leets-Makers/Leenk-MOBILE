import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CustomButton from '@/components/common/CustomButton';

export default function ButtonExamples() {
  return (
    <View style={{ gap: 20 }}>
      {/** variant = 'primary' , size = 'md' , rounded = 'md' 가 기본값으로 설정되어 있음 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>✅ 기본 버튼</Text>
      <CustomButton onPress={() => console.log('클릭됨')}>
        기본 버튼
      </CustomButton>

      {/** size = xs, sm, md, lg, xl */}
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>📏 사이즈별</Text>
      <CustomButton size="xs" onPress={() => {}}>
        XS 버튼
      </CustomButton>
      <CustomButton size="lg" onPress={() => {}}>
        Large 버튼
      </CustomButton>

      {/** variant = primary / secondary / text */}
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        🎨 스타일 (variant)
      </Text>
      <CustomButton variant="primary" onPress={() => {}}>
        Primary
      </CustomButton>
      <CustomButton variant="secondary" onPress={() => {}}>
        Secondary
      </CustomButton>

      <CustomButton variant="text" textColor="black" onPress={() => {}}>
        Text - Black
      </CustomButton>
      <CustomButton variant="text" textColor="primary" onPress={() => {}}>
        Text - Primary
      </CustomButton>

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>🚫 Disabled</Text>
      <CustomButton disabled onPress={() => {}}>
        비활성화된 버튼
      </CustomButton>

      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>↔ Full Width</Text>
      <CustomButton fullWidth onPress={() => {}}>
        전체 너비 버튼
      </CustomButton>
    </View>
  );
}
