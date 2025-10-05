// api.test.ts
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import api from './api';

// tokenStorage 모듈 목킹
jest.mock('@/utils/tokenStorage', () => ({
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
  saveAccessToken: jest.fn(),
  saveRefreshToken: jest.fn(),
  clearAllTokens: jest.fn(),
}));

// expo-router 목킹
jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}));

import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
  clearAllTokens,
} from '@/utils/tokenStorage';
import { router } from 'expo-router';

const tokenStorage = {
  getAccessToken: getAccessToken as jest.Mock,
  getRefreshToken: getRefreshToken as jest.Mock,
  saveAccessToken: saveAccessToken as jest.Mock,
  saveRefreshToken: saveRefreshToken as jest.Mock,
  clearAllTokens: clearAllTokens as jest.Mock,
};

const routerReplace = router.replace as jest.Mock;

// 유틸: 잠깐 대기(마이크로태스크 플러시용)
const tick = () => new Promise((r) => setTimeout(r, 0));

describe('api refresh logic', () => {
  // api 인스턴스용
  let apiMock: MockAdapter;
  // 기본 axios (refresh 요청용)
  let axiosMock: MockAdapter;

  beforeEach(() => {
    jest.resetAllMocks();

    apiMock = new MockAdapter(api, { delayResponse: 0 });
    axiosMock = new MockAdapter(axios, { delayResponse: 0 });
  });

  afterEach(() => {
    apiMock.restore();
    axiosMock.restore();
  });

  test('요청에 Authorization 헤더가 설정된다', async () => {
    // given
    tokenStorage.getAccessToken.mockResolvedValue('ACCESS.JWT');
    apiMock.onGet('/users/me').reply((config) => {
      // 헤더에 Bearer 토큰이 있어야 함
      const auth =
        // Axios v1의 AxiosHeaders일 수 있어 string 변환
        (config.headers as any)?.Authorization ||
        (config.headers as any)?.authorization;
      expect(auth).toBe('Bearer ACCESS.JWT');
      return [200, { ok: true }];
    });

    // when
    const res = await api.get('/users/me');

    // then
    expect(res.status).toBe(200);
  });

  test('401 발생 시 refresh 후 현재 요청이 재시도되어 성공한다', async () => {
    // given
    tokenStorage.getAccessToken.mockResolvedValue('EXPIRED.JWT');
    tokenStorage.getRefreshToken.mockResolvedValue('REFRESH.JWT');

    // 첫 호출은 401, 두 번째부터는 200으로 응답
    apiMock
      .onGet('/secure')
      .replyOnce(401)
      .onGet('/secure')
      .reply(200, { ok: true });

    // refresh 엔드포인트는 기본 axios로 호출됨
    axiosMock.onPost(/\/refresh$/).reply(200, {
      code: 1004,
      message: '토큰 재발급에 성공했습니다.',
      data: {
        accessToken: 'NEW.ACCESS.JWT',
        refreshToken: 'NEW.REFRESH.JWT',
      },
    });

    // when
    const res = await api.get('/secure');

    // then
    expect(res.status).toBe(200);
    expect(tokenStorage.saveAccessToken).toHaveBeenCalledWith('NEW.ACCESS.JWT');
    expect(tokenStorage.saveRefreshToken).toHaveBeenCalledWith(
      'NEW.REFRESH.JWT',
    );
    expect(routerReplace).not.toHaveBeenCalled();
  });

  test('동시에 2개의 401이 들어와도 refresh는 1번만 수행되고 둘 다 성공한다', async () => {
    // given
    tokenStorage.getAccessToken.mockResolvedValue('EXPIRED.JWT');
    tokenStorage.getRefreshToken.mockResolvedValue('REFRESH.JWT');

    // 두 요청 모두 최초에는 401 반환, 이후 200
    apiMock
      .onGet('/list')
      .replyOnce(401)
      .onGet('/list')
      .reply(200, { ok: true });
    apiMock.onGet('/me').replyOnce(401).onGet('/me').reply(200, { ok: true });

    // refresh는 1회만
    axiosMock.onPost(/\/refresh$/).reply(200, {
      code: 1004,
      message: '토큰 재발급에 성공했습니다.',
      data: {
        accessToken: 'NEW.ACCESS.JWT',
        refreshToken: 'NEW.REFRESH.JWT',
      },
    });

    // when: 동시에 호출
    const p1 = api.get('/list');
    const p2 = api.get('/me');

    const [r1, r2] = await Promise.all([p1, p2]);

    // then
    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);

    // refresh POST는 1번만 발생해야 함
    expect(
      axiosMock.history.post.filter((h) => /\/refresh$/.test(h.url || ''))
        .length,
    ).toBe(1);

    // 저장도 1번 이상 호출되었는지 확인
    expect(tokenStorage.saveAccessToken).toHaveBeenCalledWith('NEW.ACCESS.JWT');
    expect(tokenStorage.saveRefreshToken).toHaveBeenCalledWith(
      'NEW.REFRESH.JWT',
    );
  });

  test('/refresh 응답이 200이라도 토큰이 없으면 실패로 간주하고 로그아웃 처리한다', async () => {
    (getAccessToken as jest.Mock).mockResolvedValue('EXPIRED.JWT');
    (getRefreshToken as jest.Mock).mockResolvedValue('REFRESH.JWT');

    apiMock.onGet('/secure').replyOnce(401);

    axiosMock.onPost(/\/refresh$/).reply(200, {
      code: 1004,
      message: '토큰 재발급에 성공했습니다.',
      data: {}, // 토큰 누락
    });

    let error: any;
    try {
      await api.get('/secure');
    } catch (e) {
      error = e;
    }

    // 한 틱 대기: 인터셉터 catch의 비동기 처리 완료 보장
    await new Promise((r) => setTimeout(r, 0));

    expect(error).toBeTruthy();
    expect(clearAllTokens).toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith('/');

    expect(apiMock.history.get.filter((h) => h.url === '/secure')).toHaveLength(
      1,
    );
  });

  test('/refresh 호출 자체가 401이면 루프 없이 실패로 종료된다', async () => {
    // given
    tokenStorage.getAccessToken.mockResolvedValue('EXPIRED.JWT');
    tokenStorage.getRefreshToken.mockResolvedValue('REFRESH.JWT');

    apiMock
      .onGet('/secure')
      .replyOnce(401)
      .onGet('/secure')
      .reply(200, { ok: true });

    // refresh가 401로 실패
    axiosMock.onPost(/\/refresh$/).reply(401, { message: 'invalid refresh' });

    // when
    await expect(api.get('/secure')).rejects.toBeTruthy();
    await tick();

    // then
    expect(tokenStorage.clearAllTokens).toHaveBeenCalled();
    expect(routerReplace).toHaveBeenCalledWith('/');
  });
});
