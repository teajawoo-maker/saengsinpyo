import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '음력 생일 가이드 | 우리집 생신표',
  description: '윤달 생일 계산법, 음력 30일 없는 해 처리, 부모님 음력 생신 양력 변환 방법을 알아보세요.',
};

const guides = [
  {
    href: '/guide/yundal-saengil',
    emoji: '🌙',
    title: '윤달 생일, 어떻게 계산하나요?',
    desc: '윤달이 없는 해에 생신을 언제 챙겨야 할지 헷갈리는 분들을 위한 완벽 가이드',
    tags: ['윤달', '음력 생일', '생신'],
  },
  {
    href: '/guide/eumlryeok-30il',
    emoji: '📅',
    title: '음력 30일이 없는 해에는?',
    desc: '음력 달마다 날수가 다른 이유와, 30일 생일을 어떻게 처리하는지 알아봅니다',
    tags: ['음력 30일', '소월', '대월'],
  },
  {
    href: '/guide/bumonim-saengsin',
    emoji: '🎂',
    title: '부모님·조부모님 음력 생신 양력 변환',
    desc: '매년 달라지는 부모님 음력 생신을 올해 양력 날짜로 정확하게 확인하는 방법',
    tags: ['부모님 생신', '양력 변환', '음력 달력'],
  },
];

export default function GuidePage() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
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
          {guides.map(g => (
            <Link key={g.href} href={g.href}
              className="block rounded-2xl p-5 transition-all"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow)' }}>
              <div className="flex gap-4 items-start">
                <span className="text-3xl shrink-0">{g.emoji}</span>
                <div>
                  <h2 className="text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{g.title}</h2>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{g.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {g.tags.map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
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
