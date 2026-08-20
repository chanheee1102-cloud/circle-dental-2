'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/* ══════════════════════════════════════════════════════════════════════
   스크롤 관성 (봄온 재감사 2026-08-20)

   ★★ 봄온이 "봄온처럼" 느껴지는 가장 큰 이유는 개별 애니메이션이 아니라
      **페이지 전체가 관성으로 따라온다**는 것이다. ★★
      실측: main.js 첫 줄에서 ScrollSmoother.create({ smooth: 1.5, effects: true }).
      휠을 굴리면 스크롤바는 즉시 움직이지만 화면은 약 1.5초에 걸쳐 쫓아온다.
      이게 없으면 아래 개별 모션을 아무리 붙여도 "딱딱하다"는 인상이 남는다.

   구현 — 라이브러리 0:
      · 본문을 position:fixed 로 띄우고 translate3d 로 밀어 올린다
      · body 에 실제 높이를 줘서 네이티브 스크롤바를 그대로 쓴다
      · 매 프레임 지수감쇠로 목표값을 쫓는다 (tau ≈ 230ms → 1.5s 안착)

   ⚠️⚠️ 스크롤 가로채기는 공짜가 아니다 ⚠️⚠️
     · prefers-reduced-motion → 끈다. 관성 스크롤은 멀미를 유발하는 대표 패턴이다.
     · 터치 기기(pointer:coarse) → 끈다. 모바일 브라우저의 네이티브 관성이 더 낫고,
       주소창 접힘/고무줄 효과와 싸우면 반드시 진다.
     · 키보드 포커스가 화면 밖으로 나가면 직접 끌어온다 — 안 하면 Tab 이동 시
       "보이지 않는 곳에 포커스가 있는" 접근성 사고가 난다.
     · 해시 링크(#visit)는 가로채서 절대 좌표로 보낸다. 네이티브 앵커는 translate 된
       위치를 기준으로 계산해서 엉뚱한 데로 간다.

   ⚠️ position:fixed 자식은 뷰포트가 아니라 이 컨테이너 기준이 된다.
      그래서 헤더·퀵메뉴·프리로더는 반드시 <Smooth> **바깥**에 있어야 한다
      (app/layout.tsx 참고).
   ⚠️ position:sticky 는 이 안에서 죽는다 — 스크롤하는 조상이 없기 때문.
      대신 Motion.tsx 의 JS 핀(usePin)이 같은 일을 한다.
   ══════════════════════════════════════════════════════════════════════ */

/** 봄온 실측값. 1.5초에 걸쳐 따라붙는다. */
const SMOOTH_SEC = 1.5;

type Tick = (y: number) => void;
const ticks = new Set<Tick>();

/** 매 프레임 호출되는 구독. 관성이 꺼져 있으면 scroll 이벤트로 대신 흐른다. */
export function onTick(cb: Tick): () => void {
  ticks.add(cb);
  return () => ticks.delete(cb);
}

/**
 * 관성이 켜져 있는지 — CSS sticky 를 쓸지 JS 핀을 쓸지 가르는 판정.
 *
 * ⚠️⚠️ 이건 '상태'가 아니라 '판정식'이어야 한다 ⚠️⚠️
 *   React 는 자식의 useEffect 를 부모보다 **먼저** 실행한다. 처음에는 Smooth 가
 *   전역 플래그를 세우고 Pin·StickyMedia·HorizontalScroll 이 그걸 읽게 했는데,
 *   자식이 먼저 읽으니 언제나 false 였다. 그 결과 JS 핀은 안 걸리고, CSS sticky 는
 *   나중에 붙은 .is-smooth 클래스에 의해 해제돼서 **아무것도 고정되지 않았다.**
 *   조건을 양쪽이 각자 계산하면 실행 순서와 무관해진다.
 */
export function isSmooth(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !window.matchMedia('(pointer: coarse)').matches
  );
}

/** 관성을 고려한 절대 좌표 이동. 해시 링크·'맨 위로' 가 이걸 써야 한다. */
export function scrollToY(y: number, smooth = true) {
  window.scrollTo({ top: Math.max(0, y), behavior: smooth ? 'smooth' : 'auto' });
}

export default function Smooth({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = content.current;
    if (!el) return;

    /* ── 관성을 끄는 경우: 네이티브 스크롤 그대로. 구독자에게 값만 흘려준다. ── */
    if (!isSmooth()) {
      document.documentElement.classList.add('no-smooth');
      let raf = 0;
      const pump = () => {
        const y = window.scrollY;
        ticks.forEach((t) => t(y));
        raf = requestAnimationFrame(pump);
      };
      raf = requestAnimationFrame(pump);
      return () => cancelAnimationFrame(raf);
    }

    /* ── 관성 ON ── */
    document.documentElement.classList.add('is-smooth');

    let target = window.scrollY;
    let cur = target;
    let last = performance.now();
    let raf = 0;

    /* body 높이 = 본문 실제 높이. 이게 스크롤바의 근거가 된다. */
    const resize = () => {
      document.body.style.height = `${el.scrollHeight}px`;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const loop = (now: number) => {
      const dt = Math.min(64, now - last); // 탭 복귀 시 한 번에 튀지 않게 상한
      last = now;
      target = window.scrollY;

      /* 지수감쇠 — 프레임레이트가 달라도 같은 시간에 안착한다. */
      const k = 1 - Math.exp(-dt / ((SMOOTH_SEC * 1000) / 6.5));
      cur += (target - cur) * k;
      if (Math.abs(target - cur) < 0.06) cur = target; // 미세 진동에서 탈출

      el.style.transform = `translate3d(0, ${-cur}px, 0)`;
      ticks.forEach((t) => t(cur));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    /* 키보드 포커스가 화면 밖으로 나가면 끌어온다 (접근성). */
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.getBoundingClientRect) return;
      const r = t.getBoundingClientRect();
      if (r.top > 90 && r.bottom < window.innerHeight - 40) return;
      scrollToY(r.top + cur - window.innerHeight / 3, false);
    };
    document.addEventListener('focusin', onFocus);

    /* 해시 링크 — 네이티브 앵커는 translate 된 좌표를 보고 엉뚱한 데로 간다. */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const dest = document.querySelector(url.hash);
      if (!dest) return;
      e.preventDefault();
      scrollToY(dest.getBoundingClientRect().top + cur - 88);
      history.replaceState(null, '', url.hash);
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('focusin', onFocus);
      document.removeEventListener('click', onClick);
      document.body.style.height = '';
      document.documentElement.classList.remove('is-smooth');
    };
  }, []);

  return (
    <div className="smooth-wrapper">
      <div ref={content} className="smooth-content">
        {children}
      </div>
    </div>
  );
}
