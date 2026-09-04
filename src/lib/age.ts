/**
 * 나이와 나이 기념일(환갑·칠순 등) 계산.
 *
 * 생신 서비스에서 가장 중요한 정보는 "올해가 몇 번째 생신인가"다.
 * 양력 생년을 알면 다가오는 생신의 만 나이가 바로 나오고,
 * 거기서 환갑·칠순 같은 기념 생신을 짚어줄 수 있다.
 */

export interface AgeMilestone {
  /** 만 나이 */
  age: number;
  /** 기념일 이름 (예: 환갑) */
  name: string;
  /** 짧은 설명 */
  description: string;
}

/**
 * 만 나이 기준 기념 생신.
 * 환갑은 태어난 해의 간지로 돌아오는 만 60세, 진갑은 그 이듬해다.
 */
const MILESTONES: Record<number, { name: string; description: string }> = {
  60: { name: '환갑', description: '태어난 해의 간지로 돌아오는 해' },
  61: { name: '진갑', description: '환갑 다음 해' },
  70: { name: '칠순', description: '고희(古稀)라고도 해요' },
  77: { name: '희수', description: '喜를 풀면 七十七' },
  80: { name: '팔순', description: '산수(傘壽)라고도 해요' },
  88: { name: '미수', description: '米를 풀면 八十八' },
  90: { name: '구순', description: '졸수(卒壽)라고도 해요' },
  99: { name: '백수', description: '百에서 一을 뺀 白' },
  100: { name: '백세', description: '백 번째 생신' },
};

/**
 * 특정 연도의 생신에 맞는 만 나이.
 * 생신 당일에 만 나이가 오르므로 (생신 연도 - 태어난 해)가 그날의 만 나이다.
 */
export function ageAtBirthday(birthYear: number, birthdayYear: number): number {
  return birthdayYear - birthYear;
}

/** 해당 만 나이가 기념 생신이면 정보를 돌려준다. */
export function getMilestone(age: number): AgeMilestone | null {
  const found = MILESTONES[age];
  return found ? { age, ...found } : null;
}

/**
 * 세는나이(한국식 나이). 태어난 해를 1살로 치고 해가 바뀌면 한 살 더한다.
 * 2023년부터 공식 나이는 만 나이지만, 어른들 사이에서는 여전히 쓰인다.
 */
export function koreanAge(birthYear: number, atYear: number): number {
  return atYear - birthYear + 1;
}

/** 오늘 기준 만 나이. 올해 생일이 아직이면 한 살 적다. */
export function currentAge(
  birthYear: number,
  birthMonth: number,
  birthDay: number
): number {
  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const monthDiff = today.getMonth() + 1 - birthMonth;
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
    age -= 1;
  }
  return age;
}
