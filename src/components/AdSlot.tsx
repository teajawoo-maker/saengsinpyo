'use client';

/**
 * 광고 자리.
 *
 * 애드센스는 아직 연동하지 않는다. 승인 코드를 받으면
 * NEXT_PUBLIC_ADSENSE_CLIENT를 채우고 아래 주석대로 스크립트를 붙이면 된다.
 *
 * 클라이언트 ID가 없으면 아무것도 그리지 않는다. 빈 점선 상자를 남기면
 * 깨진 요소처럼 보이고 레이아웃만 밀어낸다.
 */

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

interface Props {
  /** 애드센스 광고 단위 ID (승인 후 발급) */
  slot?: string;
  className?: string;
}

export default function AdSlot({ slot, className }: Props) {
  if (!ADSENSE_CLIENT || !slot) return null;

  // 연동할 때 할 일:
  // 1. layout.tsx <head>에 애드센스 스크립트 한 줄 추가
  //    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=..." crossOrigin="anonymous" />
  // 2. 아래 ins 태그가 렌더된 뒤 (window.adsbygoogle = window.adsbygoogle || []).push({})
  return (
    <div className={className} aria-label="광고">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
