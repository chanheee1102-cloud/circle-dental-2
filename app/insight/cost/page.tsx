import type { Metadata } from 'next';
import { COST_TOPICS, COST_LABEL } from '@/lib/insight';
import { UNVERIFIED } from '@/lib/clinic';
import { Container, NeedsInfo, MedicalNotice, ContactCta, PageHero, Sentences } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, articleSchema, medicalWebPageSchema } from '@/lib/seo';
import { KeyPoints, ArticleMeta, References, charCount, headingId } from '@/components/article';
import { REFS_COST } from '@/lib/references';

export const metadata: Metadata = {
  title: '비용 가이드 — 무엇이 보험이고 무엇이 아닌가',
  description:
    '만 65세 임플란트 보험 조건, 스케일링 연 1회 적용, 신경치료와 크라운의 보험 차이. 치과 비용이 사람마다 달라지는 이유를 설명합니다.',
  alternates: { canonical: '/insight/cost' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '미리 알아두기', path: '/insight' },
  { name: '비용 가이드', path: '/insight/cost' },
];

const BADGE: Record<string, string> = {
  insurance: 'bg-clay-tint text-clay-700',
  partial: 'bg-brand-100 text-ink',
  private: 'bg-wine-soft text-ink-soft',
};

/**
 * 비용 가이드.
 *
 * ★★ 금액을 적지 않는다 ★★
 *   비급여 진료비는 의료법상 원내 게시 금액과 일치해야 한다. 확인되지 않은 금액을 웹에 적으면
 *   그 자체가 허위 표시이고, 원내 금액과 어긋나면 분쟁이 된다. 그래서 이 페이지는
 *   **보험 적용 여부와 비용을 가르는 변수**만 다룬다.
 *
 * ★ 그런데 이 편이 검색에도 유리하다
 *   "임플란트 얼마" 로 검색한 사람이 실제로 알고 싶은 것은 숫자 하나가 아니라
 *   "왜 병원마다 다른가, 내 경우는 어디에 해당하는가" 다. 금액표는 그 질문에 답하지 못한다.
 */
export default function CostPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          /*
           * ⚠️ 이 노드가 없으면 안 된다 (2026-08-18 전수 검사에서 발견).
           *   articleSchema 는 isPartOf / mainEntityOfPage 로 `#webpage` 를 가리키는데,
           *   여기 MedicalWebPage 가 없어서 **문서 안에서 해소되지 않는 참조**가 됐다.
           *   그래프가 열려 있으면 크롤러가 문서를 하나로 못 묶는다.
           */
          medicalWebPageSchema({
            title: '비용 가이드 — 무엇이 보험이고 무엇이 아닌가',
            description:
              '만 65세 임플란트 보험 조건, 스케일링 연 1회 적용, 신경치료와 크라운의 보험 차이. 치과 비용이 사람마다 달라지는 이유를 설명합니다.',
            path: '/insight/cost',
          }),
          articleSchema({
            path: '/insight/cost',
            title: '치과 비용 — 건강보험 적용 항목과 비급여 항목',
            description:
              '같은 치료라도 건강보험이 되는 부분과 안 되는 부분이 나뉩니다. 그 경계와 비용을 가르는 요인을 정리했습니다.',
            wordCount: charCount(COST_TOPICS.map((c) => c.title + c.answer + c.detail).join('')),
            keywords: ['치과 비용', '건강보험', '비급여', '임플란트 보험'],
          }),
          faqSchema(
            COST_TOPICS.map((c) => ({ q: c.title, a: c.answer })),
            '/insight/cost',
          ),
        ]}
      />

      <PageHero
        trail={TRAIL}
        photo="consult"
        eyebrow="비용 가이드"
        title="같은 치료라도 비용이 갈리는 이유가 있습니다"
        desc="건강보험이 적용되는 부분과 그렇지 않은 부분이 나뉘고, 그 경계가 최종 비용을 가장 크게 좌우합니다. 어떤 항목이 어디에 해당하는지 아래에 정리해 두었습니다."
      />

      <Container className="py-12 sm:py-16 lg:py-20">

        <div className="mt-9 max-w-[70ch]">
          <ArticleMeta path="/insight/cost" />
        </div>

        {/*
          ★★ "얼마인가요?" 에 정면으로 답하는 자리 (2026-08-14) ★★
            외부 진단이 "가격 정보 없음 — 비용 검색에 노출 불가" 로 잡았다. 맞는 지적이다.
            비용 페이지인데 정작 **'얼마'라는 낱말에 답하는 문장이 없었다.**

          ⚠️⚠️ 그렇다고 금액을 지어낼 수는 없다 ⚠️⚠️
            비급여 진료비는 의료법상 **원내 게시 금액과 일치해야** 하고(UNVERIFIED.pricing),
            병원이 실제 금액을 주기 전에 적으면 그 자체가 거짓 표시다.
            → 대신 **금액이 정해지는 구조**를 답한다. "왜 병원마다 다른가", "내 경우는
              어디에 해당하는가" 는 실제로 검색하는 사람이 알고 싶어 하는 것이고,
              금액표 하나보다 이 답이 오래 맞다.
        */}
        <h2
          id={headingId('치과 치료비는 얼마인가요')}
          className="mt-12 scroll-mt-28 display-sm text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink"
        >
          치과 치료비는 얼마인가요?
        </h2>
        <div className="mt-4 max-w-[68ch] rounded-2xl border border-brand-200/70 bg-parchment p-6">
          {/*
            ⚠️ 강조(<strong>)가 들어 있어 <Sentences> 를 쓸 수 없다(문자열만 받는다).
               문장마다 span.block 으로 직접 나눈다 — 마침표 뒤에서 줄이 바뀐다. 글자는 그대로다.
          */}
          <p className="text-[18px] leading-[1.85] text-ink">
            <span className="block">
              같은 이름의 치료라도 <strong className="font-black">건강보험이 적용되는지</strong>에
              따라 부담이 크게 갈립니다.
            </span>
            <span className="block">
              급여 항목은 전국 어느 치과에서나 정해진 기준을 따르고 본인부담률도 정해져 있는 반면,
              비급여 항목은 병원이 각자 정하고 원내에 게시합니다.
            </span>
            <span className="block">
              그래서 &lsquo;얼마&rsquo;는 <strong className="font-black">어떤 항목이 몇 개 필요한지</strong>가
              정해진 뒤에야 나옵니다.
            </span>
          </p>
        </div>
        <div className="mt-6 max-w-[68ch] space-y-3 text-[16.5px] leading-[1.85] text-ink-soft">
          <p>
            <Sentences text="아래 표에서 각 항목이 급여인지 비급여인지, 그리고 무엇이 비용을 가르는지 먼저 확인하실 수 있습니다. 급여 항목의 본인부담률과 만 65세 이상 임플란트·틀니 적용 조건은 국민건강보험공단이 정한 기준을 따르므로, 정확한 최신 기준은 공단과 건강보험심사평가원에서 확인하시는 것이 정확합니다." />
          </p>
          <p>
            <Sentences text="비급여 진료비는 검사 결과에 따라 필요한 항목이 달라져 검사 전에는 말씀드릴 수 없습니다. 내원하시면 촬영 사진을 함께 보며 필요한 항목과 각각의 금액을 안내드리고, 원내 게시된 비급여 진료비도 함께 확인하실 수 있습니다." />
          </p>
        </div>

        <div className="mt-9 max-w-[70ch]">
          <KeyPoints
            items={[
              `전체 ${COST_TOPICS.length}개 항목 중 건강보험이 적용되는 항목은 ${
                COST_TOPICS.filter((c) => c.covered === 'insurance').length
              }개, 조건부 적용이 ${COST_TOPICS.filter((c) => c.covered === 'partial').length}개,
              비급여가 ${COST_TOPICS.filter((c) => c.covered === 'private').length}개입니다.`,
              '같은 치료라도 보험이 되는 부분과 안 되는 부분이 나뉘고, 그 경계가 최종 비용을 가장 크게 좌우합니다.',
              '어떤 항목이 몇 개 필요한지 검사로 정해져야 비용을 말씀드릴 수 있습니다.',
            ]}
          />
        </div>

        {/*
          ★★ 비교표 (2026-08-14) ★★
            같은 정보를 카드로만 두면 "내가 알아보려는 치료가 보험이 되나" 를 한눈에 못 본다.
            항목 × 보험 적용 × 비용을 가르는 요인 세 열이면 그 비교가 한 화면에서 끝난다.
            표는 답변 엔진이 특히 잘 인용하는 형식이기도 하다(행 단위로 사실이 끊긴다).
          ⚠️ 금액은 넣지 않는다 — 비급여 진료비는 확인된 값이 없고, 확인 없이 적는 순간
             의료광고법상 거짓 표시가 된다(UNVERIFIED.pricing 주석 참고).
          ⚠️ 좁은 화면에서 표는 가로로 넘친다. 감싼 div 가 자기 안에서만 스크롤되게 한다 —
             페이지 본문이 통째로 가로 스크롤되면 그건 고장으로 보인다.
        */}
        <div className="mt-10 overflow-x-auto rounded-2xl border border-brand-200/70">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">
              치과 진료 항목별 건강보험 적용 여부와 비용을 가르는 요인
            </caption>
            <thead>
              <tr className="bg-parchment">
                <th scope="col" className="px-6 py-4 text-[14px] font-black text-ink">
                  항목
                </th>
                <th scope="col" className="px-6 py-4 text-[14px] font-black text-ink">
                  건강보험 적용
                </th>
                <th scope="col" className="px-6 py-4 text-[14px] font-black text-ink">
                  비용을 가르는 요인
                </th>
              </tr>
            </thead>
            <tbody>
              {COST_TOPICS.map((c) => (
                <tr key={c.slug} className="border-t border-wine-line">
                  <th scope="row" className="px-6 py-4 align-top text-[15.5px] font-bold text-ink">
                    {/* ⚠️ inline-block py-1 — 표 안 링크가 19px 라 손가락으로 누르기 어려웠다(실측). */}
                    <a href={`#${c.slug}`} className="inline-block py-1 hover:text-clay-700 hover:underline">
                      {c.title}
                    </a>
                  </th>
                  <td className="px-6 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[13.5px] font-black ${BADGE[c.covered]}`}
                    >
                      {COST_LABEL[c.covered]}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top text-[15px] leading-relaxed text-ink-soft">
                    {c.factors.join(' · ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 space-y-4">
          {COST_TOPICS.map((c) => (
            <article
              key={c.slug}
              id={c.slug}
              className="scroll-mt-28 rounded-2xl border border-brand-200/70 bg-parchment p-7"
            >
              <span
                className={`inline-flex rounded-full px-3 py-1 text-[13.5px] font-black ${BADGE[c.covered]}`}
              >
                {COST_LABEL[c.covered]}
              </span>
              <h2 className="mt-4 text-[20px] leading-[1.35] font-black tracking-[-0.02em] text-ink">
                {c.title}
              </h2>
              {/* 즉답 */}
              <p className="mt-3 max-w-[68ch] text-[17px] leading-[1.85] text-ink"><Sentences text={c.answer} /></p>
              <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.8] text-ink-soft"><Sentences text={c.detail} /></p>

              <div className="mt-5 border-t border-wine-line pt-4">
                <h3 className="text-[13.5px] font-black tracking-wide text-ink-muted">
                  비용을 가르는 요인
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {c.factors.join(' · ')}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/*
          ★ '비급여 진료비 — 확인 필요' 배지를 화면에서 뺐다 (2026-09-04 오너: "없애줘").
            이것은 우리가 아직 못 채운 값을 **우리에게** 지목하려고 만든 표시인데, 환자가 보는
            페이지에 그대로 떠 있었다. 방문자에게는 "이 병원은 준비가 덜 됐다" 로만 읽힌다.
          ⚠️ lib/clinic.ts 의 UNVERIFIED 자료는 **그대로 둔다.** 값이 없다는 사실이 지워지면
             누군가 임의로 금액을 채울 수 있고, 사실이 아닌 진료비 표시는 의료법 제56조 위반이다.
             아래 MedicalNotice 가 "정확한 금액은 검사 후" 라고 계속 말하고 있다.
        */}

        <div className="mt-10 max-w-[70ch]">
          <References items={REFS_COST} />
        </div>

        <MedicalNotice extra="비급여 진료비는 병원마다 다르며, 정확한 금액은 검사 후 개별 상태에 따라 안내드립니다. 원내 게시된 비급여 진료비를 함께 확인하실 수 있습니다." />
      </Container>

      {/*
        ★ 마무리 전환 블록을 뺐다 (2026-09-04 오너: "스물한번째 부분도 없애줘").
          이 페이지는 '무엇이 보험이고 무엇이 아닌가' 를 읽으러 오는 자리다. 읽고 나서 예약으로
          모는 것보다, 화면 아래 고정 바(components/QuickMenu.tsx)의 전화·예약을 쓰게 두는 편이 낫다.
        ⚠️ 되살리려면 ContactCta 를 다시 부르면 된다 — 부품은 그대로 있다.
      */}
    </>
  );
}
