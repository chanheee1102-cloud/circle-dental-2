'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * 진료 카드 줄 — **스크롤에 붙어 가로로 밀린다.**
 *
 * ★★ 왜 (2026-08-31 운영자) ★★
 *   "두번째 이미지처럼 좀 스크롤하면 자동으로 되도록해줘. 지금 스크롤하면 메인페이지만 내려가."
 *   두 번째 버전(circle-dental-2)이 이 구획에 쓰던 연출이다. 카드가 400px 라 넷이 한 화면에
 *   안 들어오는데, 옆으로 미는 방법을 알려 주지 않으면 첫 두 장만 보고 지나간다.
 *
 * ★★ 어떻게 ★★
 *   바깥 상자를 화면보다 길게 잡고, 그 구간을 지나는 동안 안쪽을 화면에 붙여(sticky) 둔다.
 *   세로로 내린 만큼 줄을 왼쪽으로 민다.
 *
 * ⚠️⚠️ **구간 길이를 넘치는 폭과 같게 두지 말 것** (2026-08-31 실측) ⚠️⚠️
 *   처음엔 고정 구간 = 넘치는 가로 길이(298px)로 뒀다. 휠 두세 번이면 끝나는 거리라
 *   운영자에게는 **가로 이동이 아예 없는 것처럼** 보였다("스크롤 하면 메인페이지만 가고
 *   가로 부분 스크롤 안돼"). 세로로 더 길게 내려야 가로가 천천히 움직인다.
 *   → SPEED 배만큼 늘려 잡는다. 값을 1 에 가깝게 내리면 그 증상이 그대로 돌아온다.
 *
 * ⚠️⚠️ **줄을 transform 으로 밀지 말 것** (2026-08-31 실측) ⚠️⚠️
 *   카드는 backdrop-filter 로 뒤를 흐려 유리가 된다(.pane-dark). 조상에 transform 이 있으면
 *   그 안쪽이 **backdrop 루트**가 되어 카드가 읽을 뒤가 없어지고, 화면에는 **흐릿한 검은
 *   사각형**만 남는다(운영자: "저 흐릿한 검은 배경 사각형"). 의료진 카드에서도 겪은 일이다.
 *   → scrollLeft 로 민다. transform 이 없으니 유리가 정상으로 돌아온다.
 *
 * ⚠️ 손가락·모션 최소화에서는 켜지 않는다. 세로 스크롤을 붙들면 페이지를 빠져나가기
 *    어려워진다. 그때는 그냥 옆으로 넘겨 보는 줄이 된다 — v2 도 같다.
 * ⚠️ 스크롤을 가로채지 않는다(preventDefault 없음). 구간을 다 지나면 저절로 풀린다.
 */

/** 고정 구간 = 넘치는 가로 길이 × 이 값. 체감 속도는 여기 하나로 조절한다. */
const SPEED = 2.4;

export function PillarRail({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  /** 가로로 굴러가는 상자. ⚠️ 여기를 scrollLeft 로 민다(transform 금지 — 위 주석). */
  const view = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  /** 줄이 화면 밖으로 넘치는 길이(px). */
  const [over, setOver] = useState(0);

  useEffect(() => {
    const v = view.current;
    if (!v) return;

    const decide = () => {
      const ok =
        window.matchMedia('(min-width: 1024px)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const o = ok ? Math.max(0, v.scrollWidth - v.clientWidth) : 0;
      setPinned(ok && o > 0);
      setOver(o);
    };

    decide();
    window.addEventListener('resize', decide);
    /* 사진이 늦게 들어오면 줄 길이가 바뀐다 — 그때 다시 잰다. */
    const imgs = Array.from(v.querySelectorAll('img'));
    imgs.forEach((im) => im.addEventListener('load', decide));
    return () => {
      window.removeEventListener('resize', decide);
      imgs.forEach((im) => im.removeEventListener('load', decide));
    };
  }, []);

  useEffect(() => {
    const o = outer.current;
    const v = view.current;
    if (!o || !v) return;
    if (!pinned) {
      v.scrollLeft = 0;
      return;
    }

    let raf = 0;
    const frame = () => {
      raf = 0;
      const r = o.getBoundingClientRect();
      const travel = o.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / travel));
      v.scrollLeft = over * p;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    frame();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pinned, over]);

  return (
    <div
      ref={outer}
      style={pinned ? { height: `calc(100vh + ${Math.round(over * SPEED)}px)` } : undefined}
    >
      <div className={pinned ? 'sticky top-0 flex h-screen items-center' : ''}>
        {/*
          ⚠️ 붙어 있는 동안에는 손으로 미는 가로 스크롤을 끈다(overflow-x-hidden) —
             안 끄면 스크롤이 민 위치와 손이 민 위치가 더해져 카드가 두 배로 달아난다.
          ⚠️ 세로 여백(py-8)을 빼지 말 것. 손을 올린 카드가 조금 커지는데 여백이 없으면
             잘린다. 세로는 overflow-y-visible 이어야 그 확대가 안 잘린다.
        */}
        <div
          ref={view}
          className={`scrollbar-none w-full ${
            pinned ? 'overflow-x-hidden' : 'snap-x snap-mandatory overflow-x-auto'
          }`}
        >
          <ul className="flex w-max gap-6 px-5 py-8 lg:px-8">{children}</ul>
        </div>
      </div>
    </div>
  );
}
