import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '윤달 생일 계산법 | 우리집 생신표',
  description: '윤달 생일은 어떻게 계산할까요? 윤달이 없는 해에 생신을 언제 챙겨야 하는지, 평달로 대체하는 방법과 가족 관습 선택법을 알아봅니다.',
  keywords: ['윤달 생일', '윤달 생신', '음력 윤달 양력 변환', '윤달 없는 해 생일', '음력 생일 계산'],
};

export default function YundalPage() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <article className="max-w-md mx-auto px-4 py-10">
        <Link href="/guide" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          ← 가이드 목록
        </Link>

        <header className="mb-8">
          <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>음력 생일 가이드</p>
          <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            윤달 생일, 어떻게 계산하나요?
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            윤달 생신은 매년 날짜가 있는 게 아니라서 헷갈리는 경우가 많아요. 정확한 규칙과 가족 관습에 맞는 계산법을 알아봅니다.
          </p>
        </header>

        <div className="space-y-6">
          <Section title="윤달이 뭔가요?">
            <p>음력은 달의 움직임을 기준으로 하기 때문에, 양력보다 1년에 약 11일 짧아요. 이 차이를 맞추기 위해 약 2~3년마다 한 달을 더 끼워 넣는데, 이 달을 <strong>윤달</strong>이라고 합니다.</p>
            <p className="mt-2">예를 들어 2023년에는 윤4월이 있어서, 음력 4월이 두 번 반복됐어요. 윤달은 어느 달이 될지 해마다 다르고, 없는 해도 많습니다.</p>
          </Section>

          <Section title="윤달 생신이 있는데, 그 윤달이 없는 해에는?">
            <p>예를 들어 어머니 생신이 <strong>윤4월 15일</strong>이라면, 윤4월이 있는 해에는 그날 챙기면 됩니다. 하지만 윤4월이 없는 해에는 두 가지 선택지가 있어요:</p>
            <div className="mt-3 space-y-3">
              <div className="rounded-xl p-4" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>① 평달 날짜로 챙기기 (가장 일반적)</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>윤4월이 없는 해에는 같은 날짜인 4월 15일(평달)로 계산해요. 대부분의 가정에서 이 방법을 사용합니다.</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>② 그 해는 건너뛰기</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>엄격하게 윤달에만 생신을 챙기는 가정도 있어요. 이 경우 다음 윤4월이 돌아올 때까지 기다립니다.</p>
              </div>
            </div>
            <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
              ※ 어떤 방식이 맞고 틀리다기보다, <strong>가족의 관습을 따르는 것이 가장 중요</strong>해요. 잘 모르겠다면 어르신께 여쭤보세요.
            </p>
          </Section>

          <Section title="우리집 생신표에서는 어떻게 선택하나요?">
            <p>계산기에서 <strong>윤달</strong>을 선택하면 추가 옵션이 나타나요:</p>
            <ul className="mt-2 space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <li>• <strong>평달 날짜로</strong> → 윤달이 없는 해엔 같은 월/일의 평달로 계산</li>
              <li>• <strong>건너뛰기</strong> → 윤달이 없는 해는 결과를 표시하지 않음</li>
            </ul>
            <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>가족 어르신께 관습을 확인 후 설정하시면 매년 정확하게 안내받을 수 있어요.</p>
          </Section>

          <Section title="언제 윤달이 있나요? (2024~2030)">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left py-2 pr-4" style={{ color: 'var(--text-muted)' }}>연도</th>
                    <th className="text-left py-2" style={{ color: 'var(--text-muted)' }}>윤달</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {[
                    ['2025년', '윤6월'],
                    ['2028년', '윤5월'],
                    ['2031년', '윤3월'],
                  ].map(([year, month]) => (
                    <tr key={year} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td className="py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>{year}</td>
                      <td className="py-2" style={{ color: 'var(--text-secondary)' }}>{month}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>※ 한국천문연구원(KASI) 공식 자료 기준</p>
          </Section>
        </div>

        <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            지금 바로 윤달 생일을 양력으로 변환해 보세요
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
