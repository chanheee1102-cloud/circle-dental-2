import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CLINIC } from '@/lib/clinic';
import { allPosts } from '@/lib/blog';
import { Container, ContactCta, PageHero } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, abs, og, alt } from '@/lib/seo';

/*
 * ★ ISR — 한 시간마다 다시 그린다 (2026-09-07 오너: "매달 자동으로 발행").
 *   글마다 date 를 미리 적어 두면 lib/blog.ts 가 오늘 이후 글을 숨기고, 이 revalidate 가
 *   날짜가 지난 글을 다시 빌드 없이 실어 준다. 새 글 파일 자체는 커밋 → 빌드로 들어온다.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: '블로그',
  /* ⚠️ 49자였다(2026-09-07 실측) — 검색 결과 조각이 한 줄로 끝나 무슨 글이 있는지 안 보였다.
     무엇을 다루는지까지 적어 70~160자 안에 둔다. 화면에는 안 나오는 글이다. */
  description: `${CLINIC.name}이 진료하면서 자주 받는 질문과 알아 두시면 좋은 내용을 정리해 올립니다. 충치와 잇몸, 임플란트와 사랑니처럼 진료실에서 설명이 길어지는 주제를 글로 풀어 두었습니다.`,
  alternates: alt('/insight/blog'),
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

/** 2026-09-08 → 2026년 9월 8일. 카드에 발행일을 사람이 읽는 형태로. */
const koDate = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
};

/**
 * 블로그 목록 — 사진 카드 격자 (2026-09-07 오너: "이미지 하나정도씩 캐러셀처럼 넣어서 카드형태로").
 *
 * ★ 카드마다 대표 사진 · 발행일 · 분류 · 제목 · 요약. 발행일을 눈에 띄게 두는 이유 —
 *   검색과 답변 엔진이 '언제 쓴 글인가' 를 신선도 신호로 보고, 사람도 그것을 보고 믿는다.
 * ★ 첫 글은 크게(2칸) — 가장 최근 글이 먼저 보이고 격자에 리듬이 생긴다.
 * ⚠️ 글은 content/blog/*.json 이 전부다(lib/blog.ts). 이 파일은 그 목록을 그리기만 한다.
 * ⚠️ 글이 하나도 없어도 정상이다 — 그때는 빈 화면 대신 '준비 중' 을 말한다. 404 로 만들지 말 것.
 */
export default function BlogIndexPage() {
  const posts = allPosts();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
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
              ...(p.image ? { image: abs(p.image) } : {}),
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

      <Container className="py-16 sm:py-24 lg:py-32">
        {posts.length === 0 ? (
          <p className="max-w-[46em] text-[17px] leading-[1.9] text-ink-soft">
            첫 글을 준비하고 있습니다. 궁금한 점은 전화나 카카오톡으로 먼저 물어보셔도 됩니다.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => {
              const big = i === 0;
              return (
                <li key={p.slug} className={big ? 'sm:col-span-2' : ''}>
                  <Link
                    href={`/insight/blog/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-200/70 bg-parchment transition-colors hover:border-brand-300"
                  >
                    <div className={`relative overflow-hidden bg-brand-100 ${big ? 'aspect-[2/1]' : 'aspect-[3/2]'}`}>
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={p.imageAlt ?? ''}
                          fill
                          priority={i < 2}
                          sizes={big ? '(min-width: 1024px) 860px, 100vw' : '(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw'}
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[15px] text-ink-muted">사진 없음</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <time dateTime={p.date} className="text-[13.5px] font-bold tabular-nums text-clay-700">
                          {koDate(p.date)}
                        </time>
                        {p.category && <span className="text-[13px] font-bold text-ink-muted">{p.category}</span>}
                      </div>
                      <h2
                        className={`display-sm mt-3 text-ink transition-colors group-hover:text-clay-700 ${
                          big ? 'text-[clamp(21px,2.4vw,30px)] leading-[1.3]' : 'text-[19px] leading-[1.4]'
                        }`}
                      >
                        {p.title}
                      </h2>
                      {/* ⚠️ Sentences 를 쓰지 않는다 — 카드 폭에서 쉼표마다 줄이 갈려 계단이 된다(증상 허브와 같은 이유). */}
                      <p className="mt-3 line-clamp-3 text-[15.5px] leading-[1.8] text-twilight">{p.summary}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-black text-clay-700">
                        읽기 <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Container>

      <ContactCta />
    </>
  );
}
