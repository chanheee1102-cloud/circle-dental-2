import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { DocHero, DocSection, BulletList, QaList, NextLinks } from '@/components/article';
import { Reveal } from '@/components/Motion';
import { TREATMENTS, treatmentBySlug } from '@/lib/treatments-content';
import { symptomBySlug } from '@/lib/symptoms';
import { journeyForTreatment } from '@/lib/insight';
import { CLINIC } from '@/lib/clinic';
import { SITE_URL, CLINIC_ID } from '@/lib/schema';

export function generateStaticParams() {
  return TREATMENTS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  if (!t) return {};
  return {
    title: `${t.name} — ${CLINIC.shortName}`,
    description: t.summary,
    alternates: { canonical: `/treatment/${t.slug}` },
    openGraph: { title: t.name, description: t.summary, type: 'article' },
  };
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  if (!t) notFound();

  const symptoms = t.relatedSymptoms.map((s) => symptomBySlug(s)).filter(Boolean);
  const journey = journeyForTreatment(t.slug);

  return (
    <>
      <main>
        <DocHero
          eyebrow="Treatment"
          title={t.name}
          answer={t.summary}
          crumbs={[
            { label: '홈', href: '/' },
            { label: '치료 알아보기', href: '/treatment' },
          ]}
        />

        <DocSection>
          <Reveal>
            <p className="t-body text-[15.5px]">{t.intro}</p>
          </Reveal>
        </DocSection>

        {t.whoFor?.length ? (
          <DocSection title="이런 경우에 해당합니다" tone="surface">
            <BulletList items={t.whoFor} />
          </DocSection>
        ) : null}

        {t.qa?.length ? (
          <DocSection title="자주 묻는 질문">
            <QaList items={t.qa} />
          </DocSection>
        ) : null}

        {journey ? (
          <DocSection title="치료는 몇 번 와야 하나요?" tone="surface">
            <Reveal>
              <div className="rounded-[22px] bg-surface p-8 md:p-10">
                <div className="flex flex-wrap gap-x-12 gap-y-4">
                  <div>
                    <p className="text-[12px] tracking-[0.14em] text-ink-2">내원 횟수</p>
                    <p className="stat mt-2 text-[25px] text-brand">{journey.visits}</p>
                  </div>
                  <div>
                    <p className="text-[12px] tracking-[0.14em] text-ink-2">전체 기간</p>
                    <p className="stat mt-2 text-[25px] text-brand">{journey.duration}</p>
                  </div>
                </div>
                <p className="t-body mt-7 text-[14.5px]">{journey.answer}</p>
                <a
                  href={`/insight/journey/${journey.slug}`}
                  className="mt-7 inline-flex text-[13px] font-bold text-brand"
                >
                  단계별로 자세히 보기 →
                </a>
              </div>
            </Reveal>
          </DocSection>
        ) : null}

        {symptoms.length ? (
          <DocSection title="이 치료와 관련된 증상">
            <NextLinks
              items={symptoms.map((s) => ({ label: s!.title, href: `/insight/symptom/${s!.slug}`, note: s!.short }))}
            />
          </DocSection>
        ) : null}

        {/* ⚠️ 의료법 제56조 — 효과 설명 뒤에는 반드시 한계·부작용 고지가 따라온다. */}
        <DocSection tone="surface">
          <Reveal>
            <div className="rounded-[22px] border border-line bg-paper p-8">
              <p className="text-[12.5px] font-bold tracking-[0.1em] text-ink-2">치료 전 확인해 주세요</p>
              <p className="mt-3 text-[13.5px] leading-[1.9] text-ink-2">
                위 내용은 일반적인 안내이며, 실제 치료 방법·기간·예후는 개인의 구강 상태와 전신 건강에 따라 달라집니다.
                모든 의료 행위에는 부작용이 발생할 수 있으므로 반드시 의료진의 진단과 상담을 거쳐 결정하시기 바랍니다.
              </p>
            </div>
          </Reveal>
        </DocSection>
      </main>

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'MedicalProcedure',
            '@id': `${SITE_URL}/treatment/${t.slug}`,
            name: t.name,
            description: t.summary,
            procedureType: { '@type': 'MedicalProcedureType', name: t.procedureType },
            howPerformed: t.intro,
            bodyLocation: '구강',
            provider: { '@id': CLINIC_ID },
          },
          ...(t.qa?.length
            ? [{
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: t.qa.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              }]
            : []),
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: '치료 알아보기', item: `${SITE_URL}/treatment` },
              { '@type': 'ListItem', position: 3, name: t.name, item: `${SITE_URL}/treatment/${t.slug}` },
            ],
          },
        ]}
      />
    </>
  );
}
