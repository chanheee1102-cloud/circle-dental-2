import Image from 'next/image';
import Link from 'next/link';
import type { Treatment } from '@/lib/treatments';
import type { TreatmentPage } from '@/lib/treatmentPages';
import type { Journey } from '@/lib/insight';
import { Container, Sentences } from '@/components/ui';
import { TreatmentHero, TreatmentStrip } from '@/components/TreatmentShell';
import { SectionHead, Card, NumChip } from '@/components/saas';

/**
 * 진료 랜딩 페이지 — 임플란트에서 만든 언어를 나머지 진료가 함께 쓰는 틀.
 *
 * ★★ 왜 하나로 묶었나 ★★
 *   진료가 아홉이라 페이지를 따로 쓰면 아홉 벌이 조금씩 어긋난다. 실제로 임플란트만
 *   손보는 사이 나머지 여덟이 옛 모양으로 남아 한 사이트로 안 보였다.
 *   내용은 lib/treatmentPages.ts 가 갖고, 모양은 여기 하나가 갖는다.
 *
 * ★ 디자인 규칙은 components/saas.tsx 머리말에 있다. 전면 사진 히어로 · 전폭 어두운 밴드 ·
 *   자간 넓힌 영문 캡스 눈썹으로 되돌리지 말 것 — 셋 다 경쟁 병원과 같아지는 지점이다.
 * ⚠️ AI 로 만든 사진(figure.ai)에는 설명용 고지를 반드시 함께 렌더한다. 지우지 말 것.
 */
export function TreatmentLanding({
  t,
  page,
  journey,
  related,
  trail,
  children,
}: {
  t: Treatment;
  page: TreatmentPage;
  journey: Journey | undefined;
  related: Array<{ slug: string; title: string }>;
  trail: Array<{ name: string; path: string }>;
  /** 비교표처럼 이 진료에만 붙는 것들. 본문 구간 뒤, FAQ 앞에 들어간다. */
  children?: React.ReactNode;
}) {

  /* AI 사진이 한 장이라도 쓰였는지 — 고지를 렌더할지 정한다. */
  const usesAi =
    page.hero.ai || page.blocks.some((b) => b.figure?.ai);

  return (
    <>
      {/*
        머리말 — 진료과목 아홉 곳이 같은 부품을 쓴다 (2026-09-01 오너 지시).
        ⚠️ 여기서 손으로 다시 그리지 말 것. 모양은 components/TreatmentShell.tsx 에서 바꾼다.
        ⚠️ 왼쪽 정렬 2단 · 알약 눈썹으로 되돌리지 말 것 — 페이지마다 머리가 달라 보였던 원인이다.
        ★ 사진은 그대로 배경으로 깐다. 상자에 담으면 진료마다 비율이 제각각이라
          (1.50 · 2.24 · 2.40 · 4.80) 누군가는 잘리거나 옆이 빈다. 그 길은 이미 두 번 돌았다.
      */}
      <TreatmentHero
        trail={trail}
        eyebrow={`고양 화정동 ${t.name} · 보건복지부 인정 통합치의학과 전문의`}
        title={page.headline.split('\n')}
        lead={page.lead}
        photo={{ src: page.hero.src, alt: '' }}
      />

      {/* 지표 3칸 — 머리말 안에 있던 것을 아래 띠로 옮겼다(2026-09-01). 내용은 그대로다. */}
      <TreatmentStrip items={page.stats.map((s) => ({ k: s.k, t: s.v }))} />

      {/* 본문 구간 — 밝은 면과 크림 면이 번갈아 오게 해서 리듬을 만든다. */}
      {page.blocks.map((b, i) => {
        const tinted = i % 2 === 1;
        return (
          <section
            key={b.label}
            className={
              tinted
                ? 'border-y border-white/8 bg-wine-soft py-16 lg:py-24'
                : 'py-16 lg:py-24'
            }
          >
            <Container>
              <SectionHead
                id={`구간-${i + 1}`}
                n={String(i + 1).padStart(2, '0')}
                label={b.label}
                title={b.title}
                desc={b.desc}
              />

              {/*
                글과 사진을 나란히 둔다 — 사진이 **왼쪽**, 글이 오른쪽이다.
                ⚠️ 사진이 있을 때만 두 단이다. 없으면 한 단으로 두어 빈 칸을 만들지 않는다.
                ⚠️ 사진을 오른쪽으로 옮기지 말 것 — 눈이 왼쪽에서 출발하므로, 사진이 먼저
                   무엇에 대한 이야기인지 알려 준 다음 글로 들어가는 순서가 맞다.
              */}
              {b.paragraphs && b.figure ? (
                <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
                  <Card lift className="reveal img-in overflow-hidden lg:sticky lg:top-32">
                    {/* ⚠️ 4:3 고정으로 되돌리지 말 것 — 3:2 사진이 11% 잘린다. */}
                    <div className="relative bg-brand-100" style={{ aspectRatio: b.figure.ratio ?? '4 / 3' }}>
                      <Image
                        src={b.figure.src}
                        alt={b.figure.alt}
                        fill
                        sizes="(min-width: 1024px) 520px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </Card>
                  <div className="reveal space-y-5">
                    {b.paragraphs.map((p) => (
                      <p key={p} className="text-[17px] leading-[1.95] text-ink-soft">
                        <Sentences text={p} />
                      </p>
                    ))}
                  </div>
                </div>
              ) : b.paragraphs ? (
                <div className="reveal mt-10 max-w-[36em] space-y-5">
                  {b.paragraphs.map((p) => (
                    <p key={p} className="text-[17px] leading-[1.95] text-ink-soft">
                      <Sentences text={p} />
                    </p>
                  ))}
                </div>
              ) : null}

              {b.steps ? (
                <div className="relative mt-14">
                  <span
                    aria-hidden
                    className="line-in absolute top-[13px] right-0 left-0 hidden h-px bg-brand-300/70 lg:block"
                  />
                  <ol className="reveal-stack relative grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {b.steps.map((s) => (
                      <li key={s.step} className="reveal flex h-full flex-col">
                        <div className="mb-6 flex items-center">
                          <NumChip n={s.step} />
                        </div>
                        <Card className="flex h-full flex-col p-7">
                          <h3 className="display-sm text-[17.5px] tracking-[-0.01em] text-ink">
                            {s.title}
                          </h3>
                          <p className="mt-2.5 text-[15.5px] leading-[1.85] text-ink-soft"><Sentences text={s.body} /></p>
                        </Card>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {/*
                ★★ 항목에 사진이 딸리면 **사진 왼쪽 · 카드 오른쪽** 2단이다 (2026-08-31 운영자) ★★
                  전에는 카드를 3열로 깔고 그 아래에 사진을 한 장 놓았는데, 사진이 혼자
                  전폭을 차지해 본문 한가운데가 사진으로 끊겼다("갑자기 너무 큰 이미지가
                  중간에 있어"). 나란히 두면 사진이 카드 옆에서 같은 이야기를 거든다.
                ⚠️ 사진을 오른쪽으로 옮기지 말 것 — 이 페이지의 다른 2단 구간도 사진이
                   왼쪽이다(위 주석). 구간마다 방향이 다르면 읽는 눈이 매번 자리를 다시 찾는다.
                ⚠️ 카드는 2열이다. 오른쪽 칸이 640px 남짓이라 3열로 두면 한 칸이 200px 밑으로
                   내려가 제목이 두 줄로 접힌다.
              */}
              {/*
                ⚠️⚠️ items-start + 고정 비율로 되돌리지 말 것 (2026-08-31 운영자) ⚠️⚠️
                  사진을 자기 비율(3:2 → 339px)로 두었더니 카드 두 줄(약 500px)과 높이가
                  안 맞아 사진 아래가 160px 비었다("카드랑 사진이랑 크기 잘 안맞으니깐").
                ★ items-stretch + h-full — 사진이 **카드 줄 높이를 그대로 채운다.**
                  잘리는 것은 배경 사진과 같은 성격이라 눈에 걸리지 않는다.
                ⚠️ 최소 높이를 함께 둔다. 카드가 한 줄뿐인 구간에서는 사진이 너무 납작해진다.
              */}
              {b.items && b.figure && !b.paragraphs ? (
                <div className="mt-12 grid items-stretch gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
                  <Card lift className="reveal img-in overflow-hidden">
                    <div className="relative h-full min-h-[280px] bg-brand-100">
                      <Image
                        src={b.figure.src}
                        alt={b.figure.alt}
                        fill
                        sizes="(min-width: 1024px) 520px, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </Card>
                  <ul className="reveal-stack grid gap-5 sm:grid-cols-2">
                  {b.items.map((it, k) => (
                    <Card as="li" key={it.title} className="reveal p-7">
                      <NumChip n={String(k + 1).padStart(2, '0')} />
                      <h3 className="display-sm mt-5 text-[18px] tracking-[-0.01em] text-ink">
                        {it.title}
                      </h3>
                      <p className="mt-2.5 text-[15.5px] leading-[1.85] text-ink-soft"><Sentences text={it.body} /></p>
                    </Card>
                  ))}
                  </ul>
                </div>
              ) : b.items ? (
                <ul className="reveal-stack mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {b.items.map((it, k) => (
                    <Card as="li" key={it.title} className="reveal p-7">
                      <NumChip n={String(k + 1).padStart(2, '0')} />
                      <h3 className="display-sm mt-5 text-[18px] tracking-[-0.01em] text-ink">
                        {it.title}
                      </h3>
                      <p className="mt-2.5 text-[15.5px] leading-[1.85] text-ink-soft"><Sentences text={it.body} /></p>
                    </Card>
                  ))}
                </ul>
              ) : null}

              {/*
                ⚠️ 사진 아래에 설명 한 줄을 달지 말 것 (2026-08-27 오너 지시).
                   alt 는 화면에 안 보이는 사람을 위해 남기고, 보이는 캡션은 두지 않는다.
                   사진이 무엇인지는 그 위 본문이 이미 말하고 있다.
              */}
              {/* ⚠️ 글이 함께 있으면 위 2단에서 이미 그렸다. 여기서 또 그리면 사진이 두 번 나온다. */}
              {/*
                ⚠️⚠️ 전폭 16:10 으로 깔지 말 것 (2026-08-31 운영자: "갑자기 너무 큰 이미지가
                   중간에 있어") ⚠️⚠️
                   컨테이너를 다 쓰면 1254×784 가 되어 본문 한가운데를 사진이 통째로 차지한다.
                   게다가 3:2 사진을 16:10 에 담아 6% 가 잘리고, 원본보다 크게 늘어나 흐려진다.
                ★ 폭을 860px 로 묶고 사진의 실제 비율을 쓴다. 위 2단 구간의 사진(520px)과
                  크기 차이가 나지만, 그쪽은 글 옆에 붙고 이쪽은 혼자 서므로 조금 큰 것이 맞다.
              */}
              {b.figure && !b.paragraphs && !b.items ? (
                <Card lift className="reveal img-in mt-12 max-w-[860px] overflow-hidden">
                  <div
                    className="relative bg-brand-100"
                    style={{ aspectRatio: b.figure.ratio ?? '16 / 10' }}
                  >
                    <Image
                      src={b.figure.src}
                      alt={b.figure.alt}
                      fill
                      sizes="(min-width: 900px) 860px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </Card>
              ) : null}

              {/*
                실제 증례 연속 컷.
                ★ 이미지 안에 A/B/C/D 가 이미 찍혀 있어 캡션이 필요 없다.
                ⚠️ 원본이 작아(220px) 크게 늘리면 뭉갠다. 칸을 작게 두고 여백으로 격을 만든다.
              */}
              {b.panels?.length ? (
                <ol className="reveal-stack mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {b.panels.map((p) => (
                    <li key={p.src} className="reveal">
                      <div className="img-in relative aspect-[4/3] overflow-hidden rounded-2xl border border-brand-200/80 bg-brand-900">
                        <Image
                          src={p.src}
                          alt={p.alt}
                          fill
                          sizes="(min-width: 1024px) 300px, (min-width: 640px) 47vw, calc(100vw - 40px)"
                          className="object-cover"
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              ) : null}

              {/* 가로로 긴 원본은 띠로 쓴다 — 4:3 으로 자르면 내용이 통째로 잘린다. */}
              {b.band ? (
                <div className="reveal img-in mt-12 overflow-hidden rounded-[22px] border border-brand-200/80 bg-brand-900">
                  {/* ⚠️ 3:1 고정이면 원본 비율이 다른 띠가 잘린다. */}
                  <div className="relative" style={{ aspectRatio: b.band.ratio ?? '3 / 1' }}>
                    <Image
                      src={b.band.src}
                      alt={b.band.alt}
                      fill
                      sizes="(min-width: 1320px) 1256px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ) : null}
            </Container>
          </section>
        );
      })}

      {children}

      {/* 진행 순서 */}
      {journey && (
        <section className="border-y border-white/8 bg-wine-soft py-16 lg:py-24">
          <Container>
            <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
              <div className="lg:sticky lg:top-40 lg:self-start">
                <SectionHead
                  id="진행-순서"
                  n={String(page.blocks.length + 1).padStart(2, '0')}
                  label="진행 순서"
                  title="몇 번에 걸쳐 어떻게 진행되나요?"
                  desc={journey.answer}
                />
                <dl className="reveal mt-9 flex gap-x-10">
                  <div>
                    <dt className="text-[13.5px] font-bold text-clay-700">내원 횟수</dt>
                    <dd className="mt-1.5 text-[20px] font-black tracking-[-0.02em] text-ink">
                      {journey.visits}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[13.5px] font-bold text-clay-700">치료 기간</dt>
                    <dd className="mt-1.5 text-[20px] font-black tracking-[-0.02em] text-ink">
                      {journey.duration}
                    </dd>
                  </div>
                </dl>
              </div>

              <ol className="reveal-stack space-y-4">
                {journey.steps.map((st, i) => (
                  <Card as="li" key={st.label} className="reveal p-6">
                    <div className="flex items-start gap-4">
                      <NumChip n={String(i + 1).padStart(2, '0')} />
                      <div>
                        <h3 className="display-sm text-[17.5px] tracking-[-0.01em] text-ink">
                          {st.label}
                        </h3>
                        <p className="mt-2 text-[15.5px] leading-[1.8] text-ink-soft">{st.what}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </ol>
            </div>

            {journey.variables.length ? (
              <p className="reveal mt-12 max-w-[46em] text-[14.5px] leading-[1.9] text-ink-muted">
                기간이 늘어나는 경우도 있습니다. {journey.variables.join(' ')}
              </p>
            ) : null}
          </Container>
        </section>
      )}

      {/*
        ★★ 자주 묻는 질문은 여기서 펼치지 않는다 (2026-08-27 오너 지시) ★★
          진료 페이지에 문답까지 다 펼치니 한 페이지가 너무 길어졌다. 정본은 /faq 가 갖고
          여기서는 그리로 가는 줄만 둔다.
        ⚠️ 함께 옮긴 것: FAQPage 구조화 데이터. 화면에서 뺐는데 스키마만 남기면 보이지 않는
           내용을 주장하는 꼴이라 검색엔진이 무시하거나 감점한다. 되살리려면 둘을 같이 옮길 것.
      */}
      {t.qa.length ? (
        <section className="py-16 lg:py-24">
          <Container>
            <Link href={`/faq#${t.slug}`} className="reveal group block">
              <Card className="flex flex-wrap items-center justify-between gap-6 p-8 transition-all group-hover:border-clay-400 group-hover:shadow-[var(--shadow-lift)]">
                <div>
                  <p className="text-[13.5px] font-black text-clay-700">자주 묻는 질문</p>
                  <p className="mt-2.5 text-[19px] font-black tracking-[-0.015em] text-ink">
                    {t.name}에 대해 많이 묻는 것 {t.qa.length}가지
                  </p>
                  <p className="mt-2 text-[15.5px] leading-[1.8] text-ink-soft">
                    기간과 횟수, 통증, 보험 적용까지 한자리에 모아 두었습니다.
                  </p>
                </div>
                <span className="shrink-0 text-[16px] font-black text-clay-700">
                  전체 보기 <span aria-hidden>→</span>
                </span>
              </Card>
            </Link>
          </Container>
        </section>
      ) : null}

      {/* 주의사항 — 원문에 있는 진료만 렌더된다. */}
      {page.aftercare && (
        <section className="border-y border-white/8 bg-wine-soft py-16 lg:py-24">
          <Container>
            <SectionHead
              id="주의사항"
              n={String(page.blocks.length + (journey ? 2 : 1)).padStart(2, '0')}
              label={page.aftercare.title}
              title="이 며칠이 결과를 좌우합니다"
            />
            <ol className="reveal-stack mt-12 grid gap-5 sm:grid-cols-2">
              {page.aftercare.items.map((a, i) => (
                <Card as="li" key={a} className="reveal flex gap-4 p-6">
                  <NumChip n={String(i + 1).padStart(2, '0')} />
                  <p className="text-[16px] leading-[1.85] text-ink-soft">{a}</p>
                </Card>
              ))}
            </ol>
          </Container>
        </section>
      )}

      {/* 관련 증상 */}
      {related.length > 0 && (
        <section className="py-16 lg:py-24">
          <Container>
            <h2 className="display-sm reveal text-[19px] tracking-[-0.01em] text-ink">
              이런 증상이라면 함께 보세요
            </h2>
            <div className="reveal mt-6 flex flex-wrap gap-2.5">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  href={`/insight/symptom/${s.slug}`}
                  className="rounded-full btn-pane border px-5 py-2.5 text-[15.5px] font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/*
        ⚠️⚠️ AI 사진 고지 — 지우지 말 것 ⚠️⚠️
          이 페이지에 AI 로 만든 사진이 한 장이라도 있으면 함께 렌더한다. 고지가 없으면
          원내 사진으로 읽히고, 그 순간 확인되지 않은 시설 주장이 된다(의료법 제56조).
          사진을 전부 실제 진료 사진으로 바꾸면 usesAi 가 false 가 되어 자동으로 사라진다.
      */}
      {/*
        ⚠️ 이 고지는 남긴다 — 다른 안내문과 성격이 다르다. 우리가 실제로 AI 로 만든 그림을
           쓰기 때문에 붙는 것이고, 빼면 그 그림이 원내 실제 사진으로 읽힌다.
        ★ 다만 **눈에 띄지 않게** 둔다 (2026-08-31 운영자: "저렇게 잘보이게 말고 자연스럽게
          좀 안보이게"). 라벨·구분선·굵은 글씨를 걷고 푸터 한 줄로 낮췄다.
        ⚠️ 사진을 전부 실제 진료 사진으로 바꾸면 usesAi 가 false 가 되어 저절로 사라진다.
      */}
      {usesAi ? (
        <Container className="pb-6">
          {/* ⚠️ 투명도를 다시 낮추지 말 것 — /70 에서 3.47:1 로 미달이었다(실측 2026-09-01).
              고지 문구는 작아도 읽혀야 한다. 안 읽히면 고지한 것이 아니다. */}
          <p className="max-w-[52em] text-[13.5px] leading-[1.7] text-ink-muted">
            <Sentences text="일부 이미지는 진료 과정을 설명하기 위해 만든 것으로 실제 진료 사진이 아닙니다." />
          </p>
        </Container>
      ) : null}
    </>
  );
}
