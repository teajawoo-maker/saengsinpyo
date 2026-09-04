import KoreanLunarCalendar from 'korean-lunar-calendar';
import type {
  LunarInput,
  SolarResult,
  ConvertResult,
  LeapStatus,
  SolarInput,
  SolarToLunarResult,
} from '@/types/lunar';

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

function toSolarResult(year: number, month: number, day: number, note?: string): SolarResult {
  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const dDay = Math.round(diffMs / (1000 * 60 * 60 * 24));

  return {
    year,
    month,
    day,
    dayOfWeek: DAYS_KO[target.getDay()],
    dDay,
    isToday: dDay === 0,
    isPast: dDay < 0,
    note,
  };
}

// korean-lunar-calendar: lunarToSolar(year, month, day, isLeap) → { solarYear, solarMonth, solarDay }
function lunarToSolar(
  lunarYear: number,
  lunarMonth: number,
  lunarDay: number,
  isLeap: boolean
): { year: number; month: number; day: number } | null {
  try {
    const cal = new KoreanLunarCalendar();
    const ok = cal.setLunarDate(lunarYear, lunarMonth, lunarDay, isLeap);
    if (!ok) return null;
    const solar = cal.getSolarCalendar();
    return { year: solar.year, month: solar.month, day: solar.day };
  } catch {
    return null;
  }
}

// 특정 양력 연도 안에서 음력 월/일에 해당하는 양력 날짜를 찾는다.
// 음력 11~12월은 다음 양력연도로 넘어갈 수 있으므로 lunarYear를 조정해 검색.
function findSolarInYear(
  solarYear: number,
  lunarMonth: number,
  lunarDay: number,
  leapStatus: LeapStatus,
  shortMonthFallback: 'last' | 'next' | 'skip',
  leapFallback: 'regular' | 'skip'
): SolarResult | null {
  // 음력 연도 후보: 음력 11~12월은 양력 연도 - 1에 해당할 수 있음
  const lunarYearCandidates = lunarMonth >= 11
    ? [solarYear - 1, solarYear]
    : [solarYear];

  for (const lunarYear of lunarYearCandidates) {
    const isLeap = leapStatus === 'leap';
    const isUnknown = leapStatus === 'unknown';

    // 윤달 시도
    if (isLeap || isUnknown) {
      const res = lunarToSolar(lunarYear, lunarMonth, lunarDay, true);
      if (res && res.year === solarYear) {
        return toSolarResult(res.year, res.month, res.day);
      }
    }

    // 평달 시도 (평달이거나, 모름이거나, 윤달이지만 위에서 못찾은 경우)
    if (leapStatus !== 'leap' || isUnknown) {
      let res = lunarToSolar(lunarYear, lunarMonth, lunarDay, false);

      if (!res) {
        // 30일인데 해당 달이 29일까지인 경우
        if (lunarDay === 30) {
          if (shortMonthFallback === 'skip') return null;
          if (shortMonthFallback === 'last') {
            res = lunarToSolar(lunarYear, lunarMonth, 29, false);
            if (res && res.year === solarYear) {
              return toSolarResult(res.year, res.month, res.day, '해당 음력 달에 30일이 없어 29일로 계산했어요.');
            }
          }
          if (shortMonthFallback === 'next') {
            // 다음 달 1일
            const nextMonth = lunarMonth === 12 ? 1 : lunarMonth + 1;
            const nextYear = lunarMonth === 12 ? lunarYear + 1 : lunarYear;
            res = lunarToSolar(nextYear, nextMonth, 1, false);
            if (res && res.year === solarYear) {
              return toSolarResult(res.year, res.month, res.day, '해당 음력 달에 30일이 없어 다음 달 1일로 계산했어요.');
            }
          }
        }
        continue;
      }

      if (res.year === solarYear) {
        const note = isUnknown ? '윤달 확인이 필요해요. 평달 기준으로 임시 계산했어요.' : undefined;
        return toSolarResult(res.year, res.month, res.day, note);
      }
    }

    // 윤달 생신인데 해당 연도에 같은 윤달 없음 → leapFallback 적용
    if (isLeap && leapFallback !== 'skip') {
      const res = lunarToSolar(lunarYear, lunarMonth, lunarDay, false);
      if (res && res.year === solarYear) {
        return toSolarResult(res.year, res.month, res.day, `올해는 윤${lunarMonth}월이 없어 평달 날짜로 계산했어요.`);
      }
    }
  }

  return null;
}

export function convertLunar(input: LunarInput): ConvertResult {
  const { month, day, leapStatus, shortMonthFallback, leapFallback } = input;

  if (month < 1 || month > 12 || day < 1 || day > 30) {
    return { thisYear: null, nextYear: null, nearest: null, error: '올바른 음력 날짜를 입력해 주세요.' };
  }

  const today = new Date();
  const thisYear = today.getFullYear();
  const nextYear = thisYear + 1;

  const thisYearResult = findSolarInYear(thisYear, month, day, leapStatus, shortMonthFallback, leapFallback);
  const nextYearResult = findSolarInYear(nextYear, month, day, leapStatus, shortMonthFallback, leapFallback);

  // 가장 가까운 다가오는 날짜
  let nearest: SolarResult | null = null;
  if (thisYearResult && !thisYearResult.isPast) {
    nearest = thisYearResult;
  } else if (nextYearResult) {
    nearest = nextYearResult;
  }

  return { thisYear: thisYearResult, nextYear: nextYearResult, nearest };
}

/**
 * 양력 생년월일 → 음력 생일(월/일/윤달여부).
 * 주민등록상 양력 생일만 아는 경우, 집에서 챙기는 음력 생신을 역으로 찾아준다.
 */
export function solarToLunar(input: SolarInput): SolarToLunarResult {
  const { year, month, day } = input;

  if (year < 1900 || year > 2100) {
    return { lunarMonth: 0, lunarDay: 0, isLeapMonth: false, error: '1900년~2100년 사이만 변환할 수 있어요.' };
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return { lunarMonth: 0, lunarDay: 0, isLeapMonth: false, error: '올바른 양력 날짜를 입력해 주세요.' };
  }

  try {
    const cal = new KoreanLunarCalendar();
    const ok = cal.setSolarDate(year, month, day);
    if (!ok) {
      return { lunarMonth: 0, lunarDay: 0, isLeapMonth: false, error: '변환할 수 없는 날짜예요. 날짜를 다시 확인해 주세요.' };
    }
    const lunar = cal.getLunarCalendar();
    return {
      lunarMonth: lunar.month,
      lunarDay: lunar.day,
      isLeapMonth: Boolean(lunar.intercalation),
    };
  } catch {
    return { lunarMonth: 0, lunarDay: 0, isLeapMonth: false, error: '변환 중 문제가 생겼어요. 날짜를 다시 확인해 주세요.' };
  }
}

/**
 * 여러 해에 걸친 양력 생신 날짜.
 * 음력 생일은 해마다 양력 날짜가 달라 반복 규칙으로 표현할 수 없다.
 * 캘린더로 내보낼 때 연도별 날짜를 각각 만들어야 해서 필요하다.
 */
export function getSolarForYears(input: LunarInput, years: number[]): SolarResult[] {
  const { month, day, leapStatus, shortMonthFallback, leapFallback } = input;
  return years
    .map(y => findSolarInYear(y, month, day, leapStatus, shortMonthFallback, leapFallback))
    .filter((r): r is SolarResult => r !== null);
}

export function formatDDay(dDay: number): string {
  if (dDay === 0) return 'D-DAY';
  if (dDay > 0) return `D-${dDay}`;
  return `D+${Math.abs(dDay)}`;
}

export function formatDate(r: SolarResult): string {
  return `${r.year}년 ${r.month}월 ${r.day}일 ${r.dayOfWeek}요일`;
}
