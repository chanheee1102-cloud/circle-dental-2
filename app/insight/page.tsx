import Link from 'next/link';
import type { Metadata } from 'next';
import { IndexHero } from '@/components/article';
import { Reveal } from '@/components/Motion';
import { SYMPTOMS } from '@/lib/symptoms';
import { CONDITIONS } from '@/lib/conditions';
import { JOURNEYS, COST_TOPICS, GLOSSARY } from '@/lib/insight';
import { TREATMENTS } from '@/lib/treatments-content';
import { CLINIC } from '@/lib/clinic';

export const metadata: Metadata = {
  title: `미리 알아두기 — ${CLINIC.name}`,
  description:
    '증상으로 찾기, 질환 설명, 치료 여정, 비용 기준, 용어집. 진료실에서 자주 받는 질문을 검색해서 들어오신 분이 바로 읽을 수 있게 정리했습니다.',
  alternates: { canonical: '/insight' },
};

const SECTIONS = [
  { href: '/insight/symptom', label: '증상으로 찾기', n: SYMPTOMS.length, note: '지금 느끼는 증상에서 시작합니다. 원인과 지금 할 수 있는 것, 바로 와야 하는 신호까지.' },
  { href: '/insight/condition', label: '질환 알아보기', n: CONDITIONS.length, note: '충치·치주염처럼 진단명을 들었을 때 그게 무엇이고 어떻게 진행하는지.' },
  { href: '/treatment', label: '치료 알아보기', n: TREATMENTS.length, note: '어떤 치료인지, 누구에게 하는지, 무엇을 주의해야 하는지.' },
  { href: '/insight/journey', label: '치료 여정', n: JOURNEYS.length, note: '첫 내원부터 마무리까지 몇 번 오고 무엇을 하는지 단계로 봅니다.' },
  { href: '/insight/cost', label: '비용 기준', n: COST_TOPICS.length, note: '보험이 되는 것과 안 되는 것, 무엇이 비용을 좌우하는지.' },
  { href: '/insight/glossary', label: '용어집', n: GLOSSARY.length, note: '진료실에서 들은 말을 다시 찾아볼 수 있게.' },
];

export default function InsightHub() {
  return (
    <>
      <main>
        <IndexHero
          eyebrow="Insight"
          lines={['치과에 오기 전에', '알아두면 좋은 것']}
          lede="진료실에서 자주 받는 질문을 미리 정리했습니다. 검색하다 들어오셨다면 여기서 시작하세요."
          crumbs={[{ label: '홈', href: '/' }, { label: '미리 알아두기', href: '/insight' }]}
        />
        <section className="bg-paper py-20 md:py-28">
          <div className="shell">
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SECTIONS.map((s, i) => (
                <Reveal as="li" key={s.href} delay={i * 70}>
                  <Link href={s.href} className="group flex h-full flex-col rounded-[26px] bg-surface p-9 transition-transform duration-500 hover:-translate-y-1.5">
                    <span className="display text-[30px] leading-none text-brand/30">{String(s.n).padStart(2, '0')}</span>
                    <h2 className="mt-6 text-[20px] font-bold tracking-[-0.03em] text-ink transition-colors group-hover:text-brand">{s.label}</h2>
                    <p className="t-body mt-3.5 flex-1 text-[13.5px]">{s.note}</p>
                    <span className="mt-7 text-[12.5px] font-bold text-brand">{s.n}건 보기 →</span>
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
