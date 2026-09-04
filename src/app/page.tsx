'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { SavedBirthday } from '@/lib/storage';

const LunarCalculator = dynamic(() => import('@/components/LunarCalculator'), { ssr: false });
const SavedBirthdays = dynamic(() => import('@/components/SavedBirthdays'), { ssr: false });
const SeasonalSection = dynamic(() => import('@/components/SeasonalSection'), { ssr: false });

export default function HomePage() {
  const [savedKey, setSavedKey] = useState(0);
  const [loadedItem, setLoadedItem] = useState<SavedBirthday | null>(null);

  const handleSaved = () => setSavedKey(k => k + 1);
  const handleLoad = (item: SavedBirthday) => {
    setLoadedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-dvh pb-20" style={{ background: 'var(--bg)' }}>
      {/* 헤더 */}
      <header className="pt-10 pb-6 px-4 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-3xl" role="img" aria-label="생신">🎂</span>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            우리집 생신표
          </h1>
        </div>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          음력 생일을 양력으로 바꿔드려요
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          회원가입 없이 · 무료로 · 바로 확인
        </p>
      </header>

      {/* 계산기 */}
      <LunarCalculator
        onSaved={handleSaved}
        initialItem={loadedItem}
      />

      {/* 저장된 생신 목록 */}
      <SavedBirthdays
        onLoad={handleLoad}
        refreshKey={savedKey}
      />

      {/* 절기 섹션 */}
      <SeasonalSection />

      {/* 안내 섹션 */}
      <section className="max-w-md mx-auto px-4 pb-6">
        <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>계산 기준 안내</h3>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <li className="flex gap-2">
              <span className="shrink-0">•</span>
              <span>한국천문연구원(KASI) 공식 음양력 데이터를 기준으로 계산합니다.</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">•</span>
              <span>윤달과 음력 30일 처리는 가족마다 관습이 다를 수 있어요. 위 옵션으로 직접 선택하세요.</span>
            </li>
            <li className="flex gap-2">
              <span className="shrink-0">•</span>
              <span>입력한 정보는 이 기기에만 저장되며 서버로 전송되지 않습니다.</span>
            </li>
          </ul>
          <Link href="/about" className="inline-block mt-3 text-xs font-medium"
            style={{ color: 'var(--accent)' }}>
            상세 계산 기준 보기 →
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="text-center pb-4 px-4">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          © 2026 우리집 생신표 · <a href="mailto:teajawoo@gmail.com" style={{ color: 'var(--text-muted)' }}>teajawoo@gmail.com</a>
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          입력한 정보는 이 기기에만 저장되며 운영자 서버로 전송되지 않습니다.
        </p>
      </footer>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center px-2 py-2 safe-area-bottom"
        style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)', backdropFilter: 'blur(10px)' }}>
        <NavItem href="/" emoji="🎂" label="계산기" active />
        <NavItem href="/guide" emoji="📖" label="가이드" />
        <NavItem href="/about" emoji="ℹ️" label="계산기준" />
      </nav>
    </main>
  );
}

function NavItem({ href, emoji, label, active }: { href: string; emoji: string; label: string; active?: boolean }) {
  return (
    <Link href={href}
      className="flex flex-col items-center gap-0.5 py-1 px-5 rounded-xl text-center transition-all"
      style={{
        color: active ? 'var(--accent)' : 'var(--text-muted)',
        background: active ? 'var(--accent-light)' : 'transparent',
      }}>
      <span className="text-xl">{emoji}</span>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
