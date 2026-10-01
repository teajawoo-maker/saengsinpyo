'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/', emoji: '🎂', label: '계산기' },
  { href: '/guide', emoji: '📖', label: '가이드' },
  { href: '/about', emoji: 'ℹ️', label: '계산기준' },
];

/**
 * 화면 아래 고정 네비게이션.
 * 가이드나 계산기준으로 들어가면 돌아올 길이 본문 링크뿐이라
 * 모든 페이지에 같은 네비를 둔다.
 */
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="주요 메뉴"
      className="fixed bottom-0 left-0 right-0 z-40 px-2 py-2"
      style={{
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-light)',
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}>
      {/*
        띠는 화면 끝까지 늘리되 메뉴는 본문과 같은 폭 안에 모은다.
        PC처럼 넓은 화면에서 세 개가 양끝으로 흩어지면 한 묶음으로 안 보인다.
      */}
      <div className="max-w-md mx-auto flex justify-around items-center">
      {ITEMS.map(item => {
        // 하위 문서(/guide/yundal-saengil)에서도 가이드 탭이 켜져야 한다
        const active = item.href === '/'
          ? pathname === '/'
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link key={item.href} href={item.href}
            aria-current={active ? 'page' : undefined}
            className="flex flex-col items-center gap-0.5 py-1 px-5 rounded-xl text-center transition-all"
            style={{
              // 켜진 탭은 연한 강조 배경 위에 놓인다. 기본 강조색은 그 위에서
              // 4.2:1이라 기준에 못 미쳐, 한 단계 진한 색을 쓴다.
              color: active ? 'var(--accent-strong)' : 'var(--text-muted)',
              background: active ? 'var(--accent-light)' : 'transparent',
            }}>
            <span className="text-xl" aria-hidden="true">{item.emoji}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
      </div>
    </nav>
  );
}
