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

dayjs.extend(relativeTime);
dayjs.locale('ko'); // '몇 분 전' 등 한글로

export const formatRelativeTime = (date: string) => {
  return dayjs(date).fromNow(); // ex: '2분 전'
};
