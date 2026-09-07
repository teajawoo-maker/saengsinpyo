import { ADSENSE_CLIENT, isAdsenseEnabled } from '@/lib/adsense';

/**
 * ads.txt
 *
 * 구글이 광고 재고의 판매 권한을 확인하는 파일이다. 없으면 애드센스에서
 * "수익 손실 위험" 경고가 뜨고 광고가 제한될 수 있다.
 * 형식: google.com, pub-<숫자>, DIRECT, f08c47fec0942fa0
 *
 * 애드센스 설정 전에는 파일 자체를 두지 않는다.
 */
export function GET() {
  if (!isAdsenseEnabled) {
    return new Response('Not Found', { status: 404 });
  }

  // ca-pub-1234... 형태로 들어오므로 ads.txt 규격인 pub-1234...로 맞춘다
  const publisherId = ADSENSE_CLIENT.replace(/^ca-/, '');

  return new Response(
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  );
}
