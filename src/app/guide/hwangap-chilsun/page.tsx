import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { AD_SLOTS } from '@/lib/adsense';

export const metadata: Metadata = {
  title: '환갑·칠순·팔순 나이 계산 | 우리집 생신표',
  description: '환갑은 몇 살일까요? 만 나이와 세는나이가 달라 헷갈리는 환갑·진갑·칠순·팔순·구순 나이를 정리했습니다. 잔치를 언제 해야 하는지도 알려드려요.',
  keywords: ['환갑 나이', '칠순 나이', '팔순 나이', '환갑 몇살', '칠순 잔치 나이', '진갑', '구순', '고희', '세는나이 만나이'],
  alternates: { canonical: '/guide/hwangap-chilsun' },
};

const MILESTONES = [
  { age: 60, name: '환갑(還甲)', also: '회갑', desc: '태어난 해의 간지가 한 바퀴 돌아 다시 온 해' },
  { age: 61, name: '진갑(進甲)', also: '', desc: '환갑 다음 해' },
  { age: 70, name: '칠순(七旬)', also: '고희(古稀)', desc: '예부터 드물다 하여 고희' },
  { age: 77, name: '희수(喜壽)', also: '', desc: '喜의 초서체가 七十七처럼 보여서' },
  { age: 80, name: '팔순(八旬)', also: '산수(傘壽)', desc: '傘의 약자가 八十이라' },
  { age: 88, name: '미수(米壽)', also: '', desc: '米를 풀면 八十八' },
  { age: 90, name: '구순(九旬)', also: '졸수(卒壽)', desc: '卒의 약자가 九十이라' },
  { age: 99, name: '백수(白壽)', also: '', desc: '百에서 一을 빼면 白' },
  { age: 100, name: '백세(百歲)', also: '상수(上壽)', desc: '백 번째 생신' },
];

export default function HwangapPage() {
  return (
    <main className="pb-24" style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <article className="max-w-md mx-auto px-4 py-10">
        <Link href="/guide" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          ← 가이드 목록
        </Link>

        <header className="mb-8">
          <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>음력 생일 가이드</p>
          <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            환갑은 몇 살인가요?
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            만 나이와 세는나이가 달라서 환갑·칠순 잔치를 언제 해야 할지 헷갈리는 경우가 많아요.
            기준을 한 번에 정리했습니다.
          </p>
        </header>

        <div className="space-y-6">
          <Section title="결론부터: 만 나이 기준입니다">
            <p>
              환갑은 <strong>만 60세</strong>, 칠순은 <strong>만 70세</strong>, 팔순은 <strong>만 80세</strong>가 되는
              생신입니다. 세는나이로는 각각 61세·71세·81세가 되는 해예요.
            </p>
            <p className="mt-2">
              어른들이 &ldquo;예순한 살에 환갑&rdquo;이라고 하시는 건 세는나이로 말씀하시는 것이고,
              가리키는 해는 같습니다.
            </p>
          </Section>

          <Section title="환갑이 만 60세인 이유">
            <p>
              환갑(還甲)은 <strong>갑(甲)으로 돌아온다</strong>는 뜻이에요. 간지는 천간 10개와 지지 12개를
              조합해 60년마다 한 바퀴를 돕니다. 그래서 태어난 해의 간지가 다시 돌아오는 때가
              태어나고 60년 뒤, 곧 만 60세입니다.
            </p>
            <p className="mt-2">
              예를 들어 1966년 병오년에 태어난 분은 2026년 병오년에 환갑을 맞습니다.
            </p>
          </Section>

          <Section title="나이별 기념 생신">
            <div className="overflow-x-auto -mx-1" tabIndex={0} role="region" aria-label="나이별 기념 생신 표">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                    <th className="text-left py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>만 나이</th>
                    <th className="text-left py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>이름</th>
                    <th className="text-left py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>유래</th>
                  </tr>
                </thead>
                <tbody>
                  {MILESTONES.map(m => (
                    <tr key={m.age} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td className="py-2 px-1 font-bold whitespace-nowrap" style={{ color: 'var(--accent)' }}>
                        {m.age}세
                      </td>
                      <td className="py-2 px-1" style={{ color: 'var(--text-primary)' }}>
                        {m.name}
                        {m.also && <span className="block text-xs" style={{ color: 'var(--text-muted)' }}>{m.also}</span>}
                      </td>
                      <td className="py-2 px-1 text-xs" style={{ color: 'var(--text-secondary)' }}>{m.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="잔치는 생신 당일에 해야 하나요?">
            <p>
              꼭 그렇지는 않아요. 가족이 모이기 좋은 <strong>주말로 앞당겨</strong> 치르는 경우가 가장 많습니다.
              다만 생신보다 <em>늦추지 않는</em> 것을 예로 여기는 집안이 많으니, 앞당기는 쪽이 무난합니다.
            </p>
            <p className="mt-2">
              음력 생신이면 해마다 양력 날짜가 달라지니, 올해 날짜를 먼저 확인하고 주말을 잡으세요.
            </p>
          </Section>

          <Section title="음력 생신이라 날짜가 헷갈린다면">
            <p>
              부모님 생신이 음력이면 양력 날짜가 해마다 11일 안팎으로 당겨집니다.
              생년월일만 넣으면 올해와 내년 양력 날짜, 그때의 만 나이, 환갑·칠순 여부까지 한 번에 확인할 수 있어요.
            </p>
          </Section>
        </div>

        {/* 글을 다 읽은 자리. 본문 중간을 끊지 않는다 */}
        <AdSlot slot={AD_SLOTS.articleEnd} className="mt-8" />

        <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            올해가 환갑·칠순인지 바로 확인해 보세요
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
