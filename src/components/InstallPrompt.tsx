'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

/**
 * 홈 화면에 추가 안내.
 *
 * 안드로이드 크롬은 조건이 맞으면 beforeinstallprompt를 주고, 그걸 받아 두었다가
 * 사용자가 누를 때 설치창을 띄울 수 있다. 아이폰 사파리는 그런 신호가 없어서
 * 공유 버튼으로 직접 추가하는 방법을 글로 안내한다.
 *
 * 한 번 닫으면 다시 띄우지 않는다. 달력 앱처럼 매일 여는 사이트가 아니라
 * 생신 때만 찾는 곳이라, 올 때마다 뜨면 성가시다.
 */

const DISMISS_KEY = 'saengsinpyo_install_dismissed';

interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // 아이폰 사파리는 표준 대신 이 값을 쓴다
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * 손가락으로 쓰는 기기인지. PC와 휴대폰은 추가되는 곳이 달라서
 * (바탕화면 / 홈 화면) 안내 문구를 다르게 써야 한다.
 */
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(pointer: coarse)').matches;
}

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function wasDismissed(): boolean {
  try {
    return !!localStorage.getItem(DISMISS_KEY);
  } catch {
    // 저장소를 못 쓰는 브라우저에서도 안내는 보여 준다
    return false;
  }
}

/** 바뀔 일이 없는 값이라 구독할 것이 없다 */
const noSubscribe = () => () => {};

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [closed, setClosed] = useState(false);

  /*
    아이폰 사파리는 beforeinstallprompt를 주지 않아 직접 판단해야 한다.
    그런데 서버에는 브라우저가 없어서, 첫 그림은 서버와 같게 false로 두고
    브라우저에서 다시 읽는다. 효과 안에서 setState를 부르면 화면을 두 번
    그리게 되므로 이 방법을 쓴다.
  */
  const showIosGuide = useSyncExternalStore(
    noSubscribe,
    () => isIos() && !isStandalone() && !wasDismissed(),
    () => false
  );

  // 서버에서는 알 수 없으니 휴대폰 기준으로 그리고, 브라우저에서 다시 읽는다
  const touch = useSyncExternalStore(noSubscribe, isTouchDevice, () => true);
  const place = touch ? '홈 화면' : '바탕화면';

  useEffect(() => {
    // 이미 홈 화면에서 열었거나, 전에 닫았으면 끝
    if (isStandalone() || wasDismissed()) return;

    const onPrompt = (e: Event) => {
      // 크롬 기본 배너 대신 우리 화면에서 때를 골라 띄운다
      e.preventDefault();
      setDeferred(e as InstallEvent);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  const dismiss = () => {
    setClosed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // 못 적어도 이번 화면에서는 닫힌다
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    // 설치했든 취소했든 이 신호는 한 번만 쓸 수 있다
    setDeferred(null);
    dismiss();
  };

  if (closed || (!deferred && !showIosGuide)) return null;

  return (
    <section className="max-w-md mx-auto px-4 pb-6">
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}
      >
        <span className="text-2xl shrink-0 leading-none mt-0.5" aria-hidden="true">
          📲
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {place}에 두고 쓰세요
          </p>
          {deferred ? (
            <>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {touch ? '앱처럼 한 번에 열립니다.' : '브라우저 주소를 치지 않고 바로 열립니다.'} 저장한 생신도 그대로 있어요.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={install}
                  className="py-2 px-4 rounded-xl text-sm font-bold"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                >
                  추가하기
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="py-2 px-3 rounded-xl text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  괜찮아요
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                아래 <strong>공유 버튼</strong>
                <span aria-hidden="true"> ⎙ </span>을 누르고{' '}
                <strong>&lsquo;홈 화면에 추가&rsquo;</strong>를 고르세요.
              </p>
              <button
                type="button"
                onClick={dismiss}
                className="mt-2 text-xs"
                style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}
              >
                닫기
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
