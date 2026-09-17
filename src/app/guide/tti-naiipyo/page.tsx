import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/pageMeta';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import GuideJsonLd from '@/components/GuideJsonLd';
import { AD_SLOTS } from '@/lib/adsense';
import { getGanji } from '@/lib/ganji';
import { koreanAge, getMilestone } from '@/lib/age';

export const metadata: Metadata = pageMetadata({
  title: '띠별 나이표 | 우리집 생신표',
  description: '올해 기준 띠별 나이를 한눈에. 쥐띠부터 돼지띠까지 태어난 해와 만 나이·세는나이를 정리했습니다. 설날 전에 태어나면 띠가 달라지는 점도 함께 안내합니다.',
  keywords: ['띠별 나이', '띠 나이표', '올해 나이', '만 나이 계산', '세는나이', '무슨 띠', '몇 살', '띠 계산'],
  path: '/guide/tti-naiipyo',
  image: 'guide-tti-naiipyo.png',
  imageAlt: '띠별 나이표',
});

/**
 * 하루에 한 번 페이지를 다시 만든다.
 * 표 전체가 올해를 기준으로 하므로 해가 바뀌면 나이가 모두 한 살씩 올라야 한다.
 */
export const revalidate = 86400;

/** 표에 실을 가장 오래된 해. 이보다 위는 자료가 드물고 쓰임도 적다. */
const OLDEST_BIRTH_YEAR = 1930;

export default function TtiNaiipyoPage() {
  const THIS_YEAR = new Date().getFullYear();

  // 올해부터 12해를 훑으면 열두 띠가 한 번씩 나온다.
  // 각 띠마다 12년씩 거슬러 올라가며 같은 띠인 해를 모은다.
  const byZodiac = Array.from({ length: 12 }, (_, i) => {
    const newest = THIS_YEAR - i;
    const ganji = getGanji(newest);
    const years: number[] = [];
    for (let y = newest; y >= OLDEST_BIRTH_YEAR; y -= 12) years.push(y);
    return { ganji, years };
  });

  return (
    <>
      <GuideJsonLd slug="tti-naiipyo" />
      <main className="pb-24" style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
        <article className="max-w-md mx-auto px-4 py-10">
          <Link href="/guide" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            ← 가이드 목록
          </Link>

          <header className="mb-8">
            <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>음력 생일 가이드</p>
            <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
              {THIS_YEAR}년 띠별 나이표
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              띠만 알면 몇 살인지 바로 찾을 수 있어요. 괄호 안은 <strong>만 나이</strong>,
              그 뒤는 세는나이입니다.
            </p>
          </header>

          <div
            className="rounded-2xl p-4 mb-6"
            style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              <strong>양력 1~2월생은 한 줄 위를 보세요.</strong> 띠는 양력 1월 1일이 아니라
              음력 설날에 바뀝니다. 설날 전에 태어났다면 앞 해의 띠입니다.
            </p>
            <Link
              href="/guide/tti-ganji"
              className="inline-block text-sm mt-2"
              style={{ color: 'var(--accent)', fontWeight: 600 }}
            >
              왜 그런가요? →
            </Link>
          </div>

          <div className="space-y-3">
            {byZodiac.map(({ ganji, years }) => (
              <section
                key={ganji.zodiac}
                className="rounded-2xl p-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}
              >
                <h2 className="text-base font-bold mb-3 flex items-baseline gap-2" style={{ color: 'var(--text-primary)' }}>
                  <span aria-hidden="true">{ganji.zodiacEmoji}</span>
                  <span>{ganji.zodiacLabel}</span>
                  <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                    {ganji.yearName}
                  </span>
                </h2>
                <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {years.map(year => {
                    const age = THIS_YEAR - year;
                    const milestone = getMilestone(age);
                    return (
                      <li key={year} className="text-sm flex items-baseline gap-1.5">
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{year}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          ({age}) {koreanAge(year, THIS_YEAR)}세
                        </span>
                        {milestone && (
                          <span
                            className="text-xs px-1.5 rounded"
                            style={{ background: 'var(--accent-light)', color: 'var(--accent-strong)', fontWeight: 600 }}
                          >
                            {milestone.name}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          <section
            className="rounded-2xl p-5 mt-6"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}
          >
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
              만 나이와 세는나이는 뭐가 다른가요?
            </h2>
            <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p>
                <strong>만 나이</strong>는 태어난 날을 0살로 시작해 생일마다 한 살을 더합니다.
                2023년부터 법에서 쓰는 공식 나이입니다.
              </p>
              <p>
                <strong>세는나이</strong>는 태어난 해를 1살로 치고, 해가 바뀌면 다 같이 한 살을 더합니다.
                그래서 12월생은 태어난 지 한 달 만에 두 살이 됩니다.
              </p>
              <p>
                이 표의 만 나이는 <strong>올해 생일이 이미 지났을 때</strong>의 값입니다.
                생일 전이라면 한 살 적습니다.
              </p>
            </div>
          </section>

          {/* 글을 다 읽은 자리. 본문 중간을 끊지 않는다 */}
          <AdSlot slot={AD_SLOTS.articleEnd} className="mt-8" />

          <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              생년월일을 넣으면 띠와 정확한 만 나이를 함께 알려드려요
            </p>
            <Link href="/" className="inline-block py-3 px-6 rounded-xl text-sm font-bold"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              🎂 계산기로 이동
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
