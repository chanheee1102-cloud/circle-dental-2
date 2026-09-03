import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import { Container, CardLink, ContactCta, PageHero } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
import { SYMPTOMS } from '@/lib/symptoms';
import { JOURNEYS, COST_TOPICS, GLOSSARY } from '@/lib/insight';
import { CONDITIONS } from '@/lib/conditions';

export const metadata: Metadata = {
  title: '미리 알아두기',
  description:
    '증상으로 찾기, 치료 여정, 비용 가이드, 용어 사전, 응급 상황 안내. 진료실에서 다 담기 어려운 배경 설명을 정리했습니다.',
  alternates: { canonical: '/insight' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '미리 알아두기', path: '/insight' },
];

export default function InsightHubPage() {
  const cards = [
    {
      href: '/insight/symptom',
      title: '증상으로 찾기',
      desc: '병명을 모르셔도 됩니다. 지금 느끼시는 증상에서 시작해 가능한 원인과 확인 방법을 설명드립니다.',
      tag: `${SYMPTOMS.length}가지 증상`,
    },
    {
      href: '/insight/condition',
      title: '질환 사전',
      desc: '진료실에서 들으신 병명이 무엇이고 방치하면 어떻게 진행하는지 설명드립니다.',
      tag: `${CONDITIONS.length}개 질환`,
    },
    {
      href: '/insight/journey',
      title: '치료 여정',
      desc: '치료마다 몇 번 오시고 얼마나 걸리는지, 회차별로 무엇을 하는지 적었습니다.',
      tag: `${JOURNEYS.length}개 치료`,
    },
    {
      href: '/insight/cost',
      title: '비용 가이드',
      desc: '건강보험이 적용되는 항목과 그렇지 않은 항목, 그리고 비용이 사람마다 달라지는 이유를 설명드립니다.',
      tag: `${COST_TOPICS.length}개 주제`,
    },
    {
      href: '/insight/glossary',
      title: '용어 사전',
      desc: '진료실에서 쓰는 용어를 짧게 풀었습니다. 설명을 들으실 때 함께 보시면 됩니다.',
      tag: `${GLOSSARY.length}개 용어`,
    },
    {
      href: '/insight/emergency',
      title: '응급 상황',
      desc: '치아가 빠졌거나 부러졌을 때, 밤에 참기 힘들 때 지금 하실 수 있는 조치를 적었습니다.',
      tag: '지금 당장',
    },
  ];

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
          ★ 카드 제목이 h2 다 (2026-08-18). 이 격자 위에 h2 가 따로 없어서 h3 으로 두면
            h1 → h3 으로 한 단계를 건너뛴다. 게다가 여기 카드 하나하나는 이 허브의
            **최상위 구획**(증상으로 찾기 · 치료 여정 · 비용 · 용어 · 응급)이라 의미상으로도 h2 가 맞다.
        */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <CardLink key={c.href} {...c} as="h2" />
          ))}
        </div>
      </Container>

      <ContactCta />
    </>
  );
}
