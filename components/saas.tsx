import type { ReactNode } from 'react';
import { Sentences } from '@/components/ui';

/**
 * 랜딩 페이지 조각들.
 *
 * ★★ 왜 새 언어가 필요했나 (2026-08-26, 오너 지시 3회) ★★
 *   ① 처음엔 국내 병원 문법을 썼다 — 전면 사진 히어로 + 어두운 오버레이 + 가운데 정렬 +
 *      자간 넓힌 영문 캡스 눈썹 + 화면을 가로지르는 어두운 밴드. 경쟁 병원과 구분이 안 됐다.
 *   ② 다음엔 밝은 카드 레이아웃으로 갈아탔다. 겹치지는 않게 됐는데 이번엔 **밋밋했다** —
 *      "AI 티 난다". 원인은 배치가 아니라 **타이포 스케일과 층이 약해서**였다.
 *      제목이 32px 이고 카드 그림자가 옅으니 화면 전체가 한 겹으로 눌려 보였다.
 *
 * ★ 지금 규칙 — 이 셋이 '전문적으로 보이는가' 를 가른다.
 *     ① **크기 대비를 크게 준다.** 제목은 최대 64px, 자간 -0.035em. 본문 16px 와의 격차가
 *        곧 위계다. 어중간한 32px 제목이 템플릿처럼 보이게 만든다.
 *     ② **층을 만든다.** 카드가 배경 위에 뜨고, 그 위에 또 뜬다. 그림자 두 단(soft/lift)을
 *        섞고 안쪽 하이라이트 링을 얹는다.
 *     ③ **구간마다 번호를 붙인다.** 01 —— 시술 방법. 문서가 아니라 설계된 화면으로 읽힌다.
 *
 * ⚠️ 되돌리지 말 것: 전면 사진 히어로, 화면을 가로지르는 어두운 밴드, 자간 넓힌 영문 캡스 눈썹.
 *    셋 다 경쟁 병원과 같아지는 지점이다.
 */

/**
 * 구간 번호 + 라벨.
 * ⚠️ 가운데 가로선을 되살리지 말 것 — 그 형태를 없애려고 알약으로 바꿨다(2026-08-31 오너).
 */
export function SectionIndex({ n, label }: { n: string; label: string }) {
  return (
    <p className="eyebrow-chip text-ink-soft">
      <span className="eyebrow-n">{n}</span>
      {label}
    </p>
  );
}

/**
 * 섹션 머리.
 * ★ 제목 크기를 clamp 로 잡아 화면이 넓어질수록 커진다 — 고정 px 는 큰 화면에서 초라해진다.
 */
export function SectionHead({
  n,
  label,
  title,
  desc,
  id,
  tone = 'light',
}: {
  n: string;
  label: string;
  title: ReactNode;
  desc?: string;
  id?: string;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  return (
    /* ★ 섹션 머리는 예외 없이 등장 연출을 받는다 — 호출부에서 매번 붙이면 반드시 빠뜨린다. */
    <div id={id} className={`reveal${id ? ' scroll-mt-36' : ''}`}>
      {/*
        ⚠️ '번호 + 가로선 + 라벨' 로 되돌리지 말 것 (2026-08-31 오너: "이고운이랑 똑같아서").
           그 형태는 흔한 관용구라 레퍼런스와 구별되지 않았다. 재질은 globals.css 의
           .eyebrow-chip 한 곳에 있고, 사이트의 모든 구획 눈금이 그것 하나를 쓴다.
        ⚠️ 어두운 면에서 clay-400 은 4.26:1 로 미달이었다(실측). clay-300 이 6.1:1 이다.
      */}
      <p className={`eyebrow-chip ${dark ? 'text-brand-200' : 'text-ink-soft'}`}>
        <span className="eyebrow-n" style={{ color: dark ? 'var(--color-clay-300)' : undefined }}>
          {n}
        </span>
        {label}
      </p>
      <h2
        className={`display-sm mt-6 max-w-[26em] text-[clamp(26px,3.4vw,42px)] leading-[1.24] tracking-[-0.03em] ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {desc ? (
        <p
          className={`mt-5 max-w-[56ch] text-[17px] leading-[1.9] ${dark ? 'text-brand-200' : 'text-ink-soft'}`}
        >
          <Sentences text={desc} tone={dark ? 'dark' : 'light'} />
        </p>
      ) : null}
    </div>
  );
}

/**
 * 카드 — 이 페이지의 기본 단위.
 * ★ 안쪽 하이라이트 선이 있어야 카드가 배경에서 뜬다. 테두리만으로는 층이 안 생긴다.
 * ⚠️ 그 선은 globals.css 의 .card-edge 로 그린다 — ring-inset 으로 되돌리지 말 것.
 *   ring 은 그림자라 자식 밑에 깔려서, 사진이 카드 폭을 꽉 채우는 카드에서만
 *   선이 사라져 보였다(2026-09-01 오너 지적).
 */
export function Card({
  children,
  className = '',
  as: Tag = 'div',
  lift = false,
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
  lift?: boolean;
}) {
  return (
    <Tag
      className={`rounded-[22px] border border-brand-200/80 bg-parchment card-edge ${
        lift ? 'shadow-[var(--shadow-lift)]' : 'shadow-[var(--shadow-soft)]'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

/** 어두운 면 위의 유리 카드. */
export function GlassCard({ children, className = '', as: Tag = 'div' }: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li';
}) {
  return (
    <Tag
      className={`rounded-[22px] border border-brand-200/70 bg-parchment card-edge card-edge-soft ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * 강조 패널 — 화면을 가로지르지 않고 모서리가 둥근 채로 안에 들어온다.
 *
 * ★★ 2026-09-02 에 어두운 패널에서 밝은 패널로 뒤집었다 (오너: "그냥 검은 느낌 아예
 *    없애") ★★ 이름도 DarkPanel → HighlightPanel 로 바꿨다 — 이름이 색을 말하면
 *    색이 바뀔 때마다 이름이 거짓말이 된다.
 * ★ 방사형 글로우는 남긴다. 큰 단색 면은 글로우가 있어야 '네모' 가 아니라 면으로 읽힌다.
 *   다만 밝은 면에서는 색을 아주 옅게 깐다(0.28 → 0.10).
 * ⚠️ 미세 노이즈는 뺐다 — 어두운 면의 밴딩을 지우려던 것이라 밝은 면에서는 할 일이 없고,
 *    mix-blend-overlay 가 밝은 바탕에서는 얼룩으로 보인다.
 * ⚠️ 이 안의 글자는 ink 계열이어야 한다. white 로 되돌리면 1.0:1 로 사라진다(실측).
 */
export function HighlightPanel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative isolate overflow-hidden rounded-[28px] border border-brand-200/70 bg-parchment ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_85%_8%,rgba(201,116,78,0.10)_0%,transparent_58%),radial-gradient(60%_50%_at_10%_100%,rgba(217,144,108,0.07)_0%,transparent_60%)]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/** 번호 칩 — 작게. 큰 세리프 숫자는 경쟁사 문법이라 쓰지 않는다. */
export function NumChip({ n, tone = 'light' }: { n: number | string; tone?: 'light' | 'dark' }) {
  return (
    <span
      className={`inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-[13.5px] font-black tabular-nums ${
        tone === 'dark' ? 'bg-white/12 text-clay-300' : 'bg-ink text-white'
      }`}
    >
      {n}
    </span>
  );
}
