export function getLinkedUserBadgeLabel<T>(
  users: T[],
  opts: {
    id: (u: T) => number | string; // user id 선택자
    name: (u: T) => string; // name 선택자
    isAuthor?: (u: T) => boolean; // 상세 응답처럼 isAuthor 플래그가 있을 때
    authorId?: number | string; // 글쓰기처럼 현재 작성자 id만 알고 있을 때
    totalCountOverride?: number; // 서버가 따로 totalCount를 주는 경우(옵션)
  },
): string | null {
  const { id, name, isAuthor, authorId, totalCountOverride } = opts;

  if (!users || users.length === 0) return null;

  // 1) 중복 제거 (id 기준)
  const seen = new Set<string | number>();
  const unique = users.filter((u) => {
    const key = id(u);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // 2) 작성자 제외 (isAuthor 플래그 또는 authorId로 식별)
  const nonAuthors = unique.filter((u) => {
    const byFlag = isAuthor ? !isAuthor(u) : true;
    const byId = authorId !== undefined ? id(u) !== authorId : true;
    return byFlag && byId;
  });

  // 총원은 서버 total(예: linkedUserCount) 우선, 없으면 unique 길이
  const total = totalCountOverride ?? unique.length;

  // 배지는 "총원 > 1"일 때만 노출
  if (total <= 1 || nonAuthors.length === 0) return null;

  const first = name(nonAuthors[0]) || '사용자';
  const others = total - 1; // 첫 번째 비작성자를 대표로 쓰므로 나머지 인원 수

  return `${first} 외 ${others}명`;
}
