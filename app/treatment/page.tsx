import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import { TREATMENTS } from '@/lib/treatments';
import { Container, ContactCta } from '@/components/ui';
import { TreatmentHero } from '@/components/TreatmentShell';
import { IMG } from '@/lib/assets';
import { CareListSection } from '@/components/CareListSection';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, itemListSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '진료과목',
  description:
    '동그라미치과의 진료 범위입니다. 임플란트, 신경치료, 잇몸치료, 충치치료, 사랑니 발치, 크라운·보철, 스케일링, 어린이 진료를 봅니다.',
  alternates: { canonical: '/treatment' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '진료과목', path: '/treatment' },
];

export default function TreatmentIndexPage() {
  return (
    <>
      {/*
        ★ 화면에 열 줄짜리 번호 목록이 실제로 보이게 된 다음에야 ItemList 를 붙였다
          (2026-08-14, 홈에서 목록을 옮겨 온 커밋). 안 보이는 목록에 붙이면 정책 위반이다.
      */}
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          itemListSchema(
            '/treatment',
            TREATMENTS.map((t) => ({ name: t.name, path: `/treatment/${t.slug}` })),
            '동그라미치과 진료 영역',
          ),
        ]}
      />
      {/*
        머리말 — 진료과목 아홉 곳과 같은 부품을 쓴다 (2026-09-01 오너 지시).
        ⚠️ 공용 PageHero 로 되돌리지 말 것 — 그쪽은 병원 소개 · 내원 안내와 함께 쓰는 부품이라
           눈썹이 알약이고 빵부스러기가 왼쪽이어서, 이 목록만 진료 페이지들과 머리가 달랐다.
      */}
      <TreatmentHero
        trail={TRAIL}
        eyebrow="고양 화정동 치과 진료과목 · 열 갈래"
        /* ⚠️ 아래 title 은 2026-09-02 오너 지정 문구다. 이전에는 '어떤 경우에 /
           어떤 진료를 하나요?' 였다 — 질문형이라 답변 엔진이 물기 좋았지만, 같은
           질문('어떤 진료를 받을 수 있나요?')이 홈 진료 구획 제목과 /about 문답에
           그대로 남아 있어 그 자리는 비지 않는다. */
        title={['증상에 따라', '필요한 진료는 달라집니다']}
        lead="같은 증상처럼 보여도 치아와 잇몸 상태에 따라 필요한 치료는 달라질 수 있습니다. 치료명이 아닌, 지금의 증상을 기준으로 확인해 보세요."
        photo={{ src: IMG.interior[2].src, alt: IMG.interior[2].alt }}
      />

      {/* ⚠️ 여백 가진 상자로 감싸지 말 것 — ArticleMeta 는 지금 null 이라 빈 띠만 남는다. */}
      <Container>
        <ArticleMeta path="/treatment" />
      </Container>

      {/*
        ★★ 목록을 밝은 띠에 올린다 (2026-09-02 오너: "너무 어둡고 침침해") ★★
          이 페이지는 열 줄을 훑어 자기 것을 찾는 자리다. 어두운 바탕에서 열 줄이 이어지면
          글이 다 비슷하게 가라앉아 훑기가 어렵다. 목록은 밝은 면이 맞다.
        ⚠️ 어두운 면으로 되돌리지 말 것. 되돌리려면 가로줄 색도 함께 봐야 한다 —
           어두운 결의 옅은 선은 밝은 띠에서, 밝은 띠의 진한 선은 어두운 결에서 어긋난다.

        ★★ 홈에 있던 진료 영역 목록을 여기로 옮겼다 (2026-08-14 운영자) ★★
          원래 이 자리에 있던 카드 격자(이름 + 요약 + 질문 수)는 이 목록이 그대로 흡수했다.
          목록 쪽에는 카드에 없던 '이런 경우에 봅니다' 까지 있어 카드를 남길 이유가 없다.
        ⚠️ 둘을 같이 두면 같은 열 개 링크가 한 페이지에 두 번 생긴다 — 사람에게도 기계에게도 손해다.
      */}
      <section className="light-band py-16 lg:py-20">
        <Container>
          <CareListSection />
        </Container>
      </section>

      <ContactCta />
    </>
  );
}
