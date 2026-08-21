import Link from 'next/link';
import type { Metadata } from 'next';
import { IndexHero } from '@/components/article';
import { Reveal, PopIn, BlurText, Lede } from '@/components/Motion';
import DefinitionSwitch from '@/components/DefinitionSwitch';
import JsonLd from '@/components/JsonLd';
import { TREATMENTS } from '@/lib/treatments-content';
import { CLINIC } from '@/lib/clinic';
import { procedureSchemas } from '@/lib/schema';

export const metadata: Metadata = {
  title: `치료 알아보기 — ${CLINIC.shortName}`,
  description: `어떤 치료인지, 누구에게 하는지, 무엇을 주의해야 하는지. ${CLINIC.shortName}의 진료 ${TREATMENTS.length}가지를 정리했습니다.`,
  alternates: { canonical: '/treatment' },
};

export default function TreatmentIndex() {
  return (
    <>
      <main>
        <IndexHero
          eyebrow="Treatment"
          lines={['어떤 치료를', '받게 되나요?']}
          lede={`${TREATMENTS.length}가지 진료를 어떤 치료인지, 누구에게 하는지, 무엇을 주의해야 하는지 순서로 정리했습니다.`}
          count={TREATMENTS.length}
          crumbs={[{ label: '홈', href: '/' }, { label: '치료 알아보기', href: '/treatment' }]}
        />

        {/* ── AEO: 한 문장 정의 ─────────────────────────────────
             ★★ 홈에서 옮겨 왔다 (2026-08-21, 운영자: "이건 그냥 서브페이지에
                넣을까?") ★★ 홈이 진료를 두 번 연속 설명하고 있었고, 이 페이지는
                반대로 제목 하나 + 진료 목록이 전부라 얇았다. 여기 오면
                **환자가 쓰는 말로 먼저 찾고**(아래 정의 6개) 그다음 전체
                목록으로 넘어가는 흐름이 된다.
             ★ 답변형 AI 는 페이지를 통째로 읽지 않고 **그대로 인용할 한 문장**을
               찾는다. "아름다운 미소를 디자인합니다" 는 그 자리에 못 들어간다 —
               질문에 답하지 않기 때문이다.
             ★ 효과와 주의를 **같은 카드 안에** 둔다. 떨어뜨려 놓으면 효과만 인용된다.
             ⚠️ 정의 6개는 이 페이지 아래 전체 목록(10개)의 부분집합이다. 중복이
                아니라 입구다 — 목록을 정의로 대체하거나 정의를 10개로 늘리지 말 것.
                (전자는 나머지 진료가 사라지고, 후자는 입구가 다시 목록이 된다.) */}
        <section id="definitions" className="relative overflow-hidden bg-surface py-20 md:py-28">
          {/* 화면이 멈추고 1초 뒤에 혼자 떠오르는 배경 — 같이 나오면 그냥 배경이지만
              늦게 나오면 시선이 그리로 간다. */}
          <PopIn className="pointer-events-none absolute -right-40 top-24 h-[520px] w-[520px] rounded-full" aria-hidden>
            <div className="h-full w-full rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-brand)_16%,transparent)_0%,transparent_62%)]" />
          </PopIn>
          <div className="relative shell">
            <Reveal>
              <p className="t-eyebrow mb-7 text-ink-2">In one sentence</p>
            </Reveal>
            <h2 className="t-h2">
              <BlurText text="이건 무슨 치료인가요?" />
            </h2>
            <Reveal delay={200}>
              <Lede
                className="t-body mt-8 max-w-xl"
                text="검색하다 들어오신 분이 가장 먼저 궁금해하는 것부터 한 문장으로 적었습니다."
              />
            </Reveal>

            <DefinitionSwitch />
          </div>
        </section>

        {/* ── 전체 진료 목록 ─────────────────────────────────── */}
        <section className="bg-paper py-20 md:py-28">
          <div className="shell">
            <Reveal>
              <h2 className="t-h2 mb-12">진료 전체 보기</h2>
            </Reveal>
            <ul className="space-y-px overflow-hidden rounded-[22px] bg-line">
              {TREATMENTS.map((t, i) => (
                <Reveal as="li" key={t.slug} delay={(i % 6) * 55}>
                  <Link href={`/treatment/${t.slug}`} className="group grid gap-4 bg-surface p-8 transition-colors duration-500 hover:bg-paper md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-10 md:p-10">
                    {/* ⚠️ h2 → h3. 위에 '진료 전체 보기' h2 가 생겼으므로 목록
                        항목은 그 아래 단계여야 한다. 같은 단계로 두면 화면
                        낭독기와 검색 엔진에 목차가 평평하게 읽힌다. */}
                    <h3 className="text-[20px] font-bold tracking-[-0.03em] text-ink transition-colors group-hover:text-brand">{t.name}</h3>
                    <p className="t-body text-[15.5px]">{t.summary}</p>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </main>

      {/* 정의 본문이 이 페이지에 있으므로 구조화 데이터도 여기서 낸다
          (2026-08-21 홈에서 함께 옮겨 옴 — 본문 없는 페이지가 스키마만 갖고
          있으면 화면에 없는 내용을 주장하는 셈이 된다). */}
      <JsonLd data={procedureSchemas()} />
    </>
  );
}
