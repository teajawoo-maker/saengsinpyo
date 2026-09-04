declare module 'korean-lunar-calendar' {
  interface SolarCalendar {
    year: number;
    month: number;
    day: number;
    dayOfWeek: number;
  }

  interface LunarCalendar {
    year: number;
    month: number;
    day: number;
    isLeapMonth: boolean;
  }

  class KoreanLunarCalendar {
    setSolarDate(year: number, month: number, day: number): boolean;
    setLunarDate(year: number, month: number, day: number, isLeapMonth: boolean): boolean;
    getSolarCalendar(): SolarCalendar;
    getLunarCalendar(): LunarCalendar;
    getGapJaString(): string;
    getAnimalString(): string;
  }

  export = KoreanLunarCalendar;
}
