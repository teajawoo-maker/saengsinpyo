import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BASE_URL, NAVER_SITE_VERIFICATION } from '@/lib/siteConfig';
import { ADSENSE_CLIENT, isAdsenseEnabled } from '@/lib/adsense';
import BottomNav from '@/components/BottomNav';

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
        url: `${BASE_URL}/og-image-v2.png`,
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
    images: [`${BASE_URL}/og-image-v2.png`],
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

        {/*
          애드센스 스크립트.
          next/script의 lazyOnload로 두면 자바스크립트가 나중에 삽입해서
          원본 HTML에는 태그가 남지 않는다. 애드센스 크롤러는 원본 HTML을
          읽으므로 소유권 확인에 실패한다. 그래서 head에 직접 넣는다.
          async라 첫 화면 그리는 것을 막지는 않는다.
        */}
        {isAdsenseEnabled && (
          <>
            {/* 광고 서버와 미리 연결해 두면 스크립트를 받는 시간이 줄어든다 */}
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

      </body>
    </html>
  );
}
