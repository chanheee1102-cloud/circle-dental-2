import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SYMPTOM_GROUPS, groupBySlug, symptomsOfGroup } from '@/lib/symptoms';
import { treatmentBySlug } from '@/lib/treatments';
import { conditionsForSymptom } from '@/lib/conditions';
import { CLINIC } from '@/lib/clinic';
import { Container, MedicalNotice, ContactCta, Sentences, PageHero } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, articleSchema, og, imageObjectSchema, pageImage,
  alt,
} from '@/lib/seo';
import { TableOfContents, ArticleMeta, References, charCount } from '@/components/article';
import { REFS_CONDITION } from '@/lib/references';

/**
 * 증상 묶음쪽 — 증상 26개를 7쪽으로 합친 결과 (2026-09-07 오너 지시).
 *
 * ★★ 이 쪽이 옛 상세쪽 26개의 자리를 대신한다 ★★
 *   합치면서 **글은 하나도 버리지 않았다.** 한 줄 답 · 응급 신호 · 원인 · 스스로 할 수 있는 것 ·
 *   이어지는 질환과 치료가 증상마다 그대로 들어온다. 줄어든 것은 26번 똑같이 반복되던
 *   **틀 문장**뿐이다("아래는 이 증상에서 흔히 확인되는 원인들입니다…" 같은 안내 문구는
 *   묶음 머리에 한 번만 둔다).
 *
 * ⚠️⚠️ <section id={s.slug}> 의 id 를 바꾸지 말 것 ⚠️⚠️
 *   next.config.ts 의 301 이 옛 주소 /insight/symptom/toothache-night 를
 *   /insight/symptom/pain#toothache-night 로 보낸다. id 가 바뀌면 넘어온 사람이
 *   쪽 맨 위에 떨어져, 무엇을 찾아 왔는지 알 수 없게 된다.
 * ⚠️ <h2> 문장도 환자가 말하는 그대로 유지할 것 — 검색 질의와 글자가 맞아야 집힌다.
 *    "밤에 이가 욱신거려서 잠을 못 자요" 를 "야간 통증" 으로 줄이면 그 순간 안 걸린다.
 * ⚠️ FAQPage 스키마에 묶음 안 증상을 **전부** 싣는다. 주소가 하나로 줄었으니,
 *    질문이 여럿이라는 것을 기계에 알려 줄 방법이 이것뿐이다.
 */
export function generateStaticParams() {
  return SYMPTOM_GROUPS.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: string }>;
}): Promise<Metadata> {
  const { group } = await params;
  const g = groupBySlug(group);
  if (!g) return {};
  const list = symptomsOfGroup(g);
  /*
   * 설명에 묶음 안 증상 제목을 이어 붙인다 — 검색 결과 조각에서 '내가 찾던 그것' 이 보여야 한다.
   * ⚠️ 머리글 첫 문장만 쓰면 짧은 쪽이 생긴다(kids 64자, 2026-09-07 실측). 제목을 다 붙이고
   *    155자에서 자르되, **낱말 중간에서 자르지 않는다** — 잘린 낱말은 조각에서 지저분하다.
   */
  const raw = `${g.lead} ${list.map((s) => s.title).join(' · ')}`;
  const description = raw.length <= 155 ? raw : raw.slice(0, raw.lastIndexOf(' ', 155));
  return {
    title: g.title,
    description,
    alternates: alt(`/insight/symptom/${g.slug}`),
    openGraph: og({ title: g.title, description, path: `/insight/symptom/${g.slug}` }),
  };
}

export default async function SymptomGroupPage({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  const { group } = await params;
  const g = groupBySlug(group);
  if (!g) notFound();

  const list = symptomsOfGroup(g);
  const GPATH = `/insight/symptom/${g.slug}`;
  const trail = [
    { name: '홈', path: '/' },
    { name: '미리 알아두기', path: '/insight' },
    { name: '증상으로 찾기', path: '/insight/symptom' },
    { name: g.short, path: GPATH },
  ];
  const docImage = pageImage(undefined, `${g.title} — 동그라미치과의원 설명`);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          medicalWebPageSchema({
            title: g.title,
            description: g.lead,
            path: GPATH,
            about: { type: 'MedicalCondition', name: g.short },
            image: docImage,
          }),
          imageObjectSchema({ path: GPATH, ...docImage }),
          articleSchema({
            path: GPATH,
            title: g.title,
            description: g.lead,
            wordCount: charCount(g.lead, list.map((s) => s.answer + s.causes.map((c) => c.name + c.detail).join('')).join('')),
            keywords: [g.short, ...list.map((s) => s.short)],
            hasImage: true,
          }),
          /* ⚠️ 묶음 안 증상 전부. 하나만 실으면 나머지는 기계에 안 보인다. */
          faqSchema(list.map((s) => ({ q: s.title, a: s.answer })), GPATH),
        ]}
      />

      <article>
        <PageHero trail={trail} photo="room" eyebrow="증상" title={g.title} />

        <Container className="py-12 sm:py-16 lg:py-20">
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-brand-200/70 bg-parchment p-7">
              <p className="text-[13px] font-black tracking-[0.14em] text-clay-600">먼저 읽어 주세요</p>
              <p className="mt-4 text-[18px] leading-[1.85] text-ink">
                <Sentences text={g.lead} />
              </p>
            </div>
            <div className="lg:sticky lg:top-28">
              {/*
                ⚠️ 앵커는 증상 slug 다 — 헤딩 글자로 만들면 301 이 보내는 조각과 어긋난다.
              */}
              <TableOfContents items={list.map((s) => ({ label: s.title, href: `#${s.slug}` }))} />
            </div>
          </div>

          <div className="mt-8 max-w-[70ch]">
            <ArticleMeta path={GPATH} />
          </div>

          {/*
            ★ 26번 반복되던 안내 문구 둘을 여기 한 번만 둔다.
              전에는 증상마다 "아래는 이 증상에서 흔히 확인되는 원인들입니다…" 와
              "증상을 덜어주는 방법이지 원인을 없애는 방법은 아닙니다…" 가 그대로 다시 나왔다.
            ⚠️ 지우지 말 것 — 둘 다 단정하지 않기 위한 문장이고, 자가 처치를 치료로
               오해하지 않게 하는 안전장치다(의료법 제56조).
          */}
          <p className="mt-8 max-w-[70ch] text-[16px] leading-relaxed text-ink-soft">
            <Sentences text="아래 원인은 각 증상에서 흔히 확인되는 것들입니다. 증상만으로는 어느 쪽인지 특정할 수 없고, 검사로 확인해야 치료가 정해집니다. 함께 적은 '해볼 수 있는 것' 은 증상을 덜어주는 방법이지 원인을 없애는 방법이 아니어서, 나아진 것처럼 느껴져도 원인은 그대로 남아 있습니다." />
          </p>
        </Container>

        {list.map((s, i) => {
          const conditions = conditionsForSymptom(s.slug);
          const treatments = s.relatedTreatments.map(treatmentBySlug).filter(Boolean);
          return (
            /*
              ⚠️ id 는 옛 주소의 slug 다. next.config.ts 의 301 이 이 조각으로 보낸다.
              ⚠️ scroll-mt-28 을 지우지 말 것 — 고정 머리말에 제목이 가려진다.
            */
            <section
              key={s.slug}
              id={s.slug}
              className={`scroll-mt-28 border-t border-wine-line py-12 sm:py-16 ${i % 2 === 1 ? 'bg-parchment' : ''}`}
            >
              <Container>
                <p className="text-[13px] font-black tracking-[0.14em] text-clay-600">
                  증상 {String(i + 1).padStart(2, '0')}
                </p>
                {/* ⚠️ 환자가 말하는 문장 그대로 — 줄여 쓰면 검색 질의와 안 맞는다. */}
                <h2 className="display-sm mt-4 max-w-[20em] text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
                  {s.title}
                </h2>
                <p className="mt-5 max-w-[70ch] text-[17.5px] leading-[1.9] text-twilight">
                  <Sentences text={s.answer} />
                </p>

                {s.image ? (
                  <figure className="mt-8 max-w-[64ch]">
                    <Image
                      src={s.image.src}
                      alt={s.image.alt}
                      width={1536}
                      height={1024}
                      sizes="(min-width: 1024px) 64ch, 100vw"
                      className="w-full rounded-2xl border border-wine-line object-cover"
                    />
                  </figure>
                ) : null}

                <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
                  <div>
                    {/* 급한 것에만 색을 준다 — 둘 다 칠하면 급한 것이 급해 보이지 않는다. */}
                    <div className="rounded-2xl border border-clay-600/40 bg-clay-400/[0.07] p-6 ring-1 ring-clay-400/10 ring-inset">
                      <p className="flex items-center gap-2.5 text-[13px] font-black tracking-[0.14em] text-clay-600">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-clay-700" />
                        미루면 안 되는 신호
                      </p>
                      <ul className="mt-4 divide-y divide-clay-600/20">
                        {s.urgent.map((u) => (
                          <li key={u} className="py-3.5 text-[16px] leading-[1.8] text-ink">
                            <Sentences text={u} />
                          </li>
                        ))}
                      </ul>
                      <a
                        href={CLINIC.phoneHref}
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[15.5px] font-semibold text-wine-bg transition-opacity hover:opacity-90"
                      >
                        {CLINIC.phone} 로 전화
                      </a>
                    </div>

                    <div className="mt-8">
                      <p className="text-[13.5px] font-black tracking-[0.06em] text-clay-700">
                        오기 전에 해볼 수 있는 것
                      </p>
                      <ul className="mt-4 divide-y divide-wine-line">
                        {s.selfCare.map((c) => (
                          <li key={c} className="flex gap-3 py-3.5 text-[16px] leading-[1.8] text-twilight">
                            <span
                              aria-hidden
                              className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-clay-600/50 text-[13px] text-clay-700"
                            >
                              ✓
                            </span>
                            {/* ⚠️ block min-w-0 flex-1 — 없으면 쉼표 줄바꿈을 재는 칸이 사라진다(globals.css 주석). */}
                            <span className="block min-w-0 flex-1"><Sentences text={c} /></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <p className="text-[13.5px] font-black tracking-[0.06em] text-clay-700">흔한 원인</p>
                    <ol className="mt-4 divide-y divide-wine-line">
                      {s.causes.map((c, ci) => (
                        <li key={c.name} className="flex gap-5 py-5 first:pt-0">
                          <span
                            aria-hidden
                            className="mt-1 shrink-0 text-[13.5px] font-black tracking-[0.06em] tabular-nums text-clay-700"
                          >
                            {String(ci + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-[17.5px] font-black text-ink">{c.name}</h3>
                            <p className="mt-2 text-[16px] leading-[1.85] text-twilight">
                              <Sentences text={c.detail} />
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>

                    {(conditions.length > 0 || treatments.length > 0) && (
                      <div className="mt-8 border-t border-wine-line pt-6">
                        <p className="text-[13.5px] font-black tracking-[0.06em] text-clay-700">
                          이어서 읽어볼 곳
                        </p>
                        <ul className="mt-4 flex flex-wrap gap-2.5">
                          {conditions.map((c) => (
                            <li key={c.slug}>
                              <Link
                                href={`/insight/condition/${c.slug}`}
                                className="inline-flex items-center gap-1.5 rounded-full border border-brand-200/70 bg-parchment px-4 py-2 text-[15px] font-semibold text-ink-soft transition-colors hover:border-brand-300 hover:text-clay-700"
                              >
                                {c.name}
                                <span aria-hidden>→</span>
                              </Link>
                            </li>
                          ))}
                          {treatments.map((t) => (
                            <li key={t!.slug}>
                              <Link
                                href={`/treatment/${t!.slug}`}
                                className="inline-flex items-center gap-1.5 rounded-full border border-clay-600/40 px-4 py-2 text-[15px] font-semibold text-ink transition-colors hover:border-clay-600"
                              >
                                {t!.name}
                                <span aria-hidden>→</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Container>
            </section>
          );
        })}

        {/* 다른 묶음으로 — 찾던 것이 여기 없을 때 빠져나갈 길. */}
        <Container className="py-12 sm:py-16 lg:py-20">
          <h2 className="display-sm text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
            다른 증상을 찾으시나요?
          </h2>
          <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SYMPTOM_GROUPS.filter((o) => o.slug !== g.slug).map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/insight/symptom/${o.slug}`}
                  className="group block h-full rounded-2xl border border-brand-200/70 bg-parchment p-6 transition-colors hover:border-brand-300"
                >
                  <h3 className="text-[18px] font-black text-ink transition-colors group-hover:text-clay-700">
                    {o.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
                    {symptomsOfGroup(o).map((s) => s.short).join(' · ')}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>

        <Container className="pt-4">
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
