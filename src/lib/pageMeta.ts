import type { Metadata } from 'next';
import { BASE_URL } from '@/lib/siteConfig';

/**
 * 쪽마다 검색·공유용 메타 정보를 만든다.
 *
 * 예전에는 쪽에서 title·description만 적었다. 그런데 Next.js는 그 값을
 * 공통 레이아웃의 openGraph에 채워 넣지 않고, 레이아웃의 openGraph를
 * 통째로 물려준다. 그래서 백일 계산기 링크를 카톡에 보내도 제목·설명·
 * 이미지가 첫 화면 것으로 나왔고, og:url까지 첫 화면을 가리켰다.
 *
 * 쪽에서 openGraph를 적으면 레이아웃 것을 합치지 않고 통째로 바꾸므로,
 * siteName·locale 같은 공통값도 여기서 매번 함께 넣는다.
 */

interface PageMetaInput {
  /** 브라우저 탭과 검색 결과 제목 */
  title: string;
  /** 검색 결과 설명 */
  description: string;
  /** '/baegil' 처럼 앞에 /를 붙인 주소. 첫 화면은 '/' */
  path: string;
  /** public/og/ 아래 파일명 */
  image: string;
  imageAlt: string;
  keywords?: string[];
  /** 카톡 카드 제목. 없으면 title */
  shareTitle?: string;
  /** 카톡 카드 설명. 앞 40자 남짓만 보이므로 핵심을 앞에 둔다. 없으면 description */
  shareDescription?: string;
}

export function pageMetadata(input: PageMetaInput): Metadata {
  const url = input.path === '/' ? BASE_URL : `${BASE_URL}${input.path}`;
  const shareTitle = input.shareTitle ?? input.title;
  const shareDescription = input.shareDescription ?? input.description;
  // 정적 파일을 절대 주소로 준다. 카카오 스크래퍼는 리다이렉트나
  // 쿼리스트링이 붙은 이미지를 가져오지 못했다.
  const image = {
    url: `${BASE_URL}/og/${input.image}`,
    width: 1200,
    height: 630,
    alt: input.imageAlt,
    type: 'image/png',
  };

  return {
    title: input.title,
    description: input.description,
    ...(input.keywords ? { keywords: input.keywords } : {}),
    alternates: { canonical: input.path },
    openGraph: {
      title: shareTitle,
      description: shareDescription,
      url,
      siteName: '우리집 생신표',
      locale: 'ko_KR',
      type: input.path === '/' ? 'website' : 'article',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: shareDescription,
      images: [image.url],
    },
  };
}
