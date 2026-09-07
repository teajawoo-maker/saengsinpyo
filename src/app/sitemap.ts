import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/siteConfig';
import { GUIDES, guidePath } from '@/lib/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/guide`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // 가이드 글은 목록에서 자동으로 채운다. 글을 추가할 때
    // 사이트맵에 넣는 것을 빠뜨리지 않도록.
    ...GUIDES.map(guide => ({
      url: `${BASE_URL}${guidePath(guide)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    {
      url: `${BASE_URL}/about`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
