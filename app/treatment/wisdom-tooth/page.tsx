import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CLINIC, NO_GUARANTEE_NOTE } from '@/lib/clinic';
import { treatmentBySlug } from '@/lib/treatments';
import { symptomBySlug } from '@/lib/symptoms';
import { journeyForTreatment } from '@/lib/insight';
import { Container, MedicalNotice, Sentences, plain } from '@/components/ui';
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
 * 사랑니 발치 — 다크룸(ORYZO) 시스템으로 만든 페이지.
 *
 * ★★ 이 시스템의 규칙 ★★
 *   ① **따뜻한 흑백.** 순백(#fff)도 순검정(#000)도 쓰지 않는다. walnut(#100904) 위에
 *      oat(#ffedd7). 순수한 값을 쓰면 그 순간 다른 사이트가 된다.
 *   ② **그림자 금지.** 깊이는 walnut→bark 두 단계 면 차이로만 만든다.
 *   ③ **채워진 버튼은 한 구간에 하나.** bark(#382416) 면이 유일한 채워진 행동이고,
 *      나머지는 크림 테두리 고스트다.
 *   ④ **ember(주황)는 편집 요소 전용.** 버튼·CTA에 쓰지 않는다. 드물어서 값이 산다.
 *   ⑤ 구분선은 **점선 헤어라인**만. 실선·굵은 선을 쓰지 않는다.
 *   ⑥ 라운드는 넷뿐 — 카드 12px, 채운 알약 36px, 고스트 22.5px, 입력 0px.
 *
 * ★★ 한글에서 지킬 수 없던 두 가지 — 무리해서 따르지 않았다 ★★
 *   ⑴ "모든 글자를 대문자로" — 한글에는 대문자가 없다. 영문 라벨만 대문자로 두고
 *      한글은 그대로 쓴다. text-transform 을 한글에 걸면 아무 일도 안 일어나고,
 *      기대만 어긋난다.
 *   ⑵ "디스플레이 행간 0.9" — 한글은 받침이 아래로 내려와 0.9 에서 잘린다. 한글 제목은
 *      1.02~1.08 로 두고, 영문 라벨에서만 0.9 의 조밀함을 살린다.
 *
 * ★ 사진 — 기존 홈페이지의 실제 수술 사진과 발치 기준 일러스트 3종을 그대로 옮겼다.
 *   레퍼런스는 "인물·스톡 사진 금지" 라, 원본에 있던 여성 통증 스톡 컷은 넣지 않았다.
 * ⚠️ 일러스트 원본은 380x280 이다. 크게 늘리지 말 것.
 * ⚠️ app/treatment/[slug] 의 generateStaticParams 에서 wisdom-tooth 를 빼 두었다.
 */

const PATH = '/treatment/wisdom-tooth';
/*
 * 히어로 머리글.
 * ★ `**...**` 는 화면에서 강조색으로 나온다(components/ui.tsx Sentences).
 * ⚠️ 메타 설명·구조화 데이터에는 plain() 으로 표시를 떼고 넣을 것 —
 *    안 그러면 검색 결과에 별표가 그대로 나간다.
 * ⚠️ 한 문단에 한 곳만 강조한다. 다 강조하면 아무것도 강조가 아니다.
 * ⚠️⚠️ **마침표를 표시 안에 넣지 말 것** — 문장 단위로 먼저 쪼갠 뒤 강조를 입히므로,
 *    마침표가 안에 있으면 닫는 표시가 **다음 문장으로 넘어가** 뒷문장까지 물든다
 *    (실제로 겪었다). 올바른 형태: '…아닙니다**.' / 잘못된 형태: '…아닙니다.**'
 * ⚠️ '방사선' 과 '사진' 사이는 **줄바꿈 없는 공백(U+00A0)** 이다. 보통 공백으로
 *    되돌리면 '방사선 / 사진' 으로 잘린다(오너 지적). 눈에 안 보이니 주의할 것.
 */
const LEAD =
  '사랑니는 가장 안쪽에 나는 제3대구치로, **모두 빼야 하는 것은 아닙니다**. 매복 깊이와 인접치·신경관의 위치에 따라 발치가 필요한지가 갈리므로, 방사선 사진으로 위치를 먼저 확인한 뒤에 말씀드립니다.';
/** 표시를 뗀 것 — 메타 설명·구조화 데이터 전용. */
const LEAD_PLAIN = plain(LEAD);

export const metadata: Metadata = {
  title: '사랑니 발치',
  description: LEAD_PLAIN.slice(0, 155),
  alternates: { canonical: PATH },
  openGraph: og({ title: withLocality('사랑니 발치'), description: LEAD_PLAIN.slice(0, 155), path: PATH }),
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '진료과목', path: '/treatment' },
  { name: '사랑니 발치', path: PATH },
];

const DOC_IMAGE = {
  src: '/img/clinic/wisdom-room.webp',
  caption: '진료실에서 원장과 진료 보조 인력이 사랑니 발치를 진행하는 모습',
  width: 1920,
  height: 1280,
};

/** 원문의 발치 기준 3가지 — 일러스트가 함께 있던 그대로. */
const REASONS = [
  {
    img: '/img/clinic/wd-tilted.webp',
    alt: '사랑니가 옆으로 누워 앞 어금니에 부딪히고 그 자리에 검은 손상이 표시된 단면 일러스트.',
    label: 'A',
    t: '옆으로 누워 주변 치아를 손상시키는 경우',
    d: '누운 사랑니가 앞 어금니의 뒷면을 밀면 그 맞닿은 면에는 칫솔이 닿지 않습니다. 문제가 사랑니보다 앞 치아 쪽에 먼저 생깁니다.',
  },
  {
    img: '/img/clinic/wd-decay.webp',
    alt: '사랑니 주변 잇몸과 앞 어금니에 붉은 염증이 표시된 단면 일러스트.',
    label: 'B',
    t: '관리가 어렵게 나서 충치나 잇몸질환을 유발한 경우',
    d: '일부만 드러난 사랑니는 잇몸 덮개 아래로 음식물이 들어가 반복해서 붓습니다. 칫솔과 치실이 닿지 않는 자리라 스스로 관리하기 어렵습니다.',
  },
  {
    img: '/img/clinic/wd-crowding.webp',
    alt: '사랑니가 앞쪽으로 미는 방향이 붉은 화살표로 표시된 단면 일러스트.',
    label: 'C',
    t: '치열에 영향을 주어 부정교합을 유발하는 경우',
    d: '뒤에서 미는 힘이 앞니 배열에 영향을 줄 수 있습니다. 교정을 마친 뒤에 특히 신경 써서 확인합니다.',
  },
];

/** 원문의 매복 사랑니 설명 4가지 — 체크리스트 형태였던 것. */
/*
 * 매복 사랑니 — 판단 기준 넷.
 * ★ 짧은 이름표 + 한 문장으로 나눴다 (2026-08-31 오너: "좀 더 전문적으로").
 *   전에는 네 항목이 전부 길고 말끝이 제각각이라, 무엇이 기준이고 무엇이 설명인지
 *   구분되지 않았다. 이름표가 **기준**을, 문장이 **판단**을 진다.
 * ⚠️⚠️ 사실은 바꾸지 않았다 — 완전매복/부분매복의 구분과 각각의 결론이 원문과 같다.
 *    임상 용어(완전매복·부분맹출·인접치·신경관)로 조였을 뿐이다.
 * ⚠️ 새 시술이나 장비를 적어 넣지 말 것. 근거 없는 표시는 의료법 제56조 위반이다.
 */
const IMPACTED = [
  {
    k: '판단 기준',
    v: '매복 깊이와 인접치·신경관과의 위치 관계에 따라 발치 필요성이 갈립니다.',
  },
  {
    k: '완전매복',
    v: '잇몸에 완전히 덮여 겉으로 드러나지 않은 사랑니는 대부분 그대로 두어도 됩니다.',
  },
  {
    k: '부분맹출',
    v: '일부만 드러난 사랑니가 방향까지 어긋나 인접치와 닿는 자리에 음식물이 끼면, 가급적 이른 시기에 제거하는 편이 좋습니다.',
  },
  {
    k: '술식의 기준',
    v: '인접치와 신경관을 건드리지 않고 사랑니만 정확히 분리하는 것, 그리고 잇몸을 크게 열지 않고 마치는 것이 회복을 좌우합니다.',
  },
];

/** 원문의 발치 후 주의사항 4가지 — 그대로. */
/*
 * 발치 후 주의사항.
 * ★ 짧은 이름표 + 한 문장으로 나눴다 (2026-08-31 오너: "문구가 너무 전문적이지가 않아").
 *   전에는 넷의 말끝이 제각각(-합니다 / -하도록 합니다 / -하셔야 도움이 됩니다)이라
 *   지시인지 설명인지 흔들렸다. 이름표가 '무엇을' 을, 문장이 '어떻게' 를 맡는다.
 * ⚠️⚠️ **사실은 한 줄도 바꾸지 않았다** — 기간·시간·행동이 모두 원문 그대로다.
 *    말투만 고른 것이다. 여기 숫자를 손대면 환자에게 잘못된 지시가 나간다.
 */
const AFTERCARE = [
  { k: '일주일간 금주·금연', v: '담배와 술은 일주일 동안 피하십시오.' },
  { k: '다음 날까지 안정', v: '무리한 운동과 사우나는 다음 날까지 피하십시오.' },
  { k: '48시간 냉찜질', v: '발치 후 48시간 동안 냉찜질을 하면 통증과 붓기가 줄어듭니다.' },
  { k: '거즈는 2시간 뒤', v: '물고 계신 거즈는 2시간 뒤에 빼시고, 그동안 나오는 침과 피는 삼키십시오.' },
];

/**
 * 원문에 없던 부분 — 왜 아래턱이 더 어려운가.
 * ★ 표준 치과 지식이다. 이 병원의 장비·실적 주장은 넣지 않는다.
 * ⚠️ 부작용 고지를 겸한다 — 지우면 광고문이 된다(의료법 제56조).
 */
const RISKS = [
  '발치한 자리에는 2~3일 붓기와 통증이 있을 수 있고, 3일째쯤 가장 심했다가 줄어듭니다.',
  '아래턱 사랑니는 뿌리가 신경관에 가까운 경우가 있어, 일시적으로 입술이나 턱이 얼얼할 수 있습니다.',
  '혈전이 빠지면 드라이소켓이 생겨 통증이 다시 심해질 수 있습니다. 빨대 사용과 세게 헹구는 것을 피하는 이유입니다.',
  '위턱 사랑니는 상악동과 가까워, 뿌리 위치에 따라 확인이 더 필요한 경우가 있습니다.',
  '입이 잘 벌어지지 않는 증상이 며칠 이어질 수 있습니다.',
];

/** 영문 라벨 — 대문자는 여기서만. 한글에는 대문자가 없다. */
/* ⚠️ uppercase 를 뺐다 (2026-08-28) — 한글에는 대문자가 없어 아무 효과가 없고,
   영문 라벨만 대문자로 굳어 한국어 화면에 남의 문법을 남긴다. */
/*
 * 구획 위 작은 글자(01 — 발치 기준 등).
 * ★ 12px → 13.5px (2026-08-31 오너: "너무 작아 조금씩만 키우자").
 *   12px 은 한글에서 받침이 뭉개지기 시작하는 크기다. 영문 기준으로 잡힌 값이었다.
 * ⚠️ 더 키우지 말 것 — 아래 제목과 크기가 가까워지면 무엇이 머리인지 흐려진다.
 */
const LABEL = 'font-medium tracking-normal';

export default function WisdomToothPage() {
  const t = treatmentBySlug('wisdom-tooth');
  if (!t) throw new Error('wisdom-tooth 진료 데이터 없음 — lib/treatments.ts');
  const journey = journeyForTreatment('wisdom-tooth');
  const related = t.relatedSymptoms.map(symptomBySlug).filter(Boolean);

  return (
    <div>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: withLocality('사랑니 발치'),
            description: LEAD_PLAIN,
            path: PATH,
            about: { type: 'MedicalProcedure', name: '사랑니 발치' },
            image: DOC_IMAGE,
          }),
          imageObjectSchema({ path: PATH, ...DOC_IMAGE }),
          articleSchema({
            path: PATH,
            title: '사랑니 발치',
            description: LEAD_PLAIN,
            wordCount: charCount(LEAD, REASONS.map((r) => r.d).join('')),
            keywords: ['사랑니', '사랑니 발치', '매복 사랑니'],
            hasImage: true,
          }),
        ]}
      />

      {/*
        머리말 — 진료과목 아홉 곳이 같은 부품을 쓴다 (2026-09-01 오너 지시).
        ⚠️ 여기서 손으로 다시 그리지 말 것. 모양은 components/TreatmentShell.tsx 에서 바꾼다.
        ⚠️ 이 페이지만의 walnut 덮개·oat 글자·아래 정렬 3단 구성으로 되돌리지 말 것 —
           같은 메뉴 안에서 페이지마다 머리가 달라 보였던 원인이다.
      */}
      <TreatmentHero
        trail={TRAIL}
        eyebrow="고양 화정동 사랑니 발치 · 보건복지부인증 통합치의학과 전문의"
        /* ⚠️ 2026-09-02 — 물음표를 지우지 말 것. 환자가 실제로 치는 질문이고,
           바로 아래 lead 첫 문장('모두 빼야 하는 것은 아닙니다')이 그 답이다.
           질문 다음에 곧장 답이 오는 형태를 답변 엔진이 문다. */
        title={['사랑니는', '꼭 빼야 하나요?']}
        lead={LEAD}
        photo={{
          src: '/img/clinic/wisdom-room.webp',
          alt: '진료실에서 원장과 진료 보조 인력이 환자의 사랑니 발치를 진행하는 모습.',
        }}
      />

      {/* ⚠️ 지어낸 문구를 넣지 말 것 — 세 칸 모두 아래 본문에 그대로 나오는 이야기다. */}
      <TreatmentStrip
        items={[
          {
            k: '먼저 보는 것',
            t: '빼야 하는지부터',
            d: '매복 깊이와 인접치·신경관과의 위치 관계에 따라 발치 필요성이 갈립니다.',
          },
          {
            k: '발치할 때',
            t: '신경관을 피해 분리',
            d: '인접치와 신경관을 건드리지 않고 사랑니만 정확히 분리합니다.',
          },
          {
            k: '뺀 다음',
            t: '첫 며칠',
            d: '그 며칠을 어떻게 보내는지가 회복을 좌우합니다.',
          },
        ]}
      />

      {/* ── 왜 문제가 되는가 ────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="border-t border-dashed border-cork pt-14">
            <p className="eyebrow-chip text-ink-soft">
              <span className="eyebrow-n">01</span>
              발치 기준
            </p>
            {/*
              ⚠️ 제목을 두 줄로 되돌리지 말 것 (2026-08-31 오너) — 왼쪽 칸이 좁아 '좋습니다' 가
                 혼자 떨어졌다. 칸 비율을 뒤집어 한 줄에 들어가게 한다.
              ⚠️ "그래서 발치하는 것이 바람직한 경우가 많습니다" 를 되살리지 말 것 —
                 히어로의 "모든 사랑니를 빼야 하는 것은 아닙니다" 와 정면으로 부딪힌다.
                 남긴 앞 문장이 **왜 문제가 되는지** 라는 사실을 지므로 인용 가치는 그대로다.
            */}
            {/*
              ⚠️ 부연을 오른쪽 칸으로 되돌리지 말 것 (2026-08-31 오너) — 제목과 나란히 두면
                 둘이 서로 다른 이야기처럼 읽힌다. 제목 **바로 아래 한 줄**이 맞다.
              ⚠️ 제목을 두 줄로 접히게 하지 말 것 — '좋습니다' 가 혼자 떨어진다.
            */}
            <div className="mt-10">
              <h2 className="display-sm text-[clamp(28px,3.9vw,44px)] leading-[1.06] text-balance text-ink">
                이런 경우에는 빼는 편이 좋습니다
              </h2>
              <p className="mt-6 max-w-[52em] text-[clamp(15px,1.3vw,18px)] leading-[1.7] font-normal text-ink/75">
                대부분의 사랑니는 칫솔질과 치실이 닿지 않아{' '}
                <strong className="font-semibold text-clay-600">충치와 치주질환의 출발점</strong>이
                됩니다.
              </p>
            </div>
          </div>

          {/*
            발치 기준 3종 — 기존 홈페이지 일러스트 그대로.
            ⚠️ 원본이 380x280 이다. 카드 폭을 넘겨 늘리지 말 것.
          */}
          <ol className="reveal-stack mt-16 grid gap-8 lg:grid-cols-3 lg:gap-10">
            {REASONS.map((r) => (
              <li key={r.label} className="reveal">
                <div className="img-in overflow-hidden rounded-xl bg-bark">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={r.img}
                      alt={r.alt}
                      fill
                      sizes="(min-width: 1024px) 380px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <p className={`mt-7 ${LABEL} text-[14.5px] text-clay-600`}>{r.label}</p>
                <h3 className="display-sm mt-3 text-[20px] leading-[1.3] text-ink">{r.t}</h3>
                <p className="mt-4 text-[17px] leading-[1.6] font-normal text-ink/75">{r.d}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── 매복 사랑니 ─────────────────────────────────────────────── */}
      <section className="border-y border-brand-200/70 bg-parchment py-24 lg:py-32">
        <Container>
          <div className="border-t border-dashed border-cork pt-14">
            <p className="eyebrow-chip text-ink-soft">
              <span className="eyebrow-n">02</span>
              매복 사랑니
            </p>
            <h2 className="display-sm mt-10 max-w-[16em] text-[clamp(28px,4.2vw,46px)] leading-[1.06] text-ink">
              매복된 사랑니는 꼭 발치해야 하나요?
            </h2>
          </div>

          <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
            <ol className="divide-y divide-dashed divide-cork border-y border-dashed border-cork">
              {IMPACTED.map((v, i) => (
                <li key={v.k} className="flex gap-6 py-8">
                  <span className={`${LABEL} shrink-0 pt-1 text-[13.5px] text-ink-soft`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="display-sm text-[18px] leading-[1.3] text-clay-600">{v.k}</p>
                    <p className="mt-2.5 text-[17.5px] leading-[1.65] font-normal text-ink/85">
                      {v.v}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {/*
              ⚠️ 사진 높이를 왼쪽 목록에 맞춘다 (2026-08-31 오너: "사진만 더 튀어나왔잖아").
                 3:4 비율을 고정해 두면 목록보다 길어져 아래로 삐져나온다.
                 넓은 화면에서는 비율을 풀고 칸 높이를 그대로 쓴다(h-full).
            */}
            <div className="img-in reveal overflow-hidden rounded-xl lg:h-full">
              <div className="relative aspect-[3/4] lg:aspect-auto lg:h-full">
                <Image
                  src="/img/clinic/wisdom-surgery.webp"
                  alt="무영등 아래에서 기구를 들고 발치를 진행하는 손의 근접 사진."
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 발치 후 ─────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="border-t border-dashed border-cork pt-14">
            <p className="eyebrow-chip text-ink-soft">
              <span className="eyebrow-n">03</span>
              발치 후 주의사항
            </p>
            <h2 className="display-sm mt-10 max-w-[14em] text-[clamp(28px,4.2vw,46px)] leading-[1.06] text-ink">
              뺀 다음 며칠이 회복을 좌우합니다
            </h2>
          </div>

          {/* ⚠️ 테두리만 있는 네모로 되돌리지 말 것 — 어두운 면 위에서 카드가 안 보였다. */}
          <ol className="mt-14 grid gap-6 sm:grid-cols-2">
            {AFTERCARE.map((a, i) => (
              <li key={a.k}>
                <div className="pane-glass pane-card border border-brand-200/70 h-full overflow-hidden rounded-[18px] p-8">
                  <p className={`${LABEL} text-[14.5px] text-ink-soft`}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="display-sm mt-4 text-[19px] leading-[1.3] text-ink">{a.k}</p>
                  <p className="mt-3 text-[17px] leading-[1.65] font-normal text-ink-soft">{a.v}</p>
                </div>
              </li>
            ))}
          </ol>

          {/*
            ⚠️ 이 주석을 {journey ? ( 안으로 옮기지 말 것 — 거기서는 JSX 주석이 문법 오류다.
          */}
          {journey ? (
            <dl className="mt-14 grid gap-6 sm:grid-cols-2">
              {[
                { k: '내원 횟수', v: journey.visits },
                { k: '치료 기간', v: journey.duration },
              ].map((x) => (
                <div key={x.k} className="pane-glass pane-card border border-brand-200/70 overflow-hidden rounded-[18px] p-8">
                  <dt className={`${LABEL} text-[14.5px] text-ink-soft`}>{x.k}</dt>
                  <dd className="display-sm mt-4 text-[clamp(20px,2.1vw,30px)] leading-[1.2] text-ink">
                    {x.v}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Container>
      </section>

      {/*
        ── 미리 아셔야 할 것 ────────────────────────────────────────
        ⚠️⚠️ 지우지 말 것 — 의료법 제56조. 발치는 부작용 가능성이 있는 수술이다.
      */}
      <section className="border-y border-brand-200/70 bg-parchment py-24 lg:py-32">
        <Container>
          <div className="border-t border-dashed border-cork pt-14">
            <p className="eyebrow-chip text-ink-soft">
              <span className="eyebrow-n">04</span>
              알아 두실 점
            </p>
            {/*
              ★★ 제목을 위에 두고 카드를 아래에 편다 (2026-08-31 오너: "너무 밋밋해") ★★
                전에는 좌우 2단이라 왼쪽 제목 아래가 통째로 비고, 오른쪽 목록만 길게
                흘러내렸다 — 화면의 절반이 빈 칸이었다. 제목을 폭 전체에 두고 카드를
                두 줄로 펴면 그 빈 칸이 사라진다.
              ⚠️⚠️ 이 구간을 지우지 말 것 — 의료법 제56조. 발치는 부작용 가능성이 있는 수술이다.
              ⚠️ 문장은 원문 그대로다. 부작용 설명을 줄이거나 부드럽게 고치지 말 것.
            */}
            <div className="mt-10">
              <h2 className="display-sm max-w-[16em] text-[clamp(28px,3.9vw,44px)] leading-[1.06] text-ink">
                미리 아셔야 할 것
              </h2>
              <p className="mt-6 max-w-[38em] text-[17px] leading-[1.7] font-normal text-ink-muted">
                <Sentences text="발치는 수술입니다. 아래는 실제로 생길 수 있는 일이며, 사람마다 정도가 다릅니다." />
              </p>
              <ul className="mt-12 grid gap-6 sm:grid-cols-2">
                {RISKS.map((r, i) => (
                  <li key={r}>
                    <div className="pane-glass pane-card border border-brand-200/70 h-full overflow-hidden rounded-[18px] p-8">
                      <p className={`${LABEL} text-[14.5px] text-ink-soft`}>
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <p className="mt-4 text-[17.5px] leading-[1.65] font-normal text-ink/85">{r}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 마무리 ──────────────────────────────────────────────────── */}
      <section className="pb-24 lg:pb-32">
        <Container>
          <div className="border-t border-dashed border-cork pt-14">
            <h2 className="display-sm focus-in max-w-[14em] text-[clamp(28px,4.2vw,46px)] leading-[1.05] text-ink">
              빼야 하는지부터 확인하세요
            </h2>
            <p className="mt-8 max-w-[32em] text-[clamp(16px,1.5vw,20px)] leading-[1.55] font-normal text-ink-soft">
              <Sentences text="누운 각도와 신경관까지의 거리에 따라 방법과 회복이 달라집니다. 사진으로 위치를 확인한 뒤에 뺄지 지켜볼지 함께 정합니다." />
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-3">
              <a
                href={CLINIC.booking.naver}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-wine-bg px-8 py-4 text-[17px] font-semibold text-dusk transition-colors hover:bg-mist"
              >
                진료 예약하기
              </a>
              <a
                href={CLINIC.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/60 px-8 py-4 text-[17px] font-semibold tabular-nums text-ink transition-colors hover:bg-brand-100"
              >
                {CLINIC.phone}
              </a>
            </div>

            <div className="mt-20 grid gap-8 border-t border-dashed border-cork pt-12 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/faq#wisdom-tooth" className="group">
                <p className={`${LABEL} text-[14.5px] text-ink-soft`}>FAQ</p>
                <p className="mt-3 text-[18px] leading-[1.4] font-normal text-ink underline decoration-cork underline-offset-4 transition-colors group-hover:decoration-ember">
                  많이 묻는 것 {t.qa.length}가지
                </p>
              </Link>
              {related.slice(0, 3).map((s) => (
                <Link key={s!.slug} href={`/insight/symptom/${s!.slug}`} className="group">
                  <p className={`${LABEL} text-[14.5px] text-ink-soft`}>관련 증상</p>
                  <p className="mt-3 text-[18px] leading-[1.4] font-normal text-ink underline decoration-cork underline-offset-4 transition-colors group-hover:decoration-ember">
                    {s!.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 검토자·출처·고지 */}
      <div className="border-t border-dashed border-cork py-14">
        <Container>
          {/* ⚠️ 글자색만 덮지 말 것 — 카드 배경이 흰색이라 크림 글자가 사라진다(겪은 일). */}
          <div className="max-w-[46em]">
            <ArticleMeta path={PATH} tone="dark" />
          </div>
          {/*
            ⚠️ '참고자료 · 안내' 펼침막을 없앴다 (2026-08-31 운영자 지시로 두 블록이
               화면에서 빠지면서 **안이 빈 껍데기**만 남았기 때문이다).
               되살리려면 components/article.tsx 의 References 와 components/ui.tsx 의
               MedicalNotice 를 먼저 되돌릴 것 — 그 둘이 지금 null 을 돌려준다.
          */}
        </Container>
      </div>
    </div>
  );
}
