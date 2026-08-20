import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { DocHero, DocSection, BulletList, QaList, NextLinks } from '@/components/article';
import { Reveal } from '@/components/Motion';
import { CONDITIONS, conditionBySlug } from '@/lib/conditions';
import { symptomBySlug } from '@/lib/symptoms';
import { treatmentBySlug } from '@/lib/treatments-content';
import { CLINIC } from '@/lib/clinic';
import { iran } from '@/lib/korean';
import { SITE_URL, CLINIC_ID } from '@/lib/schema';

export function generateStaticParams() {
  return CONDITIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = conditionBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.name}(${c.aka[0] ?? c.name}) — ${CLINIC.shortName}`,
    description: c.definition,
    /* ★ 환자가 실제로 검색하는 다른 이름(aka)을 키워드로 넣는다. */
    keywords: [c.name, ...c.aka],
    alternates: { canonical: `/insight/condition/${c.slug}` },
    openGraph: { title: c.name, description: c.definition, type: 'article' },
  };
}

export default async function ConditionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = conditionBySlug(slug);
  if (!c) notFound();

  const symptoms = c.relatedSymptoms.map((s) => symptomBySlug(s)).filter(Boolean);
  const treatments = c.relatedTreatments.map((t) => treatmentBySlug(t)).filter(Boolean);

  return (
    <>
      <main>
        <DocHero
          eyebrow="Condition"
          title={`${iran(c.name)} 무엇인가요?`}
          answer={c.definition}
          crumbs={[
            { label: '홈', href: '/' },
            { label: '미리 알아두기', href: '/insight' },
            { label: '질환 알아보기', href: '/insight/condition' },
          ]}
        />

        <DocSection>
          <Reveal>
            <p className="t-body text-[15.5px]">{c.detail}</p>
          </Reveal>
          {c.aka.length ? (
            <Reveal delay={120}>
              <p className="mt-7 text-[13px] text-ink-2">
                흔히 부르는 이름 — {c.aka.join(' · ')}
              </p>
            </Reveal>
          ) : null}
        </DocSection>

        <DocSection title="이런 증상이 나타납니다" tone="surface">
          <BulletList items={c.signs} />
        </DocSection>

        <DocSection title="원인과 위험 요인">
          <BulletList items={c.causes} />
        </DocSection>

        {/* ★ 진행 단계 — '언제 가야 하나' 를 스스로 판단하게 해 주는 자리다. */}
        {c.stages?.length ? (
          <DocSection title="방치하면 이렇게 진행합니다" tone="surface">
            <ol className="space-y-px overflow-hidden rounded-[22px] bg-line">
              {c.stages.map((st, i) => (
                <Reveal as="li" key={st.step} delay={i * 70}>
                  <div className="grid gap-2 bg-surface p-7 md:grid-cols-[190px_minmax(0,1fr)] md:gap-8 md:p-8">
                    <p className="text-[14.5px] font-bold tracking-[-0.02em] text-brand">{st.step}</p>
                    <p className="t-body text-[14.5px]">{st.what}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </DocSection>
        ) : null}

        <DocSection title="일반적인 치료 방향">
          <Reveal>
            <p className="t-body text-[15.5px]">{c.treatment}</p>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 text-[13px] leading-[1.85] text-ink-2">
              위 내용은 표준적인 치료 방향이며, 실제 계획은 진단 결과와 개인의 구강 상태에 따라 달라집니다.
            </p>
          </Reveal>
        </DocSection>

        {c.prevention?.length ? (
          <DocSection title="예방과 관리" tone="surface">
            <BulletList items={c.prevention} />
          </DocSection>
        ) : null}

        {c.faq?.length ? (
          <DocSection title="자주 묻는 질문">
            <QaList items={c.faq} />
          </DocSection>
        ) : null}

        {(symptoms.length || treatments.length) && (
          <DocSection title="이어서 보기" tone="surface">
            <NextLinks
              items={[
                ...symptoms.map((s) => ({ label: s!.title, href: `/insight/symptom/${s!.slug}`, note: s!.short })),
                ...treatments.map((t) => ({ label: t!.name, href: `/treatment/${t!.slug}`, note: t!.summary })),
              ]}
            />
          </DocSection>
        )}
      </main>

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'MedicalWebPage',
            '@id': `${SITE_URL}/insight/condition/${c.slug}`,
            name: `${iran(c.name)} 무엇인가요?`,
            description: c.definition,
            inLanguage: 'ko-KR',
            about: {
              '@type': 'MedicalCondition',
              name: c.name,
              alternateName: c.aka,
              description: c.definition,
              signOrSymptom: c.signs.map((s) => ({ '@type': 'MedicalSignOrSymptom', name: s })),
              riskFactor: c.causes.map((s) => ({ '@type': 'MedicalRiskFactor', name: s })),
              /* ⚠️ 특정 병원의 방침이 아니라 표준 치료다 — 그래서 provider 를 달지 않는다. */
              possibleTreatment: { '@type': 'MedicalTherapy', name: c.treatment },
            },
            publisher: { '@id': CLINIC_ID },
          },
          ...(c.faq?.length
            ? [{
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: c.faq.map((f) => ({
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
              { '@type': 'ListItem', position: 2, name: '미리 알아두기', item: `${SITE_URL}/insight` },
              { '@type': 'ListItem', position: 3, name: '질환 알아보기', item: `${SITE_URL}/insight/condition` },
              { '@type': 'ListItem', position: 4, name: c.name, item: `${SITE_URL}/insight/condition/${c.slug}` },
            ],
          },
        ]}
      />
    </>
  );
}
