import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://saengsinpyo.vercel.app';

const GUIDES = [
  {
    title: '윤달 생일 계산법 — 윤달이 없는 해에는 어떻게 챙기나요?',
    link: `${BASE_URL}/guide/yundal-saengil`,
    description:
      '윤달 생신은 매년 날짜가 있는 게 아니라서 헷갈리는 경우가 많아요. 정확한 규칙과 가족 관습에 맞는 계산법을 알아봅니다.',
  },
  {
    title: '음력 30일이 없는 해에는 생신을 언제 챙기나요?',
    link: `${BASE_URL}/guide/eumlryeok-30il`,
    description:
      '음력 달에는 29일까지만 있는 경우가 있어요. 대월과 소월의 차이, 음력 30일 생일 처리 방법 안내.',
  },
  {
    title: '부모님·조부모님 음력 생신 양력으로 바로 확인하기',
    link: `${BASE_URL}/guide/bumonim-saengsin`,
    description:
      '어머니 생신이 음력 몇 월 며칠인데, 올해 양력으로 언제지? 이런 고민을 2초 만에 해결하세요.',
  },
];

export async function GET() {
  const items = GUIDES.map(
    (g) => `
  <item>
    <title><![CDATA[${g.title}]]></title>
    <link>${g.link}</link>
    <description><![CDATA[${g.description}]]></description>
    <guid isPermaLink="true">${g.link}</guid>
  </item>`
  ).join('');

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
