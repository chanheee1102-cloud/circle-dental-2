import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CLINIC } from '@/lib/clinic';
import { DOCTORS } from '@/lib/doctors';
import { allPosts, postBySlug } from '@/lib/blog';
import { Container, ContactCta, Breadcrumb, Sentences } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, abs, og, medicalWebPageSchema } from '@/lib/seo';

/**
 * 블로그 글 한 편.
 *
 * ★ 본문은 content/blog/*.json 의 html 을 그대로 그린다. 그래서 생성기가 만든 HTML 이
 *   중간 변환 없이 화면에 나온다.
 * ⚠️ dangerouslySetInnerHTML 을 쓰는 유일한 자리다. 넣는 값은 **저장소에 커밋된 파일**뿐이고
 *    lib/blog.ts 가 script·iframe·on* 을 한 번 걷어 낸다. 외부 입력을 여기로 흘리지 말 것.
 * ⚠️ 본문 모양은 .blog-body 한 곳(globals.css)에서 정한다 — 글마다 클래스를 적을 수 없기
 *    때문이다. 생성기가 클래스를 붙이지 않아도 h2/p/ul 이 제 모양으로 나온다.
 *
 * ★ 날짜는 글 파일에서 온다. 다른 페이지처럼 contentDates(경로) 를 쓰지 않는다 —
 *   그쪽은 사람이 관리하는 표라 한 달에 열 편씩 늘어나는 글에는 맞지 않는다.
 */
export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  const path = `/insight/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.summary.slice(0, 155),
    alternates: { canonical: path },
    openGraph: og({ title: `${post.title} | ${CLINIC.name}`, description: post.summary.slice(0, 155), path }),
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const path = `/insight/blog/${post.slug}`;
  const trail = [
    { name: '홈', path: '/' },
    { name: '인사이트', path: '/insight' },
    { name: '블로그', path: '/insight/blog' },
    { name: post.title, path },
  ];
  /* 글쓴이는 대표원장으로 둔다 — 의료 정보는 '누가 말했는가' 가 신뢰의 절반이다. */
  const author = DOCTORS[0];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({ title: post.title, description: post.summary, path }),
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            '@id': `${CLINIC.url}${path}#post`,
            headline: post.title,
            description: post.summary,
            url: abs(path),
            inLanguage: 'ko-KR',
            datePublished: post.date,
            dateModified: post.updated ?? post.date,
            isPartOf: { '@id': `${CLINIC.url}/insight/blog#blog` },
            publisher: { '@id': `${CLINIC.url}/#clinic` },
            author: { '@id': `${CLINIC.url}/about/doctors#${author.slug}` },
            ...(post.category ? { articleSection: post.category } : {}),
          },
        ]}
      />

      <Container className="pt-12 lg:pt-16">
        <Breadcrumb trail={trail} />

        <div className="mt-9 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <time dateTime={post.date} className="display-en text-[15px] tabular-nums text-clay-600">
            {post.date.replace(/-/g, '. ')}
          </time>
          {post.category && (
            <span className="text-[14px] font-bold text-ink-muted">{post.category}</span>
          )}
        </div>

        <h1 className="display-sm mt-4 max-w-[20em] text-[clamp(28px,3.6vw,44px)] leading-[1.25] tracking-[-0.02em] text-ink">
          {post.title}
        </h1>
        <p className="mt-6 max-w-[46em] text-[18px] leading-[1.9] text-twilight"><Sentences text={post.summary} /></p>

        {/*
          ⚠️ 본문 모양은 globals.css 의 .blog-body 가 정한다. 여기서 자식마다 클래스를 주려
             하지 말 것 — 본문은 문자열이라 손댈 수 없다.
        */}
        <div
          className="blog-body mt-12 max-w-[42em]"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/*
          ⚠️ 이 안내를 지우지 말 것 — 의료광고에는 '개인차' 고지가 필요하고,
             블로그 글은 진단을 대신하지 않는다는 점을 매번 밝히는 편이 안전하다.
        */}
        <aside className="mt-14 max-w-[42em] border-t border-brand-200/70 pt-6 text-[15px] leading-[1.8] text-ink-soft">
          이 글은 일반적인 이해를 돕기 위한 것으로 개별 진단을 대신하지 않습니다. 치료 결과는
          개인의 구강 상태와 전신 건강에 따라 다를 수 있으며, 모든 의료 행위에는 부작용이 따를 수
          있습니다.{' '}
          <Link href="/about/doctors" className="font-bold text-clay-700 underline-offset-4 hover:underline">
            {author.name} {author.role}
          </Link>
        </aside>

        <div className="mt-12">
          <Link
            href="/insight/blog"
            className="group inline-flex items-center gap-2 text-[16px] font-bold text-clay-700"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            블로그 목록
          </Link>
        </div>
      </Container>

      <ContactCta />
    </>
  );
}
