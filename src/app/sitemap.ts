import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/siteConfig';
import { GUIDES, guidePath } from '@/lib/guides';

/**
 * 예전에는 모든 주소의 lastModified를 new Date()로 줬다.
 * 페이지가 하루에 한 번 다시 만들어지므로, 검색엔진 입장에서는
 * 날마다 "사이트 전체가 오늘 바뀌었다"고 말하는 셈이었다.
 * 그런 신호는 믿을 수 없다고 판단되어 아예 무시당한다.
 * 그래서 글은 실제로 고친 날을 준다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // 글 중 가장 최근에 고친 날. 목록 페이지가 바뀌는 시점이기도 하다.
  const latestGuide = GUIDES
    .map(g => g.updated)
    .sort()
    .at(-1) ?? '2026-09-04';

  return [
    {
      url: BASE_URL,
      lastModified: new Date(latestGuide),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/guide`,
      lastModified: new Date(latestGuide),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // 가이드 글은 목록에서 자동으로 채운다. 글을 추가할 때
    // 사이트맵에 넣는 것을 빠뜨리지 않도록.
    ...GUIDES.map(guide => ({
      url: `${BASE_URL}${guidePath(guide)}`,
      lastModified: new Date(guide.updated),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date('2026-09-08'),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
