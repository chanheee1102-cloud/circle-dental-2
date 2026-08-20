import Link from 'next/link';
import type { Metadata } from 'next';
import { IndexHero } from '@/components/article';
import { Reveal } from '@/components/Motion';
import { JOURNEYS } from '@/lib/insight';
import { CLINIC } from '@/lib/clinic';

export const metadata: Metadata = {
  title: `치료 여정 — ${CLINIC.shortName}`,
  description: `몇 번 오고 얼마나 걸리는지. 첫 내원부터 마무리까지 ${JOURNEYS.length}가지 치료의 단계를 정리했습니다.`,
  alternates: { canonical: '/insight/journey' },
};

export default function JourneyIndex() {
  return (
    <>
      <main>
        <IndexHero
          eyebrow="Journey"
          lines={['몇 번 와야 하고', '얼마나 걸리나요?']}
          lede="전화로 가장 많이 받는 질문입니다. 치료마다 첫 내원부터 마무리까지 어떤 단계를 거치는지, 무엇이 기간을 늘리는지 적었습니다."
          count={JOURNEYS.length}
          crumbs={[{ label: '홈', href: '/' }, { label: '미리 알아두기', href: '/insight' }, { label: '치료 여정', href: '/insight/journey' }]}
        />
        <section className="bg-paper py-20 md:py-28">
          <div className="shell">
            <ul className="grid gap-3 md:grid-cols-2">
              {JOURNEYS.map((j, i) => (
                <Reveal as="li" key={j.slug} delay={(i % 6) * 55}>
                  <Link href={`/insight/journey/${j.slug}`} className="group flex h-full flex-col rounded-[26px] bg-surface p-8 transition-transform duration-500 hover:-translate-y-1.5 md:p-9">
                    <span className="display text-[26px] leading-none text-brand/30">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="mt-5 text-[17.5px] font-bold leading-snug tracking-[-0.025em] text-ink transition-colors group-hover:text-brand">{j.question}</h2>
                    <p className="mt-3.5 line-clamp-2 flex-1 text-[14.5px] leading-[1.8] text-ink-2">{j.answer}</p>
                    <p className="mt-6 flex gap-5 text-[13.5px] font-bold text-brand">
                      <span>내원 {j.visits}</span><span>기간 {j.duration}</span>
                    </p>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}
