import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/schema';
import { SYMPTOMS } from '@/lib/symptoms';
import { CONDITIONS } from '@/lib/conditions';
import { JOURNEYS } from '@/lib/insight';
import { TREATMENTS } from '@/lib/treatments-content';

export const dynamic = 'force-static';

/**
 * ⚠️ 새 라우트를 만들면 여기도 함께 늘린다. 빠뜨리면 그 페이지는
 *    색인 요청을 한 번도 못 받고 조용히 묻힌다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const e = (path: string, priority: number, cf: 'weekly' | 'monthly' = 'monthly') => ({
    url: `${SITE_URL}${path}`, lastModified: now, changeFrequency: cf, priority,
  });
  return [
    e('/', 1, 'weekly'),
    e('/insight', 0.8),
    e('/insight/symptom', 0.9),
    ...SYMPTOMS.map((s) => e(`/insight/symptom/${s.slug}`, 0.85)),
    e('/insight/condition', 0.85),
    ...CONDITIONS.map((c) => e(`/insight/condition/${c.slug}`, 0.8)),
    e('/treatment', 0.9),
    ...TREATMENTS.map((t) => e(`/treatment/${t.slug}`, 0.85)),
    e('/insight/journey', 0.8),
    ...JOURNEYS.map((j) => e(`/insight/journey/${j.slug}`, 0.75)),
    e('/insight/cost', 0.85),
    e('/insight/glossary', 0.6),
    e('/faq', 0.85),
    e('/privacy', 0.3),
  ];
}
