export type AuthStatus =
  | 'NONE' // 비로그인
  | 'REGISTERING' // 회원가입 진행 중 (임시 토큰)
  | 'AUTHENTICATED'; // 정상 로그인 완료
