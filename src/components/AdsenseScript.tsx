'use client';

import { useEffect } from 'react';
import { ADSENSE_CLIENT, isAdsenseEnabled } from '@/lib/adsense';

/**
 * 애드센스 스크립트를 화면이 다 그려진 뒤에 불러온다.
 *
 * head에 async로 두었을 때 이 스크립트 하나가 모바일에서 261KB를 받고
 * 메인 스레드를 0.7초 잡았다. 광고를 끄고 재어 보니 성능 점수가 65점과
 * 88점으로 갈렸다. 광고는 쪽 아래쪽에만 있어서 첫 화면을 그리는 동안
 * 받을 이유가 없다.
 *
 * 승인 심사 때는 head에 그대로 두었다. 심사 전에 미루면 광고가 없는
 * 사이트로 보일 수 있어서였다. 승인된 뒤에 옮긴다.
 *
 * 되돌리려면 이 컴포넌트를 지우고 layout.tsx의 head에 다시 넣으면 된다.
 */

/** 아무 일도 안 일어나도 이때까지는 불러온다 */
const FALLBACK_MS = 3000;

export default function AdsenseScript() {
  useEffect(() => {
    if (!isAdsenseEnabled) return;
    if (document.querySelector('script[data-adsense]')) return;

    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      const s = document.createElement('script');
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.dataset.adsense = 'true';
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
      document.head.appendChild(s);
    };

    // 손가락이 닿으면 곧 아래로 내려갈 참이니 미리 받아 둔다.
    const events = ['scroll', 'pointerdown', 'keydown'] as const;
    for (const e of events) window.addEventListener(e, load, { once: true, passive: true });

    // 아무 동작이 없어도 한가해지면 받는다. 한가한 때가 안 오면 3초 뒤에.
    const idle = window.requestIdleCallback?.(load, { timeout: FALLBACK_MS });
    const timer = window.setTimeout(load, FALLBACK_MS);

    return () => {
      for (const e of events) window.removeEventListener(e, load);
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
