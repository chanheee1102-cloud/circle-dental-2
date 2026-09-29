'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

/**
 * 주요 진료 — 더뉴치과 메인 '주요 진료 과목'의 움직임을 옮긴 카드 줄 (2026-09-28 오너).
 *
 * ★ 넓은 화면: 네 장이 한 줄. 마우스가 올라간(또는 키보드로 닿은) 카드만 두 배로 넓어지고
 *   (flex-grow 1 → 2, 20% → 40%), 그 카드에서만 환자의 말·설명·'자세히 보기' 가 올라온다.
 *   오른쪽 위에는 동그라미가 한 바퀴 그려진다(더뉴는 로고가 뜨는 자리 — 여기선 이름의 원).
 * ★ 좁은 화면: 세로로 쌓고 전부 펼친 채로 둔다(올릴 마우스가 없다).
 * ★ 카드 전체가 링크다 — 넓어진 카드를 누르면 그 진료 페이지로 간다.
 * ⚠️ 움직임은 전부 CSS(globals.css 「더뉴 문법 이식」). 여기서는 어느 카드가 켜졌는지만 안다.
 */
export interface ClinicCard {
  key: string;
  en: string;
  name: string;
  quote: string;
  copy: string;
  href: string;
  tone: 'light' | 'dark';
  photo: { src: string };
}

export function ClinicAccordion({ cards }: { cards: ClinicCard[] }) {
  const [on, setOn] = useState(0);
  return (
    <ul className="cl-acc late-in" data-lenis-prevent-horizontal>
      {cards.map((c, i) => (
        <li
          key={c.key}
          className={`cl-card cl-${c.tone}${i === on ? ' is-on' : ''}`}
          data-key={c.key}
          onMouseEnter={() => setOn(i)}
        >
          <Link href={c.href} className="cl-link" onFocus={() => setOn(i)}>
            {/* 사물 정물(AI) — 뜻은 카드 글자가 진다. 링크 이름에 사진 설명이 섞이지 않게 비운다. */}
            <Image src={c.photo.src} alt="" fill sizes="(max-width: 1023px) 100vw, 40vw" className="cl-img" />
            <svg className="cl-ring" viewBox="0 0 48 48" aria-hidden focusable="false">
              <circle cx="24" cy="24" r="21" pathLength={1} />
            </svg>
            <span className="cl-text">
              <span className="cl-en">{c.en}</span>
              <span className="cl-name">{c.name}</span>
              <span className="cl-more">
                <span className="cl-quote">“{c.quote}”</span>
                <span className="cl-copy">{c.copy}</span>
                <span className="cl-btn">
                  자세히 보기
                  <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
                    <path d="M0 5h16M12.5 1 16.5 5l-4 4" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </span>
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
