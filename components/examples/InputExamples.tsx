import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Input, Textarea } from '@/components';

export default function InputExamples() {
  return (
    <ScrollView>
      <Section>
        <Title>📌 Input 예시</Title>
        {/** input 상단의 title, 하단의 subMessage 추가 가능 */}
        <Input
          title="이름"
          placeholder="이름을 입력해 주세요"
          subMessage="실명을 입력해주세요."
        />

        <Input placeholder="example@leenk.site" />
      </Section>

      <Section>
        <Title>📌 Textarea 예시</Title>
        <Textarea
          title="주제"
          placeholder="간단한 자기소개를 입력해 주세요"
          subMessage="200자까지 작성할 수 있어요."
          maxLength={200}
        />

        {/** 피드페이지에서 쓰이는 dark 모드 */}
        <Textarea
          variant="dark"
          placeholder="텍스트를 입력해주세요요요요"
          maxLength={60} // 글자수 제한 표시
          minHeight={54} // 높이 조절 가능
        />
      </Section>
    </ScrollView>
  );
}

const Section = styled.View`
  margin-bottom: 40px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;
