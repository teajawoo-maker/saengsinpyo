import JsonLd from '@/components/JsonLd';
import { GUIDES, guidePath } from '@/lib/guides';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/jsonLd';

/**
 * 가이드 글 한 편에 필요한 구조화 데이터.
 *
 * 글마다 제목·날짜를 다시 적으면 목록과 어긋나기 쉬워서,
 * slug만 받아 글 목록에서 찾아 쓴다.
 */
export default function GuideJsonLd({ slug }: { slug: string }) {
  const guide = GUIDES.find(g => g.slug === slug);
  if (!guide) return null;

  return (
    <JsonLd
      data={[
        articleJsonLd(guide),
        breadcrumbJsonLd([
          { name: '우리집 생신표', path: '/' },
          { name: '음력 생일 가이드', path: '/guide' },
          { name: guide.title, path: guidePath(guide) },
        ]),
      ]}
    />
  );
}
