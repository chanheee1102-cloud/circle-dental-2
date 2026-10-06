'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { StrengthIcon } from '@/components/StrengthIcons';

/**
 * 동그라미치과의 특별함 — 더뉴치과 메인 '특별함' 줄을 옮긴 것 (2026-09-28 오너).
 *
 * ★ 세로로 긴 사진 카드(3:4)가 가로로 흐른다. 마우스를 올린 카드는 모서리가 20px → 60px 로 둥글어지고,
 *   사진이 토프 색에 거의 잠기며 아래에 설명이 열린다(더뉴는 베이지 #c5ad8e — 여기선 흰 글자가 읽히는 깊이로).
 *
 * ★★ 넘기는 법 — 단추 대신 **스크롤** (2026-09-29 오너: "버튼으로 넘기는거 말고 방법 없나? 좀 세련된") ★★
 *   넓은 화면(마우스): 구획이 화면에 고정되고, 아래로 내리는 만큼 카드 줄이 옆으로 흐른다(가로 스크롤 고정 무대).
 *     광화문 선치과의 '구역이 지나가는 만큼 옆으로 흐르는 사진 띠'를 한 단 더 — 끝 카드까지 다 보여 준 뒤에 풀린다.
 *     내린 거리 1px = 옆으로 1px. 구획 높이 = 화면 높이 + 옆으로 갈 거리(JS 가 잰다).
 *   좁은 화면·터치: 손가락으로 밀고(스크롤 스냅), 3초마다 한 장씩 넘어간다(더뉴 autoplay 3000ms).
 *   ⚠️ 단추를 되살리지 말 것 — 오너가 '세련되지 않다' 고 뺀 것이다. 지금 어디쯤인지는 아래 가는 선이 보여 준다.
 * ★ 키보드: 고정 무대에서 Tab 으로 화면 밖 카드에 초점이 가면 그 카드가 보이는 자리까지 페이지를 내려 준다.
 * ★ 자동 넘김이 멈추는 때(좁은 화면): 마우스·키보드 초점이 안에 있을 때 · 손으로 밀고 난 직후 · 화면 밖 · 움직임 줄이기.
 *
 * ★★ 2026-10-06 오너 "모션 좀 더 전문적으로 다듬어" ★★
 *   ① 등장 — 기울어진 채 놓였다가 끝에서 툭 바로 서던 'deal'(rotate -4°→3°, 끝값이 0 이 아니라 마지막 프레임에 튀었다)을 버리고,
 *      카드가 아래에서 막이 걷히듯 솟고 사진은 크게 들어와 제자리로 가라앉는다(app/motion.css .sp-card · .sp-img).
 *   ② 옆으로 흐르는 동안 카드 안 사진이 반대로 조금 밀린다(시차 --sx, 카드 중심이 화면 가운데에서 떨어진 만큼 −1~1).
 *   ③ 줄 양끝이 화면 가장자리에서 옅어진다(.sp-view 마스크) — 오른쪽 퀵메뉴 밑으로 카드가 '잘려' 들어가던 것.
 *   ④ 카드마다 번호(01~), 올렸을 때는 토프로 덮던 것을 사진이 보이는 짙은 막 + 설명이 아래에서 열리는 것으로(모서리도 60→32px).
 */
export interface SpecialCard {
  slug: string;
  key: string;
  title: string;
  body: string;
  photo: { src: string; alt: string; pos: string };
}

const DELAY = 3000;
/** 고정 무대를 쓰는 화면 — 마우스가 있는 넓은 화면. 터치 노트북·태블릿은 손가락으로 미는 쪽이 자연스럽다. */
const PIN_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';

export function SpecialSlider({ cards, head }: { cards: SpecialCard[]; /** 고정 무대 안에 같이 세울 머리말 */ head?: ReactNode }) {
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLElement>(null);
  const hold = useRef(false);
  const lastUser = useRef(0);
  const [pinned, setPinned] = useState(false);

  /* 어느 방식인지 — 화면 폭·입력 장치가 바뀌면 다시 고른다 */
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY);
    const set = () => setPinned(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  /* ── 고정 무대: 내린 만큼 옆으로 ── */
  useEffect(() => {
    const box = pin.current;
    const el = track.current;
    const b = bar.current;
    if (!pinned || !box || !el || !b) return;
    let shift = 0; // 옆으로 갈 수 있는 거리(px)
    let x = 0; // 지금 옆으로 민 거리(px)
    let base = 0; // 민 거리가 0 일 때 줄 왼쪽 끝의 화면 좌표
    const items = [...el.children] as HTMLElement[];
    const measure = () => {
      base = el.getBoundingClientRect().left + x;
      const last = el.lastElementChild as HTMLElement | null;
      const pad = parseFloat(getComputedStyle(el).paddingRight) || 0;
      shift = last ? Math.max(0, last.offsetLeft + last.offsetWidth + pad - el.clientWidth) : 0;
      box.style.height = `calc(100vh + ${shift}px)`;
      b.style.width = `${Math.min(100, (el.clientWidth / (el.clientWidth + shift || 1)) * 100)}%`;
    };
    let raf = 0;
    const frame = () => {
      raf = 0;
      const top = box.getBoundingClientRect().top;
      x = Math.min(shift, Math.max(0, -top));
      el.style.transform = `translate3d(${-x}px, 0, 0)`;
      /* 시차 — 카드 중심이 화면 가운데에서 얼마나 떨어졌나(반 화면 = 1). 레이아웃을 다시 읽지 않게 offsetLeft 로 계산한다 */
      const half = window.innerWidth / 2;
      for (const c of items) {
        const mid = base - x + c.offsetLeft + c.offsetWidth / 2;
        c.style.setProperty('--sx', Math.max(-1.2, Math.min(1.2, (mid - half) / half)).toFixed(3));
      }
      const p = shift ? x / shift : 0;
      const w = parseFloat(b.style.width) || 100;
      b.style.transform = `translateX(${((100 - w) / w) * 100 * p}%)`;
    };
    const ask = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      measure();
      ask();
    };
    measure();
    frame();
    window.addEventListener('scroll', ask, { passive: true });
    window.addEventListener('resize', onResize);
    /* 사진이 늦게 뜨면 카드 폭이 바뀔 수 있다 — 크기가 바뀌면 다시 잰다 */
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    /* Tab 으로 화면 밖 카드에 초점 → 그 카드가 보이는 자리까지 페이지를 내린다 */
    const onFocus = (e: FocusEvent) => {
      const li = (e.target as Element | null)?.closest?.('.sp-card') as HTMLElement | null;
      if (!li) return;
      const want = Math.min(shift, Math.max(0, li.offsetLeft + li.offsetWidth - el.clientWidth + 40));
      const boxTop = box.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: boxTop + want, behavior: 'instant' as ScrollBehavior });
      el.scrollLeft = 0; // 브라우저가 초점 요소를 보이려 줄을 밀어 두는 것을 되돌린다(움직임은 transform 이 맡는다)
    };
    el.addEventListener('focusin', onFocus);

    return () => {
      window.removeEventListener('scroll', ask);
      window.removeEventListener('resize', onResize);
      el.removeEventListener('focusin', onFocus);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      box.style.height = '';
      el.style.transform = '';
      b.style.transform = '';
      for (const c of items) c.style.removeProperty('--sx');
    };
  }, [pinned]);

  /* ── 손가락으로 미는 줄(좁은 화면·터치): 가는 선 + 3초 자동 넘김 ── */
  useEffect(() => {
    const el = track.current;
    const b = bar.current;
    if (pinned || !el || !b) return;
    const draw = () => {
      const sw = el.scrollWidth || 1;
      b.style.width = `${Math.min(100, (el.clientWidth / sw) * 100)}%`;
      b.style.transform = `translateX(${(el.scrollLeft / el.clientWidth) * 100}%)`;
    };
    draw();
    el.addEventListener('scroll', draw, { passive: true });
    window.addEventListener('resize', draw);

    let t = 0;
    let io: IntersectionObserver | null = null;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let visible = false;
      io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 });
      io.observe(el);
      t = window.setInterval(() => {
        if (!visible || hold.current || document.hidden) return;
        if (performance.now() - lastUser.current < DELAY * 2) return;
        const first = el.firstElementChild as HTMLElement | null;
        const gap = parseFloat(getComputedStyle(el).columnGap || '14') || 14;
        const w = (first?.offsetWidth ?? 300) + gap;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 2) el.scrollTo({ left: 0, behavior: 'smooth' });
        else el.scrollBy({ left: w, behavior: 'smooth' });
      }, DELAY);
    }
    return () => {
      el.removeEventListener('scroll', draw);
      window.removeEventListener('resize', draw);
      window.clearInterval(t);
      io?.disconnect();
    };
  }, [pinned]);

  const touch = () => (lastUser.current = performance.now());

  return (
    <div ref={pin} className={`sp-pin${pinned ? ' is-pinned' : ''}`}>
      <div className="sp-stick">
        {head}
        <div
          className="sp-wrap late-in"
          onMouseEnter={() => (hold.current = true)}
          onMouseLeave={() => (hold.current = false)}
          onFocus={() => (hold.current = true)}
          onBlur={() => (hold.current = false)}
        >
          <div className="sp-view">
          <ul
            ref={track}
            className="sp-track"
            data-lenis-prevent-horizontal={pinned ? undefined : true}
            onPointerDown={touch}
            onWheel={touch}
            onTouchStart={touch}
          >
            {cards.map((c, i) => (
              <li key={c.slug} className="sp-card" style={{ ['--i' as string]: i }}>
                <Link href={`/about/special/${c.slug}`} className="sp-link">
                  <span className="sp-bg" aria-hidden>
                    {/* 시차용 틀 — 카드보다 좌우로 9% 씩 넓다(사진이 밀려도 가장자리가 비지 않게) */}
                    <span className="sp-par">
                    <Image
                      src={c.photo.src}
                      alt=""
                      fill
                      /*
                       * ⚠️ 카드 폭이 아니라 **그려지는 사진 폭**으로 적는다 (2026-09-28 실측: 뿌얬던 원인).
                       *   가로 사진(1056×575 등)을 세로 카드에 꽉 채우면 사진은 카드 높이 × 가로비만큼 넓게 그려진다
                       *   (440 × 1.84 ≈ 810px). sizes 를 카드 폭(400px)으로 적었더니 640px 판을 받아 1.7배로 늘려 그렸다.
                       */
                      sizes="(max-width: 767px) 160vw, 820px"
                      className="sp-img"
                      style={{ objectPosition: c.photo.pos }}
                    />
                    </span>
                  </span>
                  <span className="sp-no" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="sp-text">
                    <span className="sp-ico">
                      <StrengthIcon name={c.key} />
                    </span>
                    <span className="sp-title">{c.title}</span>
                    <span className="sp-body">
                      <span className="sp-body-in">
                        <span className="sp-desc">{c.body}</span>
                        <span className="sp-go">
                          자세히 보기 <span aria-hidden>→</span>
                        </span>
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          </div>
          {/* 지금 어디쯤인지 — 가는 선 하나. 단추는 두지 않는다(2026-09-29 오너). */}
          <div className="sp-ctrl" aria-hidden>
            <span className="sp-bar">
              <i ref={bar} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
