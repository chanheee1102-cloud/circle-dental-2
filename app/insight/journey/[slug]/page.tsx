import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { DocHero, DocSection, BulletList, NextLinks } from '@/components/article';
import { Reveal } from '@/components/Motion';
import { JOURNEYS, journeyBySlug } from '@/lib/insight';
import { treatmentBySlug } from '@/lib/treatments-content';
import { CLINIC } from '@/lib/clinic';
import { SITE_URL, CLINIC_ID } from '@/lib/schema';

export function generateStaticParams() {
  return JOURNEYS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const j = journeyBySlug(slug);
  if (!j) return {};
  return {
    title: `${j.question} — ${CLINIC.shortName}`,
    description: j.answer.slice(0, 155),
    alternates: { canonical: `/insight/journey/${j.slug}` },
    openGraph: { title: j.question, description: j.answer.slice(0, 155), type: 'article' },
  };
}

export default async function JourneyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const j = journeyBySlug(slug);
  if (!j) notFound();
  const t = treatmentBySlug(j.treatment);

  return (
    <>
      <main>
        <DocHero
          eyebrow="Journey"
          title={j.question}
          answer={j.answer}
          crumbs={[
            { label: '홈', href: '/' },
            { label: '미리 알아두기', href: '/insight' },
            { label: '치료 여정', href: '/insight/journey' },
          ]}
        />

        <DocSection>
          <Reveal>
            <div className="flex flex-wrap gap-x-14 gap-y-5 border-b border-line pb-9">
              <div>
                <p className="text-[13px] tracking-[0.14em] text-ink-2">내원 횟수</p>
                <p className="stat mt-2 text-[30px] text-brand">{j.visits}</p>
              </div>
              <div>
                <p className="text-[13px] tracking-[0.14em] text-ink-2">전체 기간</p>
                <p className="stat mt-2 text-[30px] text-brand">{j.duration}</p>
              </div>
            </div>
          </Reveal>
        </DocSection>

        <DocSection title="진행 단계" tone="surface">
          <ol className="space-y-px overflow-hidden rounded-[22px] bg-line">
            {j.steps.map((st, i) => (
              <Reveal as="li" key={st.label} delay={i * 70}>
                <div className="grid gap-3 bg-surface p-7 md:grid-cols-[56px_minmax(0,200px)_minmax(0,1fr)] md:items-baseline md:gap-8 md:p-8">
                  <span className="display text-[24px] leading-none text-brand/35">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[16px] font-bold tracking-[-0.025em] text-ink">{st.label}</p>
                  <p className="t-body text-[15.5px]">{st.what}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </DocSection>

        {/* ★ 기대치를 미리 맞추는 자리 — '왜 나는 더 오래 걸리나' 를 여기서 답한다. */}
        {j.variables?.length ? (
          <DocSection title="기간이 늘어나는 경우">
            <BulletList items={j.variables} />
            <p className="mt-8 text-[14px] leading-[1.85] text-ink-2">
              위 횟수와 기간은 일반적인 경우이며, 구강 상태에 따라 달라집니다. 정확한 계획은 진단 후에 안내드립니다.
            </p>
          </DocSection>
        ) : null}

        {t ? (
          <DocSection tone="surface">
            <NextLinks items={[{ label: t.name, href: `/treatment/${t.slug}`, note: t.summary }]} />
          </DocSection>
        ) : null}
      </main>

      <JsonLd
        data={[
          /* ★ HowTo — '몇 번 오나요' 류 질의에 단계가 그대로 인용된다. */
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            '@id': `${SITE_URL}/insight/journey/${j.slug}`,
            name: j.question,
            description: j.answer,
            totalTime: j.duration,
            inLanguage: 'ko-KR',
            step: j.steps.map((s, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: s.label,
              text: s.what,
            })),
            publisher: { '@id': CLINIC_ID },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: j.question, acceptedAnswer: { '@type': 'Answer', text: j.answer } },
            ],
          },
        ]}
      />
    </>
  );
}
