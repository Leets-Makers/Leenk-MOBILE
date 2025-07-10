export function getSubjectJosa(word: string): string {
  if (!word) return '이';

  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);

  // 한글 범위 체크: 가(44032) ~ 힣(55203)
  if (code < 44032 || code > 55203) {
    return '가'; // 한글이 아니면 기본적으로 "가"
  }

  const hasJong = (code - 44032) % 28 !== 0;
  return hasJong ? '이' : '가';
}
