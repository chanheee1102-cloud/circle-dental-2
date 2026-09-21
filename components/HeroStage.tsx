'use client';

import { useEffect, useRef } from 'react';

/**
 * 첫 화면 무대 — 스크롤 진행도(0~1)를 CSS 변수 `--p` 로, 글자 사이 원의 중심을 `--cx/--cy` 로만 내보낸다.
 *
 * ★ 레퍼런스(인터서울치과) 첫 화면의 문법: 밝은 바탕에 큰 글자, 그 사이에 **동그란 사진** 하나.
 *   내리면 그 원이 화면 전체 사진으로 커지고 글자는 뒤로 물러난다. '동그라미' 라는 이름과
 *   정원(正圓) 모티프(globals.css .num-ring 주석)가 이 문법과 정확히 맞아 가져왔다.
 *
 * ★ 이 파일은 **숫자만** 계산한다. 무엇이 어떻게 움직이는지는 전부 globals.css `.hstage` 의 CSS 가 정한다
 *   (clip-path 원의 반지름·글자 투명도·사진 배율). 자바스크립트는 스크롤 위치를 0~1 로 바꿔 줄 뿐이다.
 *   그래서 리렌더가 없다 — state 를 두지 않고 style.setProperty 로 바로 쓴다(RevealScript 의 스포트라이트와 같은 이유).
 * ★ 원의 중심은 제목 안의 빈 칸(.hs-hole)이 **실제로 놓인 자리**를 재서 넣는다. 그래서 제목이 한 줄이든(넓은 화면)
 *   세로로 쌓이든(좁은 화면) 사진은 늘 그 구멍에서 시작해 커진다. 글꼴이 늦게 와서 자리가 밀리면 다시 잰다(fonts.ready).
 * ★ 관찰자를 새로 만들지 않는다 — scroll 리스너 하나(passive) + rAF 한 번씩. RevealScript 의 '관찰자는 하나' 원칙과
 *   충돌하지 않는다(그쪽은 IntersectionObserver, 여기는 진행도).
 *
 * ⚠️ prefers-reduced-motion 이면 처음부터 끝 장면(--p: 1, 사진 전체)으로 둔다 — 원이 커지는 연출은 장식이다.
 * ⚠️ 자바스크립트가 꺼지면 layout 의 noscript 가 `--p: 1 !important` 로 눌러 역시 끝 장면이 보인다.
 *    서버 HTML 에는 `style="--p:0"` 이 실려 있어(아래) 첫 그림이 사진이었다가 글자로 튀지 않는다.
 */
export function HeroStage({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stage = el.firstElementChild as HTMLElement | null; // sticky 한 화면
    const hole = el.querySelector<HTMLElement>('.hs-hole');

    /* 원의 중심 — 구멍의 중심을 sticky 상자 기준 px 로. 장면 A 가 살짝 움직이는 상태(scale)에서 재면 어긋나므로
       그 레이어의 transform 을 잠깐 끄고 잰다. */
    const measure = () => {
      if (!stage || !hole) return;
      const layer = hole.closest<HTMLElement>('.hs-a');
      const prev = layer?.style.transform ?? '';
      if (layer) layer.style.transform = 'none';
      const s = stage.getBoundingClientRect();
      const h = hole.getBoundingClientRect();
      if (layer) layer.style.transform = prev;
      const cx = h.left + h.width / 2 - s.left;
      const cy = h.top + h.height / 2 - s.top;
      el.style.setProperty('--cx', `${cx.toFixed(1)}px`);
      el.style.setProperty('--cy', `${cy.toFixed(1)}px`);

      /*
       * 원 안에 **사진의 볼거리**(data-focus — 태블릿의 치아 모형)가 오도록 사진을 밀어 둔다.
       *   object-cover 가 그린 사진의 실제 자리(잘려 나간 만큼 포함)를 계산해 볼거리의 화면 좌표(px,py)를 얻고,
       *   원 중심(cx,cy)에서 배율(S)만큼 키운 상태로 그 점이 원 중심에 오게 하는 이동량(--tx/--ty)을 넣는다.
       *   내리면서 이동량은 0 으로, 배율은 1 로 돌아가 사진이 제 구도로 선다(globals.css .hs-photo).
       * ⚠️ data-pos 는 Tailwind object-[x_y] 와 같은 값이어야 한다 — 어긋나면 원 안에 엉뚱한 부분이 보인다.
       * ⚠️ 이동량은 상자의 22% 로 막는다 — 더 밀면 커지는 도중 사진 가장자리가 원 안으로 들어온다.
       */
      const photo = el.querySelector<HTMLElement>('.hs-photo');
      if (photo) {
        const num = (v: string | undefined, d: [number, number]) => {
          const a = (v ?? '').split(/\s+/).map(Number);
          return a.length === 2 && a.every(Number.isFinite) ? (a as [number, number]) : d;
        };
        const [fx, fy] = num(photo.dataset.focus, [0.5, 0.5]);
        const [ox, oy] = num(photo.dataset.pos, [0.5, 0.5]);
        const img = photo.querySelector('img');
        const [dw, dh] = num(photo.dataset.size, [3, 2]);
        const iw = img?.naturalWidth || dw;
        const ih = img?.naturalHeight || dh;
        const W = s.width;
        const H = s.height;
        const sc = Math.max(W / iw, H / ih);
        const rw = iw * sc;
        const rh = ih * sc;
        const px = (W - rw) * ox + fx * rw;
        const py = (H - rh) * oy + fy * rh;
        const S = 1.22; // globals.css .hs-photo 의 시작 배율과 같은 값
        const lim = (v: number, m: number) => Math.max(-m, Math.min(m, v));
        el.style.setProperty('--tx', `${lim((cx - px) * S, W * 0.22).toFixed(1)}px`);
        el.style.setProperty('--ty', `${lim((cy - py) * S, H * 0.22).toFixed(1)}px`);
      }
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      el.style.setProperty('--p', '1');
      el.classList.add('is-done', 'is-half');
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      /* 무대(2화면 높이)가 화면 위에 붙어 있는 동안 0 → 1. 붙기 전은 0, 지나가면 1. */
      const r = el.getBoundingClientRect();
      const travel = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / travel));
      el.style.setProperty('--p', p.toFixed(4));
      el.classList.toggle('is-done', p >= 0.999);
      el.classList.toggle('is-half', p >= 0.5);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    document.fonts?.ready.then(measure).catch(() => {});
    /* 사진의 원본 크기는 다 받아야 안다 — 받은 뒤 한 번 더 잰다(그 전에는 data-size 로 계산). */
    const img = el.querySelector('img');
    if (img && !img.complete) img.addEventListener('load', measure, { once: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} className={`hstage ${className}`} style={{ ['--p' as string]: 0 }}>
      {children}
    </section>
  );
}
