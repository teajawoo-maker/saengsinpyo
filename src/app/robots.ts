import { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/siteConfig';

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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'Yeti', // 네이버 (AI 브리핑 포함)
        allow: '/',
      },
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
