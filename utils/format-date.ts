import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/ko';

export function formatDate(iso: string): string {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}

export function formatMonthDayHour(iso: string): string {
  // 'Z'나 +09:00가 있으면 UTC 기준으로 읽고 local()로 변환
  const hasTZ = /[zZ]|[+\-]\d{2}:?\d{2}$/.test(iso);
  const d = hasTZ ? dayjs.utc(iso).local() : dayjs(iso);
  return `${d.month() + 1}월 ${d.date()}일 ${d.hour()}시`;
}

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale('ko');

export const formatRelativeTime = (date: string) => {
  return dayjs(date).fromNow(); // ex: '2분 전'
};

// ISO 문자열로 변환
export const toISODateTime = (d: Date) =>
  [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-') +
  'T' +
  [
    String(d.getHours()).padStart(2, '0'),
    String(d.getMinutes()).padStart(2, '0'),
    '00',
  ].join(':');

// 오늘 날짜 기준 n월 n일 반환
export const formatTodayMonthDay = (): string => {
  const today = dayjs();
  return `${today.month() + 1}월 ${today.date()}일`;
};

// n월 n일 반환
export function formatMonthDay(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${month}월 ${day}일`;
}
