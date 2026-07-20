jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

import { router } from 'expo-router';
import {
  resolveDestination,
  handleNotificationOpen,
  markAuthResolved,
  markNavigatorMounted,
  resetNotificationRouterForTest,
} from './notificationRouter';

const routerPush = router.push as jest.Mock;

// 준비 완료 상태로 만들어 두는 헬퍼
const makeReady = () => {
  markAuthResolved();
  markNavigatorMounted();
};

beforeEach(() => {
  resetNotificationRouterForTest();
  routerPush.mockClear();
});

describe('resolveDestination', () => {
  it('FCM의 path/pathId 형태를 읽는다', () => {
    expect(resolveDestination({ path: 'leenks', pathId: '12' })).toEqual({
      pathname: '/leenk/[id]',
      params: { id: '12' },
    });
  });

  it('expo-notifications의 type/id 형태를 읽는다', () => {
    expect(resolveDestination({ type: 'feed', id: 34 })).toEqual({
      pathname: '/feed/[id]',
      params: { id: '34' },
    });
  });

  it('단수와 복수 표기를 모두 허용한다', () => {
    expect(resolveDestination({ path: 'leenk', pathId: '1' })).toEqual(
      resolveDestination({ path: 'leenks', pathId: '1' }),
    );
  });

  it('생일 편지 알림은 편지함으로 보낸다', () => {
    expect(
      resolveDestination({
        path: 'birthday',
        notificationType: 'BIRTHDAY_LETTER',
      }),
    ).toEqual({ pathname: '/extra/birthday/letters' });
  });

  it('id가 없으면 목적지를 만들지 않는다', () => {
    expect(resolveDestination({ path: 'leenk' })).toBeNull();
  });

  it('모르는 path면 목적지를 만들지 않는다', () => {
    expect(resolveDestination({ path: 'unknown', pathId: '1' })).toBeNull();
  });
});

describe('cold start 지연 라우팅', () => {
  it('준비 전에 들어온 알림은 즉시 이동하지 않는다', () => {
    handleNotificationOpen('noti-1', { path: 'leenk', pathId: '7' });

    expect(routerPush).not.toHaveBeenCalled();
  });

  it('자동 로그인만 끝난 상태에서는 아직 이동하지 않는다', () => {
    handleNotificationOpen('noti-1', { path: 'leenk', pathId: '7' });
    markAuthResolved();

    expect(routerPush).not.toHaveBeenCalled();
  });

  it('자동 로그인과 네비게이터가 모두 준비되면 보관해둔 목적지로 이동한다', () => {
    handleNotificationOpen('noti-1', { path: 'leenk', pathId: '7' });
    makeReady();

    expect(routerPush).toHaveBeenCalledTimes(1);
    expect(routerPush).toHaveBeenCalledWith({
      pathname: '/leenk/[id]',
      params: { id: '7' },
    });
  });

  it('준비가 끝난 뒤에 들어온 알림은 바로 이동한다', () => {
    makeReady();
    handleNotificationOpen('noti-1', { path: 'feed', pathId: '9' });

    expect(routerPush).toHaveBeenCalledWith({
      pathname: '/feed/[id]',
      params: { id: '9' },
    });
  });
});

describe('중복 이동 방지', () => {
  it('같은 알림 ID는 한 번만 처리한다', () => {
    makeReady();
    handleNotificationOpen('noti-1', { path: 'leenk', pathId: '7' });
    handleNotificationOpen('noti-1', { path: 'leenk', pathId: '7' });

    expect(routerPush).toHaveBeenCalledTimes(1);
  });

  it('알림 ID 체계가 달라도 같은 목적지면 한 번만 이동한다', () => {
    makeReady();
    // FCM messageId와 expo identifier가 서로 다른 값으로 같은 탭을 전달하는 상황
    handleNotificationOpen('fcm-message-id', { path: 'leenk', pathId: '7' });
    handleNotificationOpen('expo-identifier', { type: 'leenk', id: '7' });

    expect(routerPush).toHaveBeenCalledTimes(1);
  });

  it('cold start에서 두 리스너가 같은 알림을 전달해도 한 번만 이동한다', () => {
    handleNotificationOpen('fcm-message-id', { path: 'leenk', pathId: '7' });
    handleNotificationOpen('expo-identifier', { type: 'leenk', id: '7' });
    makeReady();

    expect(routerPush).toHaveBeenCalledTimes(1);
  });

  it('목적지가 다르면 각각 이동한다', () => {
    makeReady();
    handleNotificationOpen('noti-1', { path: 'leenk', pathId: '7' });
    handleNotificationOpen('noti-2', { path: 'leenk', pathId: '8' });

    expect(routerPush).toHaveBeenCalledTimes(2);
  });

  it('해석할 수 없는 알림은 이동하지 않는다', () => {
    makeReady();
    handleNotificationOpen('noti-1', { path: 'leenk' });

    expect(routerPush).not.toHaveBeenCalled();
  });
});
