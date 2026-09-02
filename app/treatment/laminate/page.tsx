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
const LEAD =
  '라미네이트는 치아 앞면만 0.3~0.7mm 얇게 다듬고 그 위에 세라믹 판을 붙이는 방법입니다. 되돌릴 수 없는 삭제량이 가장 적은 대신, 붙일 자리에 법랑질이 남아 있어야 하고 무는 힘이 앞니에 몰리지 않아야 합니다.';

export const metadata: Metadata = {
  title: '라미네이트',
  description: LEAD.slice(0, 155),
  alternates: { canonical: PATH },
  openGraph: og({ title: withLocality('라미네이트'), description: LEAD.slice(0, 155), path: PATH }),
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
        eyebrow="고양 화정동 라미네이트 · 보건복지부 인정 통합치의학과 전문의"
        title={['앞면만 얇게 덮어', '자연치아를 남깁니다']}
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
      <section className="py-24 lg:py-32">
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
      <section className="light-band border-y border-wine-line py-24 lg:py-32">
        <Container>
          <h2 className="display-sm max-w-[18em] text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
            라미네이트는 어떤 점이 다른가요?
          </h2>
          {/*
            ⚠️ 대가(note)를 빼고 앞줄만 남기지 말 것 — 장점만 다섯 줄 세우면 그게 광고문이다.
               원문에서 못 옮긴 두 줄의 이유는 lib/aestheticPage.ts 에 적어 뒀다.
          */}
          <ol className="reveal-stack mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {LAMINATE_FEATURES.map((f, i) => (
              <li key={f.t} className="reveal">
                <p className="text-[13.5px] font-black tracking-[0.06em] text-clay-700 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 text-[20px] leading-[1.4] font-black tracking-[-0.02em] text-ink">
                  {f.t}
                </h3>
                <p className="mt-3 max-w-[26em] text-[16.5px] leading-[1.85] text-twilight">
                  <Sentences text={f.d} />
                </p>
                <p className="mt-3 max-w-[26em] border-l-2 border-brand-300 pl-4 text-[15.5px] leading-[1.8] text-ink-soft">
                  <Sentences text={f.note} />
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── 03 가능한 조건 · 적합한 경우 ─────────────────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="display-sm max-w-[14em] text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
                이 세 가지를 먼저 확인합니다
              </h2>
              <ul className="reveal-stack mt-10 divide-y divide-wine-line border-y border-wine-line">
                {VENEER.requires.map((r) => (
                  <li key={r} className="reveal py-6 text-[17px] leading-[1.85] text-twilight">
                    <Sentences text={r} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="display-sm max-w-[14em] text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
                이런 경우에 검토합니다
              </h2>
              <ul className="reveal-stack mt-10 divide-y divide-wine-line border-y border-wine-line">
                {VENEER.indications.map((v) => (
                  <li key={v} className="reveal py-6 text-[17px] leading-[1.85] text-twilight">
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 04 색 맞추기 ─────────────────────────────────────────── */}
      <section className="light-band border-y border-wine-line py-24 lg:py-32">
        <Container>
          <h2 className="display-sm max-w-[18em] text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
            색은 이 순서로 맞춥니다
          </h2>
          <ol className="reveal-stack mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {SHADE_STEPS.map((s) => (
              <li key={s.n} className="reveal">
                <p className="text-[13.5px] font-black tracking-[0.06em] text-clay-700 tabular-nums">
                  {s.n}
                </p>
                <h3 className="mt-3 text-[18.5px] leading-[1.4] font-black tracking-[-0.02em] text-ink">
                  {s.t}
                </h3>
                <p className="mt-3 text-[16px] leading-[1.85] text-twilight">
                  <Sentences text={s.d} />
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── 05 한계 · 미리 아셔야 할 것 ──────────────────────────── */}
      {/* ⚠️⚠️ 이 구획을 지우지 말 것 — 의료법 제56조. 되돌릴 수 없는 치료다. */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <h2 className="display-sm max-w-[12em] text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
              미리 아셔야 할 것
            </h2>
            <div>
              <ul className="reveal-stack divide-y divide-wine-line border-y border-wine-line">
                {VENEER.limits.map((l) => (
                  <li key={l} className="reveal py-6 text-[17px] leading-[1.85] text-twilight">
                    <Sentences text={l} />
                  </li>
                ))}
                {RISKS.map((r) => (
                  <li key={r} className="reveal py-6 text-[17px] leading-[1.85] text-twilight">
                    <Sentences text={r} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 문답 ─────────────────────────────────────────────────── */}
      <section className="light-band border-y border-wine-line py-24 lg:py-32">
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
      <section className="py-24 lg:py-32">
        <Container>
          <h2 className="display-sm max-w-[13em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
            깎는 양부터 정하고 시작합니다
          </h2>
          <p className="mt-8 max-w-[36em] text-[17.5px] leading-[1.9] text-twilight">
            <Sentences text="앞면만 덮을지, 전체를 씌울지는 남은 법랑질과 맞물림이 정합니다. 두 방법을 나란히 두고 보시려면 심미보철 페이지에서 삭제량 비교를 보실 수 있습니다." />
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-3">
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
            ⚠️ 심미보철 링크를 지우지 말 것 — 두 페이지는 역할이 갈려 있어서, 서로를 가리키지
               않으면 '라미네이트만 보고 크라운은 못 본' 사람이 생긴다.
          */}
          <div className="mt-20 grid gap-8 border-t border-wine-line pt-12 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/treatment/crown-prosthesis" className="group">
              <p className="text-[14.5px] font-medium text-ink-soft">함께 보기</p>
              <p className="mt-3 text-[18px] leading-[1.4] text-ink transition-colors group-hover:text-clay-600">
                심미보철 — 깎는 양 비교 <span aria-hidden>→</span>
              </p>
            </Link>
            <Link href="/treatment/whitening" className="group">
              <p className="text-[14.5px] font-medium text-ink-soft">함께 보기</p>
              <p className="mt-3 text-[18px] leading-[1.4] text-ink transition-colors group-hover:text-clay-600">
                치아미백 <span aria-hidden>→</span>
              </p>
            </Link>
            {related.slice(0, 2).map((sym) =>
              sym ? (
                <Link key={sym.slug} href={`/insight/symptom/${sym.slug}`} className="group">
                  <p className="text-[14.5px] font-medium text-ink-soft">증상으로 찾기</p>
                  <p className="mt-3 text-[18px] leading-[1.4] text-ink transition-colors group-hover:text-clay-600">
                    {sym.short} <span aria-hidden>→</span>
                  </p>
                </Link>
              ) : null,
            )}
          </div>

          <div className="mt-16 max-w-[46em]">
            <ArticleMeta path={PATH} />
          </div>
          <References items={REFS_TREATMENT} />
          <MedicalNotice extra={NO_GUARANTEE_NOTE} />
        </Container>
      </section>
    </>
  );
}
