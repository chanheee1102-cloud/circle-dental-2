'use client';

import { useEffect, useState } from 'react';
import { CLINIC, INTERIOR, VIDEO } from '@/lib/clinic';
import { LetterMarquee, OnSwitch } from './Motion';
import HeroVideo from './HeroVideo';

/**
 * 첫 화면 — bom-on 히어로의 배치 치수 + 병원 실제 소개 영상.
 *
 * ══ 원본 실측 (1920×1080) ═══════════════════════════════════════
 *   마퀴 밴드   top 40px          ← 화면 맨 위
 *   글자        267px / line-height 1.0 / weight 400
 *   서브 문구   top 388 (35.9vh) · left 139 (7.24vw) · 16px
 *   토글        top 438 (40.5vh) · left 139 · 111 × 46
 *
 * ★ On 토글 = 이 화면의 서명.
 *   누르면 배경 **영상이 실제로 꺼지고 병원 사진이 흐른다**.
 *
 * ★★ "눌러서 영상을 꺼 보세요" 같은 안내 문구는 쓰지 않는다 (2026-08-20 운영자) ★★
 *   토글은 이미 On/Off 가 적혀 있고 손잡이가 흔들린다 — 누르라는 말은 군더더기다.
 *   그 자리에는 대신 **지금 화면에 뭐가 나오는지**를 적는다.
 *   "누르는 법"이 아니라 "보고 있는 것"이라, 켜든 끄든 쓸모가 있다.
 *   ⚠️ 누르는 법을 못 읽는 사람을 위한 안내는 화면이 아니라 OnSwitch 의
 *      aria-label('배경 켜기 / 끄기')이 맡는다.
 *
 * ⚠️ 영상 뒤에 사진을 항상 깐다 — 사내망·백신이 Vimeo 를 막는 환경이 있다.
 *    자세한 이유는 HeroVideo.tsx 주석 참조.
 */

/** 껐을 때 흐르는 사진. 병원 실제 공간 사진이고 설명도 실제 그대로다. */
const STILLS = [INTERIOR[2], INTERIOR[1], INTERIOR[5], INTERIOR[3], INTERIOR[0]];
/** 한 장이 머무는 시간. 캡션을 읽을 만큼은 길고 지루하지 않을 만큼은 짧게. */
const HOLD_MS = 4800;

export default function Hero() {
  const [on, setOn] = useState(true);
  const [i, setI] = useState(0);

  /*
   * 껐을 때만 사진이 넘어간다.
   * ⚠️ 켜져 있을 때도 돌리면 영상 밑에서 보이지도 않는 사진을 계속 바꾸는 셈이다.
   * ⚠️ 모션 감소 설정에서는 넘기지 않는다 — 저절로 바뀌는 화면은 그 설정이
   *    막으려는 바로 그것이다. 첫 장만 조용히 보여 준다.
   */
  useEffect(() => {
    if (on) { setI(0); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % STILLS.length), HOLD_MS);
    return () => clearInterval(t);
  }, [on]);

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-[#0d1113]">
      <HeroVideo on={on} stills={STILLS} index={i} />

      {/*
        ⚠️⚠️ 스크림은 뒤에 뭐가 있느냐에 따라 달라야 한다 ⚠️⚠️
          영상(ON)은 흰 복도 + 무영등이라 세게 눌러야 색 글자가 읽힌다.
          사진(OFF)은 그 자체가 보여 줄 것이라, 같은 세기로 누르면 껐는데도
          여전히 어두운 화면이 된다 — 껐을 때 볼 게 없다는 지적이 그것이었다.
          그래서 **세로 스크림만 걷고, 글이 놓이는 왼쪽은 오히려 더 누른다.**
          오른쪽 사진은 밝아지고 왼쪽 글자 대비는 그대로 유지된다.
      */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: on
            ? 'linear-gradient(180deg,rgba(8,12,14,.62) 0%,rgba(8,12,14,.44) 44%,rgba(8,12,14,.84) 100%)'
            : 'linear-gradient(180deg,rgba(8,12,14,.40) 0%,rgba(8,12,14,.24) 44%,rgba(8,12,14,.80) 100%)',
          transition: 'background 1s ease-in-out',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: on
            ? 'linear-gradient(100deg,rgba(8,12,14,.66) 0%,rgba(8,12,14,.30) 44%,rgba(8,12,14,0) 82%)'
            : 'linear-gradient(100deg,rgba(8,12,14,.76) 0%,rgba(8,12,14,.34) 40%,rgba(8,12,14,0) 74%)',
          transition: 'background 1s ease-in-out',
        }}
      />

      {/*
        ⚠️⚠️ 글 자리에만 까는 스크림 — 두 번 틀린 자리다 ⚠️⚠️
          ① 상자에 담아 그렸더니 그라디언트가 0 에 닿기 전에 상자가 끝나
             **네모난 판의 모서리가 그대로 보였다.** → 화면 전체를 덮고 좌표로 찍는다.
          ② 그걸 position:fixed 로 했더니, 관성이 꺼진 화면(모바일·모션 감소)에서
             스크림이 페이지 끝까지 따라다녔다. → 히어로 섹션에 묶는다(absolute).

          왜 필요한가: 대비를 실제로 재 보니 **원래부터 기준 미달**이었다.
          켜진 상태 3.13:1 · 꺼진 상태 최악 1.67:1 — 15px 굵은 글씨는 큰 글자가
          아니라서 WCAG AA 4.5:1 이 필요하다. 화면 전체를 더 누르면 사진이 죽으므로
          글이 놓인 자리만 누른다. 지금 5.5:1 이상.
        ⚠️ 좌표식은 아래 글 블록의 top/left 와 **같은 식**이다. 하나만 고치면 어긋난다.
        ⚠️ `clamp(...) * 1.2` 의 1.2 — 마퀴 실제 렌더 높이는 폰트 크기 그대로가 아니라
           디센더 여백(20%, Motion.tsx LetterMarquee 참조)만큼 더 크다. 마퀴 쪽 padding
           값을 고치면 이 배수도 같이 고쳐야 두 계산이 어긋나지 않는다.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(38rem 15rem at calc(max(24px, 7.24vw) + 11rem) calc(76px + 4vh + clamp(56px, 13.9vw, 268px) * 1.2 + 44px + 4rem), rgba(6,10,12,.95) 0%, rgba(6,10,12,.9) 44%, rgba(6,10,12,.52) 72%, rgba(6,10,12,0) 100%)',
        }}
      />

      {/* 마퀴 — 화면 맨 위. */}
      <div className="absolute inset-x-0 top-[calc(76px+4vh)] z-10">
        <LetterMarquee text={CLINIC.marquee} seconds={30} colorClass={on ? 'text-brand-2' : 'text-white/22'} />
      </div>

      {/*
        서브 + 토글 + 지금 보고 있는 것.

        ⚠️⚠️ 세로 위치를 **뷰포트 비율(svh)로 잡으면 안 된다** ⚠️⚠️
          마퀴 글자 크기는 화면 **폭**(13.9vw)을 따르는데 이 블록은 **높이**(35.9svh)를 따랐다.
          기준이 서로 달라서, 폭이 넓고 세로가 짧은 창(실측 1879×940)에서 마퀴가 아래로
          더 내려오며 서브 문구를 약 38px 덮었다. 어떤 창에서는 반드시 겹치는 구조였다.
          → 마퀴의 실제 아래끝(헤더 76 + 4vh + 글자높이)에서 44px 띄운다.
             폭·높이 어떤 조합에서도 겹치지 않는다.
      */}
      <div
        className="absolute z-10"
        style={{
          top: 'calc(76px + 4vh + clamp(56px, 13.9vw, 268px) * 1.2 + 44px)',
          left: 'max(24px, 7.24vw)',
        }}
      >
        <h1 className="text-[clamp(14px,1.05vw,17px)] font-bold leading-[1.6] tracking-[-0.02em] text-brand-2">
          {CLINIC.tagline} : {CLINIC.shortName}
        </h1>
        <div className="mt-7">
          <OnSwitch on={on} onChange={setOn} />
        </div>

        {/*
          지금 화면에 뭐가 나오는지.
          ⚠️ 높이를 고정한다 — 문구 길이에 따라 줄 수가 달라지면 아래 눈금이 들썩인다.
          ⚠️ aria-live 를 쓰지 않는다. 4.8초마다 캡션이 바뀌는데 그때마다 읽어 주면
             화면 낭독기 사용자에게는 그냥 소음이다. 사진은 배경이지 본문이 아니다.
        */}
        <div className="mt-5 flex h-[34px] items-center gap-4">
          <p key={on ? 'v' : `p${i}`} className="hero-now text-[13.5px] leading-[1.5] text-white/60">
            {on ? VIDEO.title : STILLS[i].alt}
          </p>
        </div>

        {/* 몇 번째 장인지 — 껐을 때만. 눌러서 바로 넘길 수도 있다. */}
        <div
          className="flex items-center gap-2"
          style={{
            opacity: on ? 0 : 1,
            visibility: on ? 'hidden' : 'visible',
            transition: 'opacity .6s ease, visibility .6s',
          }}
        >
          {STILLS.map((s, n) => (
            <button
              key={s.src}
              type="button"
              tabIndex={on ? -1 : 0}
              aria-label={`${n + 1}번째 사진 — ${s.alt}`}
              aria-current={n === i}
              onClick={() => setI(n)}
              className="h-4 py-[7px]"
              style={{ cursor: 'pointer' }}
            >
              <span
                className="block h-[2px] rounded-full"
                style={{
                  width: n === i ? 26 : 12,
                  background: n === i ? 'var(--color-brand-2)' : 'rgba(255,255,255,.34)',
                  transition: 'width .5s var(--ease-soft), background .5s ease',
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* 스크롤 지시자 */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 md:flex">
        <span className="text-[11.5px] tracking-[0.3em] text-white/45">SCROLL</span>
        <span className="bouncy block h-7 w-px bg-white/45" />
      </div>
    </section>
  );
}
