import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BASE_URL, NAVER_SITE_VERIFICATION } from '@/lib/siteConfig';
import { ADSENSE_CLIENT, isAdsenseEnabled } from '@/lib/adsense';
import BottomNav from '@/components/BottomNav';
import ServiceWorker from '@/components/ServiceWorker';

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
    // 정적 파일을 절대 URL로 지정한다. 동적 생성(opengraph-image.tsx)은
    // URL에 쿼리스트링이 붙고 must-revalidate/Vary 헤더가 걸리는데,
    // 카카오톡 스크래퍼가 그런 이미지를 가져오지 못해 썸네일이 비었다.
    images: [
      {
        url: `${BASE_URL}/og/home.png`,
        width: 1200,
        height: 630,
        alt: '우리집 생신표 — 음력 생일을 양력으로',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '우리집 생신표',
    description: '음력 생일을 양력으로 변환해 드려요.',
    images: [`${BASE_URL}/og/home.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: '생신표',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#c94a0d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 네이버 서치어드바이저 소유확인 */}
        <meta name="naver-site-verification" content={NAVER_SITE_VERIFICATION} />
        {/* 빙 웹마스터도구 소유확인. ChatGPT 검색·Copilot이 빙 색인을 쓴다. 지우면 확인이 풀린다 */}
        <meta name="msvalidate.01" content="0451F4D77459E885AAAE2DB1A8DDE96A" />

        {/*
          애드센스 스크립트.

          원본 HTML에 태그가 있어야 애드센스 심사 크롤러가 알아본다. 화면을 그린
          뒤에 스크립트로 넣으면(AdsenseScript) 처음 소유 확인이 실패했을 때와
          같은 모양이 된다. 그래서 승인이 확인될 때까지는 head에 그대로 둔다.
          async라 첫 화면 그리는 것을 막지는 않는다.

          승인이 확인되면 AdsenseScript(src/components)로 옮기면 모바일 성능이
          65점에서 82점으로 오른다. 재 보았다.
        */}
        {isAdsenseEnabled && (
          <>
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
            <script
              async
              crossOrigin="anonymous"
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            />
          </>
        )}
        <link rel="alternate" type="application/rss+xml" title="우리집 생신표 RSS" href={`${BASE_URL}/feed.xml`} />
      </head>
      <body>
        {children}
        <BottomNav />
        <ServiceWorker />

      </body>
    </html>
  );
}
