import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import { Container, CardLink, ContactCta, PageHero, Sentences } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
import { SYMPTOMS, SYMPTOM_GROUPS } from '@/lib/symptoms';
import { JOURNEYS, COST_TOPICS, GLOSSARY } from '@/lib/insight';
import { CONDITIONS } from '@/lib/conditions';
import { CLINIC_QA } from '@/lib/faq';
import { TREATMENTS } from '@/lib/treatments';
import { allPosts } from '@/lib/blog';
import { NAV } from '@/lib/nav';

export const metadata: Metadata = {
  title: '미리 알아두기',
  description:
    '증상으로 찾기, 질환 사전, 치료 여정, 비용 가이드, 용어 사전, 응급 상황 안내. 진료실에서 다 담기 어려운 배경 설명을 정리했습니다.',
  alternates: { canonical: '/insight' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '미리 알아두기', path: '/insight' },
];

/**
 * 미리 알아두기 허브.
 *
 * ★★ 이 쪽이 인사이트의 **유일한 입구**다 (2026-09-07 오너 지시) ★★
 *   헤더에서 인사이트를 눌러도 더 이상 펼쳐지지 않는다(lib/nav.ts hubOnly). 여덟 갈래를
 *   세로로 늘어놓은 판은 '빨리 가는 자리' 가 아니라 '읽어야 하는 목록' 이었다.
 *   그래서 여기서 카드로 본다.
 *
 * ⚠️⚠️ 여덟 갈래가 **전부** 여기 있어야 한다 ⚠️⚠️
 *   헤더 판이 사라졌으므로 여기 빠진 것은 사이트 어디서도 못 가는 쪽이 된다.
 *   (푸터가 여덟을 계속 싣기는 하지만, 푸터만 남은 링크는 중요도 신호가 약하다.)
 *   회귀 검사가 nav 의 children 여덟과 이 목록이 정확히 같은지 강제한다.
 *
 * ★ 세 묶음으로 나눈 이유 — 카드 여덟 장을 한 격자에 늘어놓으면 헤더 판을 화면 가운데로
 *   옮긴 것과 다를 바가 없다. "내 상태 / 치료 결정 / 더 읽을거리" 는 환자가 실제로
 *   서 있는 세 자리다.
 */
const BANDS = [
  {
    title: '내 상태가 무엇인지',
    lead: '병명을 모르셔도 됩니다. 지금 느끼시는 것에서 출발해 무엇을 확인하게 되는지까지 이어집니다.',
    cards: [
      {
        href: '/insight/symptom',
        title: '증상으로 찾기',
        desc: '아픈 자리와 느낌으로 먼저 찾습니다. 가능한 원인과 확인 방법, 지금 병원에 가야 하는 신호를 함께 적었습니다.',
        tag: `${SYMPTOM_GROUPS.length}묶음 · 증상 ${SYMPTOMS.length}가지`,
      },
      {
        href: '/insight/condition',
        title: '질환 사전',
        desc: '진료실에서 들으신 병명이 무엇이고, 그대로 두면 어떻게 진행하는지 설명드립니다.',
        tag: `${CONDITIONS.length}개 질환`,
      },
      {
        href: '/insight/emergency',
        title: '응급 상황',
        desc: '치아가 빠졌거나 부러졌을 때, 밤에 참기 힘들 때 지금 하실 수 있는 조치를 적었습니다.',
        tag: '지금 당장',
      },
    ],
  },
  {
    title: '치료를 정하실 때',
    lead: '몇 번 오는지, 얼마나 걸리는지, 얼마가 드는지. 결정 전에 알고 계셔야 할 것들입니다.',
    cards: [
      {
        href: '/insight/journey',
        title: '치료 여정',
        desc: '치료마다 몇 번 오시고 얼마나 걸리는지, 회차별로 무엇을 하는지 적었습니다.',
        tag: `${JOURNEYS.length}개 치료`,
      },
      {
        href: '/insight/cost',
        title: '비용 가이드',
        desc: '건강보험이 적용되는 항목과 그렇지 않은 항목, 비용이 사람마다 달라지는 이유를 설명드립니다.',
        tag: `${COST_TOPICS.length}개 주제`,
      },
      {
        href: '/faq',
        title: '자주 묻는 질문',
        desc: '진료 시간과 예약부터 치료별 궁금한 점까지, 실제로 많이 받는 질문을 모았습니다.',
        tag: `${CLINIC_QA.length + TREATMENTS.reduce((n, t) => n + t.qa.length, 0)}개 질문`,
      },
    ],
  },
  {
    title: '더 읽어 두실 것',
    lead: '당장 필요하지는 않지만, 알고 계시면 설명을 들으실 때 훨씬 수월합니다.',
    cards: [
      {
        href: '/insight/blog',
        title: '블로그',
        desc: '진료하며 자주 받는 질문과 알아두면 좋은 치과 이야기를 적어 둡니다.',
        tag: `${allPosts().length}편`,
      },
      {
        href: '/insight/glossary',
        title: '용어 사전',
        desc: '진료실에서 쓰는 용어를 짧게 풀었습니다. 설명을 들으실 때 함께 보시면 됩니다.',
        tag: `${GLOSSARY.length}개 용어`,
      },
    ],
  },
];

/*
 * ★★ 회귀 가드 — 빌드 때 터진다 ★★
 *   nav 의 '인사이트' 하위와 이 쪽의 카드가 어긋나면 여기서 멈춘다.
 *   헤더 판이 없어졌으므로, 하위를 하나 늘리고 카드를 안 만들면 그 쪽은 사이트 어디서도
 *   못 가는 쪽이 된다(푸터만 남는다). 그 사고를 조용히 넘기지 않는다.
 * ⚠️ 이 검사를 지우지 말 것. 빌드가 멈추는 편이 링크가 조용히 사라지는 것보다 낫다.
 */
{
  const inNav = (NAV.find((n) => n.href === '/insight')?.children ?? [])
    .filter((c) => !c.external)
    .map((c) => c.href);
  const inCards = BANDS.flatMap((b) => b.cards.map((c) => c.href));
  const missing = inNav.filter((h) => !inCards.includes(h));
  if (missing.length) {
    throw new Error(
      `[insight 허브] nav 에 있는데 카드가 없는 쪽: ${missing.join(', ')} — ` +
        'app/insight/page.tsx 의 BANDS 에 카드를 추가할 것(헤더 판이 없어 여기 빠지면 갈 길이 사라진다).',
    );
  }
}

export default function InsightHubPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(TRAIL)} />
      <PageHero
        trail={TRAIL}
        photo="consult"
        eyebrow="미리 알아두기"
        title="진료실에서 못다 한 설명을 미리 읽어 두실 수 있습니다"
        desc="치료보다 그 앞뒤 설명이 부족해 불안하신 경우가 많습니다. 미리 읽고 오시면 진료실에서 더 깊은 이야기를 나눌 수 있습니다."
      />

      <Container className="py-12 sm:py-16 lg:py-20">
        {/* 발행·수정일과 검토자 — 기계와 사람이 같은 값을 보게 한다. */}
        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/insight" />
        </div>

        {/*
          ★ 카드 제목은 h3 이고 묶음 이름이 h2 다 — h1 → h2 → h3 으로 단계가 이어진다.
            (전에는 묶음이 없어 카드 제목이 h2 였다. 묶음이 생겼으니 자리를 넘긴다.)
        */}
        <div className="mt-14 space-y-16">
          {BANDS.map((b) => (
            <section key={b.title}>
              <div className="border-b border-wine-line pb-5">
                <h2 className="display-sm text-[clamp(22px,2.4vw,30px)] leading-[1.3] text-ink">
                  {b.title}
                </h2>
                <p className="mt-3 max-w-[52em] text-[16.5px] leading-[1.85] text-twilight">
                  <Sentences text={b.lead} />
                </p>
              </div>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {b.cards.map((c) => (
                  <CardLink key={c.href} {...c} as="h3" />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>

      <ContactCta />
    </>
  );
}
