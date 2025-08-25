import dayjs from 'dayjs';
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
  const date = new Date(iso);
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours();

  return `${month}월 ${day}일 ${hour}시`;
}

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
