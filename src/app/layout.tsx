import type { Metadata } from 'next';
import './globals.css';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://saengsinpyo.com';

export const metadata: Metadata = {
  title: '우리집 생신표 | 음력 생일 양력 변환',
  description: '음력 생일을 양력으로 변환해 드려요. 부모님·조부모님 음력 생신을 올해·내년 날짜로 바로 확인하세요. 회원가입 없이 무료로 이용할 수 있어요.',
  keywords: ['음력 생일', '양력 변환', '음력 생신', '부모님 생신', '음력 달력', '음력 양력 변환기', '윤달 생일', '음력 30일', '생신 날짜', '음력 계산기'],
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${BASE_URL}/feed.xml`,
    },
  },
  openGraph: {
    title: '우리집 생신표 | 음력 생일 양력 변환',
    description: '음력 생일을 양력으로 변환해 드려요. 부모님·조부모님 음력 생신을 올해·내년 날짜로 바로 확인하세요.',
    locale: 'ko_KR',
    type: 'website',
    url: BASE_URL,
    siteName: '우리집 생신표',
  },
  twitter: {
    card: 'summary_large_image',
    title: '우리집 생신표',
    description: '음력 생일을 양력으로 변환해 드려요.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '우리집 생신표',
  description: '음력 생일을 양력으로 변환해 드려요. 부모님·조부모님 음력 생신을 올해·내년 날짜로 바로 확인하세요.',
  url: BASE_URL,
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  inLanguage: 'ko-KR',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  author: { '@type': 'Organization', name: '우리집 생신표' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        {/* 네이버 서치어드바이저 소유권 인증 — 배포 후 발급받은 코드로 교체 */}
        {process.env.NAVER_SITE_VERIFICATION && (
          <meta name="naver-site-verification" content={process.env.NAVER_SITE_VERIFICATION} />
        )}
        <link rel="alternate" type="application/rss+xml" title="우리집 생신표 RSS" href={`${BASE_URL}/feed.xml`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
