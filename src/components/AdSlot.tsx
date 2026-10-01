'use client';

import { useEffect, useRef, useState } from 'react';
import { ADSENSE_CLIENT, isAdsenseEnabled } from '@/lib/adsense';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface Props {
  /** 애드센스 광고 단위 ID */
  slot: string;
  /** 광고 위에 붙일 안내 문구를 바꾸고 싶을 때 */
  label?: string;
  className?: string;
}

/** 광고가 끝내 안 오면 자리를 비우기까지 기다리는 시간 */
const GIVE_UP_MS = 4000;

/**
 * 광고 한 칸.
 *
 * 설정이 없으면 아무것도 그리지 않는다. 빈 자리를 남겨 두면 깨진 요소처럼
 * 보이고 자리만 밀어낸다.
 *
 * 광고임을 작게 밝혀 둔다. 본문과 구분이 안 되면 잘못 누르게 되고,
 * 그건 사용자에게도 애드센스 정책상으로도 좋지 않다.
 *
 * 채울 광고가 없거나 차단기에 막히면 애드센스가 빈 칸을 그대로 둔다.
 * 그러면 'ㅤ광고' 글자 아래로 수백 픽셀이 비어 사이트가 고장 난 것처럼
 * 보인다. 그래서 채워졌을 때만 글자를 보이고, 안 채워지면 통째로 접는다.
 */
export default function AdSlot({ slot, label = '광고', className }: Props) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [state, setState] = useState<'pending' | 'filled' | 'empty'>('pending');

  useEffect(() => {
    if (!isAdsenseEnabled || !slot) return;
    // 개발 중 다시 그릴 때 같은 자리에 두 번 넣지 않도록 막는다
    if (pushed.current) return;
    pushed.current = true;
    try {
      // 스크립트가 아직 안 왔어도 괜찮다. 이 배열에 쌓아 두면
      // 스크립트가 도착한 뒤에 꺼내서 처리한다.
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // 광고 차단기 등으로 실패해도 화면은 그대로 쓸 수 있어야 한다
    }
  }, [slot]);

  useEffect(() => {
    const el = insRef.current;
    if (!el) return;

    // 애드센스는 결과를 data-ad-status 속성으로 알려 준다.
    const read = () => {
      const status = el.getAttribute('data-ad-status');
      if (status === 'filled') setState('filled');
      else if (status === 'unfilled') setState('empty');
    };
    read();

    const observer = new MutationObserver(read);
    observer.observe(el, { attributes: true, attributeFilter: ['data-ad-status'] });

    // 차단기에 막히면 속성이 아예 안 붙는다. 그때도 자리를 비운다.
    const timer = window.setTimeout(() => {
      if (!el.getAttribute('data-ad-status')) setState('empty');
    }, GIVE_UP_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  if (!isAdsenseEnabled || !slot) return null;

  return (
    <div className={className} hidden={state === 'empty'}>
      <p
        className="text-center mb-1"
        style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          // 광고가 실제로 왔을 때만 보인다. 자리는 미리 잡아 두어
          // 나중에 글자가 생기면서 아래가 밀리지 않게 한다.
          visibility: state === 'filled' ? 'visible' : 'hidden',
        }}
      >
        {label}
      </p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: state === 'filled' ? 100 : 0 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
