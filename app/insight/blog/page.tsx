import type { Metadata } from 'next';
import Link from 'next/link';
import { CLINIC } from '@/lib/clinic';
import { allPosts } from '@/lib/blog';
import { Container, ContactCta, PageHero, Sentences } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, abs, og } from '@/lib/seo';

/**
 * 블로그 목록.
 *
 * ★ 글은 content/blog/*.json 이 전부다(lib/blog.ts). 이 파일은 그 목록을 그리기만 한다.
 * ⚠️ 글이 하나도 없어도 정상이다 — 그때는 빈 화면 대신 '준비 중' 을 말한다.
 *    404 로 만들지 말 것. 메뉴에 있는 주소가 404 면 방문자는 사이트가 고장 났다고 본다.
 */
export const metadata: Metadata = {
  title: '블로그',
  description: `${CLINIC.name}이 진료하면서 자주 받는 질문과 알아 두시면 좋은 내용을 정리해 올립니다.`,
  alternates: { canonical: '/insight/blog' },
  openGraph: og({
    title: `블로그 | ${CLINIC.name}`,
    description: '진료하면서 자주 받는 질문과 알아 두시면 좋은 내용을 적습니다.',
    path: '/insight/blog',
  }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '인사이트', path: '/insight' },
  { name: '블로그', path: '/insight/blog' },
];

export default function BlogIndexPage() {
  const posts = allPosts();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          /*
            ★ Blog + 글 목록 — 검색·답변 엔진이 '이 사이트에 블로그가 있고 글이 이만큼 있다' 를
              한 번에 읽는다. 글이 없으면 목록도 비운다(빈 배열을 내는 것이 거짓말보다 낫다).
          */
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            '@id': `${CLINIC.url}/insight/blog#blog`,
            name: `${CLINIC.name} 블로그`,
            url: abs('/insight/blog'),
            publisher: { '@id': `${CLINIC.url}/#clinic` },
            blogPost: posts.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              url: abs(`/insight/blog/${p.slug}`),
              datePublished: p.date,
              dateModified: p.updated ?? p.date,
              description: p.summary,
            })),
          },
        ]}
      />

      <PageHero
        trail={TRAIL}
        photo="booth"
        eyebrow="블로그"
        title="진료하면서 자주 받는 질문을 정리합니다"
        desc="상담 중에 짧게밖에 말씀드리지 못한 내용을 글로 남깁니다. 읽고 오시면 진료실에서 다음 이야기부터 하실 수 있습니다."
      />

      <Container className="py-24 lg:py-32">
        {posts.length === 0 ? (
          /* ⚠️ 이 자리를 지우지 말 것 — 첫 글을 올리기 전까지 방문자가 보는 화면이다. */
          <p className="max-w-[46em] text-[17px] leading-[1.9] text-ink-soft">
            <Sentences text="첫 글을 준비하고 있습니다. 궁금한 점은 전화나 카카오톡으로 먼저 물어보셔도 됩니다." />
          </p>
        ) : (
          <ul>
            {posts.map((p, i) => (
              <li key={p.slug} className="step-in border-b border-brand-200/70 first:border-t">
                <Link
                  href={`/insight/blog/${p.slug}`}
                  className="group grid gap-x-9 gap-y-3 px-2 py-8 transition-colors hover:bg-brand-100/50 sm:px-4 lg:grid-cols-[minmax(0,160px)_1fr] lg:py-9"
                >
                  <div className="flex items-baseline gap-3 lg:flex-col lg:items-start lg:gap-2">
                    <time
                      dateTime={p.date}
                      className="display-en text-[15px] leading-none tabular-nums text-clay-600"
                    >
                      {p.date.replace(/-/g, '. ')}
                    </time>
                    {p.category && (
                      <span className="text-[13.5px] font-bold text-ink-muted">{p.category}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="display-sm text-[clamp(20px,2.1vw,25px)] leading-snug text-ink transition-colors group-hover:text-clay-700">
                      {p.title}
                    </h2>
                    <p className="mt-3 max-w-[62ch] text-[16.5px] leading-[1.8] text-twilight">
                      <Sentences text={p.summary} />
                    </p>
                  </div>
                </Link>
                {/* i 는 지금 쓰지 않지만, 나중에 '더 보기' 를 붙일 때 기준이 된다. */}
                <span hidden>{i}</span>
              </li>
            ))}
          </ul>
        )}
      </Container>

      <ContactCta />
    </>
  );
}
