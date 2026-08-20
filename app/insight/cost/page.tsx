import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { IndexHero, DocSection, BulletList } from '@/components/article';
import { Reveal } from '@/components/Motion';
import { COST_TOPICS, COST_LABEL } from '@/lib/insight';
import { CLINIC } from '@/lib/clinic';
import { SITE_URL, CLINIC_ID } from '@/lib/schema';

export const metadata: Metadata = {
  title: `비용 기준 — ${CLINIC.shortName}`,
  description:
    '보험이 되는 것과 안 되는 것, 무엇이 비용을 좌우하는지. 금액 대신 기준을 적었습니다.',
  alternates: { canonical: '/insight/cost' },
};

const TONE: Record<string, string> = {
  insurance: 'bg-brand text-white',
  partial: 'bg-brand-soft text-brand',
  private: 'bg-line text-ink-2',
};

export default function CostPage() {
  return (
    <>
      <main>
        <IndexHero
          eyebrow="Cost"
          lines={['비용은 무엇으로', '정해지나요?']}
          lede="같은 치료라도 사람마다 견적이 다른 이유가 있습니다. 보험이 되는 조건과 비용을 가르는 요인을 정리했습니다."
          crumbs={[{ label: '홈', href: '/' }, { label: '미리 알아두기', href: '/insight' }, { label: '비용 기준', href: '/insight/cost' }]}
        />

        {/*
          ⚠️⚠️ 금액을 쓰지 않는다 ⚠️⚠️
            비급여 진료비는 병원이 게시 의무를 지는 별도 항목이고, 여기 적은 숫자와
            실제 청구액이 어긋나면 그 자체로 분쟁이 된다. 게다가 구강 상태에 따라
            달라지는 값이라 '얼마' 는 진단 전에 말할 수 없다.
            그래서 이 페이지는 **무엇이 비용을 가르는가**만 다룬다.
        */}
        <section className="bg-paper py-20 md:py-28">
          <div className="shell max-w-4xl">
            <ul className="space-y-4">
              {COST_TOPICS.map((c, i) => (
                <Reveal as="li" key={c.slug} delay={i * 70}>
                  <article className="rounded-[22px] bg-surface p-8 md:p-10">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <h2 className="max-w-2xl text-[18px] font-bold leading-snug tracking-[-0.03em] text-ink">{c.title}</h2>
                      <span className={`shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold ${TONE[c.covered]}`}>
                        {COST_LABEL[c.covered]}
                      </span>
                    </div>
                    <p className="mt-5 border-l-2 border-brand pl-5 text-[15px] leading-[1.9] text-ink">{c.answer}</p>
                    <p className="t-body mt-5 text-[14px]">{c.detail}</p>
                    {c.factors?.length ? (
                      <div className="mt-7 border-t border-line pt-6">
                        <p className="text-[12.5px] font-bold tracking-[0.1em] text-ink-2">비용을 가르는 것</p>
                        <div className="mt-4">
                          <BulletList items={c.factors} />
                        </div>
                      </div>
                    ) : null}
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <DocSection>
          <Reveal>
            <div className="rounded-[22px] border border-line bg-surface p-8">
              <p className="text-[12.5px] font-bold tracking-[0.1em] text-ink-2">금액 안내</p>
              <p className="mt-3 text-[13.5px] leading-[1.9] text-ink-2">
                이 페이지는 비용의 <b className="text-ink-2">기준</b>만 다룹니다. 실제 금액은 구강 상태와 필요한 처치에
                따라 달라져 진단 전에는 말씀드릴 수 없습니다. 비급여 진료비는 원내에 게시되어 있으며, 상담 시 항목별로
                설명해 드립니다.
              </p>
              <a href={CLINIC.phoneHref} className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-[13.5px] font-bold text-white">
                {CLINIC.phone}
              </a>
            </div>
          </Reveal>
        </DocSection>
      </main>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${SITE_URL}/insight/cost`,
          mainEntity: COST_TOPICS.map((c) => ({
            '@type': 'Question',
            name: c.title,
            acceptedAnswer: { '@type': 'Answer', text: `${c.answer} ${c.detail}` },
          })),
          publisher: { '@id': CLINIC_ID },
        }}
      />
    </>
  );
}
