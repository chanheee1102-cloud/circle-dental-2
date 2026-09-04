import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import Link from 'next/link';
import { SYMPTOMS } from '@/lib/symptoms';
import { Container, MedicalNotice, ContactCta, PageHero, Sentences } from '@/components/ui';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '증상으로 찾기',
  description:
    '이가 시리거나 잇몸에서 피가 날 때, 밤에 욱신거릴 때. 병명을 몰라도 지금 느끼는 증상에서 시작해 가능한 원인과 확인 방법을 정리했습니다.',
  alternates: { canonical: '/insight/symptom' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '미리 알아두기', path: '/insight' },
  { name: '증상으로 찾기', path: '/insight/symptom' },
];

export default function SymptomIndexPage() {
  return (
    <>
      {/* 목록 페이지 자체도 질문–답변 묶음이다. 각 증상의 즉답을 FAQ 로 노출해 인용 통로를 넓힌다. */}
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          faqSchema(SYMPTOMS.map((s) => ({ q: s.title, a: s.answer }))),
        ]}
      />

      <PageHero
        trail={TRAIL}
        photo="room"
        eyebrow="증상으로 찾기"
        title="병명은 모르셔도 괜찮습니다"
        desc="어떤 치료가 필요한지는 검사와 진단의 결과이고, 출발점은 지금 느끼시는 증상입니다. 아픈 자리와 느낌으로 먼저 찾아보세요."
      />

      <Container className="py-12 sm:py-16 lg:py-20">

        {/* ⚠️ 도입 삽화를 되살리지 말 것 (2026-09-01 오너) — 목록이 2단 유리 카드라
            사람 사진 없이도 '자료' 로 읽히지 않는다. 큰 사진은 목록을 화면 아래로 민다. */}

        {/* 발행·수정일과 검토자 — 기계와 사람이 같은 값을 보게 한다. */}
        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/insight/symptom" />
        </div>

        {/*
          ⚠️ 한 단으로 되돌리지 말 것 (2026-08-31) — 카드가 화면 폭을 다 쓰면서 안의 글이
             한 줄에 76자가 됐다(실측). 한글에서 편한 한 줄은 35~45자다.
          ⚠️ h-full 을 지우지 말 것 — 없으면 좌우 두 카드의 높이가 서로 달라진다.
        */}
        {/*
          ★★ 카드를 **눌러서 펴는 것**으로 바꿨다 (2026-09-04 오너: "각각 클릭하면 펼쳐져서 나오게끔") ★★
            전에는 카드마다 답을 통째로 깔아 두어 스무 장이 화면 여러 개를 채웠다. 이제 제목만
            늘어서고, 궁금한 것만 펴서 읽은 뒤 자세히 보기로 넘어간다.
          ⚠️ 안의 링크는 **접혀 있어도 문서에 그대로 있다** — details 는 내용을 지우지 않는다.
             자바스크립트로 갈아 끼우지 말 것. 그러면 검색·AI 가 스무 갈래를 못 읽고,
             증상 상세 스무 페이지가 이 목록에서 고아가 된다.

          ★★ 답에는 Sentences 를 쓰지 않는다 (2026-09-04 오너: "너무 쉼표랑 마침표로 해서 그런거같아") ★★
            Sentences 는 문장마다 span.block 을 낸다. 본문 폭에서는 읽기 좋지만 카드 폭에서는
            쉼표마다 줄이 갈려 글이 계단처럼 보인다. 여기서는 그냥 흐르게 둔다.
          ⚠️ 그리고 그 block 자식 때문에 line-clamp-2 가 **아예 동작하지 않고 있었다** — 두 줄로
             줄이려던 것이 전문 노출로 이어졌다. 지금은 접기가 그 역할을 한다.
        */}
        <ul className="mt-12 grid gap-3 lg:grid-cols-2">
          {SYMPTOMS.map((s) => (
            <li key={s.slug}>
              <details className="group h-full rounded-2xl border border-brand-200/70 bg-parchment transition-colors open:border-brand-300 hover:border-brand-300">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 p-6 [&::-webkit-details-marker]:hidden">
                  <h2 className="min-w-0 flex-1 text-[18px] leading-snug font-black text-ink transition-colors group-hover:text-clay-700 sm:text-[19px]">
                    {s.title}
                  </h2>
                  {/* 두 글리프를 갈아 끼우지 않는다 — 글꼴에 따라 폭이 달라져 줄이 흔들린다. */}
                  <span
                    aria-hidden
                    className="relative mt-2 h-3.5 w-3.5 shrink-0 text-clay-700 transition-transform duration-300 group-open:rotate-45"
                  >
                    <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                    <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current" />
                  </span>
                </summary>
                <div className="px-6 pb-6">
                  <p className="text-[15.5px] leading-[1.85] text-ink-soft">{s.answer}</p>
                  <Link
                    href={`/insight/symptom/${s.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-black text-clay-700 hover:underline"
                  >
                    자세히 보기 <span aria-hidden>→</span>
                  </Link>
                </div>
              </details>
            </li>
          ))}
        </ul>

        <MedicalNotice />
      </Container>

      <ContactCta
        title="증상만으로는 원인을 특정할 수 없습니다"
        desc="같은 증상이라도 원인이 여럿입니다. 검사로 확인해야 어떤 치료가 필요한지 정해집니다."
      />
    </>
  );
}
