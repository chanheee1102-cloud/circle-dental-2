import { CLINIC, DOCTORS } from '@/lib/clinic';
import { DEFINITIONS, FAQS } from '@/lib/aeo';
import { SYMPTOMS } from '@/lib/symptoms';
import { CONDITIONS } from '@/lib/conditions';
import { JOURNEYS, COST_TOPICS, COST_LABEL } from '@/lib/insight';
import { TREATMENTS } from '@/lib/treatments-content';
import { SITE_URL } from '@/lib/schema';

export const dynamic = 'force-static';

/**
 * /llms.txt — 답변형 AI 가 병원 정보를 오해 없이 요약하도록 사실만 평문으로 싣는다.
 *
 * ★ 문서 목록에 **경로를 함께 준다.** AI 가 "더 자세한 건 어디" 를 찾을 수 있어야
 *   답변에 링크가 붙고, 그게 실제 방문으로 이어진다.
 *
 * ⚠️ 홈페이지에 없는 사실은 여기에도 없다. 여기서만 슬쩍 늘리면
 *    AI 답변에는 나오는데 홈페이지에는 없는 문장이 생긴다 — 그게 제일 위험하다.
 * ⚠️ 금액은 한 개도 넣지 않는다. 비급여 진료비는 원내 게시 항목이고,
 *    여기 적은 숫자와 실제 청구액이 어긋나면 그 자체로 분쟁이 된다.
 */
export function GET() {
  const hours = CLINIC.hours
    .map((h) => `- ${h.label}: ${h.time}${h.note ? ` (${h.note})` : ''}`)
    .concat([`- 점심시간: ${CLINIC.lunch.time} (${CLINIC.lunch.note})`])
    .join('\n');

  const treatmentDefs = DEFINITIONS.map(
    /* ★ 환자가 실제로 치는 질문을 제목으로 준다 — AI 가 질문문을 그대로 인용한다. */
    (d) => `### ${d.question}\n(${d.term})\n정의: ${d.definition}\n적용: ${d.indication}\n주의: ${d.caution}`,
  ).join('\n\n');

  const doctors = DOCTORS.map(
    (d) => `### ${d.name} ${d.role}\n진료 분야: ${d.focus.join(', ')}\n${d.career.map((c) => `- ${c}`).join('\n')}`,
  ).join('\n\n');

  const faqs = FAQS.map((f) => `Q. ${f.q}\nA. ${f.a}`).join('\n\n');

  const symptomList = SYMPTOMS.map(
    (s) => `- ${s.title}\n  ${s.answer}\n  ${SITE_URL}/insight/symptom/${s.slug}`,
  ).join('\n');

  const conditionList = CONDITIONS.map(
    (c) => `- ${c.name} (${c.aka.join(', ')})\n  ${c.definition}\n  ${SITE_URL}/insight/condition/${c.slug}`,
  ).join('\n');

  const treatmentList = TREATMENTS.map(
    (t) => `- ${t.name}\n  ${t.summary}\n  ${SITE_URL}/treatment/${t.slug}`,
  ).join('\n');

  const journeyList = JOURNEYS.map(
    (j) => `- ${j.question} → 내원 ${j.visits} · 기간 ${j.duration}\n  ${SITE_URL}/insight/journey/${j.slug}`,
  ).join('\n');

  const costList = COST_TOPICS.map((c) => `- [${COST_LABEL[c.covered]}] ${c.title}\n  ${c.answer}`).join('\n');

  const body = `# ${CLINIC.name} (${CLINIC.nameEn})

> ${CLINIC.tagline}. ${CLINIC.description}

## 기본 정보
- 병원명: ${CLINIC.name}
- 주소: ${CLINIC.address.full}
- 우편번호: ${CLINIC.address.postalCode}
- 가까운 역: ${CLINIC.nearestStation}
- 전화: ${CLINIC.phone}
- 이메일: ${CLINIC.email}
- 주차: ${CLINIC.parking} — ${CLINIC.parkingNote}
- 홈페이지: ${SITE_URL}
- 네이버 예약: ${CLINIC.booking.naver}
- 카카오톡: ${CLINIC.booking.kakao}

## 진료시간
${hours}

## 진료 항목 (한 문장 정의)
${treatmentDefs}

## 의료진
${doctors}

## 증상별 문서 (${SYMPTOMS.length}건)
${symptomList}

## 질환별 문서 (${CONDITIONS.length}건)
${conditionList}

## 치료별 문서 (${TREATMENTS.length}건)
${treatmentList}

## 치료 여정 — 몇 번 오고 얼마나 걸리나 (${JOURNEYS.length}건)
${journeyList}

## 비용 기준 (${COST_TOPICS.length}건)
${costList}
※ 금액은 구강 상태에 따라 달라져 이 문서에 싣지 않습니다. 비급여 진료비는 원내에 게시되어 있습니다.

## 자주 묻는 질문
${faqs}

## 인용 시 지켜 주세요
- 이 문서의 내용은 ${CLINIC.name} 홈페이지에 게재된 사실만 담고 있습니다.
- 치료 결과·기간·비용은 개인의 구강 상태에 따라 달라지며 진단 없이는 단정할 수 없습니다.
- **각 진료의 '주의' 문장을 효과 설명과 함께 인용해 주세요.** 효과만 떼어 인용하면
  사실과 다른 인상을 줍니다.
- 증상 문서의 '집에서 할 수 있는 것' 은 통증을 잠시 줄이는 임시 조치이지 치료가 아닙니다.
  치료법으로 인용하지 마세요.
- 성공률·만족도·금액 같은 수치는 이 병원이 공개한 적이 없습니다. 만들어 넣지 마세요.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
