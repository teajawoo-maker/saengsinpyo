import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { AD_SLOTS } from '@/lib/adsense';
import { getGanji } from '@/lib/ganji';

export const metadata: Metadata = {
  title: '내 띠와 간지 알아보기 | 우리집 생신표',
  description: '무슨 띠인지, 간지가 무엇인지 알아보세요. 설날 전에 태어나면 띠가 달라지는 이유와 연도별 띠 표를 정리했습니다.',
  keywords: ['띠 계산', '무슨 띠', '간지 계산', '띠 나이표', '갑자 육십갑자', '설날 전 출생 띠', '병오년', '을사년'],
  alternates: { canonical: '/guide/tti-ganji' },
};

/**
 * 하루에 한 번 페이지를 다시 만든다.
 * 연도별 띠 표가 올해를 기준으로 하므로, 해가 바뀌면 표도 따라가야 한다.
 */
export const revalidate = 86400;

export default function TtiGanjiPage() {
  // 연도를 숫자로 박아 두면 해가 바뀌어도 아무도 모르게 낡는다.
  // 페이지를 만드는 시점의 올해부터 12년치를 보여준다.
  const THIS_YEAR = new Date().getFullYear();
  const RECENT = Array.from({ length: 12 }, (_, i) => THIS_YEAR - i);

  return (
    <main className="pb-24" style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <article className="max-w-md mx-auto px-4 py-10">
        <Link href="/guide" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          ← 가이드 목록
        </Link>

        <header className="mb-8">
          <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>음력 생일 가이드</p>
          <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            내 띠는 무엇일까요?
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            띠는 태어난 해로 정해지지만, 기준이 되는 해가 바뀌는 시점은 양력 1월 1일이 아닙니다.
            1~2월에 태어난 분들이 특히 헷갈리는 부분을 정리했어요.
          </p>
        </header>

        <div className="space-y-6">
          <Section title="띠가 바뀌는 날은 설날입니다">
            <p>
              띠는 음력을 따르기 때문에 <strong>음력 설날</strong>에 바뀝니다. 양력 1월 1일이 아니에요.
            </p>
            <p className="mt-2">
              예를 들어 1966년 설날은 양력 1월 21일이었습니다. 그래서 양력 1966년 1월 15일에 태어난 분은
              아직 <strong>을사년 뱀띠</strong>이고, 3월에 태어난 분부터 <strong>병오년 말띠</strong>가 됩니다.
              같은 1966년생이지만 띠가 다릅니다.
            </p>
            <div className="mt-3 rounded-xl p-4" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                양력 1~2월 출생이라면 그해 설날이 언제였는지 꼭 확인하세요.
                설날 전이면 앞 해의 띠입니다.
              </p>
            </div>
          </Section>

          <Section title="간지가 뭔가요?">
            <p>
              간지(干支)는 <strong>천간</strong> 10개(갑·을·병·정·무·기·경·신·임·계)와
              <strong> 지지</strong> 12개(자·축·인·묘·진·사·오·미·신·유·술·해)를 차례로 짝지은 이름입니다.
            </p>
            <p className="mt-2">
              10과 12의 최소공배수가 60이라 60년마다 같은 이름이 돌아옵니다. 이것이 육십갑자이고,
              태어난 해의 간지가 돌아오는 만 60세를 <Link href="/guide/hwangap-chilsun" style={{ color: 'var(--accent)', fontWeight: 600 }}>환갑</Link>이라 부릅니다.
            </p>
            <p className="mt-2">
              지지 열둘은 각각 동물에 대응하고, 그것이 곧 띠입니다. 임진왜란의 임진년, 기미독립운동의 기미년처럼
              역사 속 이름도 모두 간지예요.
            </p>
          </Section>

          <Section title="연도별 띠 (최근 12년)">
            <div className="overflow-x-auto -mx-1" tabIndex={0} role="region" aria-label="연도별 띠 표">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                    <th className="text-left py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>연도</th>
                    <th className="text-left py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>간지</th>
                    <th className="text-left py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>띠</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT.map(year => {
                    const g = getGanji(year);
                    return (
                      <tr key={year} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td className="py-2 px-1 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{year}년</td>
                        <td className="py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>{g.yearName}</td>
                        <td className="py-2 px-1" style={{ color: 'var(--text-secondary)' }}>
                          <span aria-hidden="true">{g.zodiacEmoji}</span> {g.zodiacLabel}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              ※ 설날 이전 출생이면 표의 앞 해가 기준입니다. 12년 전·후는 같은 띠가 반복됩니다.
            </p>
          </Section>

          <Section title="띠를 정확히 확인하려면">
            <p>
              양력 생년월일을 넣으면 그날이 음력으로 며칠인지 계산하면서 <strong>설날 기준까지 반영한 간지와 띠</strong>를
              함께 알려드립니다. 1~2월 출생이라도 정확합니다.
            </p>
          </Section>
        </div>

        {/* 글을 다 읽은 자리. 본문 중간을 끊지 않는다 */}
        <AdSlot slot={AD_SLOTS.articleEnd} className="mt-8" />

        <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            생년월일로 정확한 띠를 확인해 보세요
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
