/**
 * 사이트 정규(canonical) URL.
 *
 * Vercel이 실제로 서빙하는 도메인과 반드시 일치해야 한다.
 * 현재 apex(saengsinpyo.com)는 www로 308 리다이렉트되므로 www가 정규 주소다.
 * 불일치하면 og:image가 리다이렉트 주소를 가리켜 카카오톡·네이버에서
 * 썸네일이 표시되지 않고, 사이트맵 URL도 전부 리다이렉트로 잡힌다.
 *
 * Vercel에서 기본 도메인을 apex로 바꾸는 경우 이 값도 함께 바꿔야 한다.
 */
export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saengsinpyo.com';

/**
 * 네이버 서치어드바이저 소유확인 코드.
 * 소유확인이 끝난 뒤에도 태그를 지우면 소유권이 해제되므로 그대로 둔다.
 */
export const NAVER_SITE_VERIFICATION =
  process.env.NAVER_SITE_VERIFICATION || 'cc8bf1af1cf53486ed26105fab3ba57f7a879b92';
