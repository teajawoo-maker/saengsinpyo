'use client';

import { useEffect, useRef } from 'react';
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

/**
 * 광고 한 칸.
 *
 * 설정이 없으면 아무것도 그리지 않는다. 빈 자리를 남겨 두면 깨진 요소처럼
 * 보이고 자리만 밀어낸다.
 *
 * 광고임을 작게 밝혀 둔다. 본문과 구분이 안 되면 잘못 누르게 되고,
 * 그건 사용자에게도 애드센스 정책상으로도 좋지 않다.
 */
export default function AdSlot({ slot, label = '광고', className }: Props) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!isAdsenseEnabled || !slot) return;
    // 개발 중 다시 그릴 때 같은 자리에 두 번 넣지 않도록 막는다
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
    } catch {
      // 광고 차단기 등으로 실패해도 화면은 그대로 쓸 수 있어야 한다
    }
  }, [slot]);

  if (!isAdsenseEnabled || !slot) return null;

  return (
    <div className={className}>
      <p className="text-center mb-1" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
        {label}
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 100 }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
