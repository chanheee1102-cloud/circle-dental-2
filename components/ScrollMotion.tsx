'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 스크롤 연동 모션 — 사이트 전체에 하나, 스크롤 리스너 하나, rAF 하나 (2026-09-29).
 *   홈에만 있던 것(HomeMotion)을 레이아웃으로 올렸다 — 오너: "서브페이지도 전부 적용해줘".
 *
 * ★ 하는 일은 **CSS 변수와 클래스에 숫자를 쓰는 것뿐**이다. 어떻게 움직일지는 전부 app/motion.css 가 정한다.
 *     [data-hero]   --hp  첫 화면을 얼마나 지나왔나(0~1) → 사진은 느리게 내려가며 커지고, 글은 위로 빠지며 옅어진다
 *                         (홈 첫 화면·진료/치과소개 머리말 공통)
 *     [data-par]    --py  시차(px). 값 = 틀보다 더 큰 비율(0.1 = 위아래 10%씩 여유). 틀(부모)이 화면을 지나는 만큼 반대로 민다
 *     [data-scrub]  --p   요소가 화면 아래에서 들어와 위로 나갈 때까지 0→1 (가로로 흐르는 큰 글자, 번지는 원)
 *     [data-words]  .w.on 문장이 화면을 지나는 만큼 낱말이 차례로 짙어진다(components/motion Words)
 *     진행선        --sp  문서 전체를 얼마나 읽었나(0~1)
 * ★ 커서를 따라다니는 원·자석 단추는 뺐다(2026-09-29 오너: "마우스 커서 모션은 없애고").
 * ★ 스크롤 효과의 '등장'(is-shown)은 여기서 하지 않는다 — RevealScript 가 맡는다(관찰자 한 곳 원칙).
 * ★ 라우트가 바뀌면 다시 모은다(usePathname) — 안 그러면 두 번째 페이지부터 시차·낱말이 멈춘다.
 * ⚠️ prefers-reduced-motion 이면 아무것도 하지 않는다 → CSS 기본값(변수 0, html.mo-on 없음)이 곧 멈춘 화면이다.
 * ⚠️ 관성 스크롤(Lenis)은 네이티브 스크롤을 움직이므로 window 의 scroll 이벤트가 그대로 온다.
 */
export function ScrollMotion() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    root.classList.add('mo-on');
    let hero: HTMLElement | null = null;
    let pars: HTMLElement[] = [];
    let scrubs: HTMLElement[] = [];
    let words: Array<{ el: HTMLElement; ws: HTMLElement[]; last: number }> = [];
    const collect = () => {
      hero = document.querySelector<HTMLElement>('[data-hero]');
      pars = [...document.querySelectorAll<HTMLElement>('[data-par]')];
      scrubs = [...document.querySelectorAll<HTMLElement>('[data-scrub]')];
      words = [...document.querySelectorAll<HTMLElement>('[data-words]')].map((el) => ({
        el,
        ws: [...el.querySelectorAll<HTMLElement>('.w')],
        last: -1,
      }));
    };
    collect();

    let raf = 0;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      if (hero) {
        const h = hero.offsetHeight || 1;
        hero.style.setProperty('--hp', clamp(y / h).toFixed(4));
      }
      for (const el of pars) {
        const box = (el.parentElement ?? el).getBoundingClientRect();
        if (box.bottom < -200 || box.top > vh + 200) continue;
        const p = (vh - box.top) / (vh + box.height); // 0 = 화면 아래에서 막 들어옴, 1 = 위로 막 나감
        const room = box.height * (Number(el.dataset.par) || 0.1);
        el.style.setProperty('--py', `${((0.5 - clamp(p)) * 2 * room).toFixed(1)}px`);
      }
      for (const el of scrubs) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        el.style.setProperty('--p', clamp((vh - r.top) / (vh + r.height)).toFixed(4));
      }
      /* 낱말 — 문장 윗변이 화면 아래 12% 에 들어오면 시작해 화면 가운데보다 조금 아래에서 다 짙어진다.
         (광화문 선치과 실측: 55% 까지 올려야 끝나면 아래쪽 글이 늘 흐리다 → 끝나는 지점을 내림) */
      /* ⚠️ 문서 끝까지 내렸으면 다 짙게 — 마무리 문장이 바닥 가까이 있으면 더 못 내려서 끝 낱말이 흐린 채 남았다(/about 실측).
         ⚠️ 이미 화면 위로 지나간 문장도 다 짙게 — 빠르게 내리면 중간 값에서 멈춘 채 지나가 끝 낱말이 흐리게 남았다(실측). */
      const atEnd = y >= root.scrollHeight - vh - 4;
      for (const s of words) {
        const r = s.el.getBoundingClientRect();
        if (r.top > vh) continue;
        const n =
          atEnd || r.bottom < 0 ? s.ws.length : Math.round(clamp((vh * 0.88 - r.top) / (r.height + vh * 0.3)) * s.ws.length);
        if (n === s.last) continue;
        s.last = n;
        s.ws.forEach((w, i) => w.classList.toggle('on', i < n));
      }
      const max = root.scrollHeight - vh;
      bar.current?.style.setProperty('--sp', max > 0 ? clamp(y / max).toFixed(4) : '0');
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

    return () => {
      window.removeEventListener('scroll', ask);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return <div ref={bar} className="mo-progress" aria-hidden />;
}
