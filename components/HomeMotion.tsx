'use client';

import { useEffect, useRef } from 'react';

/**
 * 홈 스크롤 연동 모션 — 한 파일, 스크롤 리스너 하나, rAF 하나 (2026-09-29 오너: "모션그래픽 엄청 넣어줘").
 *
 * ★ 하는 일은 **CSS 변수에 숫자를 쓰는 것뿐**이다. 어떻게 움직일지는 전부 app/motion.css 가 정한다.
 *     [data-hero]   --hp  첫 화면을 얼마나 지나왔나(0~1) → 사진은 느리게 커지고, 글은 위로 빠지며 옅어진다
 *     [data-par]    --py  시차(px). 값 = 틀보다 더 큰 비율(0.1 = 위아래 10%씩 여유). 틀(부모)이 화면을 지나는 만큼 반대로 민다
 *     [data-scrub]  --p   요소가 화면 아래에서 들어와 위로 나갈 때까지 0→1 (가로로 흐르는 큰 글자, 도는 원)
 *     진행선        --sp  문서 전체를 얼마나 읽었나(0~1)
 *   커서 동그라미·자석 단추는 마우스가 있는 넓은 화면에서만.
 * ★ 스크롤 효과의 '등장'(is-shown)은 여기서 하지 않는다 — RevealScript 가 맡는다(관찰자 한 곳 원칙).
 * ⚠️ prefers-reduced-motion 이면 아무것도 하지 않는다 → CSS 기본값(변수 0)이 곧 멈춘 화면이다.
 * ⚠️ 관성 스크롤(Lenis)은 네이티브 스크롤을 움직이므로 window 의 scroll 이벤트가 그대로 온다.
 * 되돌리려면 app/page.tsx 의 <HomeMotion /> 한 줄을 지우면 된다(변수가 0 이면 모든 요소가 제자리).
 */
export function HomeMotion() {
  const bar = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    let pars: HTMLElement[] = [];
    let scrubs: HTMLElement[] = [];
    const collect = () => {
      pars = [...document.querySelectorAll<HTMLElement>('[data-par]')];
      scrubs = [...document.querySelectorAll<HTMLElement>('[data-scrub]')];
    };
    collect();

    let raf = 0;
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      if (hero) {
        const h = hero.offsetHeight || 1;
        hero.style.setProperty('--hp', Math.min(1, Math.max(0, y / h)).toFixed(4));
      }
      for (const el of pars) {
        const box = (el.parentElement ?? el).getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) continue;
        const p = (vh - box.top) / (vh + box.height); // 0 = 화면 아래에서 막 들어옴, 1 = 위로 막 나감
        const room = box.height * (Number(el.dataset.par) || 0.1);
        el.style.setProperty('--py', `${((0.5 - Math.min(1, Math.max(0, p))) * 2 * room).toFixed(1)}px`);
      }
      for (const el of scrubs) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const p = (vh - r.top) / (vh + r.height);
        el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
      }
      const max = root.scrollHeight - vh;
      bar.current?.style.setProperty('--sp', max > 0 ? (y / max).toFixed(4) : '0');
    };
    const ask = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      collect();
      ask();
    };
    frame();
    window.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', onResize);

    /* ── 커서 동그라미 · 자석 단추 — 마우스가 있는 넓은 화면만 ── */
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches;
    let cur = 0;
    const off: Array<() => void> = [];
    if (fine && ring.current) {
      const el = ring.current;
      root.classList.add('has-ring');
      let tx = -100, ty = -100, x = -100, y2 = -100;
      const loop = () => {
        x += (tx - x) * 0.2;
        y2 += (ty - y2) * 0.2;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y2.toFixed(1)}px, 0)`;
        cur = requestAnimationFrame(loop);
      };
      cur = requestAnimationFrame(loop);
      const move = (e: PointerEvent) => {
        tx = e.clientX;
        ty = e.clientY;
        el.classList.add('is-on');
        const t = e.target as Element | null;
        el.classList.toggle('is-link', !!t?.closest?.('a, button, [role="button"], summary'));
        el.classList.toggle('is-media', !!t?.closest?.('.cl-card, .sp-card, .dp-card, .tour-shot'));
      };
      const leave = () => el.classList.remove('is-on');
      const down = () => el.classList.add('is-down');
      const up = () => el.classList.remove('is-down');
      document.addEventListener('pointermove', move, { passive: true });
      document.documentElement.addEventListener('pointerleave', leave);
      document.addEventListener('pointerdown', down);
      document.addEventListener('pointerup', up);
      off.push(() => {
        document.removeEventListener('pointermove', move);
        document.documentElement.removeEventListener('pointerleave', leave);
        document.removeEventListener('pointerdown', down);
        document.removeEventListener('pointerup', up);
        root.classList.remove('has-ring');
      });

      /* 자석 — 단추가 커서 쪽으로 살짝 끌려온다(최대 단추 폭의 12%). 벗어나면 제자리로. */
      document.querySelectorAll<HTMLElement>('[data-magnet] a, a[data-magnet]').forEach((m) => {
        const mm = (e: PointerEvent) => {
          const r = m.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          m.style.transform = `translate3d(${(dx * 0.18).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px, 0)`;
        };
        const ml = () => {
          m.style.transform = '';
        };
        m.classList.add('mag');
        m.addEventListener('pointermove', mm);
        m.addEventListener('pointerleave', ml);
        off.push(() => {
          m.removeEventListener('pointermove', mm);
          m.removeEventListener('pointerleave', ml);
          m.style.transform = '';
        });
      });
    }

    return () => {
      window.removeEventListener('scroll', ask);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
      if (cur) cancelAnimationFrame(cur);
      off.forEach((f) => f());
    };
  }, []);

  return (
    <>
      <div ref={bar} className="mo-progress" aria-hidden />
      <div ref={ring} className="mo-ring" aria-hidden />
    </>
  );
}
