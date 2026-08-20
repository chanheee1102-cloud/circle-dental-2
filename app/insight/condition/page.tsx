import Link from 'next/link';
import type { Metadata } from 'next';
import { IndexHero } from '@/components/article';
import { Reveal } from '@/components/Motion';
import { CONDITIONS } from '@/lib/conditions';
import { CLINIC } from '@/lib/clinic';

export const metadata: Metadata = {
  title: `질환 알아보기 — ${CLINIC.shortName}`,
  description: `진단명을 들었을 때 그게 무엇이고 어떻게 진행하는지. ${CONDITIONS.length}가지 구강 질환을 정리했습니다.`,
  alternates: { canonical: '/insight/condition' },
};

export default function ConditionIndex() {
  return (
    <>
      <main>
        <IndexHero
          eyebrow="Condition"
          lines={['들으신 진단명이', '무슨 뜻인가요?']}
          lede={`${CONDITIONS.length}가지 구강 질환을 정의 한 문장에서 시작해 진행 단계까지 정리했습니다. 방치하면 어떻게 되는지를 알면 언제 가야 할지 스스로 판단할 수 있습니다.`}
          count={CONDITIONS.length}
          crumbs={[{ label: '홈', href: '/' }, { label: '미리 알아두기', href: '/insight' }, { label: '질환 알아보기', href: '/insight/condition' }]}
        />
        <section className="bg-paper py-20 md:py-28">
          <div className="shell">
            <ul className="grid gap-3 md:grid-cols-2">
              {CONDITIONS.map((c, i) => (
                <Reveal as="li" key={c.slug} delay={(i % 6) * 55}>
                  <Link href={`/insight/condition/${c.slug}`} className="group flex h-full flex-col rounded-[26px] bg-surface p-8 transition-transform duration-500 hover:-translate-y-1.5 md:p-9">
                    <span className="display text-[26px] leading-none text-brand/30">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="mt-5 text-[18.5px] font-bold tracking-[-0.03em] text-ink transition-colors group-hover:text-brand">{c.name}</h2>
                    {c.aka.length ? <p className="mt-1.5 text-[13.5px] text-brand">{c.aka.join(' · ')}</p> : null}
                    <p className="mt-3.5 line-clamp-3 flex-1 text-[14.5px] leading-[1.8] text-ink-2">{c.definition}</p>
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
