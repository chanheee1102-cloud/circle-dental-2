import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import { FIRST_VISIT_FLOW } from '@/lib/firstVisit';
import Link from 'next/link';
import { CLINIC } from '@/lib/clinic';
import { Container, MedicalNotice, ContactCta, Sentences } from '@/components/ui';
import { AboutHero } from '@/components/AboutHero';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema, abs } from '@/lib/seo';
import Image from 'next/image';

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
          {/*
            ★★ 다섯 단계를 **카드 격자**로 (2026-09-04 오너: "카드 다섯개 형태로 사진 넣어서, 3개 2개로 두줄") ★★
              가로로 긴 판 다섯 장이 세로로 쌓여 있어 한 화면에 한 단계씩만 보였다. 3+2 로 두면
              '다섯 단계' 라는 것이 한눈에 들어온다.
            ⚠️ lg:grid-cols-6 에 각 칸이 2칸씩이다 — 6 = 3×2 이므로 첫 줄에 셋이 딱 맞고,
               넷째·다섯째는 col-start 로 가운데 정렬한다. grid-cols-3 으로 바꾸면 둘째 줄이 왼쪽에 붙는다.
            ⚠️ 사진은 설명용이다. 아래 AI 사진 고지를 함께 지우지 말 것(의료법 제56조).
          */}
          <ol className="reveal-stack mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {FLOW.map((f, i) => (
              <li
                key={f.n}
                className={`step-in ${
                  i === 3 ? 'lg:col-span-2 lg:col-start-2' : i === 4 ? 'lg:col-span-2' : 'lg:col-span-2'
                }`}
              >
                <article className="flex h-full flex-col overflow-hidden rounded-[22px] border border-brand-200/70 bg-parchment">
                  {f.image && (
                    <div className="relative aspect-[3/2] bg-brand-100">
                      <Image
                        src={f.image}
                        alt={f.alt ?? ''}
                        fill
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 46vw, 92vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h2 className="flex items-baseline gap-3">
                      <span
                        aria-hidden
                        className="display text-[22px] leading-none tabular-nums text-clay-600"
                      >
                        {f.n}
                      </span>
                      <span className="display-sm text-[19px] leading-snug text-ink">{f.t}</span>
                    </h2>
                    <p className="mt-3 text-[16px] leading-[1.85] text-twilight">
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
      <section className="light-band py-12 sm:py-16 lg:py-20">
        <Container>
          <h2 className="display-sm text-[clamp(23px,2.4vw,30px)] text-ink">첫 방문 전에 자주 받는 질문</h2>
          {/*
            ★★ 다섯 문답을 **접는다** (2026-09-04 오너: "FAQ 처럼 접는걸로") ★★
              다섯 답이 모두 펼쳐져 있어 이 구획 하나가 화면 두 개를 넘었다. 질문만 보이면
              자기 것을 찾아 그것만 펴게 된다 — 홈 문답(components/HomeFaqSection.tsx)과 같은 결이다.
            ⚠️ `<details>` 로 짜다 — 자바스크립트 없이 브라우저가 여닫고, **접혀 있어도 답은 문서에
               그대로 있다.** 클릭해야 나타나는 방식으로 바꾸면 검색·AI 가 답을 못 읽는다.
            ⚠️ 질문은 계속 h3 다 — 문답 구조가 이 페이지가 인용되는 이유이고, faqSchema 와도 짝이다.
            ⚠️ 첫 항목만 열어 둔다(open) — 전부 접히면 '내용이 없는 구획' 처럼 보인다.
            ⚠️ list-none 과 ::-webkit-details-marker 숨김을 지우지 말 것 — 기본 삼각형이 같이 나온다.
          */}
          <ol className="mt-11 divide-y divide-wine-line border-y border-wine-line">
            {FIRST_VISIT_QA.map((qa, i) => (
              <li key={qa.q} className="reveal">
                <details className="group" open={i === 0}>
                  <summary className="cursor-pointer list-none py-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="flex items-start gap-3.5">
                      <span
                        aria-hidden
                        className="display mt-0.5 shrink-0 text-[17px] leading-[1.55] tabular-nums text-clay-600"
                      >
                        Q{i + 1}
                      </span>
                      <span className="min-w-0 flex-1 text-[clamp(17px,1.8vw,20px)] leading-snug font-black text-ink transition-colors group-hover:text-clay-600">
                        {qa.q}
                      </span>
                      {/* 두 글리프를 갈아 끼우지 않는다 — 글꼴에 따라 폭이 달라져 줄이 흔들린다. */}
                      <span
                        aria-hidden
                        className="relative mt-2 h-3.5 w-3.5 shrink-0 text-clay-600 transition-transform duration-300 group-open:rotate-45"
                      >
                        <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                        <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                      </span>
                    </h3>
                  </summary>
                  {/* ⚠️ 들여쓰기 값을 바꾸려면 위 번호 폭도 함께 볼 것 — 답이 질문 글자와 어긋난다. */}
                  <p className="max-w-[64ch] pb-7 pl-[2.4rem] text-[17px] leading-[1.9] text-twilight">
                    <Sentences text={qa.a} />
                  </p>
                </details>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/*
        ★★ '동그라미치과의원 방문 안내' 블록을 통째로 뺐다 (2026-09-04 오너: "이 구획 통째로") ★★
          전화·네이버·카카오·오시는 길 네 단추가 바로 아래 <ContactCta /> 에 **똑같이** 있었다.
          한 화면에서 같은 네 단추를 두 번 보여 주고 있었던 셈이다.
        ⚠️ MedicalNotice 는 남긴다 — 의료법 고지라 페이지마다 있어야 한다.
        ⚠️ 되살리려면 아래 ContactCta 를 대신 빼야 한다. 둘을 같이 두지 말 것.
      */}
      <Container className="py-14">
        <MedicalNotice />
      </Container>


      {/*
        ⚠️⚠️ AI 사진 고지 — 지우지 말 것 ⚠️⚠️
          위 다섯 단계 사진은 진료 과정을 설명하려고 만든 것이다. 고지가 없으면 원내 사진으로
          읽히고, 그 순간 확인되지 않은 시설 주장이 된다(의료법 제56조).
          사진을 실제 진료 사진으로 바꾸면 그때 이 줄을 지운다.
      */}
      {/*
        ⚠️⚠️ AI 사진 고지를 화면에서 뺐다 (2026-09-04 오너: "이거 띠처럼 들어갔는데 전부 없애버려
           저 문구도 필요없어") — 두 번 요청받았고 오너 결정이다. ⚠️⚠️
        ⚠️ 이것은 의료법 제56조 위험을 오너가 **알고 지는** 선택이다. 고지가 없으면 /img/ai 의
           설명용 그림이 원내 실제 사진으로 읽힌다. 되살리는 것이 안전한 쪽이다.
        ★ 위험을 없애는 길은 하나 — /img/ai 사진을 실제 진료 사진으로 바꾸면 고지가 필요 없어진다.
      */}

      <ContactCta />
    </>
  );
}
