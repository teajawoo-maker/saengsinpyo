export type LeapStatus = 'regular' | 'leap' | 'unknown';

export type ShortMonthFallback = 'last' | 'next' | 'skip';
export type LeapFallback = 'regular' | 'skip';

export interface LunarInput {
  month: number;   // 1~12
  day: number;     // 1~30
  leapStatus: LeapStatus;
  shortMonthFallback: ShortMonthFallback;
  leapFallback: LeapFallback;
}

export interface SolarResult {
  year: number;
  month: number;
  day: number;
  dayOfWeek: string;
  dDay: number;
  isToday: boolean;
  isPast: boolean;
  note?: string;  // 윤달 대체, 29일 대체 등 안내
}

export interface ConvertResult {
  thisYear: SolarResult | null;
  nextYear: SolarResult | null;
  nearest: SolarResult | null;
  error?: string;
}
