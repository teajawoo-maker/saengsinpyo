import type { MetadataRoute } from 'next';

/**
 * 홈 화면에 추가할 수 있게 하는 설정.
 * 생신은 1년에 몇 번만 찾아보는 일이라, 홈 화면에 두지 않으면
 * 서비스가 있다는 것 자체를 잊게 된다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '우리집 생신표 — 음력 생일 양력 변환',
    short_name: '생신표',
    description: '음력 생일을 양력으로 변환해 드려요. 부모님·조부모님 생신을 올해·내년 날짜로 바로 확인하세요.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1714',
    theme_color: '#E8802B',
    lang: 'ko',
    categories: ['utilities', 'lifestyle'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
