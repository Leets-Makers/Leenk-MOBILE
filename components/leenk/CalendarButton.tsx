import React, { useEffect, useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import dayjs from 'dayjs';
import styled from 'styled-components/native';
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
import { useToastStore } from '@/stores/toastStore';

interface CalendarButtonProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  onDateChange?: (date: Date | null) => void;
  mode?: 'leenk' | 'birthday';
  placeholder?: string;
}

type Step = 'date' | 'time' | null;

export default function CalendarButton({
  value,
  onChange,
  onDateChange,
  mode = 'leenk',
  placeholder,
}: CalendarButtonProps) {
  const { showToast } = useToastStore();

  const [selectedDate, setSelectedDate] = useState<Date | null>(value ?? null);
  const [step, setStep] = useState<Step>(null);
  const [tempDateStr, setTempDateStr] = useState<string>('');

  // 최소 날짜 (leenk 전용)
  const minDateStr = useMemo(
    () => getFormatedDate(new Date(), 'YYYY/MM/DD'),
    [],
  );

  useEffect(() => {
    if (value?.getTime() !== selectedDate?.getTime()) {
      setSelectedDate(value ?? null);
    }
  }, [value]);

  const commit = (date: Date | null) => {
    setSelectedDate(date);
    onChange?.(date);
    onDateChange?.(date);
  };

  // 날짜 선택 로직
  const handleSelectDate = (dateStr: string) => {
    const selected = dayjs(dateStr, 'YYYY/MM/DD');

    if (mode === 'birthday') {
      // 생일 모드 : 모든 날짜 가능
      commit(selected.toDate());
      setStep(null);
      return;
    }

    // leenk 모드 : 날짜 선택 후 시간 선택으로 이동
    setTempDateStr(dateStr);
    setStep('time');
  };

  // 시간 선택 로직
  const handleSelectTime = (timeStr: string) => {
    const selected = dayjs(`${tempDateStr} ${timeStr}`, 'YYYY/MM/DD HH:mm');
    const now = dayjs();

    if (selected.isSame(now, 'day') && selected.isBefore(now)) {
      const minutesToAdd = 30 - (now.minute() % 30);
      const rounded = now
        .add(minutesToAdd === 30 ? 0 : minutesToAdd, 'minute')
        .second(0)
        .millisecond(0);

      showToast('현재 시간 이후로 선택해줘!', 'error');
      commit(rounded.toDate());
    } else {
      commit(selected.toDate());
    }
    setStep(null);
  };

  // 표시 포맷 변경
  const formattedText = selectedDate
    ? mode === 'birthday'
      ? dayjs(selectedDate).format('MM월 DD일')
      : dayjs(selectedDate).format('MM월 DD일 HH시 mm분')
    : (placeholder ??
      (mode === 'birthday' ? '생일을 선택해줘' : '모임 일시를 선택해줘'));

  return (
    <>
      <Container $isFocused={!!step}>
        <StyledText selected={!!selectedDate}>{formattedText}</StyledText>
        <Pressable onPress={() => setStep('date')}>
          <CalendarIcon />
        </Pressable>
      </Container>

      {/* 날짜 선택 */}
      {step === 'date' && (
        <DatePicker
          mode="calendar"
          minimumDate={mode === 'leenk' ? minDateStr : undefined}
          maximumDate={undefined}
          onSelectedChange={handleSelectDate}
          onDateChange={() => {}}
          onMonthYearChange={() => {}}
          options={{
            mainColor: colors.primary,
            defaultFont: fonts.Regular,
            headerFont: fonts.Bold,
          }}
          locale="en"
          isGregorian
        />
      )}

      {/* 시간 선택 */}
      {step === 'time' && (
        <DatePicker
          mode="time"
          onTimeChange={handleSelectTime} // HH:mm
          minuteInterval={30}
          onDateChange={() => {}}
          onSelectedChange={() => {}}
          options={{
            mainColor: colors.primary,
            defaultFont: fonts.Regular,
            headerFont: fonts.Bold,
          }}
          locale="en"
          isGregorian
        />
      )}
    </>
  );
}

/* styled */
const Container = styled.View<{ $isFocused: boolean }>`
  width: 100%;
  border-radius: ${radius.sm}px;
  padding: ${height * 12}px ${width * 12}px;
  margin-top: ${height * 12}px;
  border-width: ${({ $isFocused }) => ($isFocused ? 2 : 1)}px;
  border-color: ${({ $isFocused }) =>
    $isFocused ? colors.primaryLight : colors.divider[2]};
  background-color: transparent;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StyledText = styled.Text<{ selected: boolean }>`
  font-size: ${fontSize.lg}px;
  line-height: ${lineHeight.l};
  font-family: ${fonts.Regular};
  color: ${({ selected }) => (selected ? colors.black : '#B0B0B0')};
`;
