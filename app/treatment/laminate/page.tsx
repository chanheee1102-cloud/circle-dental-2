import type { Metadata } from 'next';
import Link from 'next/link';
import { CLINIC, NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { treatmentBySlug } from '@/lib/treatments';
import { symptomBySlug } from '@/lib/symptoms';
import { METHODS, LAMINATE_FEATURES, SHADE_STEPS, RISKS } from '@/lib/aestheticPage';
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
import { TreatmentClosing } from '@/components/TreatmentClosing';

/**
 * 라미네이트 — 심미보철에서 **꺼내 온** 전용 페이지.
 *
 * ★★ 왜 따로 만들었나 (2026-09-02 오너: "라미네이트 메뉴 꺼내서 하나 새로 만들자
 *    우리 심미보철안에 싹다 있잖아") ★★
 *   기존 홈페이지도 심미보철 아래에 라미네이트와 올세라믹 크라운을 **따로** 뒀다.
 *   우리는 둘을 한 페이지에 비교로만 담고 있어서, '라미네이트' 를 찾아온 사람이
 *   비교표부터 읽어야 했다. 검색·답변 엔진 쪽에서도 '라미네이트' 라는 주제를 지목할
 *   문서가 없던 셈이다(h1 도 '깎는 양이 결과를 정합니다' 였다).
 *
 * ⚠️⚠️ 심미보철 페이지와 역할이 다르다 — 합치지 말 것 ⚠️⚠️
 *   심미보철: **둘 중 무엇을 고를지** (삭제량 비교가 본문이다)
 *   여기:     **라미네이트 하나**를 깊게 (조건 · 특징 · 색 · 한계)
 *   두 페이지가 서로를 링크한다. 같은 문장을 양쪽에 복사하지 말 것 — 중복 문서가 된다.
 *
 * ★ 내용 원칙은 심미보철과 같다 — 원문 사실은 살리되 판단 근거(조건·대가·한계)를 함께 적는다.
 *   특징 다섯 줄의 근거와 원문에서 못 옮긴 두 줄은 lib/aestheticPage.ts 의
 *   LAMINATE_FEATURES 머리말에 적어 뒀다.
 * ⚠️ RISKS 구획을 지우지 말 것 — 부작용과 한계가 빠지면 이 페이지는 광고문이 된다(제56조).
 */

const PATH = '/treatment/laminate';
/* ⚠️ 2026-09-03 오너 지정 문구(히어로에 그대로 나간다). */
const LEAD =
  '라미네이트는 치아 앞면을 필요한 만큼만 다듬어, 얇은 세라믹을 부착하는 심미치료입니다. 동그라미치과에서는 자연치아 보존을 우선으로, 치아 상태와 교합을 세심하게 살펴 치료를 계획합니다.';

/**
 * 검색 결과에 뜨는 설명 — 화면 문구와 **일부러 다르게** 둔다.
 * ⚠️ LEAD 로 되돌리지 말 것 (2026-09-03) — 새 문구에는 '0.3~0.7mm' 도 '법랑질' 도 없다.
 *    삭제량 수치는 이 페이지가 심미보철과 갈리는 유일한 근거이고(본문 특징 01),
 *    법랑질 조건은 가능·불가능을 가르는 기준이다. 화면에서 빠진 만큼 여기서 지킨다.
 * ⚠️ 본문에 없는 것을 여기 적지 말 것.
 */
const META_DESC =
  '고양 화정동 라미네이트. 치아 앞면만 0.3~0.7mm 얇게 다듬고 그 위에 세라믹 판을 붙입니다. 되돌릴 수 없는 삭제량이 가장 적은 대신, 붙일 자리에 법랑질이 남아 있어야 하고 무는 힘이 앞니에 몰리지 않아야 합니다.';

export const metadata: Metadata = {
  title: '라미네이트',
  description: META_DESC.slice(0, 155),
  alternates: { canonical: PATH },
  openGraph: og({ title: withLocality('라미네이트'), description: META_DESC.slice(0, 155), path: PATH }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '진료과목', path: '/treatment' },
  { name: '라미네이트', path: PATH },
];

const DOC_IMAGE = {
  src: '/img/clinic/aes-veneer.webp',
  caption: '치아 모형 위에 얇은 세라믹 라미네이트를 올려 형태를 맞춰 보는 모습',
  width: 1280,
  height: 853,
};

/**
 * 라미네이트 자료는 METHODS 의 veneer 하나에서만 온다 — 두 곳에 적지 않는다.
 * ⚠️ find 결과를 그대로 쓰면 타입이 undefined 를 품어 모든 사용처에 경고가 붙는다.
 *    여기서 한 번만 확인하고 확정 타입으로 내보낸다.
 */
const VENEER = (() => {
  const found = METHODS.find((m) => m.key === 'veneer');
  if (!found) throw new Error('veneer 데이터 없음 — lib/aestheticPage.ts');
  return found;
})();

export default function LaminatePage() {
  const t = treatmentBySlug('laminate');
  if (!t) throw new Error('laminate 진료 데이터 없음 — lib/treatments.ts');
  const related = t.relatedSymptoms.map(symptomBySlug).filter(Boolean);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: withLocality('라미네이트'),
            description: LEAD,
            path: PATH,
            about: { type: 'MedicalProcedure', name: '라미네이트' },
            image: DOC_IMAGE,
          }),
          imageObjectSchema({ path: PATH, ...DOC_IMAGE }),
          articleSchema({
            path: PATH,
            title: '라미네이트',
            description: LEAD,
            wordCount: charCount(LEAD, VENEER.requires.join(''), t.intro),
            keywords: ['라미네이트', '세라믹 라미네이트', '치아 삭제량', '법랑질', '앞니 심미'],
            hasImage: true,
          }),
        ]}
      />

      <TreatmentHero
        trail={TRAIL}
        eyebrow="고양 화정동 라미네이트 · 보건복지부인증 통합치의학과 전문의"
        /* ⚠️ 2026-09-03 오너 지정 제목. 서술형으로 둔다 — 앞뒤 진료 페이지(사랑니 · 미백)가 질문형이라
           메뉴를 훑을 때 물음표만 이어지면 그것대로 기계가 쓴 것처럼 보인다.
           '최대한' 은 이 병원이 스스로 쓰는 말이다(자연치아를 최대한 살리는). */
        title={['자연치아를 최대한 보존하는', '동그라미 라미네이트']}
        lead={LEAD}
        photo={{
          src: DOC_IMAGE.src,
          alt: '치아 모형 위에 얇은 세라믹 라미네이트를 올려 형태를 맞춰 보는 모습.',
        }}
      />

      {/* ⚠️ 수치는 범위로만 적는다 — lib/aestheticPage.ts 의 reduction 과 같은 값이다. */}
      <TreatmentStrip
        items={[
          {
            k: '깎는 양',
            t: '앞면 0.3~0.7mm',
            d: '치아 전체를 1.0~1.5mm 줄이는 크라운의 절반 이하입니다.',
          },
          {
            k: '먼저 보는 것',
            t: '법랑질과 맞물림',
            d: '세라믹은 법랑질에 붙을 때 가장 단단히 결합하고, 무는 힘이 앞니에 몰리면 얇은 판이 견디기 어렵습니다.',
          },
          {
            k: '내원 횟수',
            t: '보통 2~3회',
            d: '앞면을 다듬어 본을 뜨고, 제작된 판을 붙인 뒤 형태와 맞물림을 다듬습니다.',
          },
        ]}
      />

      {/* ── 01 무엇인가 ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <p className="eyebrow-chip text-clay-700">라미네이트란</p>
          <h2 className="display-sm reveal mt-5 max-w-[16em] text-[clamp(26px,3.6vw,40px)] leading-[1.2] tracking-[-0.02em] text-ink">
            {VENEER.def}
          </h2>
          <p className="reveal mt-8 max-w-[46em] text-[17.5px] leading-[1.9] text-twilight">
            <Sentences text={t.intro} />
          </p>
        </Container>
      </section>

      {/* ── 02 특징 (기존 홈페이지 원문) ─────────────────────────── */}
      <section className="light-band border-y border-wine-line py-16 sm:py-24 lg:py-32">
        <Container>
          <h2 className="display-sm max-w-[18em] text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
            라미네이트는 어떤 점이 다른가요?
          </h2>
          {/*
            ⚠️ 대가(note)를 빼고 앞줄만 남기지 말 것 — 장점만 다섯 줄 세우면 그게 광고문이다.
               원문에서 못 옮긴 두 줄의 이유는 lib/aestheticPage.ts 에 적어 뒀다.
          */}
          {/*
            ★★ 카드로 바꿨다 (2026-09-04 오너: "카드형태로 하든지 지금 행, 열, 배치, 안맞음") ★★
              두 칸 격자에 여백만으로 나눠 뒀더니 칸마다 글 길이가 달라 **행이 어긋났다** —
              다섯째만 아래에 혼자 남고 왼쪽에 큰 빈자리가 생겼다.
            ⚠️ h-full 을 지우지 말 것 — 이것이 같은 줄의 카드 높이를 맞춘다(격자 기본값 stretch).
               없으면 카드마다 높이가 달라 다시 어긋나 보인다.
            ⚠️ 대가(note)를 빼고 앞줄만 남기지 말 것 — 장점만 다섯 줄 세우면 그게 광고문이다.
               원문에서 못 옮긴 두 줄의 이유는 lib/aestheticPage.ts 에 적어 뒀다.
          */}
          <ol className="reveal-stack mt-12 grid gap-5 sm:grid-cols-2">
            {LAMINATE_FEATURES.map((f, i) => (
              <li key={f.t} className="reveal">
                <div className="flex h-full flex-col rounded-2xl border border-brand-200/70 bg-parchment p-7 sm:p-8">
                  <p className="text-[13.5px] font-black tracking-[0.06em] text-clay-700 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 text-[20px] leading-[1.4] font-black tracking-[-0.02em] text-ink">
                    {f.t}
                  </h3>
                  <p className="mt-3 text-[16.5px] leading-[1.85] text-twilight">
                    <Sentences text={f.d} />
                  </p>
                  {/* mt-auto — 대가 줄을 카드 아래에 붙여 카드마다 같은 자리에 오게 한다. */}
                  <p className="mt-auto border-l-2 border-brand-300 pt-5 pl-4 text-[15.5px] leading-[1.8] text-ink-soft">
                    <Sentences text={f.note} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── 03 가능한 조건 · 적합한 경우 ─────────────────────────── */}
      {/*
        ★ '이 세 가지를 먼저 확인합니다 / 이런 경우에 검토합니다' 두 칸을 뺐다 (2026-09-04 오너: "없애줘").
          바로 위 01~05 칸이 같은 것을 이미 말하고 있었다 — 삭제량·접착면·무는 힘·색.
        ⚠️ VENEER.requires / VENEER.indications 자료는 그대로 둔다(lib/aestheticPage.ts).
           되살릴 때 다시 쓰거나 다른 화면이 가져다 쓸 수 있다.
      */}

      {/* ── 04 색 맞추기 ─────────────────────────────────────────── */}
      {/*
        ★ '색은 이 순서로 맞춥니다' 를 뺐다 (2026-09-04 오너: "열한번째 사진 내용이 열두번째랑 같은데
           한곳에서 삭제하던지"). 같은 SHADE_STEPS 를 심미보철 페이지도 쓰는데, 그쪽은 **구강스캐너
           사진과 함께** 보여 준다. 사진이 있는 쪽을 남기고 이 넉 칸짜리 사본을 뺐다.
        ⚠️ 정본은 app/treatment/crown-prosthesis/page.tsx 의 '보철 색은 순서를 지켜야 맞출 수 있습니다' 다.
           둘을 다시 같이 두지 말 것 — 같은 글이 한 사이트에 두 번 있으면 검색이 어느 쪽을 고를지 헷갈린다.
      */}

      {/* ── 05 한계 · 치료 전에 알아 두실 점 ──────────────────────────── */}
      {/* ⚠️⚠️ 이 구획을 지우지 말 것 — 의료법 제56조. 되돌릴 수 없는 치료다. */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <h2 className="display-sm max-w-[12em] text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
              치료 전에 알아 두실 점
            </h2>
            <div>
              <ul className="reveal-stack divide-y divide-wine-line border-y border-wine-line">
                {VENEER.limits.map((l) => (
                  <li key={l} className="reveal py-6 text-[17px] leading-[1.85] text-twilight">
                    <Sentences text={l} />
                  </li>
                ))}
                {/*
                  ★ 번호를 붙였다 (2026-09-04 오너: "번호 붙여줘"). 선으로만 나눠 두면 몇 가지인지
                    세어야 알 수 있고, 읽다가 어디까지 봤는지도 잃는다.
                  ⚠️ min-w-0 flex-1 을 지우지 말 것 — 없으면 글이 어절 폭으로 눌린다.
                */}
                {RISKS.map((r, i) => (
                  <li key={r} className="reveal flex gap-4 py-6">
                    <span
                      aria-hidden
                      className="mt-1 shrink-0 text-[13.5px] font-black tracking-[0.06em] text-clay-700 tabular-nums"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="min-w-0 flex-1 text-[17px] leading-[1.85] text-twilight">
                      <Sentences text={r} />
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 문답 ─────────────────────────────────────────────────── */}
      <section className="light-band border-y border-wine-line py-16 sm:py-24 lg:py-32">
        <Container>
          <h2 className="display-sm max-w-[18em] text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
            많이 묻는 것
          </h2>
          <div className="reveal-stack mt-10 divide-y divide-wine-line border-y border-wine-line">
            {t.qa.map((qa, i) => (
              <div key={qa.q} className="reveal grid gap-4 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
                <h3 className="flex gap-3 text-[18px] leading-[1.5] font-black tracking-[-0.02em] text-ink">
                  {/* ⚠️ 번호와 질문 사이에 공백을 두지 말 것 — React 가 그 자리에 주석 노드를 넣는다. */}
                  <span aria-hidden className="shrink-0 text-clay-700 tabular-nums">{`Q${i + 1}`}</span>
                  <span>{qa.q}</span>
                </h3>
                <p className="text-[16.5px] leading-[1.9] text-twilight">
                  <Sentences text={qa.a} />
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 마무리 ───────────────────────────────────────────────── */}
      {/*
        ⚠️ 이 마무리를 페이지 안에 다시 풀어 쓰지 말 것 (2026-09-04) — 일곱 페이지가 각자 복사본을
           갖고 있어서 충치만 단추가 오른쪽이고 나머지는 왼쪽이었다. 부품은 components/TreatmentClosing.tsx.
      */}
      <TreatmentClosing
        title="깎는 양부터 정하고 시작합니다"
        lead="앞면만 덮을지, 전체를 씌울지는 남은 법랑질과 맞물림이 정합니다. 두 방법을 나란히 두고 보시려면 심미보철 페이지에서 삭제량 비교를 보실 수 있습니다."
        links={[
          { label: '함께 보기', title: '심미보철에서 깎는 양 비교하기', href: '/treatment/crown-prosthesis' },
          { label: '함께 보기', title: '치아미백', href: '/treatment/whitening' },
          ...related.slice(0, 2).map((s) => ({ label: '증상으로 찾기', title: s!.title, href: `/insight/symptom/${s!.slug}` })),
        ]}
      />
    </>
  );
}
