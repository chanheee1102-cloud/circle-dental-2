import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { IndexHero, QaList } from '@/components/article';
import { Reveal } from '@/components/Motion';
import { FAQS } from '@/lib/aeo';
import { CLINIC } from '@/lib/clinic';
import { SITE_URL, CLINIC_ID } from '@/lib/schema';
import { faqSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: `자주 묻는 질문 — ${CLINIC.shortName}`,
  description: `진료시간·주차·위치부터 임플란트 부작용까지. ${CLINIC.name}이 전화로 가장 많이 받는 질문 ${FAQS.length}가지에 답했습니다.`,
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  const topics = [...new Set(FAQS.map((f) => f.topic))];

  return (
    <>
      <main>
        <IndexHero
          eyebrow="FAQ"
          lines={['전화로 가장 많이', '받는 질문입니다']}
          lede="개인의 구강 상태에 따라 답이 달라질 수 있어, 정확한 판단은 진단 후에 가능합니다. 여기에 없는 질문은 전화로 물어봐 주세요."
          crumbs={[{ label: '홈', href: '/' }, { label: '자주 묻는 질문', href: '/faq' }]}
        />

        <section className="bg-paper py-20 md:py-28">
          {/* ★ 주제를 왼쪽에 고정해 두면 긴 목록에서 지금 어디를 보는지 잃지 않는다. */}
          <div className="shell grid gap-14 lg:grid-cols-[minmax(0,230px)_minmax(0,1fr)] lg:gap-20">
            <nav aria-label="질문 주제" className="lg:sticky lg:top-28 lg:h-fit">
              <p className="t-eyebrow mb-6 text-ink-2">주제</p>
              <ul className="space-y-2.5">
                {topics.map((t) => (
                  <li key={t}>
                    <a href={`#${encodeURIComponent(t)}`} className="text-[14.5px] font-semibold tracking-[-0.02em] text-ink-2 transition-colors hover:text-brand">
                      {t}
                      <span className="ml-2 text-[12px] text-ink-2">{FAQS.filter((f) => f.topic === t).length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="space-y-14">
              {topics.map((t) => (
                <section key={t} id={encodeURIComponent(t)} className="scroll-mt-28">
                  <Reveal>
                    <h2 className="text-[13px] font-bold tracking-[0.14em] text-brand">{t}</h2>
                  </Reveal>
                  <div className="mt-4">
                    <QaList items={FAQS.filter((f) => f.topic === t)} />
                  </div>
                </section>
              ))}

              <Reveal>
                <div className="rounded-[22px] bg-surface p-9 md:p-11">
                  <h2 className="text-[19px] font-bold tracking-[-0.03em] text-ink">여기에 없는 질문이라면</h2>
                  <p className="t-body mt-4 max-w-xl text-[14.5px]">
                    구강 상태에 따라 답이 달라지는 질문은 진단 후에 정확히 말씀드릴 수 있습니다. 전화나 예약으로 문의해
                    주세요.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href={CLINIC.phoneHref} className="rounded-full bg-brand px-7 py-3.5 text-[14px] font-bold text-white">
                      {CLINIC.phone}
                    </a>
                    <a href={CLINIC.booking.naver} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-7 py-3.5 text-[14px] font-bold text-ink-2">
                      네이버 예약
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <JsonLd
        data={[
          faqSchema(),
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: '자주 묻는 질문', item: `${SITE_URL}/faq` },
            ],
          },
        ]}
      />
    </>
  );
}
