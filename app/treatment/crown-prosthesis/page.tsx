import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CLINIC, NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { treatmentBySlug } from '@/lib/treatments';
import { symptomBySlug } from '@/lib/symptoms';
import { journeyForTreatment } from '@/lib/insight';
import { METHODS, MATERIALS, SHADE_STEPS, RISKS } from '@/lib/aestheticPage';
import { Container, MedicalNotice, Sentences } from '@/components/ui';
import { TreatmentHero, TreatmentStrip } from '@/components/TreatmentShell';
import { JsonLd } from '@/components/JsonLd';
import { ArticleMeta, References, charCount } from '@/components/article';
import { REFS_TREATMENT } from '@/lib/references';
import {
  breadcrumbSchema,
  medicalWebPageSchema,
  articleSchema,
  og,
  imageObjectSchema,
  withLocality,
} from '@/lib/seo';

/**
 * 심미보철 — 라미네이트와 올세라믹 크라운을 **깎는 양**으로 가르는 비교 문서.
 *
 * ★★ 2026-09-03 사이트의 결로 되돌렸다 (오너: "심미 보철은 디자인적인 부분 한번
 *    전문가 지정해서 보완") ★★
 *   이 페이지만 다른 시스템 위에 있었다 — '크림 종이(MindMarket)' 축: 50~64px 알약
 *   모서리, 유리 카드(card-glass), 회색(#6f746f) 막대, 회색(#c3c7c3) 마감 띠.
 *   팔레트를 하양·베이지·고동으로 바꿀 때 다른 페이지는 토큰을 따라왔는데 여기는
 *   제 토큰(grass·coral·sun·paper·inkw·stone)을 따로 갖고 있어서 그대로 남았다.
 *   같은 메뉴에서 이 페이지로 넘어오면 다른 사이트처럼 보였다.
 *
 *   무엇을 바꿨나 — 내용은 한 글자도 안 바꿨다. 그릇만 바꿨다.
 *     · 면: 흰 캔버스 + light-band(베이지) 교대. 다른 진료 페이지와 같은 리듬.
 *     · 카드: rounded-2xl + 실선(border-brand-200/70). 유리·그림자 없음.
 *     · 막대: 금색 → 고동(clay-700) / 실선색(brand-300). 밝은 면에 금색을 채우지 않는다
 *       — 금색은 어두운 면 안의 강조에만 쓴다는 오너 규칙(2026-09-02).
 *     · 두 방법: **카드 두 장 → 칸 두 개.** 한 장이 1,500px 이었고 그 안에 카드가 또
 *       들어 있었다(카드 속 카드). 칸은 실선 하나로 나누고, 안의 세 덩어리는 위 실선으로
 *       구분한다. '알아 두실 점' 만 옅게 칠한 상자로 남긴다 — 한계는 눈에 띄어야 한다.
 *     · 번호: '가능한 조건' 의 01/02/03 은 뺐다(순서가 뜻이 없다). 색 맞추기의 번호는
 *       남긴다 — 그 구획의 요지가 '순서' 다.
 *     · 자간 -0.05em → -0.02em. 사이트 전체가 -0.02~-0.03 이다.
 *     · 회색 마감 띠 삭제. 다른 페이지에 없는 장식이었다.
 *
 * ⚠️ 유리 카드·50px 모서리로 되돌리지 말 것. 이 페이지만 튀던 원인이다.
 * ⚠️ 막대에 금색을 다시 칠하지 말 것 — 밝은 면이다.
 *
 * ★ 내용 원칙 — 기존 홈페이지의 특징 목록은 마케팅 문구라 **판단 근거가 없다**(오너 지적).
 *   원문 사실은 전부 살리되, 삭제량·재료·조건·한계를 함께 적는다. 임상 수치는 표준 지식이고
 *   병원 고유 주장(보유 장비·실적)은 넣지 않는다. 근거는 lib/aestheticPage.ts 머리말 참고.
 * ⚠️ RISKS 섹션을 지우지 말 것 — 부작용과 한계가 빠지면 이 페이지는 광고문이 된다(제56조).
 * ⚠️ app/treatment/[slug] 의 generateStaticParams 에서 crown-prosthesis 를 빼 두었다.
 */

const PATH = '/treatment/crown-prosthesis';
/* ⚠️ 2026-09-03 오너 지정 문구(히어로에 그대로 나간다). 삭제량·교합이 그대로 남아 있어
   검색 설명을 따로 두지 않는다. */
const LEAD =
  '심미보철은 단순히 치아의 색과 모양만 바꾸는 치료가 아닙니다. 치아 상태와 교합, 필요한 삭제량을 함께 고려해, 자연치아를 최대한 보존할 수 있는 치료 방법을 선택합니다.';

export const metadata: Metadata = {
  title: '심미보철',
  description: LEAD.slice(0, 155),
  alternates: { canonical: PATH },
  openGraph: og({ title: withLocality('심미보철'), description: LEAD.slice(0, 155), path: PATH }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '진료과목', path: '/treatment' },
  { name: '심미보철', path: PATH },
];

const DOC_IMAGE = {
  src: '/img/clinic/aes-consult.webp',
  caption: '상담실에서 원장이 환자에게 보철 치료 계획을 설명하는 모습',
  width: 1280,
  height: 853,
};

/** 막대 길이 기준 — 가장 큰 삭제량(1.5mm)을 100% 로 둔다. */
const MAX_MM = 1.5;

/** 작은 소제목 — 칸 안의 세 덩어리 머리. 같은 역할은 같은 글자로. */
const SUB = 'text-[13.5px] font-black tracking-[0.06em] text-clay-700';

export default function CrownProsthesisPage() {
  const t = treatmentBySlug('crown-prosthesis');
  if (!t) throw new Error('crown-prosthesis 진료 데이터 없음 — lib/treatments.ts');
  const journey = journeyForTreatment('crown-prosthesis');
  const related = t.relatedSymptoms.map(symptomBySlug).filter(Boolean);

  return (
    <div className="bg-wine-bg text-ink">
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: withLocality('심미보철'),
            description: LEAD,
            path: PATH,
            about: { type: 'MedicalProcedure', name: '심미보철' },
            image: DOC_IMAGE,
          }),
          imageObjectSchema({ path: PATH, ...DOC_IMAGE }),
          articleSchema({
            path: PATH,
            title: '심미보철',
            description: LEAD,
            wordCount: charCount(LEAD, METHODS.flatMap((m) => m.requires).join('')),
            keywords: ['심미보철', '라미네이트', '올세라믹', '지르코니아', '치아 삭제량'],
            hasImage: true,
          }),
        ]}
      />

      {/*
        머리말 — 진료과목 아홉 곳이 같은 부품을 쓴다 (2026-09-01 오너 지시).
        ⚠️ 여기서 손으로 다시 그리지 말 것. 모양은 components/TreatmentShell.tsx 에서 바꾼다.
      */}
      <TreatmentHero
        trail={TRAIL}
        /* ⚠️ 눈썹에서 '라미네이트와 올세라믹 비교' 를 뺐다 (2026-09-03) — 새 제목이 같은 말을
           하고 있어 한 화면에 두 번 나왔다. 진료 페이지 공통 형태(지역 + 진료명 + 자격)로 맞춘다. */
        eyebrow="고양 화정동 심미보철 · 보건복지부인증 통합치의학과 전문의"
        /* ⚠️ 2026-09-03 오너 지정 제목. 두 이름(라미네이트·올세라믹)을 제목에 두는 것이
           이 페이지의 일이다 — 본문 전체가 그 둘을 삭제량으로 가르는 비교다.
           '깎는 양' 은 바로 아래 lead 와 첫 구획 제목이 이어받았다. */
        title={['라미네이트와 올세라믹,', '어떻게 선택하나요?']}
        lead={LEAD}
        photo={{
          src: '/img/clinic/aes-scanner.webp',
          alt: '진료실에서 구강 스캐너로 앞니의 형태를 떠 화면에 옮기는 모습.',
        }}
      />

      {/* ⚠️ 수치는 범위로만 적는다 — lib/aestheticPage.ts 의 reduction 과 같은 값이다. */}
      <TreatmentStrip
        items={[
          {
            k: '라미네이트',
            t: '앞면 0.3~0.7mm',
            d: '앞면만 얇게 다듬어 세라믹을 붙입니다. 되돌릴 수 없는 삭제량이 가장 적습니다.',
          },
          {
            k: '올세라믹',
            t: '전체 1.0~1.5mm',
            d: '치아 전체를 감싸 씌웁니다. 손상이 크거나 신경치료를 한 치아에 씁니다.',
          },
          {
            k: '먼저 정리하는 것',
            t: '잇몸과 맞물림',
            d: '염증이 있으면 경계가 붉게 비치고, 맞물림이 안 맞으면 얇은 세라믹은 깨집니다.',
          },
        ]}
      />

      {/*
        ★★ 삭제량 비교 — 이 페이지의 임팩트 자리 ★★
          두 방법의 가장 큰 차이는 색도 재료도 아니고 **얼마나 깎느냐** 다. 글자로 적으면
          0.3 과 1.5 의 차이가 안 느껴져서, 막대가 실제 비율대로 자라게 한다(.bar-grow).
          이 페이지에서 움직임을 '연출' 하는 자리는 여기 하나다.
        ⚠️ 수치는 범위로만 적는다. 단일 값은 모든 케이스에 그 값이 적용되는 것처럼 읽힌다.
        ⚠️ 막대 색 — 라미네이트는 고동(clay-700), 크라운은 실선색(brand-300). 짙고 옅음이
           '덜 깎는 쪽' 을 가리킨다. 금색을 칠하지 말 것(밝은 면).
      */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <h2 className="display-sm reveal max-w-[13em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
            같은 앞니라도 깎는 두께가 세 배까지 차이 납니다
          </h2>

          <div className="reveal-stack mt-14 divide-y divide-wine-line border-y border-wine-line">
            {METHODS.map((m) => (
              <div
                key={m.key}
                className="reveal grid gap-4 py-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-10"
              >
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="text-[19px] font-black tracking-[-0.01em] text-ink">{m.name}</p>
                    <p className="text-[15px] text-ink-soft">{m.reduction.label}</p>
                  </div>
                  <div className="mt-4 h-8 w-full overflow-hidden rounded-[6px] bg-brand-100">
                    <span
                      className={`bar-grow h-full rounded-[6px] ${m.key === 'veneer' ? 'bg-clay-700' : 'bg-brand-300'}`}
                      style={{ ['--w' as string]: `${(m.reduction.max / MAX_MM) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-[clamp(28px,3vw,40px)] leading-none font-extrabold tracking-[-0.03em] text-ink tabular-nums sm:min-w-[6.5em] sm:text-right">
                  {m.reduction.min}–{m.reduction.max}
                  <span className="ml-1.5 text-[16px] font-bold text-ink-soft">mm</span>
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-[38em] text-[17.5px] leading-[1.9] text-twilight">
            <Sentences text="깎은 치아 구조는 돌아오지 않습니다. 그래서 덜 깎는 방법이 가능한지부터 확인하고, 그것으로 버티지 못하는 자리에만 더 깎는 방법을 씁니다." />
          </p>
        </Container>
      </section>

      {/* ── 두 방법: 조건과 한계까지 ────────────────────────────────── */}
      <section className="light-band border-y border-wine-line py-16 sm:py-24 lg:py-32">
        <Container>
          <h2 className="display-sm reveal max-w-[12em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
            남은 치아 상태에 따라 가능한 방법이 갈립니다
          </h2>

          {/*
            ★ 카드 두 장이 아니라 **칸 두 개**다. 실선 하나로 나눈다(띠의 세로 구분선과 같은 말).
              카드로 감싸면 한 장이 1,500px 이 되고, 그 안의 '알아 두실 점' 이 카드 속 카드가 된다.
            ⚠️ 좁은 화면에서는 위아래로 쌓이며 위 실선으로 나뉜다.
          */}
          <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-0">
            {METHODS.map((m, i) => (
              <article
                key={m.key}
                className={
                  i === 0
                    ? 'lg:pr-14'
                    : 'border-t border-wine-line pt-14 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-14'
                }
              >
                <p className={SUB}>{m.tag}</p>
                <h3 className="display-sm mt-4 text-[clamp(26px,3vw,36px)] leading-[1.15] tracking-[-0.02em] text-ink">
                  {m.name}
                </h3>
                <p className="mt-5 max-w-[30em] text-[17.5px] leading-[1.85] text-twilight">
                  <Sentences text={m.def} />
                </p>

                <div className="img-in reveal mt-8 overflow-hidden rounded-[20px] border border-brand-200 bg-parchment p-2">
                  <div className="card-edge relative aspect-[16/10] overflow-hidden rounded-[13px]">
                    <Image
                      src={m.key === 'veneer' ? '/img/clinic/aes-veneer.webp' : '/img/clinic/aes-chairside.webp'}
                      alt={
                        m.key === 'veneer'
                          ? '장갑 낀 손이 얇은 세라믹 보철물을 다루고 있는 근접 사진.'
                          : '진료실에서 원장과 진료 보조 인력이 벽에 걸린 파노라마 영상을 보며 진료하는 모습.'
                      }
                      fill
                      sizes="(min-width: 1024px) 600px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* 조건 — 원문에 없던 판단 근거. 이 칸에서 가장 중요한 부분이다. */}
                <div className="mt-10 border-t border-wine-line pt-7">
                  <p className={SUB}>가능한 조건</p>
                  <ul className="mt-4 divide-y divide-wine-line">
                    {m.requires.map((r) => (
                      <li key={r} className="py-4 text-[16.5px] leading-[1.85] text-twilight">
                        <Sentences text={r} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-wine-line pt-7">
                  <p className={SUB}>이런 경우에 검토합니다</p>
                  <ul className="mt-4 space-y-2.5">
                    {m.indications.map((v) => (
                      <li key={v} className="flex gap-3 text-[16.5px] leading-[1.7] text-twilight">
                        <span aria-hidden className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-clay-700" />
                        <span className="min-w-0 flex-1"><Sentences text={v} /></span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/*
                  ⚠️ 한계 — 지우지 말 것. 이것이 빠지면 광고문이 된다.
                  ★ 이 덩어리만 옅게 칠한다 — 충치 페이지의 주의 상자와 같은 그릇이다.
                */}
                <div className="mt-8 rounded-2xl border border-clay-600/40 bg-clay-400/[0.07] p-6 ring-1 ring-clay-400/10 ring-inset">
                  <p className={SUB}>알아 두실 점</p>
                  <ul className="mt-3 space-y-2.5">
                    {m.limits.map((l) => (
                      <li key={l} className="text-[16px] leading-[1.8] text-ink">
                        <Sentences text={l} />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 재료 ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <h2 className="display-sm reveal max-w-[12em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
            자리마다 유리한 재료가 다릅니다
          </h2>
          <p className="reveal mt-8 max-w-[36em] text-[17.5px] leading-[1.9] text-twilight">
            <Sentences text="앞니는 빛이 통과하는 정도가, 어금니는 씹는 힘을 견디는 강도가 먼저입니다. 하나로 정해 두면 한쪽이 손해를 봅니다." />
          </p>

          <ul className="reveal-stack mt-12 grid gap-5 lg:grid-cols-3">
            {MATERIALS.map((m) => (
              <li key={m.name} className="reveal rounded-2xl border border-brand-200/70 bg-parchment p-7">
                <p className={SUB}>{m.where}</p>
                <h3 className="mt-3 text-[22px] leading-[1.25] font-black tracking-[-0.02em] text-ink">
                  {m.name}
                </h3>
                <p className="mt-4 text-[16.5px] leading-[1.85] text-twilight">
                  <Sentences text={m.body} />
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── 색 맞추기 ───────────────────────────────────────────────── */}
      <section className="light-band border-y border-wine-line py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <h2 className="display-sm reveal max-w-[10em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
                보철 색은 순서를 지켜야 맞출 수 있습니다
              </h2>
              <p className="reveal mt-8 max-w-[26em] text-[17.5px] leading-[1.9] text-twilight">
                <Sentences text="보철은 나중에 색이 변하지 않습니다. 그래서 무엇을 먼저 하느냐가 결과를 가릅니다." />
              </p>
              <div className="img-in reveal mt-10 overflow-hidden rounded-[20px] border border-brand-200 bg-parchment p-2">
                <div className="card-edge relative aspect-[4/3] overflow-hidden rounded-[13px]">
                  <Image
                    src="/img/clinic/aes-scanner.webp"
                    alt="진료실 구강 스캐너 화면에 위아래 치열의 3차원 스캔 데이터가 표시되어 있다."
                    fill
                    sizes="(min-width: 1024px) 480px, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* ★ 번호를 남긴다 — 이 구획의 요지가 '순서' 다. 번호가 곧 내용이다. */}
            <ol className="reveal-stack divide-y divide-wine-line border-y border-wine-line">
              {SHADE_STEPS.map((s) => (
                <li key={s.n} className="reveal grid gap-3 py-7 sm:grid-cols-[3em_minmax(0,1fr)] sm:gap-6">
                  <span className="text-[14px] font-black tracking-[0.04em] text-clay-700 tabular-nums">{s.n}</span>
                  <div>
                    <h3 className="text-[20px] leading-[1.35] font-black tracking-[-0.02em] text-ink">{s.t}</h3>
                    <p className="mt-3 max-w-[32em] text-[16.5px] leading-[1.85] text-twilight">
                      <Sentences text={s.d} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/*
        ── 부작용과 한계 ────────────────────────────────────────────
        ⚠️⚠️ 지우지 말 것 — 의료법 제56조. 이 구간이 빠지면 페이지 전체가 광고문이 된다.
      */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <h2 className="display-sm reveal text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
              치료 전에 알아 두실 점
            </h2>
            <ul className="reveal-stack divide-y divide-wine-line border-y border-wine-line">
              {RISKS.map((r) => (
                <li key={r} className="reveal py-5 text-[17px] leading-[1.8] text-twilight">
                  <Sentences text={r} />
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── 마무리 ──────────────────────────────────────────────────── */}
      <section className="light-band border-y border-wine-line py-16 sm:py-24 lg:py-32">
        <Container>
          <h2 className="display-sm reveal max-w-[12em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
            덜 깎는 방법이 가능한지 먼저 봅니다
          </h2>
          <p className="mt-8 max-w-[36em] text-[17.5px] leading-[1.9] text-twilight">
            <Sentences text="남은 치아의 양과 무는 힘, 잇몸 상태를 먼저 확인한 뒤에 어떤 방법이 가능한지 말씀드립니다. 씹는 기능과 잇몸을 정리하는 것이 색과 모양보다 앞섭니다." />
          </p>

          {journey ? (
            <dl className="mt-10 flex flex-wrap gap-x-14 gap-y-5">
              <div>
                <dt className="text-[14.5px] font-medium text-ink-soft">내원 횟수</dt>
                <dd className="mt-2 text-[clamp(26px,3vw,36px)] leading-none font-extrabold tracking-[-0.03em] text-ink tabular-nums">
                  {journey.visits}
                </dd>
              </div>
              <div>
                <dt className="text-[14.5px] font-medium text-ink-soft">치료 기간</dt>
                <dd className="mt-2 text-[clamp(26px,3vw,36px)] leading-none font-extrabold tracking-[-0.03em] text-ink tabular-nums">
                  {journey.duration}
                </dd>
              </div>
            </dl>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={CLINIC.booking.naver}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-[17px] font-semibold text-wine-bg transition-opacity hover:opacity-90"
            >
              진료 예약하기 <span aria-hidden>→</span>
            </a>
            <a
              href={CLINIC.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/60 px-8 py-4 text-[17px] font-semibold tabular-nums text-ink transition-colors hover:bg-ink hover:text-wine-bg"
            >
              {CLINIC.phone}
            </a>
          </div>

          {/*
            ⚠️ 라미네이트 링크를 지우지 말 것 (2026-09-02) — 이 페이지는 **둘 중 무엇을
               고를지**를 다루고, 라미네이트 하나를 깊게 보는 문서는 따로 있다.
               서로를 안 가리키면 비교만 보고 상세는 못 본 사람이 생긴다.
            ⚠️ 관련 증상은 2개다 — 라미네이트 · 문답과 합쳐 네 칸이 찬다(3개면 한 줄이 밀린다).
          */}
          <div className="mt-20 grid gap-8 border-t border-wine-line pt-12 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/treatment/laminate" className="group">
              <p className="text-[14.5px] font-medium text-ink-soft">자세히 보기</p>
              <p className="mt-3 text-[18px] leading-[1.4] text-ink transition-colors group-hover:text-clay-600">
                라미네이트 <span aria-hidden>→</span>
              </p>
            </Link>
            <Link href="/faq#crown-prosthesis" className="group">
              <p className="text-[14.5px] font-medium text-ink-soft">자주 묻는 질문</p>
              <p className="mt-3 text-[18px] leading-[1.4] text-ink transition-colors group-hover:text-clay-600">
                많이 묻는 것 {t.qa.length}가지 <span aria-hidden>→</span>
              </p>
            </Link>
            {related.slice(0, 2).map((s) => (
              <Link key={s!.slug} href={`/insight/symptom/${s!.slug}`} className="group">
                <p className="text-[14.5px] font-medium text-ink-soft">관련 증상</p>
                <p className="mt-3 text-[18px] leading-[1.4] text-ink transition-colors group-hover:text-clay-600">
                  {s!.title} <span aria-hidden>→</span>
                </p>
              </Link>
            ))}
          </div>

          {/*
            ⚠️ 발행 정보·근거·고지를 **마무리 구획 안에** 둔다(라미네이트 페이지와 같은 자리).
               셋 다 지금은 null 을 돌려주는 부품이라(components/article.tsx · ui.tsx),
               별도 Container 로 감싸 여백을 주면 **아무것도 없는 흰 띠 128px** 이 마무리 띠와
               푸터 사이에 남는다(2026-09-03 실측). 다시 켜지면 여기서 그대로 나타난다.
          */}
          <div className="mt-16 max-w-[46em]">
            <ArticleMeta path={PATH} />
          </div>
          <References items={REFS_TREATMENT} />
          <MedicalNotice extra={NO_GUARANTEE_NOTE} />
        </Container>
      </section>
    </div>
  );
}
