import { router } from 'expo-router';

const LEENK_ROUTE = '/leenk/[id]' as const;
const FEED_ROUTE = '/feed/[id]' as const;
const BIRTHDAY_LETTERS_ROUTE = '/extra/birthday/letters' as const;
const BIRTHDAY_ROUTE = '/extra' as const;

export type NotificationData = Record<string, unknown> | undefined;

export type Destination =
  | { pathname: typeof LEENK_ROUTE; params: { id: string } }
  | { pathname: typeof FEED_ROUTE; params: { id: string } }
  | { pathname: typeof BIRTHDAY_LETTERS_ROUTE }
  | { pathname: typeof BIRTHDAY_ROUTE };

const toText = (value: unknown) => (value == null ? '' : String(value).trim());

/**
 * 알림 페이로드에서 목적지를 해석한다.
 * FCM은 path/pathId, expo-notifications는 type/id로 내려와서 양쪽 키를 모두 받는다.
 * 해석할 수 없으면 null을 반환해 이동하지 않는다.
 */
export const resolveDestination = (data: NotificationData): Destination | null => {
  const payload = data ?? {};
  const path = toText(payload.path ?? payload.type).toLowerCase();
  const id = toText(payload.pathId ?? payload.id);

  if (path === 'birthday') {
    const notificationType = toText(payload.notificationType);
    if (notificationType === 'BIRTHDAY_LETTER') {
      return { pathname: BIRTHDAY_LETTERS_ROUTE };
    }
    return { pathname: BIRTHDAY_ROUTE };
  }

  if (!id) return null;

  if (path === 'leenk' || path === 'leenks' || path === 'link') {
    return { pathname: LEENK_ROUTE, params: { id } };
  }

  if (path === 'feed' || path === 'feeds') {
    return { pathname: FEED_ROUTE, params: { id } };
  }

  return null;
};

const destinationKey = (destination: Destination) =>
  'params' in destination
    ? `${destination.pathname}:${destination.params.id}`
    : destination.pathname;

// 자동 로그인 완료와 네비게이터 마운트가 모두 끝나야 이동을 흘려보낸다.
let authResolved = false;
let navigatorMounted = false;

let pendingDestination: Destination | null = null;

// 같은 알림이 두 리스너에 동시에 잡히는 경우를 거르기 위한 기록
const handledNotificationIds = new Set<string>();
const DUPLICATE_WINDOW_MS = 1000;
let lastNavigation: { key: string; at: number } | null = null;

const isReady = () => authResolved && navigatorMounted;

const navigate = (destination: Destination) => {
  const key = destinationKey(destination);
  const now = Date.now();

  // FCM과 expo-notifications는 알림 ID 체계가 달라 ID만으로는 중복을 못 거른다.
  // 같은 목적지로의 연속 이동은 짧은 시간 안에서 한 번만 허용한다.
  if (
    lastNavigation &&
    lastNavigation.key === key &&
    now - lastNavigation.at < DUPLICATE_WINDOW_MS
  ) {
    return;
  }
  lastNavigation = { key, at: now };

  switch (destination.pathname) {
    case LEENK_ROUTE:
      router.push({ pathname: LEENK_ROUTE, params: destination.params });
      return;
    case FEED_ROUTE:
      router.push({ pathname: FEED_ROUTE, params: destination.params });
      return;
    default:
      router.push(destination.pathname);
  }
};

const flushPending = () => {
  if (!isReady()) return;

  const destination = pendingDestination;
  pendingDestination = null;
  if (destination) navigate(destination);
};

/** 자동 로그인 분기가 끝났을 때 호출한다. */
export const markAuthResolved = () => {
  authResolved = true;
  flushPending();
};

/** 루트 네비게이터가 마운트됐을 때 호출한다. */
export const markNavigatorMounted = () => {
  navigatorMounted = true;
  flushPending();
};

/**
 * 알림 탭을 처리한다.
 * 앱이 아직 준비되지 않았으면 목적지를 보관했다가 준비 완료 직후 이동한다.
 */
export const handleNotificationOpen = (
  notificationId: string | undefined,
  data: NotificationData,
) => {
  if (notificationId) {
    if (handledNotificationIds.has(notificationId)) return;
    handledNotificationIds.add(notificationId);
  }

  const destination = resolveDestination(data);
  if (!destination) return;

  if (!isReady()) {
    pendingDestination = destination;
    return;
  }

  navigate(destination);
};

/** 테스트 전용: 모듈 상태 초기화 */
export const resetNotificationRouterForTest = () => {
  authResolved = false;
  navigatorMounted = false;
  pendingDestination = null;
  handledNotificationIds.clear();
  lastNavigation = null;
};
