import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/pageMeta';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import GuideJsonLd from '@/components/GuideJsonLd';
import { AD_SLOTS } from '@/lib/adsense';
import { getSolarForYears } from '@/lib/lunarConverter';

export const metadata: Metadata = pageMetadata({
  title: '추석 벌초·성묘는 언제 하나요? | 우리집 생신표',
  description: '올해 추석 날짜와 연휴, 벌초 시기, 성묘 가는 날, 차례 시간을 정리했습니다. 추석이 해마다 양력으로 달라지는 이유도 함께 설명합니다.',
  keywords: ['올해 추석', '추석 연휴', '벌초 시기', '벌초 언제', '성묘 날짜', '추석 차례 시간', '백중', '한가위'],
  path: '/guide/chuseok-beolcho',
  image: 'guide-chuseok-beolcho.png',
  imageAlt: '추석 벌초·성묘는 언제 하나요?',
});

/**
 * 하루에 한 번 페이지를 다시 만든다.
 * 추석은 음력 8월 15일이라 양력 날짜가 해마다 달라진다.
 */
export const revalidate = 86400;

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 음력 날짜 하나를 여러 해에 걸쳐 양력으로 */
function lunarDay(month: number, day: number, years: number[]) {
  return getSolarForYears(
    { month, day, leapStatus: 'regular', shortMonthFallback: 'last', leapFallback: 'regular' },
    years
  );
}

function fmt(r: { month: number; day: number; dayOfWeek: string }) {
  return `${r.month}월 ${r.day}일 ${r.dayOfWeek}요일`;
}

export default function ChuseokPage() {
  const THIS_YEAR = new Date().getFullYear();
  const years = [THIS_YEAR, THIS_YEAR + 1];

  // 추석은 음력 8월 15일, 백중은 음력 7월 15일이다.
  // 날짜를 글에 적어 두면 내년이면 낡으므로 매번 계산한다.
  const chuseok = lunarDay(8, 15, years);
  const baekjung = lunarDay(7, 15, years);

  const thisChuseok = chuseok[0];
  const thisBaekjung = baekjung[0];

  // 연휴는 추석 당일과 그 앞뒤 하루씩 사흘이다.
  const holiday = thisChuseok
    ? [-1, 0, 1].map(offset => {
        const d = new Date(thisChuseok.year, thisChuseok.month - 1, thisChuseok.day + offset);
        return `${d.getMonth() + 1}월 ${d.getDate()}일(${DAYS[d.getDay()]})`;
      })
    : [];

  return (
    <>
      <GuideJsonLd slug="chuseok-beolcho" />
      <main className="pb-24" style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
        <article className="max-w-md mx-auto px-4 py-10">
          <Link href="/guide" className="inline-flex items-center gap-1 text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            ← 가이드 목록
          </Link>

          <header className="mb-8">
            <p className="text-sm mb-2" style={{ color: 'var(--accent)' }}>음력 생일 가이드</p>
            <h1 className="text-2xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
              {THIS_YEAR}년 추석, 언제 무엇을 하나요?
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              추석은 음력 8월 15일이라 양력 날짜가 해마다 달라집니다.
              올해 추석과 연휴, 벌초와 성묘 시기를 정리했어요.
            </p>
          </header>

          {thisChuseok && (
            <div className="rounded-2xl p-5 mb-6 text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{THIS_YEAR}년 추석</p>
              <p className="text-2xl font-black mb-2" style={{ color: 'var(--accent-strong)' }}>
                {fmt(thisChuseok)}
              </p>
              {holiday.length > 0 && (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  연휴 {holiday.join(' · ')}
                </p>
              )}
            </div>
          )}

          <div className="space-y-6">
            <Section title="벌초는 언제 하나요?">
              <p>
                예로부터 <strong>백중</strong>(음력 7월 15일)이 지나고 추석 전까지 벌초를 했습니다.
                {thisBaekjung && <> 올해 백중은 <strong>{fmt(thisBaekjung)}</strong>입니다.</>}
              </p>
              <p className="mt-2">
                요즘은 추석 <strong>2~3주 전 주말</strong>에 많이 합니다. 여름에 자란 풀이 한 번
                꺾인 뒤이고, 추석 직전에는 벌초 인파가 몰려 길이 막히기 때문입니다.
              </p>
              <div className="mt-3 rounded-xl p-4" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  이 시기에는 땅벌이 가장 사납습니다. 밝은 색 옷과 향이 강한 화장품은 피하고,
                  긴 옷과 장갑을 챙기세요.
                </p>
              </div>
            </Section>

            <Section title="성묘는 언제 가나요?">
              <p>
                정해진 규칙은 없습니다. 크게 세 가지로 나뉩니다.
              </p>
              <ul className="space-y-2.5 mt-3">
                <li className="flex gap-2"><span className="shrink-0">①</span><span><strong>추석 당일</strong> — 아침에 차례를 지내고 산소로 가는 가장 흔한 방식</span></li>
                <li className="flex gap-2"><span className="shrink-0">②</span><span><strong>추석 전날</strong> — 당일 길이 막힐 것을 피해 미리 다녀옵니다</span></li>
                <li className="flex gap-2"><span className="shrink-0">③</span><span><strong>벌초하는 날</strong> — 산소를 손보면서 함께 인사드립니다</span></li>
              </ul>
              <p className="mt-3">
                한식에 가는 성묘와 어떻게 다른지는
                <Link href="/guide/jesa-gil" style={{ color: 'var(--accent)', fontWeight: 600 }}> 제사 날짜 계산</Link> 편에서 다룹니다.
              </p>
            </Section>

            <Section title="차례는 몇 시에 지내나요?">
              <p>
                차례는 <strong>아침</strong>에 지냅니다. 보통 해가 뜬 뒤부터 오전 중에 마칩니다.
              </p>
              <p className="mt-2">
                밤에 지내는 <strong>기제사</strong>와 헷갈리기 쉬운데, 둘은 다른 의례입니다.
                기제사는 돌아가신 그날을 기리는 것이라 음력 기일 밤에 지내고,
                차례는 명절 아침에 온 조상께 함께 인사드리는 것입니다.
              </p>
            </Section>

            <Section title="추석 날짜가 해마다 달라지는 이유">
              <p>
                추석은 <strong>음력 8월 15일</strong>입니다. 음력은 달의 움직임을 따르기 때문에
                한 해가 양력보다 약 11일 짧고, 그래서 양력 날짜가 해마다 옮겨 다닙니다.
              </p>
              <div className="overflow-x-auto -mx-1 mt-3" tabIndex={0} role="region" aria-label="연도별 추석 날짜">
                <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid var(--border)' }}>
                      <th className="text-left py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>연도</th>
                      <th className="text-left py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>추석</th>
                      <th className="text-left py-2 px-1 font-semibold" style={{ color: 'var(--text-primary)' }}>백중</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chuseok.map((c, i) => (
                      <tr key={c.year} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td className="py-2 px-1 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>{c.year}년</td>
                        <td className="py-2 px-1 whitespace-nowrap font-semibold" style={{ color: 'var(--accent)' }}>{c.month}월 {c.day}일</td>
                        <td className="py-2 px-1 whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                          {baekjung[i] ? `${baekjung[i].month}월 ${baekjung[i].day}일` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                ※ 한국천문연구원(KASI) 음양력 데이터 기준. 연휴가 토·일과 겹치면
                대체공휴일이 생길 수 있으니 그해 정부 발표를 확인하세요.
              </p>
            </Section>

            <Section title="모인 김에 여쭤보면 좋은 것">
              <p>
                부모님 생신이 음력인 집이 많은데, 정작 음력으로 몇 월 며칠인지 정확히 아는
                자식은 드뭅니다. 어른들께 직접 여쭤볼 수 있는 자리가 명절 말고는 잘 없습니다.
              </p>
              <p className="mt-2">
                <strong>음력 몇 월 며칠인지, 그리고 평달인지 윤달인지</strong> 두 가지만 여쭤보세요.
                그 두 가지면 앞으로 해마다 양력 날짜를 자동으로 알 수 있습니다.
              </p>
              <p className="mt-2">
                음력 30일에 태어나셨다면
                <Link href="/guide/eumlryeok-30il" style={{ color: 'var(--accent)', fontWeight: 600 }}> 30일이 없는 해</Link>가,
                윤달에 태어나셨다면
                <Link href="/guide/yundal-saengil" style={{ color: 'var(--accent)', fontWeight: 600 }}> 윤달 생일</Link> 편이
                도움이 됩니다.
              </p>
            </Section>
          </div>

          {/* 글을 다 읽은 자리. 본문 중간을 끊지 않는다 */}
          <AdSlot slot={AD_SLOTS.articleEnd} className="mt-8" />

          <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: 'var(--accent-light)', border: '1px solid var(--border-light)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              여쭤본 음력 생신, 잊어버리기 전에 저장해 두세요
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
