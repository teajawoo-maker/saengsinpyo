import type { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES, guidePath } from '@/lib/guides';

export const metadata: Metadata = {
  title: '음력 생일 가이드 | 우리집 생신표',
  description: '윤달 생일 계산법, 음력 30일 없는 해 처리, 부모님 음력 생신 양력 변환 방법을 알아보세요.',
  alternates: { canonical: '/guide' },
};


export default function GuidePage() {
  return (
    <main className="pb-24" style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <div className="max-w-md mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-1 text-sm mb-8"
          style={{ color: 'var(--text-muted)' }}>
          ← 계산기로 돌아가기
        </Link>

        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
          음력 생일 가이드
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          윤달, 30일 처리, 부모님 생신 계산까지 — 헷갈리는 음력 생일 궁금증을 해결해 드려요.
        </p>

        <div className="space-y-4">
          {GUIDES.map(g => (
            <Link key={g.slug} href={guidePath(g)}
              className="block rounded-2xl p-5 transition-all"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow)' }}>
              <div className="flex gap-4 items-start">
                <span className="text-3xl shrink-0">{g.emoji}</span>
                <div>
                  <h2 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{g.title}</h2>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{g.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {g.tags.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--accent-light)', color: 'var(--accent-strong)' }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
