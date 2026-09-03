import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import { FIRST_VISIT_FLOW } from '@/lib/firstVisit';
import Link from 'next/link';
import { CLINIC } from '@/lib/clinic';
import { Container, MedicalNotice, ContactCta, Sentences } from '@/components/ui';
import { AboutHero } from '@/components/AboutHero';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, abs } from '@/lib/seo';

export const metadata: Metadata = {
  title: '치과 처음 갈 때 — 무엇을 하고 무엇을 챙기나',
  description:
    '치과 첫 방문에는 문진, 방사선 촬영, 구강 검사, 계획 설명 순으로 진행됩니다. 무엇을 챙겨야 하는지, 복용 중인 약은 왜 알려야 하는지 정리했습니다.',
  alternates: { canonical: '/about/process' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '병원 소개', path: '/about' },
  { name: '진료 절차', path: '/about/process' },
];

/**
 * 첫 방문 안내.
 *
 * ★★ 이전 버전에서 걷어낸 것 ★★
 *   원래 이 페이지에는 '저희는 이렇게 진행합니다' 형태의 5단계와 단계별 소요시간이 있었다.
 *   전부 내가 지어낸 병원 방침이었다. 기존 홈페이지에 그런 내용이 없고, 병원이 실제로
 *   어떤 순서로 진료하는지 확인한 바가 없다. 의료광고에서 사실이 아닌 표시는 의료법 위반이다.
 *
 * ★ 대신 남긴 것 — **일반적인 치과 진료 절차**
 *   "치과 처음 가면 뭐 해요" 는 실제로 많이 들어오는 질의이고, 여기에 답하는 것은
 *   특정 병원의 방침을 주장하지 않고도 가능하다. 그래서 주어를 병원이 아니라
 *   '일반적으로' 로 바꿔 표준 절차를 설명한다. 사실 확인이 필요 없고, 병원 사정이
 *   바뀌어도 이 문서는 그대로 유효하다.
 *
 * ⚠️ 여기에 '저희는~' 문장을 다시 넣지 말 것. 넣으려면 원장님 확인이 먼저다.
 */
/*
 * ★ 절차 배열은 lib/firstVisit.ts 한 곳에서 온다 (2026-08-14).
 *   홈에도 같은 절차를 요약해 보여 주게 되면서 이 파일 안에 있던 배열을 뽑아냈다.
 *   두 곳에 적힌 절차는 반드시 어긋난다 — 한쪽만 고치는 날이 오기 때문이다.
 */
const FLOW = FIRST_VISIT_FLOW;

const FIRST_VISIT_QA = [
  {
    q: '치과에 처음 가면 무엇을 하나요?',
    a: '문진, 방사선 촬영, 구강 검사, 설명 순으로 진행하는 것이 일반적입니다. 통증이나 감염처럼 급한 상황이면 그날 응급 처치를 먼저 하고, 급하지 않으면 검사와 계획 수립까지 하고 다음 방문부터 치료를 시작하는 경우가 많습니다.',
  },
  {
    q: '치과에 갈 때 무엇을 챙겨야 하나요?',
    a: '신분증과 복용 중인 약 목록을 챙기시면 됩니다. 다른 병원에서 찍은 방사선 사진이나 치료 기록이 있다면 함께 가져가면 중복 촬영을 줄일 수 있습니다.',
  },
  {
    q: '복용 중인 약을 꼭 알려야 하나요?',
    a: '반드시 알려야 합니다. 항응고제(아스피린·와파린 등)는 발치 시 출혈에, 골다공증 주사제는 발치 후 뼈 회복에 직접 영향을 줍니다. 임의로 중단하지 말고 복용 중이라는 사실만 알리면 치과와 주치의가 상의해 일정을 조율합니다.',
  },
  {
    q: '임신 중에도 치과 진료를 받을 수 있나요?',
    a: '받을 수 있습니다. 임신 중에는 호르몬 변화로 잇몸 염증이 잘 생겨 오히려 관리가 더 필요합니다. 다만 시기에 따라 권장되는 처치가 달라지므로 임신 주수를 먼저 알리는 것이 좋습니다.',
  },
  {
    q: '방사선 촬영은 안전한가요?',
    a: '치과용 방사선 촬영의 선량은 일상에서 받는 자연 방사선에 비해 매우 낮은 수준입니다. 다만 임신 중이거나 가능성이 있다면 미리 알려 촬영 여부와 방법을 상의하는 것이 좋습니다.',
  },
];

export default function ProcessPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: '치과 처음 갈 때 — 무엇을 하고 무엇을 챙기나',
            description: FIRST_VISIT_QA[0].a,
            path: '/about/process',
          }),
          faqSchema(FIRST_VISIT_QA),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: '치과 첫 방문 절차',
            description: FIRST_VISIT_QA[0].a,
            url: abs('/about/process'),
            step: FLOW.map((f, i) => ({
              '@type': 'HowToStep',
              position: i + 1,
              name: f.t,
              text: f.d,
            })),
          },
        ]}
      />

      <AboutHero
        trail={TRAIL}
        photo="booth"
        title="치과에 처음 가면 무엇을 하나요?"
        lead="무엇을 하는지 모르면 첫 방문이 부담스럽습니다. 접수부터 상담까지의 순서는 대체로 정해져 있습니다."
      />

      {/*
        발행·수정일 — ⚠️ 여백 가진 상자로 감싸지 말 것. ArticleMeta 는 지금 null 이라 빈 띠만 남는다.
      */}
      <Container>
        <ArticleMeta path="/about/process" />
      </Container>

      {/*
        ★★ 절차 다섯 단계 — 카드가 스크롤을 따라 하나씩 올라온다 (2026-09-02 오너) ★★
          "카드 형태로, 스크롤하면 하나씩 순서대로 넘어가게 모션 예쁘게."
        ★ .step-in 은 카드마다 따로 관찰한다 — 묶음이 한꺼번에 뜨는 reveal-stack 과 다르다.
          읽는 속도에 맞춰 다음 카드가 올라온다. 모양은 globals.css 의 .step-in 에서 정한다.
        ⚠️ 카드를 걷고 글만 두지 말 것 — 그렇게 뒀더니 "너무 밋밋하다" 는 지적을 받았다.
        ⚠️ 카드 사이에 가로 구분선을 다시 긋지 말 것 — 그건 그 전에 "억지스럽다" 로 퇴짜다.
           카드 자체가 이미 경계다.
        ⚠️ 번호(01~05)를 지우지 말 것 — HowTo 구조화 데이터의 순서와 화면이 같은 말을 해야 한다.
      */}
      <Container className="pt-12 pb-16 lg:pt-16 lg:pb-20">
        <ol className="space-y-4 lg:space-y-5">
          {FLOW.map((f) => (
            <li key={f.n} className="step-in">
              <article className="rounded-[22px] border border-brand-200/70 bg-parchment p-7 sm:p-9 lg:p-10">
                <div className="grid gap-y-4 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:items-baseline lg:gap-x-12">
                  <h2 className="flex items-baseline gap-4">
                    <span
                      aria-hidden
                      className="display text-[clamp(26px,2.8vw,36px)] leading-none tabular-nums text-clay-600"
                    >
                      {f.n}
                    </span>
                    <span className="display-sm text-[clamp(19px,2vw,24px)] leading-snug text-ink">
                      {f.t}
                    </span>
                  </h2>
                  <p className="max-w-[62ch] text-[17px] leading-[1.9] text-twilight">
                    <Sentences text={f.d} />
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </Container>


      {/*
        ★ 문답 — 병원 소개와 같은 문법(질문 왼쪽, 답 오른쪽, 가로줄).
        ⚠️ 질문형 h2 + 바로 아래 답 구조를 깨지 말 것 — AI 가 인용해 가는 자리다.
        ⚠️ 밝은 띠는 한 페이지에 하나다. 여기 말고 다른 구획에 또 붙이지 말 것.
      */}
      {/*
        ★ 문답 — 여기도 선을 걷었다. 질문이 굵고 답이 그 아래 붙으면 그것으로 구분이 된다.
        ⚠️ 질문형 h2 + 바로 아래 답 구조를 깨지 말 것 — AI 가 인용해 가는 자리다.
        ⚠️ 밝은 띠는 한 페이지에 하나다.
      */}
      {/*
        ★ 문답 — 번호를 붙여 문서처럼 읽히게 (2026-09-02 오너: "QnA 처럼 번호 붙이고 전문적으로").
          Q1~Q5 를 금색으로 앞세우고, 답은 질문 글자 왼쪽 끝에 맞춰 들여쓴다.
        ⚠️ 가로 구분선을 긋지 말 것 — 번호와 들여쓰기가 이미 항목을 나눈다("억지스럽다" 지적).
        ⚠️ 질문형 제목 + 바로 아래 답 구조를 깨지 말 것 — AI 가 인용해 가는 자리다.
        ⚠️ 밝은 띠는 한 페이지에 하나다.
      */}
      <section className="light-band py-16 lg:py-20">
        <Container>
          <h2 className="display-sm text-[clamp(23px,2.4vw,30px)] text-ink">첫 방문 전에 자주 받는 질문</h2>
          <ol className="mt-11 space-y-10 lg:space-y-12">
            {FIRST_VISIT_QA.map((qa, i) => (
              <li key={qa.q} className="reveal">
                <h3 className="flex gap-3.5">
                  <span
                    aria-hidden
                    className="display shrink-0 text-[17px] leading-[1.55] tabular-nums text-clay-600"
                  >
                    Q{i + 1}
                  </span>
                  <span className="text-[clamp(17px,1.8vw,20px)] leading-snug font-black text-ink">
                    {qa.q}
                  </span>
                </h3>
                {/* ⚠️ 들여쓰기 값을 바꾸려면 위 번호 폭도 함께 볼 것 — 답이 질문 글자와 어긋난다. */}
                <p className="mt-3 max-w-[64ch] pl-[2.4rem] text-[17px] leading-[1.9] text-twilight">
                  <Sentences text={qa.a} />
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/*
        방문 안내 — ⚠️ 그라데이션 버튼으로 되돌리지 말 것 (오너 지시, 사이트 전체 규칙).
        이 사이트의 버튼은 단색 아니면 테두리다.
      */}
      <Container className="py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
          <h2 className="display-sm text-[clamp(19px,2vw,24px)] text-ink">
            동그라미치과의원 방문 안내
          </h2>
          <div>
            <p className="text-[17px] leading-[1.9] text-twilight">
              진료시간과 위치는 내원 안내 페이지에 있고, 예약은 아래 연락처로 하실 수 있습니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={CLINIC.phoneHref}
                /* ⚠️ bg-parchment 로 되돌리지 말 것 — 어두운 서브페이지에서 parchment 는 어두운 값이라
                   글자와 같은 색이 된다(2026-09-02 실측 1.04:1). 그 조합은 진료 페이지의
                   bg-night 안(어두운 섬)에서만 밝게 뒤집힌다. 여기는 섬이 아니다. */
                className="rounded-full bg-ink px-8 py-4 text-[17px] font-semibold text-wine-bg transition-opacity hover:opacity-90"
              >
                {CLINIC.phone}
              </a>
              <a
                href={CLINIC.booking.naver}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-[1.5px] border-ink/60 px-8 py-4 text-[17px] font-semibold text-ink transition-colors hover:bg-ink hover:text-wine-bg"
              >
                네이버 예약
              </a>
              <a
                href={CLINIC.booking.kakao}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-[1.5px] border-ink/60 px-8 py-4 text-[17px] font-semibold text-ink transition-colors hover:bg-ink hover:text-wine-bg"
              >
                카카오톡 상담
              </a>
              <Link
                href="/visit"
                className="rounded-full border-[1.5px] border-ink/60 px-8 py-4 text-[17px] font-semibold text-ink transition-colors hover:bg-ink hover:text-wine-bg"
              >
                오시는 길
              </Link>
            </div>
          </div>
        </div>

        <MedicalNotice />
      </Container>


      <ContactCta />
    </>
  );
}
