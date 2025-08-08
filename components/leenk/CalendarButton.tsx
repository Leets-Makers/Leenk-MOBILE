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
import DatePicker from 'react-native-modern-datepicker';
import { getFormatedDate } from 'react-native-modern-datepicker';

export default function CalendarButton() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [step, setStep] = useState<'date' | 'time' | null>(null); // Android 전용
  const [tempDate, setTempDate] = useState<string>(''); // YYYY-MM-DD

  const handleIOSChange = (_: any, date?: Date) => {
    if (date) setSelectedDate(date);
    setStep(null);
  };

  const handleAndroidDate = (dateStr: string) => {
    setTempDate(dateStr);
    setStep('time');
  };

  const handleAndroidTime = (timeStr: string) => {
    const date = new Date(`${tempDate}T${timeStr}`);
    setSelectedDate(date);
    setStep(null);
  };

  return (
    <>
      <Container $isFocused={!!step}>
        <StyledText selected={!!selectedDate}>
          {selectedDate
            ? dayjs(selectedDate).format('MM월 DD일 HH시')
            : '모임 일시를 선택해줘'}
        </StyledText>

        <Pressable
          onPress={() => {
            if (Platform.OS === 'ios') {
              setStep('date');
            } else {
              setStep('date');
            }
          }}
        >
          <CalendarIcon />
        </Pressable>
      </Container>

      {/* iOS: native datetime picker */}
      {Platform.OS === 'ios' && step === 'date' && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="datetime"
          display="default"
          onChange={handleIOSChange}
          minimumDate={new Date()}
        />
      )}

      {/* Android: modern-datepicker date -> time */}
      {Platform.OS === 'android' && step === 'date' && (
        <DatePicker
          mode="calendar"
          onDateChange={() => {}}
          onMonthYearChange={() => {}}
          onSelectedChange={handleAndroidDate}
          minimumDate={getFormatedDate(new Date(), 'YYYY/MM/DD')}
          options={{
            mainColor: colors.primary,
            defaultFont: fonts.Regular,
            headerFont: fonts.Bold,
          }}
          locale="en"
          isGregorian={true}
        />
      )}

      {Platform.OS === 'android' && step === 'time' && (
        <DatePicker
          mode="time"
          onTimeChange={(timeStr) => {
            const date = dayjs(
              `${tempDate} ${timeStr}`,
              'YYYY-MM-DD HH:mm',
            ).toDate();
            setSelectedDate(date);
            setStep(null);
          }}
          onDateChange={() => {}}
          onSelectedChange={handleAndroidTime}
          minuteInterval={30}
          options={{
            mainColor: colors.primary,
            defaultFont: fonts.Regular,
            headerFont: fonts.Bold,
          }}
          locale="en"
          isGregorian={true}
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
