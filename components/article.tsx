import Link from 'next/link';
import { Reveal, LineReveal, BlurText, LetterMarquee } from './Motion';
import { CLINIC } from '@/lib/clinic';

/**
 * 인사이트 문서 공통 조각.
 *
 * ★★ 이 페이지들이 AEO 의 본체다 ★★
 *   랜딩 한 장으로는 "밤에 이가 욱신거려요" 같은 질문에 인용될 수 없다.
 *   답변형 AI 는 **질문 모양의 제목 + 바로 뒤에 오는 직답**을 찾는다.
 *   그래서 모든 문서가 같은 골격을 쓴다:
 *     제목(질문) → 직답 한 문단 → 근거·상세 → 위험 신호 → 다음 행동
 *
 * ⚠️ 이 골격을 바꾸면 AEO 가 조용히 무너진다. 화면이 예뻐 보여도 점수는 떨어진다.
 *    디자인은 여백·타이포로만 손댄다.
 *
 * ══ 홈 디자인에 맞춤 (2026-08-20 운영자: "모든 페이지 메인 디자인에 맞춰서") ══
 *   ★ 홈은 **어두운 화면으로 시작**한다(영상 히어로). 서브가 밝은 화면으로 시작하면
 *     같은 사이트로 안 읽힌다. 그래서 목록 머리(IndexHero)도 짙은 ink 로 통일했다.
 *   ★ 카드는 홈과 같은 관계로 — **밝은 바탕(paper) 위에 한 톤 짙은 카드(surface)**.
 *     서브는 반대로(surface 바탕 + 흰 카드) 되어 있어 명암 리듬이 뒤집혀 있었다.
 *   ★ 모서리 반경이 18·20·22px 로 제각각이었다. 홈의 26/22 두 값으로 줄였다.
 *   ★ 큰 세리프 숫자(.display)와 마퀴 밴드 — 홈에서 가장 눈에 띄는 두 장치인데
 *     서브에는 하나도 없었다.
 */

/* 카드 규격 — 여기 한 곳에서만 정한다. 페이지마다 적으면 반드시 어긋난다. */
export const CARD = 'rounded-[22px] bg-surface';
export const CARD_LG = 'rounded-[26px] bg-surface';

export function DocHero({
  eyebrow,
  title,
  answer,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  answer?: string;
  crumbs: { label: string; href: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-ink pb-20 pt-[124px] text-white md:pb-28 md:pt-[150px]">
      <div className="shell">
        <Reveal>
          <nav aria-label="현재 위치" className="mb-9 flex flex-wrap items-center gap-2 text-[12px] text-white/50">
            {crumbs.map((c, i) => (
              <span key={c.href} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                <Link href={c.href} className="transition-colors hover:text-white">{c.label}</Link>
              </span>
            ))}
          </nav>
          {/* 영문 라벨은 세리프로 — 홈 히어로의 결과 같은 자리를 만든다. */}
          <p className="display text-[13px] uppercase tracking-[0.3em] text-brand-2">{eyebrow}</p>
        </Reveal>

        {/* h1 은 질문 그대로 — 검색어와 같은 모양이어야 인용된다. */}
        <h1 className="t-h2 mt-5 max-w-4xl text-white">{title}</h1>

        {/* ★ 직답 — h1 바로 다음 문단. 여기가 인용되는 자리다. */}
        {answer ? (
          <Reveal delay={140}>
            <p className="mt-8 max-w-3xl border-l-2 border-brand-2 pl-6 text-[16.5px] leading-[1.92] text-white/85 md:text-[18px]">
              {answer}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

export function DocSection({
  title,
  children,
  tone = 'paper',
}: {
  title?: string;
  children: React.ReactNode;
  tone?: 'paper' | 'surface';
}) {
  return (
    <section className={`${tone === 'surface' ? 'bg-surface' : 'bg-paper'} py-16 md:py-24`}>
      <div className="shell max-w-4xl">
        {title ? (
          <Reveal>
            <h2 className="t-h3 mb-9 text-[20px] font-bold tracking-[-0.03em] text-ink md:text-[25px]">{title}</h2>
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}

/** 원인·단계처럼 '이름 + 설명' 이 반복되는 목록. */
export function NamedList({ items }: { items: { name: string; detail: string }[] }) {
  return (
    <ul className="space-y-px overflow-hidden rounded-[22px] bg-line">
      {items.map((it, i) => (
        <Reveal as="li" key={it.name} delay={i * 60}>
          <div className="bg-surface p-7 md:p-8">
            <p className="text-[16px] font-bold tracking-[-0.025em] text-ink">{it.name}</p>
            <p className="t-body mt-2.5 text-[14.5px]">{it.detail}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

export function BulletList({ items, tone = 'plain' }: { items: readonly string[]; tone?: 'plain' | 'urgent' }) {
  const urgent = tone === 'urgent';
  return (
    <ul className={`space-y-3 ${urgent ? 'rounded-[22px] bg-[#fdf3f1] p-8' : ''}`}>
      {items.map((s, i) => (
        <Reveal as="li" key={s} delay={i * 50}>
          <span className="flex gap-3.5 text-[15px] leading-[1.85] text-ink-2">
            <span className={`mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full ${urgent ? 'bg-[#b03e28]' : 'bg-brand'}`} />
            {s}
          </span>
        </Reveal>
      ))}
    </ul>
  );
}

/**
 * 위험 신호 — 지금 바로 와야 하는 상황.
 * ⚠️ 이 블록은 진료 안내보다 위에 둔다. 응급 상황에서 스크롤을 더 시키면 안 된다.
 */
export function RedFlags({ items }: { items: readonly string[] }) {
  if (!items?.length) return null;
  return (
    <div className="rounded-[26px] border border-[#e8c9c1] bg-[#fdf3f1] p-8 md:p-10">
      <p className="text-[13px] font-bold tracking-[0.1em] text-[#b03e28]">이럴 때는 바로 오세요</p>
      <ul className="mt-6 space-y-3">
        {items.map((s) => (
          <li key={s} className="flex gap-3.5 text-[15px] leading-[1.85] text-ink">
            <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#b03e28]" />
            {s}
          </li>
        ))}
      </ul>
      <a
        href={CLINIC.phoneHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#b03e28] px-6 py-3 text-[14px] font-bold text-white"
      >
        {CLINIC.phone}
      </a>
    </div>
  );
}

export function QaList({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f, i) => (
        <Reveal key={f.q} delay={i * 50}>
          <details className="group py-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
              <span className="text-[15.5px] font-bold leading-snug tracking-[-0.024em] text-ink">{f.q}</span>
              <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-ink-2 transition-transform duration-400 group-open:rotate-45">
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" aria-hidden="true">
                  <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <p className="t-body mt-4 pr-10 text-[14.5px]">{f.a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}

/** 문서 끝 — 다음에 읽을 것. AI 가 아니라 사람이 길을 잃지 않게 하는 자리다. */
export function NextLinks({ items }: { items: { label: string; href: string; note?: string }[] }) {
  if (!items.length) return null;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((l, i) => (
        <Reveal as="li" key={l.href} delay={i * 70}>
          <Link
            href={l.href}
            className={`group block h-full ${CARD} p-7 transition-transform duration-500 hover:-translate-y-1`}
          >
            <span className="text-[15.5px] font-bold tracking-[-0.025em] text-ink transition-colors group-hover:text-brand">
              {l.label}
            </span>
            {l.note ? <span className="mt-2 block text-[13.5px] leading-relaxed text-ink-2">{l.note}</span> : null}
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

/**
 * 목록 페이지 머리 — 인사이트 허브·증상 목록 등에서 공용.
 *
 * ★★ 홈처럼 **어두운 화면으로 시작한다** ★★
 *   홈은 영상 히어로라 첫 화면이 짙다. 서브만 흰 화면으로 시작하면
 *   같은 사이트로 안 읽힌다. 문서 머리(DocHero)는 이미 짙었는데
 *   목록 머리만 밝아서 둘 사이도 어긋나 있었다.
 * ★ 아래에 마퀴 밴드를 깐다 — 홈에서 섹션을 가르는 장치를 그대로 쓴다.
 */
export function IndexHero({
  eyebrow,
  lines,
  lede,
  crumbs,
  count,
}: {
  eyebrow: string;
  lines: [string, string];
  lede: string;
  crumbs: { label: string; href: string }[];
  /** 목록 개수 — 큰 세리프 숫자로 얹는다. 없으면 생략. */
  count?: number;
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-ink pb-20 pt-[124px] text-white md:pb-24 md:pt-[150px]">
        <div className="shell">
          <Reveal>
            <nav aria-label="현재 위치" className="mb-9 flex flex-wrap items-center gap-2 text-[12px] text-white/50">
              {crumbs.map((c, i) => (
                <span key={c.href} className="flex items-center gap-2">
                  {i > 0 ? <span aria-hidden="true">/</span> : null}
                  <Link href={c.href} className="transition-colors hover:text-white">{c.label}</Link>
                </span>
              ))}
            </nav>
            <p className="display text-[13px] uppercase tracking-[0.3em] text-brand-2">{eyebrow}</p>
          </Reveal>
          <h1 className="t-h2 mt-5 text-white">
            {/* ⚠️ 화면은 두 줄이지만 크롤러·읽어주기에는 한 문장으로 이어져야 한다.
                공백을 안 넣으면 textContent 가 "…전에먼저…" 로 붙는다(실측). */}
            <BlurText text={lines[0]} />
            <span className="sr-only"> </span>
            <br />
            <span className="text-brand-2"><BlurText text={lines[1]} step={45} /></span>
          </h1>
          <Reveal delay={240}>
            <p className="mt-8 max-w-2xl text-[15.5px] leading-[1.92] text-white/70">{lede}</p>
          </Reveal>

          {/*
            개수를 큰 세리프로 얹는다 — 홈의 진료 카드 번호(01·02)와 같은 장치다.
            ⚠️ 장식이 아니라 값이라 화면 낭독기에도 읽히게 둔다(aria-hidden 을 안 건다).
          */}
          {count ? (
            <Reveal delay={320}>
              <p className="mt-12 flex items-baseline gap-3">
                {/* ⚠️ /50 은 ink 위에서 2.14:1 로 떨어진다(54px 은 큰 글자라 3:1 기준). /70 = 3.19:1. */}
                <span className="display text-[54px] leading-none text-brand-2/70">{count}</span>
                <span className="text-[13px] tracking-[0.02em] text-white/70">개의 문서</span>
              </p>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/*
        마퀴 밴드 — 홈에서 섹션을 가르는 장치. 어두운 머리와 밝은 본문 사이의 이음매다.
        ⚠️ 히어로 크기(13.9vw ≈ 260px)로 쓰면 구분선 하나가 화면의 1/4을 먹는다.
           머리 바로 아래라 본문이 화면 밖으로 밀린다 — band 크기로 쓴다.
        ⚠️ 영문을 쓴다. 한글은 이 크기에서 획이 뭉쳐 무늬가 아니라 글씨로 읽혀
           본문보다 먼저 눈에 들어온다(구분선이 주인공이 되면 안 된다).
      */}
      <div className="overflow-hidden border-b border-line bg-surface py-4">
        <LetterMarquee text={`${CLINIC.nameEn} ·`} seconds={40} size="band" colorClass="text-ink/[0.12]" />
      </div>
    </>
  );
}

/**
 * 목록 카드 — 증상·질환·여정·인사이트 허브가 모두 이걸 쓴다.
 *
 * ★ 홈의 진료 카드와 같은 규격: 26px 반경, surface 바탕, 큰 세리프 번호,
 *   hover 시 1px 떠오름. 전에는 페이지마다 18/20/22px 에 흰 카드였다.
 */
export function DocCard({
  href,
  no,
  eyebrow,
  title,
  body,
}: {
  href: string;
  no?: number;
  eyebrow?: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex h-full flex-col ${CARD_LG} p-8 transition-transform duration-500 hover:-translate-y-1.5 md:p-9`}
    >
      {no != null ? (
        <span className="display text-[26px] leading-none text-brand/30">
          {String(no).padStart(2, '0')}
        </span>
      ) : null}
      {eyebrow ? (
        <span className="mt-4 text-[11.5px] tracking-[0.14em] text-ink-2">{eyebrow}</span>
      ) : null}
      <h3 className="mt-2.5 text-[17px] font-bold leading-[1.5] tracking-[-0.03em] text-ink transition-colors group-hover:text-brand">
        {title}
      </h3>
      <p className="mt-4 line-clamp-4 flex-1 text-[13.5px] leading-[1.85] text-ink-2">{body}</p>
      <span
        aria-hidden
        className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-brand transition-transform duration-500 group-hover:translate-x-1"
      >
        자세히 <span>→</span>
      </span>
    </Link>
  );
}

export { LineReveal };
