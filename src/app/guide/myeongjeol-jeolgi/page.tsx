import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import { AD_SLOTS } from '@/lib/adsense';
import { getSeasonalDaysForYear } from '@/lib/seasonalDays';

export const metadata: Metadata = {
  title: '올해 명절·절기 날짜 | 우리집 생신표',
  description: '설날, 정월대보름, 단오, 칠석, 추석, 동지, 한식이 올해 양력으로 언제인지 한눈에. 음력 명절이 매년 달라지는 이유도 함께 정리했습니다.',
  keywords: ['올해 설날', '올해 추석', '정월대보름 날짜', '단오 날짜', '칠석', '동지 날짜', '한식 날짜', '명절 날짜', '절기'],
  alternates: { canonical: '/guide/myeongjeol-jeolgi' },
};

/**
 * 표에 쓸 연도. 빌드 시점 기준 올해와 내년을 보여준다.
 * 정적 페이지라 해가 바뀌면 다시 배포해야 값이 갱신된다.
 */
const THIS_YEAR = new Date().getFullYear();

export default function MyeongjeolPage() {
  const thisYear = getSeasonalDaysForYear(THIS_YEAR);
  const nextYear = getSeasonalDaysForYear(THIS_YEAR + 1);
  const nextByName = new Map(nextYear.map(d => [d.name, d]));

  return (
    <main className="pb-24" style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
      <article className="max-w-md mx-auto px-4 py-10">
        <Link href="/guide" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          ← 가이드 목록
        </Link>

        <header className="mb-8">
          <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>음력 생일 가이드</p>
          <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            {THIS_YEAR}년 명절·절기는 언제인가요?
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            음력을 따르는 명절은 해마다 양력 날짜가 달라집니다.
            올해와 내년 날짜를 한눈에 정리했어요.
          </p>
        </header>

        <div className="space-y-6">
          <Section title={`${THIS_YEAR}년과 ${THIS_YEAR + 1}년 날짜`}>
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                    <th className="text-left py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>명절</th>
                    <th className="text-left py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>{THIS_YEAR}년</th>
                    <th className="text-left py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>{THIS_YEAR + 1}년</th>
                  </tr>
                </thead>
                <tbody>
                  {thisYear.map(day => {
                    const next = nextByName.get(day.name);
                    return (
                      <tr key={day.name} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td className="py-2 px-1 whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                          <span aria-hidden="true">{day.emoji}</span> {day.name}
                        </td>
                        <td className="py-2 px-1 whitespace-nowrap font-semibold" style={{ color: 'var(--accent)' }}>
                          {day.date.getMonth() + 1}월 {day.date.getDate()}일
                        </td>
                        <td className="py-2 px-1 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                          {next ? `${next.date.getMonth() + 1}월 ${next.date.getDate()}일` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              ※ 한국천문연구원(KASI) 음양력 데이터 기준. 동지는 태양 위치를 계산해 구합니다.
            </p>
          </Section>

          <Section title="음력 명절 — 해마다 날짜가 달라집니다">
            <ul className="space-y-2.5">
              <li className="flex gap-2"><span className="shrink-0">🎊</span><span><strong>설날</strong> — 음력 1월 1일. 한 해의 첫날이자 띠가 바뀌는 날입니다.</span></li>
              <li className="flex gap-2"><span className="shrink-0">🌕</span><span><strong>정월대보름</strong> — 음력 1월 15일. 새해 첫 보름달에 오곡밥과 부럼을 먹습니다.</span></li>
              <li className="flex gap-2"><span className="shrink-0">🌿</span><span><strong>단오</strong> — 음력 5월 5일. 수릿날이라고도 하며, 창포물에 머리를 감던 풍습이 있습니다.</span></li>
              <li className="flex gap-2"><span className="shrink-0">⭐</span><span><strong>칠석</strong> — 음력 7월 7일. 견우와 직녀가 만난다는 날입니다.</span></li>
              <li className="flex gap-2"><span className="shrink-0">🌾</span><span><strong>추석</strong> — 음력 8월 15일. 한가위. 가을 보름달 아래 햇곡식으로 차례를 지냅니다.</span></li>
            </ul>
            <p className="mt-3">
              이 날들이 해마다 양력으로 옮겨 다니는 이유는
              <Link href="/guide/eumlryeok-yanglyeok" style={{ color: 'var(--accent)', fontWeight: 600 }}> 음력과 양력의 차이</Link>에서 설명합니다.
            </p>
          </Section>

          <Section title="절기 — 태양의 위치로 정해집니다">
            <p>
              절기는 음력이 아니라 <strong>태양의 위치</strong>로 정합니다. 그래서 양력 날짜가
              해마다 거의 같고, 하루 정도만 움직입니다.
            </p>
            <ul className="space-y-2.5 mt-3">
              <li className="flex gap-2"><span className="shrink-0">🌑</span><span><strong>동지</strong> — 밤이 가장 긴 날. 태양 황경이 270도가 되는 순간으로, 양력 12월 21일이나 22일입니다. 팥죽을 먹습니다.</span></li>
              <li className="flex gap-2"><span className="shrink-0">🔥</span><span><strong>한식</strong> — 동지로부터 105일째. 양력 4월 5~6일 무렵이며, 산소를 돌보고 성묘합니다.</span></li>
            </ul>
            <p className="mt-3">
              한식이 제사·성묘와 어떻게 이어지는지는
              <Link href="/guide/jesa-gil" style={{ color: 'var(--accent)', fontWeight: 600 }}> 제사 날짜 계산</Link> 편에서 다룹니다.
            </p>
          </Section>

          <Section title="양력으로 고정된 기념일">
            <p>
              어린이날(5월 5일), 광복절(8월 15일), 개천절(10월 3일), 한글날(10월 9일)은
              양력으로 정해져 있어 해마다 같은 날입니다.
            </p>
            <p className="mt-2">
              단오가 음력 5월 5일, 추석이 음력 8월 15일이라 어린이날·광복절과 숫자가 같은데,
              기준이 달라서 실제 날짜는 전혀 다릅니다.
            </p>
          </Section>
        </div>

        {/* 글을 다 읽은 자리. 본문 중간을 끊지 않는다 */}
        <AdSlot slot={AD_SLOTS.articleEnd} className="mt-8" />

        <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
          <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            계산기 첫 화면에서 다가오는 명절까지 며칠 남았는지 볼 수 있어요
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
