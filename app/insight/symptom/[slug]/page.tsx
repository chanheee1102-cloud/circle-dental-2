import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { DocHero, DocSection, NamedList, BulletList, RedFlags, NextLinks } from '@/components/article';
import { SYMPTOMS, symptomBySlug } from '@/lib/symptoms';
import { conditionsForSymptom } from '@/lib/conditions';
import { TREATMENTS, treatmentBySlug } from '@/lib/treatments-content';
import { CLINIC } from '@/lib/clinic';
import { SITE_URL, CLINIC_ID } from '@/lib/schema';

export function generateStaticParams() {
  return SYMPTOMS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = symptomBySlug(slug);
  if (!s) return {};
  return {
    title: `${s.title} — ${CLINIC.shortName}`,
    /* ⚠️ description 은 직답 앞부분을 그대로 쓴다. 따로 쓰면 본문과 어긋난다. */
    description: s.answer.slice(0, 155),
    alternates: { canonical: `/insight/symptom/${s.slug}` },
    openGraph: { title: s.title, description: s.answer.slice(0, 155), type: 'article' },
  };
}

export default async function SymptomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = symptomBySlug(slug);
  if (!s) notFound();

  const related = s.relatedTreatments.map((t) => treatmentBySlug(t)).filter(Boolean);
  const conditions = conditionsForSymptom(s.slug);

  return (
    <>
      <main>
        <DocHero
          eyebrow="Symptom"
          title={s.title}
          answer={s.answer}
          crumbs={[
            { label: '홈', href: '/' },
            { label: '미리 알아두기', href: '/insight' },
            { label: '증상으로 찾기', href: '/insight/symptom' },
          ]}
        />

        {/* ⚠️ 위험 신호를 원인 설명보다 위에 둔다 — 응급 상황에서 스크롤을 더 시키면 안 된다. */}
        {s.urgent?.length ? (
          <DocSection tone="surface">
            <RedFlags items={s.urgent} />
          </DocSection>
        ) : null}

        {s.causes?.length ? (
          <DocSection title="왜 이런 증상이 생기나요?">
            <NamedList items={[...s.causes]} />
          </DocSection>
        ) : null}

        {s.selfCare?.length ? (
          <DocSection title="지금 집에서 할 수 있는 것" tone="surface">
            <BulletList items={s.selfCare} />
            <p className="mt-8 text-[13px] leading-[1.85] text-ink-2">
              아래 방법은 통증을 잠시 줄이는 것이지 원인을 없애지는 못합니다. 증상이 반복되면 원인을 확인하는 검사가
              필요합니다.
            </p>
          </DocSection>
        ) : null}

        {conditions.length ? (
          <DocSection title="이 증상과 관련된 질환">
            <NextLinks
              items={conditions.map((c) => ({
                label: c.name,
                href: `/insight/condition/${c.slug}`,
                note: c.definition,
              }))}
            />
          </DocSection>
        ) : null}

        {related.length ? (
          <DocSection title="관련 치료" tone="surface">
            <NextLinks
              items={related.map((t) => ({ label: t!.name, href: `/treatment/${t!.slug}`, note: t!.summary }))}
            />
          </DocSection>
        ) : null}

        <section className="bg-ink py-20 text-white md:py-24">
          <div className="shell flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="t-h3 text-[22px] font-bold tracking-[-0.03em] text-white md:text-[27px]">
                증상이 계속되면 원인부터 확인하세요
              </p>
              <p className="mt-3 text-[14px] text-white/60">
                {CLINIC.nearestStation} · 화·목 야간진료 20:30까지
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={CLINIC.phoneHref} className="rounded-full bg-brand px-7 py-3.5 text-[14px] font-bold text-white">
                {CLINIC.phone}
              </a>
              <a
                href={CLINIC.booking.naver}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/35 px-7 py-3.5 text-[14px] font-bold text-white"
              >
                네이버 예약
              </a>
            </div>
          </div>
        </section>
      </main>

      {/*
        ★ MedicalWebPage + MedicalSignOrSymptom.
        ⚠️ 자가관리(selfCare)를 치료법으로 표시하지 않는다 — 'possibleTreatment' 에 넣으면
           집에서 하는 임시 조치가 치료로 인용된다.
      */}
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            '@id': `${SITE_URL}/insight/symptom/${s.slug}`,
            name: s.title,
            description: s.answer,
            inLanguage: 'ko-KR',
            about: {
              '@type': 'MedicalSignOrSymptom',
              name: s.short,
              possibleCause: s.causes.map((c) => ({ '@type': 'MedicalCause', name: c.name, description: c.detail })),
            },
            publisher: { '@id': CLINIC_ID },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: '미리 알아두기', item: `${SITE_URL}/insight` },
              { '@type': 'ListItem', position: 3, name: '증상으로 찾기', item: `${SITE_URL}/insight/symptom` },
              { '@type': 'ListItem', position: 4, name: s.title, item: `${SITE_URL}/insight/symptom/${s.slug}` },
            ],
          },
        ]}
      />
    </>
  );
}
