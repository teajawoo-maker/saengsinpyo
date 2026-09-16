/**
 * 날을 세어 기념일을 찾는다.
 *
 * 백일도 49재도 "그날을 1일로 친다". 백일은 태어난 날이 1일이라
 * 태어난 날 + 99일이고, 49재는 돌아가신 날이 1일이라 + 48일이다.
 * 여기서 하루씩 어긋난 정보가 인터넷에 많이 돌아다녀서,
 * 계산을 한곳에 모아 두고 세는 기준을 주석으로 남긴다.
 */

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

export interface CountedDay {
  name: string;
  /** 그날을 1일로 쳤을 때 몇 일째인가 */
  nth: number;
  date: Date;
  /** 오늘 기준 남은 날. 지났으면 음수 */
  dDay: number;
  note?: string;
}

function midnight(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(base: Date, days: number): Date {
  const d = midnight(base);
  d.setDate(d.getDate() + days);
  return d;
}

function dDayFrom(target: Date): number {
  const today = midnight(new Date());
  return Math.round((midnight(target).getTime() - today.getTime()) / 86400000);
}

export function formatCounted(d: Date): string {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${DAYS_KO[d.getDay()]}요일`;
}

export function formatDDay(dDay: number): string {
  if (dDay === 0) return '오늘';
  return dDay > 0 ? `D-${dDay}` : `D+${Math.abs(dDay)}`;
}

/**
 * 돌(첫 생일)은 날을 세지 않고 해를 센다.
 * 2월 29일에 태어난 아기는 평년에 그날이 없어 3월 1일로 친다.
 */
function anniversary(birth: Date, years: number): { date: Date; note?: string } {
  const y = birth.getFullYear() + years;
  const m = birth.getMonth();
  const d = birth.getDate();
  const candidate = new Date(y, m, d);
  // 2월 29일이 없는 해에는 Date가 3월 1일로 넘겨 버린다. 그걸 그대로 쓰되 알려준다.
  if (candidate.getMonth() !== m) {
    return { date: candidate, note: '2월 29일이 없는 해라 3월 1일로 맞췄어요.' };
  }
  return { date: candidate };
}

/**
 * 아기의 기념일.
 * 태어난 날을 1일로 세므로 백일은 +99일이다. (+100일이 아니다)
 */
export function getBabyMilestones(birth: Date): CountedDay[] {
  const counted: CountedDay[] = [
    { name: '50일', nth: 50 },
    { name: '백일', nth: 100 },
    { name: '200일', nth: 200 },
  ].map(({ name, nth }) => {
    const date = addDays(birth, nth - 1);
    return { name, nth, date, dDay: dDayFrom(date) };
  });

  const results = [...counted];
  for (const years of [1, 2]) {
    const { date, note } = anniversary(birth, years);
    results.push({
      name: years === 1 ? '첫돌' : '두돌',
      nth: 0,
      date,
      dDay: dDayFrom(date),
      note,
    });
  }

  return results.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * 돌아가신 뒤의 재(齋).
 *
 * 돌아가신 날을 1일로 세어 이레마다 재를 지내고, 일곱 번째가 49재다.
 * 그래서 49재는 돌아가신 날 + 48일이다.
 */
export function getMemorialDays(death: Date): CountedDay[] {
  const names = ['초재', '이재', '삼재', '사재', '오재', '육재', '사십구재'];
  return names.map((name, i) => {
    const nth = (i + 1) * 7;
    const date = addDays(death, nth - 1);
    return {
      name: name === '사십구재' ? '49재' : name,
      nth,
      date,
      dDay: dDayFrom(date),
      note: name === '사십구재' ? '마지막 재입니다.' : undefined,
    };
  });
}

/**
 * 삼우제.
 *
 * 장사(매장·화장)를 지낸 날이 초우, 그 다음날이 재우, 또 그 다음날이 삼우다.
 * 그래서 삼우제는 장례를 치른 날 + 2일이다.
 *
 * 돌아가신 날이 아니라 '장례를 치른 날'이 기준이라는 점이 자주 헷갈린다.
 * 3일장이면 돌아가신 날이 1일째, 발인이 3일째이므로 삼우제는 5일째가 된다.
 */
export function getSamuje(funeralDate: Date): CountedDay {
  const date = addDays(funeralDate, 2);
  return {
    name: '삼우제',
    nth: 3,
    date,
    dDay: dDayFrom(date),
    note: '장례를 치른 날을 초우로 세어 세 번째 날입니다.',
  };
}
