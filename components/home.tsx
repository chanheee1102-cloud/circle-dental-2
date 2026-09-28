import Link from 'next/link';
import { Sentences } from '@/components/ui';
import type { ReactNode } from 'react';

/*
 * ★★ 홈 전용 조각들 — 디자인 수정 요청서(2026-09-16) 문법 ★★
 *
 *   · 제목은 **한글 세리프 400**(.serif-head). 굵기로 강조하지 않는다.
 *   · 채워진 버튼은 dusk(블루그레이) 하나뿐. 한 화면에 채운 버튼은 하나.
 *   · 카드는 흰 면 + mist 1px 실선. 그림자·유리를 쓰지 않는다.
 *   · 모서리 — 버튼 알약, 카드 6px, 큰 사진 8px.
 *   · 영문 라벨(.kicker)은 **라틴 문자 자리에만**. 한글 라벨은 .eyebrow-chip.
 */

/** 구획 머리말 — 왼쪽 제목, 오른쪽에 '전체 보기' 같은 곁다리 링크를 둘 수 있다. */
export function HomeHead({
  label,
  title,
  desc,
  aside,
  tone = 'light',
  reveal = true,
  asideInline = false,
  className = '',
}: {
  label?: string;
  title: ReactNode;
  desc?: ReactNode;
  aside?: ReactNode;
  tone?: 'light' | 'dark';
  reveal?: boolean;
  /** 곁다리 링크를 좁은 화면에서도 제목 오른쪽 같은 줄에 둔다(목업 "어떤 고민이 있으신가요? · 전체 보기"). */
  asideInline?: boolean;
  className?: string;
}) {
  const dark = tone === 'dark';
  const row = asideInline
    ? 'flex-row items-end justify-between'
    : 'flex-col sm:flex-row sm:items-end sm:justify-between';
  return (
    <div className={`${reveal ? 'reveal' : ''} flex gap-6 ${row} ${className}`}>
      <div className="max-w-[40em]">
        {label ? (
          <p className={`eyebrow-chip ${dark ? 'text-mist/80' : 'text-ash'}`}>{label}</p>
        ) : null}
        <h2
          className={`serif-head mt-4 text-[clamp(28px,4vw,44px)] ${
            dark ? 'text-parchment' : 'text-charcoal'
          }`}
        >
          {title}
        </h2>
        {desc ? (
          <p
            className={`mt-5 max-w-[42em] text-[17px] leading-[1.9] ${
              dark ? 'text-mist/80' : 'text-ash'
            }`}
          >
            {typeof desc === 'string' ? <Sentences text={desc} tone={dark ? 'dark' : 'light'} /> : desc}
          </p>
        ) : null}
      </div>
      {aside ? <div className="shrink-0 sm:pb-1.5">{aside}</div> : null}
    </div>
  );
}

/**
 * 가운데 머리말 — 더뉴치과 메인 문법(영문 한 줄 + 큰 제목 + 한두 줄 설명, 가운데 정렬). 2026-09-28.
 * 의료진·특별함처럼 더뉴에서 옮긴 구획만 쓴다. 영문 줄은 라틴 문자 자리라 .kicker(Marcellus).
 */
export function CenterHead({ en, title, desc }: { en: string; title: ReactNode; desc?: string }) {
  return (
    <div className="c-head reveal">
      <p className="kicker">{en}</p>
      <h2 className="serif-head">{title}</h2>
      {desc ? (
        <p>
          <Sentences text={desc} />
        </p>
      ) : null}
    </div>
  );
}

const ARROW = (
  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
    →
  </span>
);

/** 채워진 버튼 — 이 시스템에서 유일하게 면을 채운다. 밝은 면에서는 dusk, 어두운 면에서는 흰색. */
export function FillBtn({
  href,
  children,
  external,
  tone = 'light',
  label,
  size = 'md',
  className = '',
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  tone?: 'light' | 'dark';
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const dark = tone === 'dark';
  const cls = `group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors ${
    size === 'sm' ? 'px-5 py-2.5 text-[15px]' : 'px-7 py-3.5 text-[16px]'
  } ${
    dark
      ? 'bg-parchment text-charcoal hover:bg-mist'
      : 'bg-dusk text-white hover:bg-brand-800'
  } ${className}`;
  const inner = (
    <>
      {children}
      {ARROW}
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} aria-label={label} className={cls}>
      {inner}
    </Link>
  );
}

/** 테두리 버튼 — 글자와 같은 색의 얇은 테두리. 채운 버튼 옆에서 무게만 다르다. */
export function LineBtn({
  href,
  children,
  external,
  tone = 'light',
  size = 'md',
  className = '',
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md';
  className?: string;
}) {
  const dark = tone === 'dark';
  const cls = `group inline-flex items-center justify-center gap-2 rounded-full border font-medium transition-colors ${
    size === 'sm' ? 'px-5 py-2.5 text-[15px]' : 'px-7 py-3.5 text-[16px]'
  } ${
    dark
      ? 'border-white/45 text-parchment hover:border-white hover:bg-white/10'
      : 'border-charcoal/30 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-white'
  } ${className}`;
  /* tel: / mailto: 는 같은 창에서, 화살표 없이. */
  const isDirect = href.startsWith('tel:') || href.startsWith('mailto:');
  const inner = (
    <>
      {children}
      {!isDirect && ARROW}
    </>
  );
  if (isDirect) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/** 밑줄 링크 — 구획 끝에서 다음 페이지로 넘기는 자리. 목업의 "동그라미의 진료 철학 →". */
export function QuietLink({
  href,
  children,
  tone = 'light',
  external,
  className = '',
}: {
  href: string;
  children: ReactNode;
  tone?: 'light' | 'dark';
  external?: boolean;
  className?: string;
}) {
  const dark = tone === 'dark';
  const cls = `group inline-flex w-fit items-center gap-2 border-b pb-1.5 text-[15.5px] font-medium transition-colors ${
    dark
      ? 'border-white/40 text-parchment hover:border-white'
      : 'border-charcoal/30 text-charcoal hover:border-charcoal'
  } ${className}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
      {ARROW}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
      {ARROW}
    </Link>
  );
}
