/**
 * 간지(干支)와 띠.
 *
 * 어르신 세대는 "병오년생 말띠"처럼 간지로 자기 해를 기억하는 경우가 많다.
 * 생년을 이미 받고 있으니 그대로 알려줄 수 있다.
 *
 * 주의: 간지의 해는 음력 설날에 바뀐다. 양력 1~2월 초에 태어난 사람은
 * 아직 전해의 간지라서, 양력 연도만으로 계산하면 틀린다. 그래서 이 파일은
 * 반드시 음력 연도를 받는다.
 */

const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

const ZODIAC: { name: string; emoji: string }[] = [
  { name: '쥐', emoji: '🐭' },
  { name: '소', emoji: '🐮' },
  { name: '호랑이', emoji: '🐯' },
  { name: '토끼', emoji: '🐰' },
  { name: '용', emoji: '🐲' },
  { name: '뱀', emoji: '🐍' },
  { name: '말', emoji: '🐴' },
  { name: '양', emoji: '🐑' },
  { name: '원숭이', emoji: '🐵' },
  { name: '닭', emoji: '🐔' },
  { name: '개', emoji: '🐶' },
  { name: '돼지', emoji: '🐷' },
];

export interface Ganji {
  /** 예: 병오 */
  ganji: string;
  /** 예: 병오년 */
  yearName: string;
  /** 예: 말 */
  zodiac: string;
  zodiacEmoji: string;
  /** 예: 말띠 */
  zodiacLabel: string;
}

/**
 * 음력 연도의 간지와 띠.
 * 서기 4년이 갑자년이라 (연도 - 4)를 기준으로 센다.
 */
export function getGanji(lunarYear: number): Ganji {
  const base = lunarYear - 4;
  const gan = CHEONGAN[((base % 10) + 10) % 10];
  const jiIndex = ((base % 12) + 12) % 12;
  const ji = JIJI[jiIndex];
  const animal = ZODIAC[jiIndex];

  return {
    ganji: `${gan}${ji}`,
    yearName: `${gan}${ji}년`,
    zodiac: animal.name,
    zodiacEmoji: animal.emoji,
    zodiacLabel: `${animal.name}띠`,
  };
}
