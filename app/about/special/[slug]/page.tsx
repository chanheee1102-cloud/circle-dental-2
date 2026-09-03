import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SPECIALS, specialBySlug } from '@/lib/specials';
import { CLINIC } from '@/lib/clinic';
import { Container, MedicalNotice, ContactCta, Sentences } from '@/components/ui';
import { AboutHero } from '@/components/AboutHero';
import { StrengthIcon } from '@/components/StrengthIcons';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, articleSchema, og, imageObjectSchema } from '@/lib/seo';
import { KeyPoints, TableOfContents, ArticleMeta, headingId, charCount } from '@/components/article';
import { imageMeta } from '@/lib/imageSize';

export function generateStaticParams() {
  return SPECIALS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = specialBySlug(slug);
  if (!s) return {};
  /*
   * ★ 설명이 짧으면 본문의 첫 소제목을 이어 붙인다 (2026-08-14 실측).
   *   body 한 줄만 쓰면 항목에 따라 42자밖에 안 돼 검색 결과에서 한 줄로 끝난다
   *   (실측: digital-diagnosis 42자). 45자 미만은 스니펫으로서 제 역할을 못 한다.
   *   ⚠️ 새 문장을 짓지 않는다 — 본문에 이미 있는 context 의 소제목을 그대로 잇는다.
   *
   * ★ 기준을 60 → 80 으로 올렸다 (2026-08-18 전수 재측정).
   *   60 이면 hygiene 이 **정확히 60자**라 아슬아슬하게 통과해 그대로 짧게 나갔다.
   *   본문 길이(42·52·60·79·92)를 보면 80 이 다섯 항목을 자연스럽게 가른다 —
   *   79자 이하는 이어 붙이고, 92자짜리 medical-team 만 그대로 둔다.
   */
  const description =
    s.body.length >= 80 ? s.body : `${s.body}. ${s.context.map((c) => c.h).slice(0, 2).join(', ')} 등을 정리했습니다.`;
  return {
    title: s.title,
    description,
    alternates: { canonical: `/about/special/${s.slug}` },
    openGraph: og({
      title: `${s.title} | ${CLINIC.name}`,
      description,
      path: `/about/special/${s.slug}`,
      images: [{ url: s.image, alt: s.alt }],
    }),
  };
}

/**
 * 특별함 상세.
 *
 * ★ 사진을 크게 쓰는 자리다. 기존 홈페이지에서는 슬라이드라 넘겨야 보였고
 *   각각의 URL 도 없었다. 페이지로 열면 색인되고, 사진도 잘리지 않는다.
 * ★ 원문(title·body)과 일반 지식 확장(context·faq)을 화면에서도 구분해 배치한다 —
 *   위쪽은 병원이 하는 약속, 아래쪽은 그 용어가 무엇인지에 대한 설명이다.
 */
export default async function SpecialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = specialBySlug(slug);
  if (!s) notFound();

  const trail = [
    { name: '홈', path: '/' },
    { name: '병원 소개', path: '/about' },
    { name: s.title, path: `/about/special/${s.slug}` },
  ];

  const others = SPECIALS.filter((o) => o.slug !== s.slug);

  const SPATH = `/about/special/${s.slug}`;
  const heroImage = imageMeta(s.image, s.alt);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: s.title,
            description: s.body,
            path: SPATH,
            image: heroImage,
          }),
          heroImage ? imageObjectSchema({ path: SPATH, ...heroImage }) : null,
          articleSchema({
            path: SPATH,
            title: s.title,
            description: s.body,
            wordCount: charCount(s.body, s.context.map((c) => c.h + c.p).join('')),
            keywords: [s.title, ...s.context.map((c) => c.h)],
          }),
          faqSchema(s.faq, SPATH),
        ]}
      />

      <article>
        {/*
          ⚠️ 제목을 아래 격자에서 다시 그리지 말 것 (2026-08-28) — 머리는 PageHero 가 전담한다.
          ★ 아이콘·번호·사진은 격자에 남긴다 — 그것은 머리말이 아니라 내용이다.
        */}
        {/* ⚠️ 눈썹을 넘기지 말 것 — 사진 위 작은 글자는 밝은 사진에서 먼저 깨진다. */}
        <AboutHero trail={trail} photo="sterile" title={s.title} />
        {/* 히어로 — 사진을 크게 */}
        <Container className="py-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <div className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-brand-200/70 bg-parchment text-clay-700"
                >
                  <StrengthIcon name={s.key} />
                </span>
                <div>
                  <p className="text-[13.5px] font-black tracking-[0.06em] text-clay-700">
                    {s.eyebrow}
                  </p>
                  <p className="text-[26px] font-black leading-none text-ink-muted">{s.no}</p>
                </div>
              </div>


              {/* 원문 그대로 — AI 인용 대상 */}
              <p className="mt-7 max-w-[58ch] text-[18px] leading-[1.9] text-ink-soft"><Sentences text={s.body} /></p>

              <div className="mt-8">
                <ArticleMeta path={SPATH} />
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-brand-200 lg:aspect-[16/11]">
              <Image
                src={s.image}
                alt={s.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>

        {/* 용어 풀이 — 일반적인 치과 지식 */}
        <section className="border-y border-brand-200/80 bg-parchment py-12 sm:py-16 lg:py-20">
          <Container>
            <p className="eyebrow-chip text-clay-700">함께 알아 두시면 좋은 내용</p>
            <div className="mb-10 max-w-[70ch]">
              {/* ⚠️ 'h — 본문 70자…' 로 되돌리지 말 것 — 대시로 이어 붙인 조각을 문장 중간에서 자르는 요약이었다. 질문형 소제목만 든다. */}
              <KeyPoints items={[s.body, ...s.context.slice(0, 2).map((c) => c.h)]} />
            </div>
            <div className="mb-10 max-w-[70ch]">
              <TableOfContents items={[...s.context.map((c) => c.h), '자주 묻는 질문']} />
            </div>
            <div className="mt-8 divide-y divide-wine-line">
              {s.context.map((c) => (
                <div key={c.h} className="py-7 first:pt-0 last:pb-0">
                  <h2 id={headingId(c.h)} className="display-sm scroll-mt-28 text-[19px] text-ink sm:text-[21px]">
                    {c.h}
                  </h2>
                  <p className="mt-3.5 max-w-[70ch] text-[17px] leading-[1.85] text-ink-soft"><Sentences text={c.p} /></p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        <Container className="py-12 sm:py-16 lg:py-20">
          <h2 id={headingId('자주 묻는 질문')} className="scroll-mt-28 display-sm text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
            자주 묻는 질문
          </h2>
          <div className="mt-8 divide-y divide-wine-line border-t border-wine-line">
            {s.faq.map((f) => (
              <article key={f.q} className="py-6">
                <h3 className="text-[18px] font-black leading-snug text-ink">{f.q}</h3>
                <p className="mt-3 max-w-[68ch] text-[16.5px] leading-[1.85] text-ink-soft"><Sentences text={f.a} /></p>
              </article>
            ))}
          </div>
          <MedicalNotice />
        </Container>

        {/* 다른 특별함 */}
        <section className="light-band border-t border-wine-line py-12 sm:py-16 lg:py-20">
          <Container>
            <h2 className="display-sm text-[clamp(22px,2.4vw,28px)] leading-[1.3] text-ink">동그라미치과의 특별함</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  href={`/about/special/${o.slug}`}
                  className="group overflow-hidden rounded-2xl border border-brand-200/70 bg-parchment transition-colors hover:border-brand-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={o.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="px-5 py-4 text-[15.5px] font-black text-ink transition-colors group-hover:text-clay-700">
                    {o.title}
                  </p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      </article>

      <ContactCta />
    </>
  );
}
