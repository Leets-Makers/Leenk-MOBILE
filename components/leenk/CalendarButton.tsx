import React, { useState } from 'react';
import { Platform, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarIcon } from '@/assets';
import colors from '@/theme/color';
import {
  fonts,
  fontSize,
  height,
  lineHeight,
  radius,
  width,
} from '@/theme/globalStyles';
import styled from 'styled-components/native';
import dayjs from 'dayjs';

export default function CalendarButton() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_: any, date?: Date) => {
    setShowPicker(false);
    if (date) setSelectedDate(date);
  };

  return (
    <>
      <Container>
        <StyledText selected={!!selectedDate}>
          {selectedDate
            ? dayjs(selectedDate).format('MM월 DD일 HH시')
            : '모임 일시를 선택해줘'}
        </StyledText>

        <Pressable onPress={() => setShowPicker(true)}>
          <CalendarIcon />
        </Pressable>
      </Container>

      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="datetime"
          display="default"
          onChange={handleChange}
          minimumDate={new Date()}
        />
      )}
    </>
  );
}

const Container = styled.View`
  width: 100%;
  border-radius: ${radius.sm}px;
  padding: ${height * 12}px ${width * 12}px;
  border-width: 2px;
  border-color: ${colors.divider[2]};
  background-color: transparent;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledText = styled.Text<{ selected: boolean }>`
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l};
  font-family: ${fonts.Regular};
  color: ${({ selected }) => (selected ? colors.black : colors.text[3])};
`;
