import KoreanLunarCalendar from 'korean-lunar-calendar';

export interface SeasonalDay {
  name: string;
  emoji: string;
  date: Date;
  description: string;
}

function lunarToSolar(year: number, month: number, day: number, isLeap = false): Date | null {
  try {
    const cal = new KoreanLunarCalendar();
    if (!cal.setLunarDate(year, month, day, isLeap)) return null;
    const s = cal.getSolarCalendar();
    return new Date(s.year, s.month - 1, s.day);
  } catch {
    return null;
  }
}

// 동지: 태양 황경 270도, 양력로는 대략 12/21~22
function getDongji(year: number): Date {
  // 근사식: 동지는 12월 22일 근처 (간단 근사)
  // 정확하게는 천문 계산이 필요하지만 표시용으로 충분
  const base = new Date(year, 11, 22);
  return base;
}

// 한식: 동지로부터 105일째
function getHansik(year: number): Date {
  const dongji = getDongji(year - 1); // 전년도 동지
  const hansik = new Date(dongji);
  hansik.setDate(hansik.getDate() + 105);
  return hansik;
}

export function getSeasonalDaysForYear(year: number): SeasonalDay[] {
  const days: SeasonalDay[] = [];

  const add = (name: string, emoji: string, date: Date | null, description: string) => {
    if (date) days.push({ name, emoji, date, description });
  };

  // 음력 기반 절기
  add('설날', '🎊', lunarToSolar(year, 1, 1), '음력 1월 1일 · 새해 첫날');
  add('정월대보름', '🌕', lunarToSolar(year, 1, 15), '음력 1월 15일 · 오곡밥과 부럼');
  add('단오', '🌿', lunarToSolar(year, 5, 5), '음력 5월 5일 · 수릿날');
  add('칠석', '⭐', lunarToSolar(year, 7, 7), '음력 7월 7일 · 견우와 직녀');
  add('추석', '🌾', lunarToSolar(year, 8, 15), '음력 8월 15일 · 한가위');
  add('동지', '🌑', getDongji(year), '양력 12월 22일경 · 팥죽 먹는 날');

  // 양력 기반
  add('한식', '🔥', getHansik(year), '동지로부터 105일째 · 성묘하는 날');

  // 양력로 고정된 기념일
  days.push({ name: '어린이날', emoji: '🎈', date: new Date(year, 4, 5), description: '양력 5월 5일' });
  days.push({ name: '광복절', emoji: '🇰🇷', date: new Date(year, 7, 15), description: '양력 8월 15일' });
  days.push({ name: '개천절', emoji: '🌟', date: new Date(year, 9, 3), description: '양력 10월 3일' });
  days.push({ name: '한글날', emoji: '🖊️', date: new Date(year, 9, 9), description: '양력 10월 9일' });

  return days.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getUpcomingSeasonalDays(count = 3): SeasonalDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const year = today.getFullYear();

  const all = [
    ...getSeasonalDaysForYear(year),
    ...getSeasonalDaysForYear(year + 1),
  ];

  return all
    .filter(d => d.date >= today)
    .slice(0, count);
}

export function formatSeasonalDate(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dow = days[date.getDay()];
  return `${m}월 ${d}일 ${dow}요일`;
}

export function getDDayLabel(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // 인자로 받은 Date를 그대로 고치면 호출한 쪽의 값이 바뀐다.
  // 렌더 중에 호출되므로 반드시 복사본을 쓴다.
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return '오늘';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}
