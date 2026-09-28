'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import { StrengthIcon } from '@/components/StrengthIcons';

/**
 * 동그라미치과의 특별함 — 더뉴치과 메인 '특별함' 줄을 옮긴 것 (2026-09-28 오너).
 *
 * ★ 세로로 긴 사진 카드(2:3)가 가로로 흐르고 3초마다 한 장씩 넘어간다(더뉴 autoplay 3000ms).
 *   마우스를 올린 카드는 모서리가 20px → 60px 로 둥글어지고, 사진이 토프 색에 거의 잠기며
 *   아래에 설명이 열린다(더뉴는 베이지 #c5ad8e — 여기선 요청서의 Warm Taupe 를 흰 글자가 읽히는 깊이로).
 * ★ 넘김은 스크롤 스냅 위에서 한다 — 손가락·트랙패드로 밀어도 되고, 끝에 닿으면 처음으로 돌아간다.
 * ★ 멈추는 때: 마우스가 올라가 있을 때 · 키보드 초점이 안에 있을 때 · 손으로 밀고 난 직후 ·
 *   화면 밖에 있을 때 · 움직임 줄이기 설정. (보고 있는 카드를 빼앗지 않는다.)
 */
export interface SpecialCard {
  slug: string;
  key: string;
  title: string;
  body: string;
  photo: { src: string; alt: string; pos: string };
}

const DELAY = 3000;

export function SpecialSlider({ cards }: { cards: SpecialCard[] }) {
  const track = useRef<HTMLUListElement>(null);
  const hold = useRef(false);
  const lastUser = useRef(0);
  const bar = useRef<HTMLElement>(null);

  /* 아래 가는 선 — 보이는 폭만큼의 막대가 지금 자리에 선다(다시 그리지 않고 스타일만 바꾼다) */
  useEffect(() => {
    const el = track.current;
    const b = bar.current;
    if (!el || !b) return;
    const draw = () => {
      const sw = el.scrollWidth || 1;
      b.style.width = `${Math.min(100, (el.clientWidth / sw) * 100)}%`;
      b.style.transform = `translateX(${(el.scrollLeft / el.clientWidth) * 100}%)`;
    };
    draw();
    el.addEventListener('scroll', draw, { passive: true });
    window.addEventListener('resize', draw);
    return () => {
      el.removeEventListener('scroll', draw);
      window.removeEventListener('resize', draw);
    };
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap || '20') || 20;
    const w = (first?.offsetWidth ?? 400) + gap;
    const max = el.scrollWidth - el.clientWidth - 2;
    if (dir === 1 && el.scrollLeft >= max) el.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir === -1 && el.scrollLeft <= 2) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    else el.scrollBy({ left: dir * w, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    const t = window.setInterval(() => {
      if (!visible || hold.current || document.hidden) return;
      if (performance.now() - lastUser.current < DELAY * 2) return;
      step(1);
    }, DELAY);
    return () => {
      window.clearInterval(t);
      io.disconnect();
    };
  }, [step]);

  const touch = () => (lastUser.current = performance.now());

  return (
    <div
      className="sp-wrap"
      onMouseEnter={() => (hold.current = true)}
      onMouseLeave={() => (hold.current = false)}
      onFocus={() => (hold.current = true)}
      onBlur={() => (hold.current = false)}
    >
      <ul ref={track} className="sp-track" data-lenis-prevent-horizontal onPointerDown={touch} onWheel={touch} onTouchStart={touch}>
        {cards.map((c) => (
          <li key={c.slug} className="sp-card">
            <Link href={`/about/special/${c.slug}`} className="sp-link">
              <span className="sp-bg" aria-hidden>
                <Image
                  src={c.photo.src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 78vw, 400px"
                  className="sp-img"
                  style={{ objectPosition: c.photo.pos }}
                />
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
      {/*
        ★ 넘김 단추는 카드 **아래 줄**에 둔다 (2026-09-28 오너: "왼쪽 오른쪽 버튼이 카드랑 겹치잖아").
          카드 가장자리에 반쯤 걸쳐 두던 더뉴 방식은 사진·제목을 가렸다. 왼쪽엔 지금 어디쯤인지 보이는 가는 선.
      */}
      <div className="sp-ctrl">
        <span className="sp-bar" aria-hidden>
          <i ref={bar} />
        </span>
        <button type="button" className="sp-nav" aria-label="이전 카드" onClick={() => (touch(), step(-1))}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10.5 2.5 5 8l5.5 5.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <button type="button" className="sp-nav" aria-label="다음 카드" onClick={() => (touch(), step(1))}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M5.5 2.5 11 8l-5.5 5.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
