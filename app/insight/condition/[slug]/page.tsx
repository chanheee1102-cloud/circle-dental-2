import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CONDITIONS, conditionBySlug } from '@/lib/conditions';
import { symptomBySlug } from '@/lib/symptoms';
import { treatmentBySlug } from '@/lib/treatments';
import { Container, MedicalNotice, ContactCta, Sentences, PageHero } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, articleSchema, abs , og , imageObjectSchema, pageImage} from '@/lib/seo';
import { KeyPoints, TableOfContents, ArticleMeta, References, charCount, headingId } from '@/components/article';
import { REFS_CONDITION } from '@/lib/references';

export function generateStaticParams() {
  return CONDITIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = conditionBySlug(slug);
  if (!c) return {};
  /*
   * ★ 설명은 정의 한 줄에 **주요 증상**을 이어 붙인다 (2026-08-14 실측 후).
   *   정의만 쓰면 41~67자라 검색 결과에서 한 줄로 끝난다. 검색하는 사람은 병명보다
   *   증상을 들고 오기 때문에, 증상 낱말이 설명에 들어 있어야 자기 이야기로 읽는다.
   *   ⚠️ 새 문장을 짓지 않는다 — 본문에 이미 있는 signs 를 그대로 잇는다.
   *      여기서 지어낸 한 줄은 검색 결과에 그대로 나가는 의료 정보가 된다.
   */
  const description = c.signs.length
    ? `${c.definition} 주로 ${c.signs.slice(0, 3).join(', ')} 증상으로 나타납니다.`
    : c.definition;
  return {
    // 별칭을 제목에 넣는다 — '치주염' 보다 '풍치' 로 검색하는 사람이 많다.
    title: `${c.name} (${c.aka[0]})`,
    description,
    keywords: [c.name, ...c.aka],
    alternates: { canonical: `/insight/condition/${c.slug}` },
    openGraph: og({
      title: `${c.name} — ${c.aka[0]}`,
      description,
      path: `/insight/condition/${c.slug}`,
    }),
  };
}

export default async function ConditionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = conditionBySlug(slug);
  if (!c) notFound();

  const trail = [
    { name: '홈', path: '/' },
    { name: '미리 알아두기', path: '/insight' },
    { name: '질환 사전', path: '/insight/condition' },
    { name: c.name, path: `/insight/condition/${c.slug}` },
  ];

  const symptoms = c.relatedSymptoms.map(symptomBySlug).filter(Boolean);
  const treatments = c.relatedTreatments.map(treatmentBySlug).filter(Boolean);

  /**
   * MedicalCondition 스키마 — 질환 페이지의 핵심이다.
   * name/alternateName 을 함께 주면 '풍치' 같은 구어 질의도 이 문서로 연결된다.
   */
  const conditionSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name: c.name,
    alternateName: c.aka,
    description: c.definition,
    url: abs(`/insight/condition/${c.slug}`),
    signOrSymptom: c.signs.map((s) => ({ '@type': 'MedicalSignOrSymptom', name: s })),
    riskFactor: c.causes.map((s) => ({ '@type': 'MedicalRiskFactor', name: s })),
    possibleTreatment: treatments.map((t) => ({ '@type': 'MedicalProcedure', name: t!.name })),
  };

  const CPATH = `/insight/condition/${c.slug}`;
  /** 대표 이미지 — 사진이 없는 문서는 그 페이지 전용 공유 카드를 쓴다(lib/seo.ts pageImage 주석). */
  const docImage = pageImage(undefined, `${c.name}(${c.aka[0]}) 설명 — 동그라미치과의원`);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: `${c.name} (${c.aka[0]})`,
            description: c.definition,
            path: CPATH,
            about: { type: 'MedicalCondition', name: c.name },
            image: docImage,
          }),
          imageObjectSchema({ path: CPATH, ...docImage }),
          conditionSchema,
          articleSchema({
            path: `/insight/condition/${c.slug}`,
            title: `${c.name} (${c.aka[0]}) — 증상·원인·치료`,
            description: c.definition,
            wordCount: charCount(c.definition, c.signs.join(''), c.causes.join('')),
            keywords: [c.name, ...c.aka],
            hasImage: true,
          }),
          faqSchema(
            [{ q: `${c.name}이란 무엇인가요?`, a: c.definition }, ...c.faq],
            `/insight/condition/${c.slug}`,
          ),
        ]}
      />

      <article>
        {/*
          ⚠️ 머리를 다시 손으로 그리지 말 것 — PageHero 하나가 전담한다(2026-08-28).
          ⚠️ 바로 아래 '즉답 블록' 을 히어로 설명글로 옮기지 말 것. 같은 문장이 두 번 나오면
             인용 가치가 떨어진다. 답은 본문 첫 자리에 한 번만 둔다.
        */}
        <PageHero trail={trail} photo="consult" eyebrow="질환" title={c.name} />
        <Container className="py-16 lg:py-20">
          <p className="mt-3 text-[16.5px] font-semibold text-ink-muted">{c.aka.join(' · ')}</p>

          <div className="mt-8 max-w-[70ch]">
            <ArticleMeta path={`/insight/condition/${c.slug}`} />
          </div>

          {/* 요약 — 정의 한 줄 + 주요 증상 + 원인. 전부 아래 본문에 그대로 있는 값이다. */}
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <KeyPoints
              items={[
                c.definition,
                `주요 증상: ${c.signs.slice(0, 3).join(', ')}`,
                `주요 원인: ${c.causes.slice(0, 3).join(', ')}`,
              ]}
            />
            <TableOfContents
              items={[
                `${c.name}이란 무엇인가요?`,
                '이런 증상이 나타납니다',
                '원인과 위험 요인',
                '방치하면 이렇게 진행합니다',
                '일반적인 치료 방향',
                '자주 묻는 질문',
              ]}
            />
          </div>

          {/*
            ★★ 정의 블록 — AI 가 인용하는 자리. 한 문장으로 끝난다 ★★
              ⚠️ 헤딩을 반드시 화면에 보이게 둔다. 전에는 FAQPage 마크업에만
                 "${c.name}이란 무엇인가요?" 를 넣고 화면에는 정의만 있었다.
                 화면에 없는 문답을 마크업하는 것은 구조화 데이터 정책 위반이다
                 (실측: 질환 상세 15개 페이지에서 각 1건씩 잡혔다).
                 질문 자체가 실제 검색어이기도 해서, 보이게 두는 편이 원래 맞다.
          */}
          <h2
            id={headingId(`${c.name}이란 무엇인가요`)}
            className="mt-10 scroll-mt-28 display-sm text-[clamp(22px,2.4vw,28px)] leading-[1.3] text-ink"
          >
            {c.name}이란 무엇인가요?
          </h2>
          <div className="mt-4 max-w-[64ch] rounded-2xl border border-brand-200/70 bg-parchment p-6">
            <p className="text-[17.5px] leading-[1.85] text-ink"><Sentences text={c.definition} /></p>
          </div>

          <p className="mt-7 max-w-[66ch] text-[17px] leading-[1.85] text-ink-soft"><Sentences text={c.detail} /></p>
        </Container>

        {/* 증상 · 원인 */}
        <section className="border-y border-brand-200/80 bg-parchment py-16 lg:py-20">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 id={headingId('이런 증상이 나타납니다')} className="scroll-mt-28 display-sm text-[clamp(22px,2.4vw,28px)] leading-[1.3] text-ink">
                  이런 증상이 나타납니다
                </h2>
                <ul className="mt-6 space-y-3">
                  {c.signs.map((s) => (
                    <li key={s} className="flex gap-3 text-[16.5px] leading-relaxed text-ink-soft">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-700"
                      />
                      <span><Sentences text={s} /></span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 id={headingId('원인과 위험 요인')} className="scroll-mt-28 display-sm text-[clamp(22px,2.4vw,28px)] leading-[1.3] text-ink">
                  원인과 위험 요인
                </h2>
                <ul className="mt-6 space-y-3">
                  {c.causes.map((s) => (
                    <li key={s} className="flex gap-3 text-[16.5px] leading-relaxed text-ink-soft">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay-700"
                      />
                      <span><Sentences text={s} /></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* 진행 단계 — '언제 가야 하나'를 스스로 가늠하게 해 준다. */}
        <Container className="py-16 lg:py-20">
          <h2 id={headingId('방치하면 이렇게 진행합니다')} className="scroll-mt-28 display-sm text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
            방치하면 이렇게 진행합니다
          </h2>
          <ol className="mt-10 divide-y divide-wine-line border-y border-wine-line">
            {c.stages.map((st, i) => (
              <li key={st.step} className="grid gap-3 py-7 sm:grid-cols-[3em_minmax(0,1fr)] sm:gap-6">
                <span aria-hidden className="text-[14px] font-black tracking-[0.04em] text-clay-700 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-[19px] leading-[1.35] font-black tracking-[-0.02em] text-ink">{st.step}</h3>
                  <p className="mt-2 max-w-[32em] text-[16.5px] leading-[1.85] text-twilight"><Sentences text={st.what} /></p>
                </div>
              </li>
            ))}
          </ol>
        </Container>

        {/* 치료 · 예방 */}
        <section className="light-band border-y border-wine-line py-16 lg:py-20">
          <Container>
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 id={headingId('일반적인 치료 방향')} className="scroll-mt-28 display-sm text-[clamp(22px,2.4vw,28px)] leading-[1.3] text-ink">
                  일반적인 치료 방향
                </h2>
                <p className="mt-5 max-w-[62ch] text-[16.5px] leading-[1.85] text-ink-soft">
                  {c.treatment}
                </p>
              </div>
              <div>
                <h2 id={headingId('예방과 관리')} className="scroll-mt-28 display-sm text-[clamp(22px,2.4vw,28px)] leading-[1.3] text-ink">
                  예방과 관리
                </h2>
                <ul className="mt-5 space-y-3">
                  {c.prevention.map((p) => (
                    <li key={p} className="flex gap-3 text-[16px] leading-relaxed text-ink-soft">
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-clay-600/50 text-[13.5px] text-clay-700"
                      >
                        ✓
                      </span>
                      <span><Sentences text={p} /></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <Container className="py-16 lg:py-20">
          <h2 id={headingId('자주 묻는 질문')} className="scroll-mt-28 display-sm text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
            자주 묻는 질문
          </h2>
          <div className="mt-8 divide-y divide-wine-line border-t border-wine-line">
            {c.faq.map((f) => (
              <article key={f.q} className="py-6">
                <h3 className="text-[18px] font-black leading-snug text-ink">{f.q}</h3>
                <p className="mt-3 max-w-[68ch] text-[16.5px] leading-[1.85] text-ink-soft"><Sentences text={f.a} /></p>
              </article>
            ))}
          </div>
        </Container>

        {/* 연결 */}
        {(symptoms.length > 0 || treatments.length > 0) && (
          <section className="border-t border-brand-200/80 bg-parchment py-16 lg:py-20">
            <Container>
              <div className="grid gap-10 lg:grid-cols-2">
                {symptoms.length > 0 && (
                  <div>
                    <h2 className="display-sm text-[clamp(22px,2.4vw,28px)] leading-[1.3] text-ink">관련 증상</h2>
                    <div className="mt-5 space-y-2.5">
                      {symptoms.map((s) => (
                        <Link
                          key={s!.slug}
                          href={`/insight/symptom/${s!.slug}`}
                          className="group flex items-center justify-between gap-3 rounded-2xl border border-brand-200/70 px-5 py-3.5 transition-colors hover:border-brand-300 hover:bg-parchment"
                        >
                          <span className="text-[15.5px] font-bold text-ink transition-colors group-hover:text-clay-700">
                            {s!.title}
                          </span>
                          <span aria-hidden className="text-clay-700">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {treatments.length > 0 && (
                  <div>
                    <h2 className="display-sm text-[clamp(22px,2.4vw,28px)] leading-[1.3] text-ink">관련 진료</h2>
                    <div className="mt-5 space-y-2.5">
                      {treatments.map((t) => (
                        <Link
                          key={t!.slug}
                          href={`/treatment/${t!.slug}`}
                          className="group flex items-center justify-between gap-3 rounded-2xl border border-brand-200/70 px-5 py-3.5 transition-colors hover:border-brand-300 hover:bg-parchment"
                        >
                          <span className="text-[15.5px] font-bold text-ink transition-colors group-hover:text-clay-700">
                            {t!.name}
                          </span>
                          <span aria-hidden className="text-clay-700">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Container>
          </section>
        )}

        <Container>
          <div className="max-w-[70ch]">
            <References items={REFS_CONDITION} />
          </div>
          <MedicalNotice />
        </Container>
      </article>

      <ContactCta />
    </>
  );
}
