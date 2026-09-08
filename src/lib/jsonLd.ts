import { BASE_URL } from '@/lib/siteConfig';
import type { Guide } from '@/lib/guides';
import { guidePath } from '@/lib/guides';

/**
 * 검색엔진에 "이 쪽이 무엇인지" 기계가 읽을 수 있게 알려주는 조각들.
 *
 * 예전에는 공통 레이아웃에서 WebApplication 하나를 모든 쪽에 붙였다.
 * 그러면 가이드 글에도 "이건 계산기 앱이다"라고 말하는 셈이라
 * 글이 글로 인식되지 않는다. 쪽 성격에 맞는 것을 각자 붙인다.
 */

const PUBLISHER = {
  '@type': 'Organization',
  name: '우리집 생신표',
  url: BASE_URL,
} as const;

/** 첫 화면 — 계산기 */
export function webApplicationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '우리집 생신표',
    description:
      '음력 생일을 양력으로 변환해 드려요. 부모님·조부모님 음력 생신을 올해·내년 날짜로 바로 확인하세요.',
    url: BASE_URL,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    inLanguage: 'ko-KR',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
    publisher: PUBLISHER,
  };
}

/** 가이드 글 한 편 */
export function articleJsonLd(guide: Guide) {
  const url = `${BASE_URL}${guidePath(guide)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.rssDescription,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    // 날짜는 지어내지 않는다. 글 목록에 적어 둔 실제 날짜를 쓴다.
    datePublished: guide.published,
    dateModified: guide.updated,
    inLanguage: 'ko-KR',
    keywords: guide.tags.join(', '),
    image: `${BASE_URL}/og-image-v2.png`,
    author: PUBLISHER,
    publisher: PUBLISHER,
  };
}

/** 검색 결과에 "우리집 생신표 > 가이드 > 글" 경로를 보여준다 */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: step.name,
      item: `${BASE_URL}${step.path}`,
    })),
  };
}

/** 가이드 목록 */
export function guideListJsonLd(guides: Guide[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '음력 생일 가이드',
    url: `${BASE_URL}/guide`,
    inLanguage: 'ko-KR',
    publisher: PUBLISHER,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: guides.map((g, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: g.title,
        url: `${BASE_URL}${guidePath(g)}`,
      })),
    },
  };
}
