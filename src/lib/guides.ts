/**
 * 가이드 글 목록.
 *
 * 목록 페이지·사이트맵·RSS 세 곳이 모두 이 배열을 읽는다.
 * 예전에는 파일마다 따로 적어서 글을 추가할 때 한 곳을 빠뜨리기 쉬웠다.
 * 새 글을 쓰면 여기에만 추가하면 된다.
 */

export interface Guide {
  /** '/guide/' 뒤에 붙는 부분 */
  slug: string;
  emoji: string;
  /** 목록 카드 제목 */
  title: string;
  /** 목록 카드 설명 */
  description: string;
  /** RSS에 실을 조금 더 긴 설명 */
  rssDescription: string;
  tags: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'yundal-saengil',
    emoji: '🌙',
    title: '윤달 생일, 어떻게 계산하나요?',
    description: '윤달이 없는 해에 생신을 언제 챙겨야 할지 헷갈리는 분들을 위한 완벽 가이드',
    rssDescription: '윤달 생신은 매년 날짜가 있는 게 아니라서 헷갈리는 경우가 많아요. 정확한 규칙과 가족 관습에 맞는 계산법을 알아봅니다.',
    tags: ['윤달', '음력 생일', '생신'],
  },
  {
    slug: 'eumlryeok-30il',
    emoji: '📅',
    title: '음력 30일이 없는 해에는?',
    description: '음력 달마다 날수가 다른 이유와, 30일 생일을 어떻게 처리하는지 알아봅니다',
    rssDescription: '음력 달에는 29일까지만 있는 경우가 있어요. 대월과 소월의 차이, 음력 30일 생일 처리 방법 안내.',
    tags: ['음력 30일', '소월', '대월'],
  },
  {
    slug: 'bumonim-saengsin',
    emoji: '🎂',
    title: '부모님·조부모님 음력 생신 양력 변환',
    description: '매년 달라지는 부모님 음력 생신을 올해 양력 날짜로 정확하게 확인하는 방법',
    rssDescription: '어머니 생신이 음력 몇 월 며칠인데, 올해 양력으로 언제지? 이런 고민을 2초 만에 해결하세요.',
    tags: ['부모님 생신', '양력 변환', '음력 달력'],
  },
  {
    slug: 'hwangap-chilsun',
    emoji: '🎉',
    title: '환갑은 몇 살인가요?',
    description: '만 나이와 세는나이가 달라 헷갈리는 환갑·칠순·팔순 기준과 잔치 시기를 정리했어요',
    rssDescription: '만 나이와 세는나이가 달라 헷갈리는 환갑·진갑·칠순·팔순·구순 기준과 잔치 시기를 정리했습니다.',
    tags: ['환갑 나이', '칠순', '팔순', '진갑'],
  },
  {
    slug: 'tti-ganji',
    emoji: '🐴',
    title: '내 띠는 무엇일까요?',
    description: '띠가 바뀌는 날은 설날이에요. 1~2월생이 헷갈리는 이유와 연도별 띠 표',
    rssDescription: '양력 1~2월에 태어나면 띠가 앞 해가 될 수 있어요. 간지의 뜻과 연도별 띠 표를 확인하세요.',
    tags: ['띠 계산', '간지', '육십갑자'],
  },
  {
    slug: 'eumlryeok-yanglyeok',
    emoji: '🌗',
    title: '음력 생일은 왜 해마다 날짜가 달라지나요?',
    description: '해를 따르는 양력과 달을 따르는 음력의 차이, 11일씩 당겨지는 이유와 윤달이 생기는 원리',
    rssDescription: '음력은 양력보다 한 해가 11일쯤 짧습니다. 그래서 음력 생일은 양력으로 해마다 앞당겨져요. 윤달이 생기는 이유까지 함께 설명합니다.',
    tags: ['음력 양력 차이', '음력 원리', '태음태양력'],
  },
  {
    slug: 'jesa-gil',
    emoji: '🕯️',
    title: '제사 날짜, 올해는 언제인가요?',
    description: '음력 기일을 올해 양력으로 찾는 법. 전날 지내는지, 윤달에 돌아가신 경우는 어떻게 하는지',
    rssDescription: '기일은 돌아가신 날의 음력 날짜라서 양력으로는 해마다 달라집니다. 올해 날짜를 찾는 방법과 집안마다 다른 관습을 정리했습니다.',
    tags: ['제사 날짜', '기일 계산', '한식'],
  },
  {
    slug: 'myeongjeol-jeolgi',
    emoji: '🌾',
    title: '올해 명절·절기는 언제인가요?',
    description: '설날·정월대보름·단오·칠석·추석·동지·한식 날짜를 올해와 내년까지 한눈에',
    rssDescription: '음력을 따르는 명절은 해마다 양력 날짜가 달라집니다. 설날부터 동지까지 올해와 내년 날짜를 정리했습니다.',
    tags: ['설날 날짜', '추석 날짜', '동지', '절기'],
  },
];

export function guidePath(guide: Guide): string {
  return `/guide/${guide.slug}`;
}
