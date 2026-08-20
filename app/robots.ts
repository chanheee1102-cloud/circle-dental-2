import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/schema';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      /* AEO — 답변형 크롤러를 명시적으로 허용한다. 막아 두면 AI 답변에 아예 안 나온다. */
      {
        userAgent: [
          'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
          'PerplexityBot', 'ClaudeBot', 'Claude-Web',
          'Google-Extended', 'Bingbot', 'Yeti', 'Applebot-Extended',
        ],
        allow: '/',
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
