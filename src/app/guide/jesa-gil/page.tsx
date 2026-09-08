import type { Metadata } from 'next';
import Link from 'next/link';
import GuideJsonLd from '@/components/GuideJsonLd';
import AdSlot from '@/components/AdSlot';
import { AD_SLOTS } from '@/lib/adsense';

export const metadata: Metadata = {
  title: '제사·기일 날짜 계산하는 법 | 우리집 생신표',
  description: '음력 기일을 올해 양력 날짜로 찾는 방법. 제사는 돌아가신 전날 지내는지, 윤달에 돌아가신 경우는 어떻게 하는지 정리했습니다.',
  keywords: ['제사 날짜 계산', '기일 계산', '음력 기일 양력', '제사 전날', '기제사 날짜', '윤달 제사', '음력 제사'],
  alternates: { canonical: '/guide/jesa-gil' },
};

export default function JesaPage() {
  return (
    <>
      <GuideJsonLd slug="jesa-gil" />
    <main className="pb-24" style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <article className="max-w-md mx-auto px-4 py-10">
        <Link href="/guide" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          ← 가이드 목록
        </Link>

        <header className="mb-8">
          <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>음력 생일 가이드</p>
          <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            제사 날짜, 올해는 언제인가요?
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            기일은 대개 음력으로 기억하기 때문에 양력 날짜가 해마다 달라집니다.
            올해 날짜를 찾는 방법과, 집집마다 다른 관습을 정리했어요.
          </p>
        </header>

        <div className="space-y-6">
          <Section title="기일은 돌아가신 날의 음력 날짜입니다">
            <p>
              예를 들어 아버지께서 양력 2010년 3월 15일에 돌아가셨다면, 그날의 음력 날짜는
              음력 1월 30일입니다. 이후 제사는 해마다 <strong>음력 1월 30일</strong>에 맞춰 지냅니다.
            </p>
            <p className="mt-2">
              그래서 양력으로는 매년 날짜가 달라져요. 음력이 양력보다 한 해에 11일쯤 짧기 때문입니다.
            </p>
            <div className="mt-3 rounded-xl p-4" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                이 계산은 생신을 찾는 것과 똑같습니다. 돌아가신 양력 날짜를 넣어
                음력 날짜를 알아낸 뒤, 그 음력 날짜의 올해 양력 날짜를 보면 됩니다.
              </p>
            </div>
          </Section>

          <Section title="제사는 전날 저녁에 지내나요?">
            <p>
              전통적으로 제사는 기일 <strong>자시(子時, 밤 11시~새벽 1시)</strong>에 지냈습니다.
              옛 시간 기준으로는 자시부터 새 날이 시작되므로, 오늘날 달력으로 보면
              &lsquo;돌아가신 날 전날 밤&rsquo;에 모이는 모습이 됩니다.
            </p>
            <p className="mt-2">
              요즘은 기일 당일 저녁에 지내는 집이 더 많습니다. 어느 쪽이든 <strong>기준이 되는
              날짜는 기일 그 자체</strong>이고, 모이는 시각만 다릅니다.
            </p>
            <p className="mt-2">
              날짜를 헷갈리지 않으려면 &lsquo;기일이 며칠인지&rsquo;를 먼저 정하고,
              모이는 시각은 가족끼리 정하시면 됩니다.
            </p>
          </Section>

          <Section title="윤달에 돌아가신 경우">
            <p>
              윤달은 해마다 있는 것이 아니라서, 윤달에 돌아가신 경우 그 윤달이 없는 해가 생깁니다.
              이때는 두 가지로 나뉩니다.
            </p>
            <div className="mt-3 space-y-3">
              <div className="rounded-xl p-4" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>① 평달 같은 날짜로 (가장 일반적)</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  윤4월 10일이 기일이라면, 윤4월이 없는 해에는 평달 4월 10일에 지냅니다.
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>② 윤달이 돌아오는 해에만</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  엄격히 지키는 집안에서는 윤달이 있는 해에만 지내기도 합니다.
                </p>
              </div>
            </div>
            <p className="mt-3">
              <Link href="/guide/yundal-saengil" style={{ color: 'var(--accent)', fontWeight: 600 }}>윤달 생일 계산법</Link>과
              같은 문제라, 계산기에서 윤달 옵션을 선택하면 원하는 방식으로 계산됩니다.
            </p>
          </Section>

          <Section title="음력 30일이 기일이라면">
            <p>
              음력 달은 29일까지인 달(소월)과 30일까지인 달(대월)이 있습니다. 음력 30일이 기일인데
              그 해 그 달이 29일까지라면 날짜가 없어집니다.
            </p>
            <p className="mt-2">
              보통 <strong>그 달의 마지막 날인 29일</strong>에 지냅니다. 자세한 내용은
              <Link href="/guide/eumlryeok-30il" style={{ color: 'var(--accent)', fontWeight: 600 }}> 음력 30일이 없는 해</Link> 편을 참고하세요.
            </p>
          </Section>

          <Section title="한식과 성묘">
            <p>
              한식(寒食)은 동지로부터 105일째 되는 날로, 양력 4월 5~6일 무렵입니다.
              예부터 이날 산소를 돌보고 성묘하는 풍습이 있었습니다.
            </p>
            <p className="mt-2">
              동지는 태양의 위치로 정해져 해마다 12월 21일이나 22일로 달라지므로, 한식 날짜도
              해마다 조금씩 움직입니다. 계산기 첫 화면의 <strong>다가오는 명절·절기</strong>에서
              올해 날짜를 확인할 수 있어요.
            </p>
          </Section>

          <Section title="정리">
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="shrink-0">•</span><span>기일은 돌아가신 날의 <strong>음력</strong> 날짜입니다.</span></li>
              <li className="flex gap-2"><span className="shrink-0">•</span><span>양력 날짜는 해마다 11일쯤 당겨집니다.</span></li>
              <li className="flex gap-2"><span className="shrink-0">•</span><span>모이는 시각(전날 밤 / 당일 저녁)은 집안마다 다릅니다.</span></li>
              <li className="flex gap-2"><span className="shrink-0">•</span><span>윤달·30일 처리도 집안 관습을 따르면 됩니다.</span></li>
            </ul>
          </Section>
        </div>

        {/* 글을 다 읽은 자리. 본문 중간을 끊지 않는다 */}
        <AdSlot slot={AD_SLOTS.articleEnd} className="mt-8" />

        <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            돌아가신 양력 날짜를 넣으면 올해 기일을 찾아드려요
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
