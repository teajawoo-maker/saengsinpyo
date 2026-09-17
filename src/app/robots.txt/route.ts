import { BASE_URL } from '@/lib/siteConfig';

/**
 * robots.txt.
 *
 * 예전에는 robots.ts(MetadataRoute.Robots)로 만들었는데, 그 방식은 주석 줄을
 * 넣을 수 없다. 다음(Daum) 웹마스터도구는 소유 확인을 robots.txt 맨 아래의
 * 주석 한 줄로 하므로 글로 직접 만든다.
 */
export const dynamic = 'force-static';

/**
 * AI 검색이 답을 만들 때 가져가는 봇들.
 *
 * 지금도 '*' 규칙으로 모두 들어올 수 있다. 그래도 이름을 적어 두는 이유는,
 * 나중에 누가 '*'에 막는 규칙을 더해도 AI 검색 노출까지 함께 끊기지 않게
 * 하려는 것이다. 사이트를 AI 답변에 인용되게 하는 것이 목적이라
 * 학습용 봇도 막지 않는다.
 */
const AI_CRAWLERS = [
  'OAI-SearchBot', // ChatGPT 검색 결과
  'ChatGPT-User', // ChatGPT가 사용자 질문으로 직접 열어 볼 때
  'GPTBot', // OpenAI 학습
  'PerplexityBot',
  'Perplexity-User',
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  'Google-Extended', // Gemini
  'Applebot',
  'Applebot-Extended', // Apple Intelligence
  'Bingbot', // Copilot, 그리고 ChatGPT 검색이 참고하는 빙
];

/**
 * 다음 웹마스터도구 소유 확인 키. 반드시 파일 맨 아래에 있어야 한다.
 * 지우면 다음 검색 등록이 풀린다.
 */
const DAUM_WEBMASTER =
  '#DaumWebMasterTool:3546d1887fe4ed2c6260ef61315a9d5dc7c23c826b8ea21bc69912f052ba118c:ro2/p+FRpTVu5Bol3xeyLQ==';

export function GET() {
  const body = [
    'User-Agent: *',
    'Allow: /',
    '',
    '# 네이버 (AI 브리핑 포함)',
    'User-Agent: Yeti',
    'Allow: /',
    '',
    '# AI 검색',
    ...AI_CRAWLERS.map(name => `User-Agent: ${name}`),
    'Allow: /',
    '',
    `Host: ${BASE_URL}`,
    `Sitemap: ${BASE_URL}/sitemap.xml`,
    '',
    DAUM_WEBMASTER,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
