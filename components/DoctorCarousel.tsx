'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { LineBtn } from '@/components/home';

/**
 * 의료진 넘김판 — 목업(2026-09-16 요청서) 다섯 번째 화면.
 *
 * ★ 좁은 화면: 한 번에 한 사람, 옆으로 넘긴다(scroll-snap). 아래에 ‹ 1 / 3 › 표시.
 *   넓은 화면(lg): 세 사람이 한 줄에 선다 — 넘김도, 표시도 없다.
 * ★ 넘김은 브라우저의 스크롤이다. 자바스크립트는 **몇 번째인지 세는 일**만 한다.
 *   그래서 자바스크립트가 늦거나 꺼져도 손가락으로 넘기는 것은 그대로 된다.
 * ⚠️ 사진·이름·자격·경력은 lib/doctors.ts 원문이다(의료법 제56조). 여기서 문구를 만들지 않는다.
 * ⚠️ 채운 버튼을 넣지 말 것 — 홈의 채운 버튼은 첫 화면과 오시는 길 둘뿐이다.
 */
export interface CarouselDoctor {
  slug: string;
  name: string;
  role: string;
  license: string;
  keyCareer: readonly string[];
  photo: string;
}

export function DoctorCarousel({ doctors }: { doctors: CarouselDoctor[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  /* 한 칸 너비 = 첫 칸과 둘째 칸의 시작점 차이(칸 폭 + 간격). 화면 폭이 바뀌어도 그때그때 잰다. */
  const step = () => {
    const el = track.current;
    if (!el) return 0;
    const [a, b] = el.children;
    if (a instanceof HTMLElement && b instanceof HTMLElement) return b.offsetLeft - a.offsetLeft;
    return el.clientWidth;
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const s = step();
      if (s > 0) setIndex(Math.min(doctors.length - 1, Math.max(0, Math.round(el.scrollLeft / s))));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [doctors.length]);

  const go = (n: number) => {
    const el = track.current;
    if (!el) return;
    const next = Math.min(doctors.length - 1, Math.max(0, n));
    el.scrollTo({ left: next * step(), behavior: 'smooth' });
  };

  return (
    <div>
      <ul
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto lg:grid lg:grid-cols-3 lg:gap-x-6 lg:overflow-visible"
        aria-label="의료진"
      >
        {doctors.map((d) => (
          <li key={d.slug} className="w-full shrink-0 snap-start lg:w-auto">
            <div className="overflow-hidden rounded-[8px] bg-white">
              <div className="relative aspect-[4/3] overflow-hidden bg-wine-soft lg:aspect-[4/5]">
                <Image
                  src={d.photo}
                  alt={`${d.name} ${d.role}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover object-[50%_16%]"
                />
              </div>
              <div className="px-6 pt-6 pb-7">
                <p className="text-[22px] leading-none text-charcoal">
                  {d.name} <span className="ml-1 text-[15px] text-ash">{d.role}</span>
                </p>
                <p className="mt-3 text-[15px] text-charcoal/80">{d.license}</p>
                <ul className="mt-2 space-y-0.5">
                  {d.keyCareer.map((c) => (
                    <li key={c} className="text-[14px] leading-[1.6] text-ash">
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <LineBtn href={`/about/doctors#${d.slug}`} size="sm">
                    의료진 자세히 보기
                  </LineBtn>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* ‹ 1 / 3 › — 좁은 화면에서만. */}
      <div className="mt-7 flex items-center justify-center gap-7 text-[14px] text-ash lg:hidden">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label="이전 의료진"
          className="p-2 transition-opacity disabled:opacity-30"
        >
          <Chevron dir="left" />
        </button>
        <span className="tabular-nums text-charcoal" aria-live="polite">
          {index + 1} / {doctors.length}
        </span>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === doctors.length - 1}
          aria-label="다음 의료진"
          className="p-2 transition-opacity disabled:opacity-30"
        >
          <Chevron dir="right" />
        </button>
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'M12.5 4 6.5 10l6 6' : 'M7.5 4l6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
