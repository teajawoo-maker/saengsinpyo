'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { subscribe, getRawSnapshot, getServerSnapshot, type SavedBirthday } from '@/lib/storage';
import { AD_SLOTS } from '@/lib/adsense';
import AdSlot from '@/components/AdSlot';

/*
  계산기는 첫 화면의 본문이자 LCP 요소다. ssr:false로 두면 서버가 보내는
  HTML에 아예 들어가지 않아, 화면이 늦게 그려지고 나중에 끼어들면서
  아래 내용을 밀어낸다. 실제로 LCP 5.3초, CLS 0.58이 나왔다.
  브라우저 API를 처음 그릴 때 쓰지 않으므로 서버에서 함께 그린다.

  저장 목록과 백업도 서버에서 그린다. 저장소를 useSyncExternalStore로
  읽으면서 서버용 스냅샷(빈 목록)이 생겨 안전해졌다.
*/
import LunarCalculator from '@/components/LunarCalculator';
import SavedBirthdays from '@/components/SavedBirthdays';
import BackupSection from '@/components/BackupSection';

/*
  절기 섹션만 클라이언트 전용으로 남긴다. 오늘 날짜에 따라 내용이 달라져
  미리 그려두면 시간이 지났을 때 어긋난다. 대신 자리를 미리 잡아
  나중에 나타나도 화면이 밀리지 않게 한다.
*/
const SeasonalSection = dynamic(() => import('@/components/SeasonalSection'), { ssr: false });

export default function HomeContent() {
  const [loadedItem, setLoadedItem] = useState<SavedBirthday | null>(null);

  // 저장 개수는 저장소를 직접 구독해서 안다. 목록 컴포넌트가
  // 부모에게 알려줄 필요가 없다.
  const raw = useSyncExternalStore(subscribe, getRawSnapshot, getServerSnapshot);
  const savedCount = useMemo(() => {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  }, [raw]);

  const handleLoad = (item: SavedBirthday) => {
    setLoadedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        initialItem={loadedItem}
      />

      {/* 저장된 생신 목록 */}
      <SavedBirthdays onLoad={handleLoad} />

      {/* 절기 섹션 — 나타날 자리를 미리 잡아 화면이 밀리지 않게 한다 */}
      <div className="w-full max-w-md mx-auto px-4" style={{ minHeight: 268 }}>
        <SeasonalSection />
      </div>

      {/* 백업 — 저장한 생신이 있을 때만 안내한다 */}
      {savedCount > 0 && <BackupSection count={savedCount} />}

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

      {/*
        광고는 여기 한 곳뿐이다. 계산을 마치고 안내까지 읽은 뒤라
        도구를 쓰는 흐름을 끊지 않는다. 첫 화면에는 두지 않는다.
      */}
      <div className="max-w-md mx-auto px-4 pb-6">
        <AdSlot slot={AD_SLOTS.homeBottom} />
      </div>

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
