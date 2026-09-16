import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import JaeCalculator from '@/components/JaeCalculator';
import JsonLd from '@/components/JsonLd';
import { AD_SLOTS } from '@/lib/adsense';
import { toolJsonLd, breadcrumbJsonLd } from '@/lib/jsonLd';

export const metadata: Metadata = {
  title: '49재·삼우제 계산기 | 우리집 생신표',
  description: '돌아가신 날을 넣으면 초재부터 49재까지, 그리고 삼우제 날짜를 계산해 드려요. 49재는 돌아가신 날을 1일로 세어 48일 뒤입니다.',
  keywords: ['49재 계산', '사십구재 계산기', '삼우제 날짜', '49재 날짜', '초재 이재', '재 지내는 날'],
  alternates: { canonical: '/sasipgujae' },
};

export default function SasipgujaePage() {
  return (
    <>
      <JsonLd
        data={[
          toolJsonLd({
            name: '49재·삼우제 계산기',
            description: '돌아가신 날로 초재부터 49재까지와 삼우제 날짜를 계산합니다.',
            path: '/sasipgujae',
          }),
          breadcrumbJsonLd([
            { name: '우리집 생신표', path: '/' },
            { name: '49재·삼우제 계산기', path: '/sasipgujae' },
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
              49재·삼우제 계산기
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              돌아가신 날을 넣으면 초재부터 49재까지, 그리고 삼우제가 언제인지 알려드려요.
            </p>
          </header>

          <JaeCalculator />

          <div className="space-y-6 mt-8">
            <Section title="49재는 돌아가신 날 + 49일이 아닙니다">
              <p>
                49재는 <strong>돌아가신 날을 1일로 세어 49일째</strong>입니다. 달력으로는
                돌아가신 날에서 <strong>48일</strong>을 더한 날이에요.
              </p>
              <p className="mt-2">
                이레마다 재를 지내 일곱 번째가 49재입니다. 초재는 7일째,
                이재는 14일째… 이런 식이라 모두 같은 요일에 돌아옵니다.
              </p>
            </Section>

            <Section title="삼우제는 기준이 다릅니다">
              <p>
                삼우제만은 돌아가신 날이 아니라 <strong>장례를 치른 날</strong>이 기준입니다.
                장사를 지낸 날이 초우, 다음날이 재우, 그 다음날이 삼우예요.
              </p>
              <p className="mt-2">
                요즘 흔한 3일장이면 돌아가신 날이 첫날, 사흘째가 발인입니다.
                그래서 삼우제는 돌아가신 날로부터 닷새째가 됩니다. 장례를 다른 날수로
                치렀다면 위에서 직접 골라 주세요.
              </p>
            </Section>

            <Section title="49재가 지나면">
              <p>
                이후로는 해마다 <strong>기일</strong>에 제사를 지냅니다. 기일은 돌아가신 날의
                <strong> 음력</strong> 날짜라서, 양력으로는 해마다 날짜가 달라집니다.
              </p>
              <p className="mt-2">
                올해 기일이 양력으로 언제인지, 제사를 전날 저녁에 지내는 관습은 무엇인지는
                <Link href="/guide/jesa-gil" style={{ color: 'var(--accent)', fontWeight: 600 }}> 제사 날짜 계산</Link>에서
                자세히 다룹니다.
              </p>
            </Section>

            <Section title="집안마다 다를 수 있습니다">
              <p>
                재를 지내는 방식과 절차는 종교와 집안, 절에 따라 다릅니다. 여기서는
                <strong> 날짜를 세는 기준</strong>만 알려드립니다. 실제로 어떻게 모실지는
                모시는 절이나 집안 어른께 여쭤보세요.
              </p>
            </Section>
          </div>

          {/* 글을 다 읽은 자리. 본문 중간을 끊지 않는다 */}
          <AdSlot slot={AD_SLOTS.articleEnd} className="mt-8" />

          <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              해마다 돌아오는 기일도 미리 확인해 두세요
            </p>
            <Link href="/" className="inline-block py-3 px-6 rounded-xl text-sm font-bold"
              style={{ background: 'var(--accent)', color: '#fff' }}>
              🎂 음력 날짜 계산기
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
