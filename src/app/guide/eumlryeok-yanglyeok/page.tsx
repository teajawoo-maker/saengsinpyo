import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { AD_SLOTS } from '@/lib/adsense';

export const metadata: Metadata = {
  title: '음력과 양력의 차이 | 우리집 생신표',
  description: '음력 생일이 왜 해마다 양력 날짜가 달라지는지, 11일씩 당겨지는 이유와 윤달이 생기는 원리를 쉽게 설명합니다.',
  keywords: ['음력 양력 차이', '음력이란', '양력이란', '음력 생일 왜 다른가', '태음태양력', '음력 원리', '윤달 이유'],
  alternates: { canonical: '/guide/eumlryeok-yanglyeok' },
};

export default function EumlryeokYanglyeokPage() {
  return (
    <main className="pb-24" style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <article className="max-w-md mx-auto px-4 py-10">
        <Link href="/guide" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          ← 가이드 목록
        </Link>

        <header className="mb-8">
          <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>음력 생일 가이드</p>
          <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            음력 생일은 왜 해마다 날짜가 달라지나요?
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            어머니 생신이 작년엔 3월이었는데 올해는 2월이라고요? 이상한 게 아닙니다.
            음력과 양력이 무엇을 기준으로 삼는지 알면 바로 이해됩니다.
          </p>
        </header>

        <div className="space-y-6">
          <Section title="한 줄 요약">
            <p>
              <strong>양력은 해를 기준으로, 음력은 달을 기준으로</strong> 만든 달력입니다.
              둘의 길이가 한 해에 약 11일 차이 나서, 음력 날짜를 양력으로 옮기면
              해마다 11일쯤 앞당겨집니다.
            </p>
          </Section>

          <Section title="양력 — 지구가 해를 한 바퀴 도는 시간">
            <p>
              지구가 태양을 한 바퀴 도는 데 <strong>약 365.2422일</strong>이 걸립니다.
              양력은 이걸 365일로 잡고, 남는 0.2422일을 모아 4년마다 2월에 하루를 더합니다.
              그게 윤년의 2월 29일이에요.
            </p>
            <p className="mt-2">
              해를 기준으로 하니 계절이 달력과 어긋나지 않습니다. 양력 8월은 언제나 여름이죠.
            </p>
          </Section>

          <Section title="음력 — 달이 차고 기우는 시간">
            <p>
              달이 초승달에서 다시 초승달이 되기까지 <strong>약 29.53일</strong>이 걸립니다.
              음력은 이걸 기준으로 한 달을 29일 또는 30일로 정합니다. 그래서 음력 15일은
              언제나 보름달이에요.
            </p>
            <p className="mt-2">
              12달을 모으면 29.53 × 12 = <strong>약 354일</strong>. 양력 365일보다
              <strong> 11일쯤 짧습니다.</strong>
            </p>
          </Section>

          <Section title="그래서 11일씩 당겨집니다">
            <p>
              음력 한 해가 11일 짧으니, 같은 음력 날짜를 양력으로 보면 해마다 11일쯤 앞으로 옵니다.
            </p>
            <div className="mt-3 rounded-xl p-4" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                음력 8월 15일(추석)이 어떤 해에는 양력 9월 말, 다음 해에는 9월 중순인 이유가 이것입니다.
              </p>
            </div>
          </Section>

          <Section title="윤달 — 계절과 어긋나지 않게 하는 장치">
            <p>
              해마다 11일씩 밀리면 곤란합니다. 그냥 두면 3년 뒤엔 한 달, 16년 뒤엔 반년이 어긋나
              추석이 봄에 오게 됩니다.
            </p>
            <p className="mt-2">
              그래서 <strong>2~3년에 한 번 한 달을 통째로 끼워 넣습니다.</strong> 이 달이 윤달이에요.
              윤4월이 있는 해에는 음력 4월이 두 번 지나갑니다.
            </p>
            <p className="mt-2">
              달도 따르고 계절도 맞추는 이런 방식을 <strong>태음태양력</strong>이라고 합니다.
              우리가 흔히 &lsquo;음력&rsquo;이라 부르는 게 정확히는 이것입니다.
            </p>
            <p className="mt-2">
              윤달에 태어난 경우 생신을 어떻게 챙기는지는
              <Link href="/guide/yundal-saengil" style={{ color: 'var(--accent)', fontWeight: 600 }}> 윤달 생일 계산법</Link>에서 다룹니다.
            </p>
          </Section>

          <Section title="어느 쪽이 내 &lsquo;진짜&rsquo; 생일인가요?">
            <p>
              둘 다 같은 날입니다. 태어난 순간은 하나이고, 그날을 부르는 이름이 두 가지일 뿐이에요.
            </p>
            <p className="mt-2">
              주민등록에는 대개 양력으로 올라가 있고, 집에서는 음력으로 챙기는 경우가 많습니다.
              그래서 &lsquo;내 생일이 언제였더라&rsquo; 하는 혼란이 생깁니다.
            </p>
            <p className="mt-2">
              계산기에 <strong>양력 생년월일을 넣으면 음력 생일을</strong>, 반대로 음력을 넣으면
              올해 양력 날짜를 알려드립니다.
            </p>
          </Section>

          <Section title="음력 날짜는 누가 정하나요?">
            <p>
              한국의 음력은 <strong>한국천문연구원(KASI)</strong>이 천문 계산으로 확정해 공표합니다.
              달의 위치와 태양의 위치를 계산해 초하루와 윤달을 정합니다.
            </p>
            <p className="mt-2">
              이 사이트도 같은 기준의 데이터를 씁니다. 자세한 내용은
              <Link href="/about" style={{ color: 'var(--accent)', fontWeight: 600 }}> 계산 기준</Link>에서 확인하세요.
            </p>
          </Section>
        </div>

        {/* 글을 다 읽은 자리. 본문 중간을 끊지 않는다 */}
        <AdSlot slot={AD_SLOTS.articleEnd} className="mt-8" />

        <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            올해 음력 생신이 양력으로 언제인지 확인해 보세요
          </p>
          <Link href="/" className="inline-block py-3 px-6 rounded-xl text-sm font-bold"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            🎂 계산기로 이동
          </Link>
        </div>
      </article>
    </main>
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
