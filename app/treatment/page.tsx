import Link from 'next/link';
import type { Metadata } from 'next';
import { IndexHero } from '@/components/article';
import { Reveal } from '@/components/Motion';
import { TREATMENTS } from '@/lib/treatments-content';
import { CLINIC } from '@/lib/clinic';

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
          lines={['무슨 치료인지', '먼저 알고 오세요']}
          lede={`${TREATMENTS.length}가지 진료를 어떤 치료인지, 누구에게 하는지, 무엇을 주의해야 하는지 순서로 정리했습니다.`}
          count={TREATMENTS.length}
          crumbs={[{ label: '홈', href: '/' }, { label: '치료 알아보기', href: '/treatment' }]}
        />
        <section className="bg-paper py-20 md:py-28">
          <div className="shell">
            <ul className="space-y-px overflow-hidden rounded-[22px] bg-line">
              {TREATMENTS.map((t, i) => (
                <Reveal as="li" key={t.slug} delay={(i % 6) * 55}>
                  <Link href={`/treatment/${t.slug}`} className="group grid gap-4 bg-surface p-8 transition-colors duration-500 hover:bg-paper md:grid-cols-[minmax(0,260px)_minmax(0,1fr)] md:gap-10 md:p-10">
                    <h2 className="text-[19px] font-bold tracking-[-0.03em] text-ink transition-colors group-hover:text-brand">{t.name}</h2>
                    <p className="t-body text-[14.5px]">{t.summary}</p>
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
