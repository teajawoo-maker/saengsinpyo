'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { SavedBirthday } from '@/lib/storage';

const LunarCalculator = dynamic(() => import('@/components/LunarCalculator'), { ssr: false });
const SavedBirthdays = dynamic(() => import('@/components/SavedBirthdays'), { ssr: false });
const SeasonalSection = dynamic(() => import('@/components/SeasonalSection'), { ssr: false });
const BackupSection = dynamic(() => import('@/components/BackupSection'), { ssr: false });

export default function HomePage() {
  const [savedKey, setSavedKey] = useState(0);
  const [loadedItem, setLoadedItem] = useState<SavedBirthday | null>(null);
  const [savedCount, setSavedCount] = useState(0);

  const handleSaved = () => setSavedKey(k => k + 1);
  const handleLoad = (item: SavedBirthday) => {
    setLoadedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleCountChange = useCallback((n: number) => setSavedCount(n), []);

  return (
    <main className="min-h-dvh pb-20" style={{ background: 'var(--bg)' }}>
      {/* 헤더 */}
      <header className="relative pt-11 pb-8 px-4 text-center overflow-hidden">
        {/* 위쪽에 은은한 색을 깔아 밋밋함을 덜어낸다 */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-56 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, var(--bg-soft) 0%, rgba(255,242,228,0) 100%)' }} />

        <div className="relative">
          <div className="inline-flex items-center justify-center mb-4 rounded-full"
            style={{
              width: 104, height: 104,
              background: 'linear-gradient(145deg, #ffc46b 0%, var(--accent) 100%)',
              boxShadow: 'var(--shadow-accent)',
            }}>
            <span style={{ fontSize: '58px', lineHeight: 1 }} role="img" aria-label="생신">🎂</span>
          </div>

          <h1 className="text-[28px] font-black tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
            우리집 생신표
          </h1>
          <p className="text-base mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            음력 생일을 양력으로 바꿔드려요
          </p>

          <div className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
            회원가입 없이 · 무료로 · 바로 확인
          </div>
        </div>
      </header>

      {/* 계산기 — 저장된 생신을 누르면 key가 바뀌며 그 값으로 새로 마운트된다 */}
      <LunarCalculator
        key={loadedItem?.id ?? 'new'}
        onSaved={handleSaved}
        initialItem={loadedItem}
      />

      {/* 저장된 생신 목록 */}
      <SavedBirthdays
        onLoad={handleLoad}
        refreshKey={savedKey}
        onCountChange={handleCountChange}
      />

      {/* 절기 섹션 */}
      <SeasonalSection />

      {/* 백업 — 저장한 생신이 있을 때만 안내한다 */}
      {savedCount > 0 && (
        <BackupSection count={savedCount} onImported={handleSaved} />
      )}

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

    </main>
  );
}
