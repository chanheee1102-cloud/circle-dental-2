import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CLINIC, NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { treatmentBySlug } from '@/lib/treatments';
import { symptomBySlug } from '@/lib/symptoms';
import {
  ISOLATION_BODY,
  STEPS,
  PRODUCT_POINTS,
  INDICATIONS,
  WORKS_ON,
  RISKS,
  AFTERCARE,
} from '@/lib/whiteningPage';
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
 * 치아미백 — 실험실(Integrated Biosciences) 시스템으로 만든 페이지.
 *
 * ★★ 이 시스템의 규칙 — 어기면 다른 사이트가 된다 ★★
 *   ① **단일 굵기.** 제목부터 본문까지 전부 400 이다. 위계는 굵기가 아니라 크기와 자간으로만
 *      만든다. 자간은 크기에 비례해 조인다 — 큰 제목 -0.03em, 본문 -0.001em.
 *   ② **그림자 없음.** 깊이는 면 색과 1px 헤어라인으로만 만든다.
 *   ③ **강조는 미세 면에만.** 라임은 40×40 화살표 버튼과 6px 점에서만 쓴다. 큰 면·본문 뒤·
 *      그라디언트 금지. 나머지가 전부 무채색이라 초록이 나타날 때 눈이 그리로 간다.
 *   ④ **순검정은 푸터에만.** 본문 어두운 면은 abyss(#222f30) — 초록 기운을 품은 어두운 색이라
 *      라임과 같은 계열로 읽힌다.
 *   ⑤ 고정폭은 라벨·번호·태그에만. 제목이나 긴 본문에 쓰지 않는다.
 *
 * ⚠️ 레퍼런스는 사진 대신 현미경·분자 렌더를 쓰지만, 여기서는 **병원의 실제 사진**을 쓴다.
 *    기존 홈페이지 자산을 옮기는 것이 이 작업의 전제다(오너 지시). 대신 밝은 라이프스타일
 *    컷(웃는 입·모형 스톡)은 빼고 어두운 시술·제품 사진만 골라 12~16px 라운드에 담았다.
 * ⚠️ 원본을 확대해 늘리지 않는다 — 제품 컷은 625x404 라 그 이상 키우면 뭉갠다.
 * ⚠️ RISKS 를 지우지 말 것. 미백은 개인차와 재착색이 큰 처치라 이것이 빠지면 광고문이 된다.
 * ⚠️ app/treatment/[slug] 의 generateStaticParams 에서 whitening 을 빼 두었다.
 */

/* ⚠️ 옛 주소(/treatment/aesthetic)로 되돌리지 말 것 — 메뉴·내용이 '치아미백' 인데
   주소만 aesthetic 이라 셋이 어긋나 있었다(2026-09-01). next.config 에 301 이 걸려 있다. */
const PATH = '/treatment/whitening';
/* ★ 제목이 던진 분기를 그대로 이어받는다 — 아래 04 구간이 이 이야기를 펼친다. */
/* ⚠️ 2026-09-03 오너 지정 문구(히어로에 그대로 나간다). */
const LEAD =
  '치아미백은 치아에 스며든 색소를 분해해, 본연의 치아색을 보다 밝게 개선하는 치료입니다. 변색의 원인과 치아 상태에 따라 미백 효과에 차이가 있을 수 있어, 정확한 원인을 파악한 뒤 적합한 방법을 안내드립니다.';

/**
 * 검색 결과에 뜨는 설명 — 화면 문구와 **일부러 다르게** 둔다.
 * ⚠️ LEAD 로 되돌리지 말 것 (2026-09-03) — 새 문구에는 '법랑질'·'착색'·'보철물' 이 없다.
 *    셋 다 본문 04 구간('듣는 착색과 안 듣는 착색')이 실제로 다루는 내용이고,
 *    '미백 안 되는 치아' 를 찾는 사람이 치는 말이다.
 */
const META_DESC =
  '고양 화정동 치아미백. 미백제는 법랑질 안에 스며든 착색을 분해합니다. 겉에 쌓인 착색에는 잘 듣지만 안쪽에서 온 변색이나 보철물은 같은 방법으로 밝아지지 않아, 변색의 원인부터 확인하고 시작합니다.';

export const metadata: Metadata = {
  title: '치아미백',
  description: META_DESC.slice(0, 155),
  alternates: { canonical: PATH },
  openGraph: og({ title: withLocality('치아미백'), description: META_DESC.slice(0, 155), path: PATH }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '진료과목', path: '/treatment' },
  { name: '치아미백', path: PATH },
];

const DOC_IMAGE = {
  src: '/img/clinic/wh-light.webp',
  caption: '전용 광조사기의 빛이 미백제를 바른 앞니에 조사되고 있는 모습',
  width: 1920,
  height: 400,
};

/** 이 페이지에서만 쓰는 고정폭 라벨. */
/*
 * ⚠️⚠️ 한글 라벨에 이 고정폭을 다시 쓰지 말 것 (2026-09-02 오너: "잘 안보이는 폰트는
 *    전부 수정해") ⚠️⚠️
 *   시스템 고정폭 스택에는 한글 글자체가 없어서, 한글이 섞이면 **글자마다 다른 폰트로
 *   떨어지고 자간이 벌어져** 같은 크기여도 훨씬 흐리게 읽힌다. 라틴 문자(PRODUCT, FAQ)
 *   에만 남긴다.
 * ★ 한글 라벨은 아래 LABEL 을 쓴다 — 같은 자리, 같은 역할, 읽히는 글꼴.
 */
const MONO = 'font-[family-name:var(--font-mono)] tracking-[-0.02em]';
/** 한글 라벨 — 구획 안의 작은 제목. 고정폭 대신 본문 글꼴을 굵게 쓴다. */
const LABEL = 'text-[16px] font-bold tracking-[-0.01em] text-ink';

/**
 * 주 행동 버튼.
 * ⚠️ 고정폭 글자 + 라임 사각 화살표였던 것을 홈 규격(알약·16px·semibold)으로 통일했다
 *    (2026-08-28). 이 페이지만 버튼 언어가 달라 다른 사이트처럼 보였다.
 * ⚠️ 색을 반드시 지정한다 — 없으면 body 색을 물려받아 어두운 면에서 사라진다.
 */
function ArrowBtn({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const inner = (
    <>
      {label}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </>
  );
  const cls =
    'group inline-flex items-center gap-2 rounded-full bg-wine-bg px-8 py-4 text-[17px] font-semibold text-dusk transition-colors hover:bg-mist';
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** 구간 번호 — 목차 역할. */
function Counter({ n, total, dark }: { n: string; total: string; dark?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[14px] ${MONO} ${
        dark ? 'border-brand-200/70 text-ink-soft' : 'border-brand-200/70 text-ink-soft'
      }`}
    >
      {n} / {total}
    </span>
  );
}

export default function WhiteningPage() {
  const t = treatmentBySlug('whitening');
  if (!t) throw new Error('whitening 진료 데이터 없음 — lib/treatments.ts');
  const related = t.relatedSymptoms.map(symptomBySlug).filter(Boolean);

  return (
    <div className=" bg-wine-bg">
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: withLocality('치아미백'),
            description: LEAD,
            path: PATH,
            about: { type: 'MedicalProcedure', name: '치아미백' },
            image: DOC_IMAGE,
          }),
          imageObjectSchema({ path: PATH, ...DOC_IMAGE }),
          articleSchema({
            path: PATH,
            title: '치아미백',
            description: LEAD,
            wordCount: charCount(LEAD, STEPS.map((s) => s.d).join('')),
            keywords: ['치아미백', 'BeauTis', '전문가 미백', '잇몸 격리'],
            hasImage: true,
          }),
        ]}
      />

      {/*
        머리말 — 진료과목 아홉 곳이 같은 부품을 쓴다 (2026-09-01 오너 지시).
        ⚠️ 여기서 손으로 다시 그리지 말 것. 모양은 components/TreatmentShell.tsx 에서 바꾼다.
        ⚠️ 이 페이지만의 MONO 빵부스러기·lichen 색 눈썹으로 되돌리지 말 것 —
           같은 메뉴 안에서 페이지마다 머리가 달라 보였던 원인이다.
      */}
      {/*
        ⚠️ '겉에 쌓인 색인지, 안쪽에서 온 색인지.' 로 되돌리지 말 것 (2026-09-02 오너:
           "너무 AI 티나고 이상한거는 좀 자연스럽고 ... 전문적으로"). 두 조각을 이어야
           문장이 되는 제목은 훑을 때 무슨 말인지 안 잡히고, 병원 홈페이지 어투가 아니다.
        ★ 지금 제목은 이 페이지가 실제로 하는 일을 그대로 적은 것이다 — 변색 원인을
          먼저 확인하고 방법을 정한다. 검색·답변 엔진이 찾는 문장 형태이기도 하다.
      */}
      <TreatmentHero
        trail={TRAIL}
        eyebrow="고양 화정동 치아미백 · 보건복지부인증 통합치의학과 전문의"
        /* ⚠️ 2026-09-03 오너 지정 제목. 물음표를 지우지 말 것 — 미백에서 가장 많이 받는 질문이고,
           바로 아래 lead 가 '겉 착색은 듣고 안쪽 변색·보철물은 아니다' 로 답한다. */
        title={['치아미백은', '누구나 효과를 볼 수 있나요?']}
        lead={LEAD}
        photo={{
          src: '/img/clinic/wh-light.webp',
          alt: '전용 광조사기의 푸른빛이 미백제를 바른 앞니에 조사되고 있는 모습.',
        }}
      />

      {/* ⚠️ 지어낸 문구를 넣지 말 것 — 세 칸 모두 lib/whiteningPage.ts 의 제조사 표기와 이 페이지 본문에서 왔다. */}
      <TreatmentStrip
        items={[
          {
            k: '약제',
            t: '저농도 미백제',
            d: '특수 활성제를 더해 고농도 미백제에 준하는 효과를 내도록 설계된 제품입니다(제조사 표기 기준).',
          },
          {
            k: '광원',
            t: 'BeauTis Light',
            d: '자외선이 아닌 가시광선을 쓰는 전용 광조사기를 함께 사용합니다.',
          },
          {
            k: '먼저 보는 것',
            t: '변색의 원인 확인',
            d: '겉에 쌓인 착색인지 안쪽에서 온 변색인지에 따라 방법이 갈립니다.',
          },
        ]}
      />

      {/* ⚠️ 같은 사진을 띠로 다시 두지 말 것 — 히어로 배경으로 올라갔다(2026-09-01). */}

      {/* ── 01 잇몸 격리 — 이 병원이 원문에서 강조한 부분 ─────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <Counter n="01" total="05" dark />
          <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
            <div>
              <h2 className="display-sm max-w-[13em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
                미백제가 잇몸에 닿지 않도록 먼저 격리합니다
              </h2>
              <div className="mt-10 max-w-[32em] space-y-6 text-[18px] leading-[1.7] font-normal tracking-[-0.001em] text-ink-soft">
                {ISOLATION_BODY.map((p) => (
                  <p key={p}>
                    <Sentences text={p} />
                  </p>
                ))}
              </div>
            </div>
            <div className="card-edge img-in reveal overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/img/scene/wh-barrier.webp"
                  alt="개구기를 낀 치아 모형의 잇몸 경계를 따라 가느다란 주사기 끝으로 보호막을 도포하는 접사."
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 02 과정 ─────────────────────────────────────────────────── */}
      <section className="border-t border-brand-200/70 py-24 lg:py-32">
        <Container>
          <Counter n="02" total="05" dark />
          <h2 className="display-sm mt-10 max-w-[12em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
            미백은 다섯 단계로 진행합니다
          </h2>

          <ol className="reveal-stack mt-16 divide-y divide-wine-line border-y border-brand-200/70">
            {STEPS.map((s) => (
              <li key={s.n} className="reveal grid gap-6 py-9 lg:grid-cols-[6rem_minmax(0,14em)_minmax(0,1fr)] lg:gap-10">
                <span className={`${MONO} text-[14px] font-bold text-clay-600`}>{s.n}</span>
                <h3 className="display-sm text-[24px] leading-[1.2] tracking-[-0.006em] text-ink">
                  {s.t}
                </h3>
                <p className="max-w-[36em] text-[18px] leading-[1.65] font-normal text-ink-soft"><Sentences text={s.d} /></p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── 03 제품 — 밝은 면으로 뒤집는다 ─────────────────────────── */}
      <section className="border-y border-brand-200/70 light-band py-24 lg:py-32">
        <Container>
          <Counter n="03" total="05" />
          <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
            <h2 className="display-sm max-w-[13em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
              오스템 BeauTis 미백 솔루션을 사용합니다
            </h2>
            <p className={`${MONO} flex items-center gap-2.5 text-[14px] text-ink-soft`}>
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-clay-600" />
              PRODUCT
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            {/* 제품 컷 — 원본 625x404. 카드 폭 안에서만 쓰고 늘리지 않는다. */}
            <div className="rounded-[20px] border border-brand-200 bg-parchment p-2">
              <div className="card-edge img-in reveal overflow-hidden rounded-[13px] bg-wine-bg">
                <div className="relative aspect-[16/10]">
                  <Image
                    src="/img/clinic/wh-kit.webp"
                    alt="오스템 BeauTis 치아미백 시술용 미백제 두 종류의 제품 사진."
                    fill
                    sizes="(min-width: 1024px) 460px, 100vw"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <ul className="grid gap-6 sm:grid-cols-2">
              {PRODUCT_POINTS.map((p) => (
                <li key={p.t} className="rounded-2xl border border-brand-200/70 bg-parchment p-8">
                  <p className={LABEL}>{p.k}</p>
                  <h3 className="display-sm mt-4 text-[24px] leading-[1.2] tracking-[-0.006em] text-ink">
                    {p.t}
                  </h3>
                  <p className="mt-4 text-[18px] leading-[1.6] font-normal text-ink-soft"><Sentences text={p.d} /></p>
                </li>
              ))}
            </ul>
          </div>

          {/* 적응증 — 원문 3가지. */}
          <div className="mt-16 rounded-2xl border border-brand-200/70 bg-parchment p-8 sm:p-12">
            <p className={LABEL}>이런 분들께 권합니다</p>
            <ul className="mt-8 divide-y divide-wine-line border-y border-brand-200/70">
              {INDICATIONS.map((v) => (
                <li key={v} className="py-6 text-[20px] leading-[1.4] font-normal tracking-[-0.006em] text-ink"><Sentences text={v} /></li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── 04 듣는 착색과 안 듣는 착색 ────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <Counter n="04" total="05" dark />
          <h2 className="display-sm mt-10 max-w-[12em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
            모든 어두움이 미백으로 밝아지지는 않습니다
          </h2>
          <p className="mt-8 max-w-[34em] text-[18px] leading-[1.7] font-normal text-ink-soft">
            <Sentences text="미백제는 법랑질 안에 스며든 착색 분자를 분해합니다. 그래서 어두움이 어디서 왔는지에 따라 듣는 정도가 다르고, 아예 다른 방법이 필요한 경우도 있습니다." />
          </p>

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {WORKS_ON.map((g, gi) => (
              <div key={g.label} className="rounded-2xl border border-brand-200/70 bg-parchment p-8">
                <p className={`${LABEL} flex items-center gap-2.5`}>
                  {gi === 0 ? <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-clay-600" /> : null}
                  {g.label}
                </p>
                <ul className="mt-8 divide-y divide-wine-line border-y border-brand-200/70">
                  {g.items.map((it) => (
                    <li key={it} className="py-5 text-[17.5px] leading-[1.6] font-normal text-ink"><Sentences text={it} /></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ⚠️ 색조 가이드 사진을 되살리지 말 것 (2026-09-01 오너) — 바로 위 단계 목록이
              이미 같은 이야기를 하고 있어 사진이 한 번 더 말할 것이 없었다. */}
        </Container>
      </section>

      {/*
        ── 05 미리 아셔야 할 것 ────────────────────────────────────
        ⚠️⚠️ 지우지 말 것 — 의료법 제56조. 미백은 개인차와 재착색이 큰 처치다.
      */}
      <section className="border-y border-brand-200/70 light-band py-24 lg:py-32">
        <Container>
          <Counter n="05" total="05" />
          <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <h2 className="display-sm text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
              미백 전에 알아 두실 점
            </h2>
            <ul className="divide-y divide-wine-line border-y border-brand-200/70">
              {RISKS.map((r) => (
                <li key={r} className="py-6 text-[18px] leading-[1.65] font-normal text-ink-soft"><Sentences text={r} /></li>
              ))}
            </ul>
          </div>

          <div className="mt-16 rounded-2xl border border-brand-200/70 bg-parchment p-8 sm:p-12">
            <p className={LABEL}>미백 후 며칠</p>
            <ul className="mt-8 grid gap-x-12 gap-y-6 sm:grid-cols-2">
              {AFTERCARE.map((a) => (
                <li key={a} className="flex gap-4 text-[17.5px] leading-[1.6] font-normal text-ink">
                  <span aria-hidden className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-clay-600" />
                  <span className="min-w-0 flex-1"><Sentences text={a} /></span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── 마무리 ──────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <h2 className="display-sm focus-in max-w-[12em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
            변색의 원인에 따라 미백 방법이 달라집니다
          </h2>
          <p className="mt-10 max-w-[34em] text-[18px] leading-[1.7] font-normal text-ink-soft">
            <Sentences text="같은 누런색이라도 겉에 쌓인 것인지, 안쪽에서 온 것인지에 따라 방법이 달라집니다. 보철물이 있는 경우에는 색이 어긋나지 않도록 순서를 먼저 정합니다." />
          </p>

          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5">
            <ArrowBtn href={CLINIC.booking.naver} label="진료 예약하기" external />
            <a
              href={CLINIC.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/60 px-8 py-4 text-[17px] font-semibold tabular-nums text-ink transition-colors hover:bg-ink hover:text-wine-bg"
            >
              {CLINIC.phone}
            </a>
          </div>

          <div className="mt-20 grid gap-8 border-t border-brand-200/70 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/faq#whitening" className="group">
              <p className={`${MONO} text-[14px] font-bold text-ink-soft`}>FAQ</p>
              <p className="mt-3 text-[18px] leading-[1.4] font-normal text-ink transition-colors group-hover:text-clay-600">
                많이 묻는 것 {t.qa.length}가지
              </p>
            </Link>
            <Link href="/treatment/crown-prosthesis" className="group">
              <p className="text-[14.5px] font-medium text-ink-soft">함께 보기</p>
              <p className="mt-3 text-[18px] leading-[1.4] font-normal text-ink transition-colors group-hover:text-clay-600">
                심미보철
              </p>
            </Link>
            {related.slice(0, 2).map((s) => (
              <Link key={s!.slug} href={`/insight/symptom/${s!.slug}`} className="group">
                <p className="text-[14.5px] font-medium text-ink-soft">증상</p>
                <p className="mt-3 text-[18px] leading-[1.4] font-normal text-ink transition-colors group-hover:text-clay-600">
                  {s!.title}
                </p>
              </Link>
            ))}
          </div>

          {/*
            ⚠️ 발행 정보·근거·고지를 마무리 구획 **안에** 둔다 (2026-09-03). 전에는 순검정 띠
               (bg-void)에 따로 담았는데 셋 다 null 을 돌려주는 부품이라 **아무것도 없는
               검은 띠 128px** 이 푸터 위에 남아 있었다. 다시 켜지면 여기서 그대로 나타난다.
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
