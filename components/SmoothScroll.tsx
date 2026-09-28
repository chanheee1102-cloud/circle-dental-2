'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * 관성 스크롤 — 더뉴치과가 GSAP ScrollSmoother(smooth: 1)로 주는 '미끄러지듯 멈추는' 스크롤 (2026-09-28 오너).
 *
 * ★ 더뉴와 같은 조건에서만 켠다: 넓은 화면(768px 초과) · 마우스가 있는 기기 · 움직임 줄이기 설정이 아닐 때.
 *   터치 화면은 운영체제의 관성이 이미 있어서 덧씌우면 오히려 끈적해진다.
 * ★ 네이티브 스크롤 위에서 움직인다(Lenis) — position: sticky 헤더·IntersectionObserver 리빌·앵커가 그대로 돈다.
 * ⚠️ 켜져 있는 동안 html 의 scroll-behavior: smooth 는 끈다(globals.css .lenis 규칙) — 둘이 겹치면 앵커 이동이 두 번 미끄러진다.
 * ⚠️ 안쪽에 따로 스크롤되는 상자(메가메뉴·모바일 메뉴·팝업)는 data-lenis-prevent 를 달면 그 안에서는 손대지 않는다.
 * 되돌리려면 app/layout.tsx 의 <SmoothScroll /> 한 줄을 지우면 된다.
 */
export function SmoothScroll() {
  useEffect(() => {
    const ok =
      window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ok) return;
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      /* 앵커는 CSS 의 scroll-padding-top·scroll-margin-top 을 Lenis 가 직접 읽는다 — offset 을 또 주면 두 번 빠진다(실측 81px 어긋남) */
      anchors: true,
      autoRaf: true,
      prevent: (node) => node.closest?.('[role="dialog"], [data-lenis-prevent]') != null,
    });
    return () => lenis.destroy();
  }, []);
  return null;
}
