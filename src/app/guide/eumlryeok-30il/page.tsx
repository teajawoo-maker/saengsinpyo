import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '음력 30일 없는 해 생일 계산 | 우리집 생신표',
  description: '음력 달에는 29일까지만 있는 경우가 있어요. 음력 30일 생일이 있는 분들을 위한 처리 방법과 가족 관습 선택 가이드.',
  keywords: ['음력 30일', '음력 30일 없는 해', '소월 대월', '음력 생일 29일', '음력 달 날수'],
};

export default function Eumlryeok30ilPage() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <article className="max-w-md mx-auto px-4 py-10">
        <Link href="/guide" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          ← 가이드 목록
        </Link>

        <header className="mb-8">
          <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>음력 생일 가이드</p>
          <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            음력 30일이 없는 해에는?
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            음력은 달마다 날수가 다릅니다. 어떤 달은 30일까지, 어떤 달은 29일까지예요. 30일에 태어나신 분들의 생신 계산법을 알아봅니다.
          </p>
        </header>

        <div className="space-y-6">
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>대월과 소월이란?</h2>
            <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--text-secondary)' }}>
              <p>음력 달은 크게 두 종류로 나뉩니다:</p>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="rounded-xl p-3 text-center" style={{ background: 'var(--accent-light)' }}>
                  <p className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>대월 (大月)</p>
                  <p className="text-2xl font-black mb-1" style={{ color: 'var(--accent)' }}>30일</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>그 달 마지막 날이 30일</p>
                </div>
                <div className="rounded-xl p-3 text-center" style={{ background: 'var(--bg)', border: '1px solid var(--border-light)' }}>
                  <p className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>소월 (小月)</p>
                  <p className="text-2xl font-black mb-1" style={{ color: 'var(--text-secondary)' }}>29일</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>그 달 마지막 날이 29일</p>
                </div>
              </div>
              <p className="mt-3">어느 달이 대월인지 소월인지는 해마다 달라지며, 천문 계산으로만 정확히 알 수 있어요. 같은 달이라도 어떤 해는 30일, 어떤 해는 29일까지입니다.</p>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>30일 생신인데 그 달이 29일까지라면?</h2>
            <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-secondary)' }}>
              <p>예를 들어 아버지 생신이 <strong>음력 7월 30일</strong>인데, 올해 음력 7월이 29일로 끝나는 소월이라면 세 가지 방법 중 하나를 선택해야 해요:</p>
              <div className="space-y-3 mt-1">
                {[
                  { label: '① 29일(그 달 마지막 날)로 계산', desc: '가장 일반적인 방법이에요. "30일이 없으니 그달의 마지막 날"로 챙깁니다.', recommended: true },
                  { label: '② 다음 달 1일로 계산', desc: '"다음 달 초하루"로 미루어 챙기는 가정도 있어요.' },
                  { label: '③ 그 해는 건너뛰기', desc: '30일이 없는 해는 아예 챙기지 않는 방식입니다.' },
                ].map(opt => (
                  <div key={opt.label} className="rounded-xl p-4"
                    style={{ background: opt.recommended ? 'var(--accent-light)' : 'var(--bg)', border: '1px solid var(--border-light)' }}>
                    <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                      {opt.label} {opt.recommended && <span className="text-xs ml-1" style={{ color: 'var(--accent)' }}>추천</span>}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{opt.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                ※ 어떤 방식이 정답은 아니에요. 가족 어르신께 여쭤보고 관습을 따르는 게 가장 좋습니다.
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>계산기에서 설정하는 방법</h2>
            <div className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <p>음력 <strong>30일</strong>을 선택하면 자동으로 추가 옵션이 나타납니다:</p>
              <ul className="mt-2 space-y-1">
                <li>• <strong>29일로</strong> → 소월인 해에 29일로 계산</li>
                <li>• <strong>다음달 1일로</strong> → 다음 달 1일로 계산</li>
                <li>• <strong>건너뛰기</strong> → 소월인 해는 결과를 표시하지 않음</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            직접 30일 생일을 계산해 보세요
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
