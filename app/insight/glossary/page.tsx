import Link from 'next/link';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { IndexHero } from '@/components/article';
import { Reveal } from '@/components/Motion';
import { GLOSSARY } from '@/lib/insight';
import { treatmentBySlug } from '@/lib/treatments-content';
import { CLINIC } from '@/lib/clinic';
import { SITE_URL, CLINIC_ID } from '@/lib/schema';

export const metadata: Metadata = {
  title: `치과 용어집 — ${CLINIC.shortName}`,
  description: `진료실에서 들은 말을 다시 찾아볼 수 있게. 치과 용어 ${GLOSSARY.length}개를 쉬운 말로 풀었습니다.`,
  alternates: { canonical: '/insight/glossary' },
};

export default function GlossaryPage() {
  return (
    <>
      <main>
        <IndexHero
          eyebrow="Glossary"
          lines={['진료실에서 들은 말이', '무슨 뜻인가요?']}
          lede={`설명은 들었는데 나와서 생각하니 잘 모르겠는 말들이 있습니다. ${GLOSSARY.length}개를 쉬운 말로 풀었습니다.`}
          count={GLOSSARY.length}
          crumbs={[{ label: '홈', href: '/' }, { label: '미리 알아두기', href: '/insight' }, { label: '용어집', href: '/insight/glossary' }]}
        />
        <section className="bg-paper py-20 md:py-28">
          <div className="shell max-w-4xl">
            <dl className="space-y-px overflow-hidden rounded-[22px] bg-line">
              {GLOSSARY.map((g, i) => {
                const t = g.related ? treatmentBySlug(g.related) : null;
                return (
                  <Reveal key={g.term} delay={(i % 8) * 45}>
                    <div className="grid gap-2 bg-surface p-7 md:grid-cols-[200px_minmax(0,1fr)] md:gap-8 md:p-8">
                      <dt>
                        <span className="text-[17px] font-bold tracking-[-0.025em] text-ink">{g.term}</span>
                        {g.reading ? <span className="ml-2 text-[14px] text-ink-2">{g.reading}</span> : null}
                      </dt>
                      <dd>
                        <p className="t-body text-[15.5px]">{g.def}</p>
                        {t ? (
                          <Link href={`/treatment/${t.slug}`} className="mt-3 inline-flex text-[13.5px] font-bold text-brand">
                            {t.name} →
                          </Link>
                        ) : null}
                      </dd>
                    </div>
                  </Reveal>
                );
              })}
            </dl>
          </div>
        </section>
      </main>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'DefinedTermSet',
          '@id': `${SITE_URL}/insight/glossary`,
          name: '치과 용어집',
          inLanguage: 'ko-KR',
          publisher: { '@id': CLINIC_ID },
          hasDefinedTerm: GLOSSARY.map((g) => ({
            '@type': 'DefinedTerm',
            name: g.term,
            description: g.def,
          })),
        }}
      />
    </>
  );
}
