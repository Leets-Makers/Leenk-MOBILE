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
  const [isFocused, setIsFocused] = useState(false);
  const handleChange = (_: any, date?: Date) => {
    setShowPicker(false);
    setIsFocused(false);
    if (date) setSelectedDate(date);
  };

  return (
    <>
      <Container $isFocused={isFocused}>
        <StyledText selected={!!selectedDate}>
          {selectedDate
            ? dayjs(selectedDate).format('MM월 DD일 HH시')
            : '모임 일시를 선택해줘'}
        </StyledText>

        <Pressable
          onPress={() => {
            setShowPicker(true);
            setIsFocused(true);
          }}
        >
          <CalendarIcon />
        </Pressable>
      </Container>

      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          minimumDate={new Date()}
        />
      )}
    </>
  );
}

const Container = styled.View<{ $isFocused: boolean }>`
  width: 100%;
  border-radius: ${radius.sm}px;
  padding: ${height * 12}px ${width * 12}px;
  margin-top: ${height * 8}px;
  border-width: 2px;
  border-color: ${({ $isFocused }) =>
    $isFocused ? colors.primaryLight : colors.divider[2]};
  background-color: transparent;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledText = styled.Text<{ selected: boolean }>`
  font-size: ${fontSize.md}px;
  line-height: ${lineHeight.l};
  font-family: ${fonts.Regular};
  color: ${({ selected }) => (selected ? colors.black : '#B0B0B0')};
`;
