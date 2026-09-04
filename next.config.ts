import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // OG 썸네일은 내용이 바뀌지 않는 정적 이미지다. 기본값인
        // max-age=0, must-revalidate로는 크롤러가 매번 재검증하게 되므로
        // 길게 캐시시킨다. 이미지를 교체할 때는 파일명을 바꿔야 한다.
        source: '/og-image.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
