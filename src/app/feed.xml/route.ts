import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/siteConfig';
import { GUIDES, guidePath } from '@/lib/guides';

export async function GET() {
  // 가이드 목록에서 자동으로 채운다. 글을 추가할 때 RSS에
  // 넣는 것을 빠뜨리지 않도록.
  const items = GUIDES.map(guide => {
    const link = `${BASE_URL}${guidePath(guide)}`;
    return `
  <item>
    <title><![CDATA[${guide.title}]]></title>
    <link>${link}</link>
    <description><![CDATA[${guide.rssDescription}]]></description>
    <guid isPermaLink="true">${link}</guid>
  </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>우리집 생신표</title>
    <link>${BASE_URL}</link>
    <description>음력 생일을 양력으로 변환해 드려요. 부모님·조부모님 음력 생신을 올해·내년 날짜로 바로 확인하세요.</description>
    <language>ko</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <dc:creator>우리집 생신표</dc:creator>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
