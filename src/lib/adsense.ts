/**
 * 애드센스 설정.
 *
 * 광고 배치 원칙:
 * 첫 화면에는 광고를 두지 않는다. 들어오자마자 광고가 보이면 거부감이 생기고,
 * 남에게 공유하기도 꺼려진다. 계산기는 도구라서 흐름을 끊지 않도록
 * 결과와 입력 사이에도 넣지 않는다.
 * 광고는 할 일을 마친 뒤인 페이지 아래쪽, 그리고 읽을거리인 가이드 글
 * 끝에만 한 개씩 둔다.
 *
 * NEXT_PUBLIC_ADSENSE_CLIENT가 없으면 스크립트도 광고 자리도 만들지 않는다.
 */

/**
 * 게시자 ID.
 * 어차피 스크립트 주소에 그대로 실려 나가는 공개 값이라 코드에 둔다.
 */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-2389705168121700';

export const isAdsenseEnabled = ADSENSE_CLIENT.length > 0;

/**
 * 광고 단위 ID. 애드센스에서 광고 단위를 만들면 발급된다.
 * 자동 광고만 쓸 경우 비워 두어도 되고, 그때는 개별 자리를 그리지 않는다.
 */
export const AD_SLOTS = {
  /** 홈 화면 맨 아래 (saengsinpyo-home-bottom) */
  homeBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ?? '4161910707',
  /** 가이드 글 끝 (saengsinpyo-article-end) */
  articleEnd: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE ?? '3749023332',
} as const;
