import type { Metadata } from 'next';
import Link from 'next/link';
import { CLINIC, NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { Container, MedicalNotice, Sentences } from '@/components/ui';
import { TreatmentHero, TreatmentStrip } from '@/components/TreatmentShell';
import { JsonLd } from '@/components/JsonLd';
import { ArticleMeta, References, headingId, charCount } from '@/components/article';
import { REFS_TREATMENT } from '@/lib/references';
import {
  breadcrumbSchema,
  medicalWebPageSchema,
  articleSchema,
  faqSchema,
  og,
  withLocality,
} from '@/lib/seo';

/**
 * 발치 즉시 식립 · 임플란트 재수술 — **한 페이지**.
 *
 * ★★ 왜 둘을 한 페이지에 두는가 (2026-09-03 오너) ★★
 *   처음에는 주제를 쪼개 재수술 페이지를 따로 만들고 임플란트 하위 여덟 개를 메뉴에 걸었다.
 *   오너: "이렇게 여러페이지 말고 한페이지에 좀 간략하게, 이미 임플란트 페이지에 있는 내용
 *   빼고, 재수술이나 발치 후 즉시 식립 내용 정도만." 맞는 지적이다 — 둘 다 **'언제 심느냐'**
 *   하나로 묶이는 이야기이고(뽑자마자 심느냐 / 빼내고 기다렸다 다시 심느냐), 따로 두면
 *   각각은 얇은데 메뉴만 길어진다.
 *
 * ⚠️ /treatment/implant 가 이미 다루는 것은 **여기서 되풀이하지 않는다** —
 *    디지털 방식(3D CT·모의수술), 시술 4단계, 방식 비교, 진행 순서와 기간, 수술 후 주의사항,
 *    치료 증례. 이 페이지는 그 페이지가 다루지 않는 '두 갈래' 만 맡는다.
 * ⚠️ 참고 사이트(오너가 준 주소 둘)의 것을 옮기지 않았다 — 성공률·실패 원인 비율 수치,
 *    병원 고유 프로토콜 이름, 환자 증례, '첫 수술보다 훨씬 섬세한' 같은 우월성 표현은 전부 뺐다.
 *    남긴 것은 표준 치과 지식과 우리 데이터에 이미 있는 사실뿐이다(의료법 제56조).
 * ⚠️ 임플란트주위염의 원인·단계·예방은 lib/conditions.ts 가 갖고 있다. 여기서 다시 쓰지 말고
 *    링크로 이을 것 — 같은 내용이 두 곳에 있으면 검색이 어느 쪽을 고를지 헷갈린다.
 * ⚠️ 예전 주소 /treatment/implant/immediate-placement 는 next.config.ts 에서 이리로 301 이다.
 */

const PATH = '/treatment/implant/extraction-and-retreatment';

/* ⚠️ 히어로에 그대로 나간다. 두 갈래를 한 문장씩만 — 간략함이 이 페이지의 요구다. */
const LEAD =
  '치아를 뽑은 자리에 바로 심을 수 있는 경우가 있고, 이미 심은 임플란트를 빼내고 다시 심어야 하는 경우가 있습니다. 어느 쪽이든 남은 뼈가 임플란트를 붙잡아 줄 수 있는지가 먼저이고, 그것을 방사선 사진으로 확인한 뒤에 말씀드립니다.';

/**
 * 검색 설명 — 두 질의를 한 문장씩 담는다.
 * ⚠️ '발치 즉시 임플란트' 와 '임플란트 재수술' 은 서로 다른 검색어다. 한 페이지가 둘을
 *    맡는 이상 설명에 둘 다 들어 있어야 어느 쪽으로 들어와도 이 문서가 답으로 보인다.
 */
const META_DESC =
  '고양 화정동 발치 즉시 임플란트와 임플란트 재수술. 뽑은 자리에 바로 심을 수 있는 조건, 이미 심은 임플란트를 빼내고 다시 심어야 하는 경우와 그때 걸리는 기간을 정리했습니다.';

export const metadata: Metadata = {
  title: '발치 즉시 식립 · 재수술',
  description: META_DESC.slice(0, 155),
  alternates: { canonical: PATH },
  openGraph: og({ title: withLocality('발치 즉시 식립 · 임플란트 재수술'), description: META_DESC.slice(0, 155), path: PATH }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '진료과목', path: '/treatment' },
  { name: '임플란트', path: '/treatment/implant' },
  { name: '발치 즉시 식립 · 재수술', path: PATH },
];

/** 히어로 아래 세 칸 — 두 갈래를 가르는 기준만. 기간·단계는 임플란트 페이지가 갖는다. */
const STRIP = [
  { k: '바로 심을 때', t: '급성 염증이 없을 것', d: '뽑은 자리에 고름이나 심한 염증이 있으면 아물기를 기다렸다 심는 편이 안전합니다.' },
  { k: '다시 심을 때', t: '뼈가 회복된 뒤', d: '빼낸 자리의 뼈가 아무는 데 보통 3~6개월이 걸립니다. 남은 뼈가 충분하면 동시에 심기도 합니다.' },
  { k: '둘 다 먼저 보는 것', t: '남은 뼈와 잇몸', d: '임플란트를 붙잡아 줄 뼈가 있는지가 두 경우 모두의 출발점입니다.' },
];

/* ── 발치 즉시 식립 ─────────────────────────────────────────────── */
const IMMEDIATE = {
  what:
    '치아를 뽑은 그 자리에 곧바로 임플란트를 심는 방법입니다. 뽑은 뒤 아무는 기간(보통 2~3개월)을 건너뛰는 만큼 전체 기간과 수술 횟수가 줄고, 뽑은 자리의 뼈가 줄어드는 것을 덜어 주어 앞니처럼 잇몸 모양이 중요한 부위에서 특히 검토합니다.',
  yes: [
    '뽑을 자리에 급성 감염이나 고름이 없는 경우',
    '임플란트를 단단히 고정할 만큼 주변 뼈가 남아 있는 경우',
    '앞니처럼 잇몸 선과 모양을 지키는 것이 중요한 부위',
  ],
  care: [
    '뽑은 자리는 뿌리 모양이라 임플란트와 형태가 달라 빈틈이 생기고, 그 공간을 채우는 뼈이식이 함께 필요한 경우가 많습니다',
    '바로 심는 것과 바로 씹는 것은 다릅니다. 뼈와 붙는 기간은 그대로 필요합니다',
    '초기 고정이 부족하면 계획을 바꿔 아물기를 기다렸다 심어야 할 수 있습니다',
  ],
};

/* ── 임플란트 재수술 ────────────────────────────────────────────── */
const REDO = {
  what:
    '이미 심은 임플란트를 빼내고, 뼈가 회복된 뒤 다시 심는 치료입니다. 다만 흔들린다고 모두 빼는 것은 아니어서, 나사나 보철물이 풀린 것인지 임플란트를 붙잡는 뼈가 녹은 것인지부터 가릅니다. 앞쪽이면 부품을 바꾸는 것으로 끝나고, 뒤쪽이면 제거가 필요합니다.',
  yes: [
    '임플란트 주변 잇몸이 자주 붓고 고름이 나오는 경우',
    '방사선 사진에서 임플란트를 붙잡는 뼈가 줄어든 것이 확인되는 경우',
    '임플란트 자체가 흔들리는 경우',
    '심은 위치나 방향 때문에 청소가 어렵거나 씹는 힘이 한쪽으로 몰리는 경우',
  ],
  care: [
    '빼낼 때 주변 뼈가 함께 없어져 뼈이식이 필요한 경우가 많습니다',
    '위턱 어금니는 상악동, 아래턱은 신경관이 가까워 처음 심을 때보다 확인할 것이 많습니다',
    '뼈가 회복되기를 기다리는 기간이 있어, 전체 기간은 처음 심을 때보다 깁니다',
    '원인이 관리 습관·흡연·조절되지 않는 당뇨라면, 다시 심어도 같은 일이 반복될 수 있습니다',
  ],
};

const QA = [
  {
    q: '발치하고 바로 심으면 기간이 얼마나 줄어드나요?',
    a: '뽑은 자리가 아무는 기간, 보통 2~3개월을 건너뛰는 만큼 줄어듭니다. 다만 빈 공간을 채우는 뼈이식을 함께 하면 그 차이는 작아집니다.',
  },
  {
    q: '임플란트가 흔들리면 무조건 빼야 하나요?',
    a: '아닙니다. 위에 얹힌 보철물이나 나사가 풀린 것과, 임플란트를 붙잡는 뼈가 녹아 흔들리는 것은 다릅니다. 앞쪽이라면 조이거나 부품을 바꾸는 것으로 끝나고, 뒤쪽이라면 제거가 필요합니다. 방사선 사진으로 어느 쪽인지 먼저 확인합니다.',
  },
  {
    q: '재수술은 처음 심은 곳이 아니어도 되나요?',
    a: '됩니다. 다만 어떤 임플란트를 썼는지 알면 빼내는 기구와 방법을 미리 정할 수 있어 도움이 됩니다. 촬영한 사진이나 시술 기록이 있으면 가져오시고, 없어도 CT로 확인해 계획을 세웁니다.',
  },
  {
    q: '다시 심으면 또 문제가 생기지 않나요?',
    a: '처음 실패한 원인을 그대로 두면 반복될 수 있습니다. 그래서 재수술은 다시 심는 것보다 원인을 찾는 것이 먼저입니다. 잇몸 관리와 흡연, 혈당 조절, 그리고 보철물 형태와 맞물림까지 함께 봅니다.',
  },
];

/** 소제목 아래 작은 라벨 — 같은 역할은 같은 글자로. */
const SUB = 'text-[13.5px] font-black tracking-[0.06em] text-clay-700';

export default function ExtractionAndRetreatmentPage() {
  return (
    <div className="bg-wine-bg text-ink">
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: withLocality('발치 즉시 식립 · 임플란트 재수술'),
            description: LEAD,
            path: PATH,
            about: { type: 'MedicalProcedure', name: '임플란트' },
          }),
          articleSchema({
            path: PATH,
            title: '발치 즉시 식립 · 임플란트 재수술',
            description: LEAD,
            wordCount: charCount(LEAD, IMMEDIATE.what + REDO.what),
            keywords: ['발치 즉시 임플란트', '임플란트 재수술', '임플란트 제거', '뼈이식', '임플란트주위염'],
          }),
          faqSchema(QA),
        ]}
      />

      <TreatmentHero
        trail={TRAIL}
        eyebrow="고양 화정동 임플란트 · 보건복지부인증 통합치의학과 전문의"
        title={['바로 심는 경우와', '다시 심는 경우']}
        lead={LEAD}
        photo={{
          src: '/img/clinic/implant-aftercare.webp',
          alt: '상담실에서 원장이 모니터의 파노라마 영상을 보며 환자에게 임플란트 계획을 설명하는 모습.',
        }}
      />

      <TreatmentStrip items={STRIP} />

      {/* ── 01 발치 즉시 식립 ──────────────────────────────────────── */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="eyebrow-chip text-clay-700">01 · 뽑은 자리에 바로</p>
              <h2
                id={headingId('발치 즉시 식립은 어떤 방법인가요')}
                className="display-sm reveal mt-5 scroll-mt-28 max-w-[13em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink"
              >
                발치 즉시 식립은 어떤 방법인가요?
              </h2>
              <p className="reveal mt-8 max-w-[30em] text-[17.5px] leading-[1.9] text-twilight">
                <Sentences text={IMMEDIATE.what} />
              </p>
            </div>

            <div>
              <div className="border-t border-wine-line pt-7">
                <p className={SUB}>이런 경우에 검토합니다</p>
                <ul className="reveal-stack mt-4 divide-y divide-wine-line">
                  {IMMEDIATE.yes.map((v) => (
                    <li key={v} className="reveal py-4 text-[16.5px] leading-[1.85] text-twilight">
                      <Sentences text={v} />
                    </li>
                  ))}
                </ul>
              </div>
              {/* ⚠️ 알아 두실 점을 지우지 말 것 — 장점만 적으면 광고문이 된다(의료법 제56조). */}
              <div className="mt-8 rounded-2xl border border-clay-600/40 bg-clay-400/[0.07] p-6 ring-1 ring-clay-400/10 ring-inset">
                <p className={SUB}>알아 두실 점</p>
                <ul className="mt-3 space-y-2.5">
                  {IMMEDIATE.care.map((v) => (
                    <li key={v} className="text-[16px] leading-[1.8] text-ink">
                      <Sentences text={v} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 02 임플란트 재수술 ─────────────────────────────────────── */}
      <section className="light-band border-y border-wine-line py-16 sm:py-24 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="eyebrow-chip text-clay-700">02 · 빼내고 다시</p>
              <h2
                id={headingId('임플란트 재수술은 언제 하나요')}
                className="display-sm reveal mt-5 scroll-mt-28 max-w-[13em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink"
              >
                임플란트 재수술은 언제 하나요?
              </h2>
              <p className="reveal mt-8 max-w-[30em] text-[17.5px] leading-[1.9] text-twilight">
                <Sentences text={REDO.what} />
              </p>
              {/*
                ⚠️ 임플란트주위염의 원인·단계·예방을 여기 옮겨 적지 말 것 — 질환 사전이 갖고 있다.
                   같은 내용이 두 곳에 있으면 검색이 어느 쪽을 고를지 헷갈린다.
              */}
              <Link
                href="/insight/condition/peri-implantitis"
                className="group reveal mt-7 inline-flex items-center gap-2 text-[16px] font-semibold text-ink transition-colors hover:text-clay-600"
              >
                임플란트주위염이 무엇인지 <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div>
              <div className="border-t border-wine-line pt-7">
                <p className={SUB}>이럴 때 제거를 검토합니다</p>
                <ul className="reveal-stack mt-4 divide-y divide-wine-line">
                  {REDO.yes.map((v) => (
                    <li key={v} className="reveal py-4 text-[16.5px] leading-[1.85] text-twilight">
                      <Sentences text={v} />
                    </li>
                  ))}
                </ul>
              </div>
              {/* ⚠️ 지우지 말 것 — 재수술은 부작용과 한계가 분명한 치료다(의료법 제56조). */}
              <div className="mt-8 rounded-2xl border border-clay-600/40 bg-clay-400/[0.07] p-6 ring-1 ring-clay-400/10 ring-inset">
                <p className={SUB}>알아 두실 점</p>
                <ul className="mt-3 space-y-2.5">
                  {REDO.care.map((v) => (
                    <li key={v} className="text-[16px] leading-[1.8] text-ink">
                      <Sentences text={v} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 문답 ───────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 lg:py-32">
        <Container>
          <h2 className="display-sm reveal text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
            자주 묻는 질문
          </h2>
          <div className="mt-10 divide-y divide-wine-line border-y border-wine-line">
            {QA.map((f) => (
              <article key={f.q} className="reveal py-7">
                <h3 id={headingId(f.q)} className="scroll-mt-28 text-[19px] leading-[1.4] font-black tracking-[-0.02em] text-ink">
                  {f.q}
                </h3>
                <p className="mt-3 max-w-[42em] text-[16.5px] leading-[1.85] text-twilight">
                  <Sentences text={f.a} />
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 마무리 ─────────────────────────────────────────────────── */}
      <section className="light-band border-y border-wine-line py-16 sm:py-24 lg:py-32">
        <Container>
          <h2 className="display-sm reveal max-w-[13em] text-[clamp(26px,3.6vw,42px)] leading-[1.15] tracking-[-0.02em] text-ink">
            남은 뼈를 먼저 확인합니다
          </h2>
          <p className="mt-8 max-w-[36em] text-[17.5px] leading-[1.9] text-twilight">
            <Sentences text="바로 심을 수 있는지도, 다시 심을 수 있는지도 남은 뼈와 잇몸이 정합니다. 사진으로 확인한 뒤에 어떤 방법이 가능한지 말씀드립니다." />
          </p>

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

          <div className="mt-20 grid gap-8 border-t border-wine-line pt-12 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/treatment/implant" className="group">
              <p className="text-[14.5px] font-medium text-ink-soft">먼저 보기</p>
              <p className="mt-3 text-[18px] leading-[1.4] text-ink transition-colors group-hover:text-clay-600">
                임플란트 — 방법과 기간 <span aria-hidden>→</span>
              </p>
            </Link>
            <Link href="/treatment/implant/bone-graft" className="group">
              <p className="text-[14.5px] font-medium text-ink-soft">함께 보기</p>
              <p className="mt-3 text-[18px] leading-[1.4] text-ink transition-colors group-hover:text-clay-600">
                뼈이식 <span aria-hidden>→</span>
              </p>
            </Link>
            <Link href="/insight/journey/implant" className="group">
              <p className="text-[14.5px] font-medium text-ink-soft">기간이 궁금하면</p>
              <p className="mt-3 text-[18px] leading-[1.4] text-ink transition-colors group-hover:text-clay-600">
                몇 번 오고 얼마나 걸리나요 <span aria-hidden>→</span>
              </p>
            </Link>
          </div>

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
