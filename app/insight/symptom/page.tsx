import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { IndexHero } from '@/components/article';
import { Reveal } from '@/components/Motion';
import { SYMPTOMS } from '@/lib/symptoms';
import { CLINIC } from '@/lib/clinic';
import { SITE_URL, CLINIC_ID } from '@/lib/schema';

export const metadata: Metadata = {
  title: `증상으로 찾기 — ${CLINIC.shortName}`,
  description: `지금 느끼는 증상에서 시작하세요. ${SYMPTOMS.length}가지 증상의 원인과 지금 할 수 있는 것, 바로 와야 하는 신호를 정리했습니다.`,
  alternates: { canonical: '/insight/symptom' },
};

export default function SymptomIndex() {
  return (
    <>
      <main>
        <IndexHero
          eyebrow="Symptom"
          lines={['지금 어떤 증상이', '있으신가요?']}
          lede={`${SYMPTOMS.length}가지 증상을 모았습니다. 각 문서는 왜 그런지, 지금 무엇을 할 수 있는지, 언제 바로 와야 하는지를 순서로 적었습니다.`}
          count={SYMPTOMS.length}
          crumbs={[{ label: '홈', href: '/' }, { label: '미리 알아두기', href: '/insight' }, { label: '증상으로 찾기', href: '/insight/symptom' }]}
        />
        <section className="bg-paper py-20 md:py-28">
          <div className="shell">
            <ul className="grid gap-3 md:grid-cols-2">
              {SYMPTOMS.map((s, i) => (
                <Reveal as="li" key={s.slug} delay={(i % 6) * 55}>
                  <Link href={`/insight/symptom/${s.slug}`} className="group flex h-full flex-col rounded-[26px] bg-surface p-8 transition-transform duration-500 hover:-translate-y-1.5 md:p-9">
                    {/* 큰 세리프 번호 — 홈의 진료 카드(01·02)와 같은 장치. */}
                    <span className="display text-[26px] leading-none text-brand/30">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-5 text-[12.5px] tracking-[0.14em] text-brand">{s.short}</span>
                    <h2 className="mt-2.5 text-[18px] font-bold leading-snug tracking-[-0.025em] text-ink transition-colors group-hover:text-brand">
                      {s.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 flex-1 text-[14.5px] leading-[1.8] text-ink-2">{s.answer}</p>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: '증상으로 찾기',
          url: `${SITE_URL}/insight/symptom`,
          publisher: { '@id': CLINIC_ID },
          hasPart: SYMPTOMS.map((s) => ({
            '@type': 'MedicalWebPage',
            name: s.title,
            url: `${SITE_URL}/insight/symptom/${s.slug}`,
          })),
        }}
      />
    </>
  );
}
