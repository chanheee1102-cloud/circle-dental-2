'use client';

import Image from 'next/image';
import { useState } from 'react';
import { LineBtn } from '@/components/home';

/**
 * 의료진 — 한 사람씩 크게 (2026-09-17 오너: "의료진 쪽 전문적으로 다시").
 *
 * ★ 목업(다섯 번째 화면)의 문법 — 사진 하나, 이름, 한 줄 소개, 버튼, ‹ 1/3 ›. 세 장을 나란히 늘어놓는
 *   '명함 카드' 를 버리고 **한 사람에게 화면을 다 준다.** 넓은 화면에서는 왼쪽 사진·오른쪽 글의 잡지 펼침면.
 * ★ 요청서: 신뢰는 문구가 아니라 사진·여백·타이포로. 그래서 이름은 세리프로 크게, 경력은 얇은 선 사이에
 *   짧게, 나머지는 원장별 페이지로 넘긴다.
 * ⚠️ 이름·자격·경력은 lib/doctors.ts 원문의 부분집합이다(의료법 제56조). 여기서 문장을 만들지 않는다 —
 *    목업의 인용문("가능한 치료와 필요한 치료를 구분해서…")은 본인 말이 아니라 넣지 않는다.
 * ⚠️ 사진은 본인 확인이 되는 스튜디오 사진뿐이다. 진료 장면 사진은 누구인지 특정할 수 없어 이름 아래 둘 수 없다.
 * ⚠️ 채운 버튼을 넣지 말 것 — 홈의 채운 버튼은 첫 화면과 오시는 길 둘뿐이다.
 */
export interface ShowcaseDoctor {
  slug: string;
  name: string;
  role: string;
  license: string;
  keyCareer: readonly string[];
  careerCount: number;
  societyCount: number;
  photo: string;
}

export function DoctorShowcase({ doctors }: { doctors: ShowcaseDoctor[] }) {
  const [index, setIndex] = useState(0);
  const d = doctors[index];
  const n = doctors.length;
  const go = (i: number) => setIndex((i + n) % n);

  return (
    <div>
      {/* 이름 탭 — 넓은 화면. 지금 보는 사람에게 밑줄. */}
      <div role="tablist" aria-label="의료진 선택" className="hidden gap-8 border-b border-wine-line lg:flex">
        {doctors.map((x, i) => (
          <button
            key={x.slug}
            role="tab"
            type="button"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={`-mb-px flex items-baseline gap-2 border-b pb-4 text-[17px] transition-colors ${
              i === index
                ? 'border-charcoal text-charcoal'
                : 'border-transparent text-ash hover:text-charcoal'
            }`}
          >
            <span className="kicker text-[11px] text-inherit">0{i + 1}</span>
            {x.name} <span className="text-[14px] text-ash">{x.role}</span>
          </button>
        ))}
      </div>

      {/* key 로 다시 그려 .enter 진입 동작을 사람마다 한 번씩 */}
      <div key={d.slug} className="grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="enter relative aspect-[4/3] overflow-hidden rounded-[8px] bg-white sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image
            src={d.photo}
            alt={`${d.name} ${d.role}`}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover object-[50%_14%]"
          />
        </div>

        <div className="enter flex flex-col justify-center" style={{ animationDelay: '80ms' }}>
          <p className="kicker lg:hidden">
            0{index + 1} / 0{n}
          </p>
          <h3 className="serif-head mt-3 text-[clamp(30px,3.4vw,44px)] text-charcoal lg:mt-0">
            {d.name}
            <span className="ml-3 font-sans text-[17px] text-ash">{d.role}</span>
          </h3>
          <p className="mt-4 text-[16.5px] leading-[1.7] text-charcoal/85">{d.license}</p>

          <ul className="mt-7 divide-y divide-wine-line border-y border-wine-line">
            {d.keyCareer.map((c) => (
              <li key={c} className="py-3 text-[15.5px] leading-[1.6] text-charcoal/80">
                {c}
              </li>
            ))}
          </ul>
          {/* 전체는 원장 페이지에 — 개수만 사실대로 적는다(lib/doctors.ts 배열 길이). */}
          <p className="mt-4 text-[14px] text-ash">
            학력·경력 {d.careerCount}줄
            {d.societyCount > 0 ? ` · 학회 활동 ${d.societyCount}곳` : ''} — 전체는 의료진 페이지에서
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
            <LineBtn href={`/about/doctors#${d.slug}`} size="sm">
              의료진 자세히 보기
            </LineBtn>
            <div className="flex items-center gap-5 text-[14px] text-ash">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="이전 의료진"
                className="p-2 transition-colors hover:text-charcoal"
              >
                <Chevron dir="left" />
              </button>
              <span className="tabular-nums text-charcoal" aria-live="polite">
                {index + 1} / {n}
              </span>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="다음 의료진"
                className="p-2 transition-colors hover:text-charcoal"
              >
                <Chevron dir="right" />
              </button>
            </div>
          </div>
        </div>
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
