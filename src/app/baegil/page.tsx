import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import BaegilCalculator from '@/components/BaegilCalculator';
import JsonLd from '@/components/JsonLd';
import { AD_SLOTS } from '@/lib/adsense';
import { toolJsonLd, breadcrumbJsonLd } from '@/lib/jsonLd';

export const metadata: Metadata = {
  title: '백일·돌 계산기 | 우리집 생신표',
  description: '아기 태어난 날을 넣으면 50일, 백일, 200일, 첫돌 날짜를 정확히 계산해 드려요. 백일은 태어난 날을 1일로 세어 99일 뒤입니다.',
  keywords: ['백일 계산', '백일 계산기', '아기 백일', '돌 계산', '첫돌 날짜', '200일 계산', '50일 계산'],
  alternates: { canonical: '/baegil' },
};

export default function BaegilPage() {
  return (
    <>
      <JsonLd
        data={[
          toolJsonLd({
            name: '백일·돌 계산기',
            description: '아기 태어난 날로 50일·백일·200일·첫돌 날짜를 계산합니다.',
            path: '/baegil',
          }),
          breadcrumbJsonLd([
            { name: '우리집 생신표', path: '/' },
            { name: '백일·돌 계산기', path: '/baegil' },
          ]),
        ]}
      />
      <main className="pb-24" style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
        <div className="max-w-md mx-auto px-4 py-10">
          <Link href="/" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            ← 생신 계산기
          </Link>

          <header className="mb-6">
            <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>날짜 계산기</p>
            <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
              백일·돌 계산기
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              아기가 태어난 날을 넣으면 50일, 백일, 200일, 첫돌이 언제인지 알려드려요.
            </p>
          </header>

          <BaegilCalculator />

          <div className="space-y-6 mt-8">
            <Section title="백일은 태어난 날 + 100일이 아닙니다">
              <p>
                백일은 <strong>태어난 날을 1일로 세어 100일째</strong>입니다. 그래서 달력으로는
                태어난 날에서 <strong>99일</strong>을 더한 날이에요.
              </p>
              <p className="mt-2">
                100일을 더하면 하루가 밀립니다. 인터넷에 하루 어긋난 계산이 많이 돌아다니는 이유가
                이것입니다. 50일과 200일도 마찬가지로 각각 49일, 199일을 더합니다.
              </p>
            </Section>

            <Section title="돌은 날이 아니라 해를 셉니다">
              <p>
                첫돌은 365일째가 아니라 <strong>태어난 날로부터 만 1년</strong>입니다.
                그래서 태어난 달·일이 그대로 돌아오는 날이에요.
              </p>
              <p className="mt-2">
                윤년 2월 29일에 태어났다면 평년에는 그날이 없습니다. 이런 경우 보통
                3월 1일로 칩니다.
              </p>
            </Section>

            <Section title="백일·돌잔치는 꼭 그날 해야 하나요?">
              <p>
                아닙니다. 요즘은 가족이 모이기 좋은 <strong>가까운 주말</strong>에 하는 집이 훨씬 많습니다.
                백일은 예로부터 아기가 무사히 백 일을 넘긴 것을 축하하는 자리라서,
                날짜 자체보다 그 시기를 지났다는 데 뜻이 있습니다.
              </p>
            </Section>

            <Section title="아기 생일도 음력으로 챙기나요?">
              <p>
                집안에 따라 다릅니다. 어른들 생신을 음력으로 챙기는 집에서는 아기도 음력으로
                잡는 경우가 있어요. 위 결과에 음력 날짜도 함께 표시해 뒀습니다.
              </p>
              <p className="mt-2">
                음력으로 정하면 해마다 양력 날짜가 달라집니다. 이유는
                <Link href="/guide/eumlryeok-yanglyeok" style={{ color: 'var(--accent)', fontWeight: 600 }}> 음력과 양력의 차이</Link>에서
                설명합니다.
              </p>
            </Section>
          </div>

          {/* 글을 다 읽은 자리. 본문 중간을 끊지 않는다 */}
          <AdSlot slot={AD_SLOTS.articleEnd} className="mt-8" />

          <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              온 가족 생신을 한곳에 모아 보세요
            </p>
            <Link href="/" className="inline-block py-3 px-6 rounded-xl text-sm font-bold"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              🎂 생신 계산기로 이동
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
      <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      <div className="text-sm leading-relaxed space-y-1" style={{ color: 'var(--text-secondary)' }}>
        {children}
      </div>
    </section>
  );
}
