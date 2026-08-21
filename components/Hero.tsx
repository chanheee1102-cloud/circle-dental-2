'use client';

import { CLINIC, INTERIOR } from '@/lib/clinic';
import { FACTS } from '@/lib/aeo';
import { LetterMarquee, Magnetic } from './Motion';
import HeroVideo from './HeroVideo';

/**
 * 첫 화면 — 병원 실제 소개 영상 위에 왼쪽 아래 한 덩어리.
 *
 * ★★ 아래에서부터 쌓는다 (2026-08-21, 운영자: "규격이나 배치 잘맞추고") ★★
 *    예전에는 문구 블록을 **마퀴 아래끝에서 몇 px** 하는 식으로 위에서부터
 *    내려 앉혔고, 사실 띠는 따로 화면 맨 아래에 붙여 뒀다. 그래서 창 크기마다
 *    둘 사이 빈 공간이 제멋대로 벌어졌고(1400×900 에서 189px 공백), 좁아지면
 *    반대로 겹쳤다. 지금은 문구 + 버튼 + 사실 띠를 **한 덩어리로 묶어 화면
 *    아래에 붙인다** — 사이 간격이 창 크기와 무관하게 고정된다.
 *    ⚠️ 다시 top 기준 절대 좌표로 돌리지 말 것. 마퀴 크기는 화면 '폭'을 따르고
 *       띠 높이는 줄바꿈에 따라 변해서, 위아래 양쪽에서 계산하면 반드시 어긋난다.
 *    ⚠️⚠️ 마퀴와 이 덩어리는 **둘 다 흐름 안에 둔다**(absolute 금지) ⚠️⚠️
 *       둘을 절대 좌표로 띄우면 세로가 짧고 폭이 넓은 창에서 서로를 모른 채
 *       겹친다 — 마퀴 높이는 화면 폭(13.9vw)을 따르는데 덩어리는 화면 아래에
 *       붙으므로, 폭이 넓고 세로가 짧아질수록 둘이 같은 자리를 노린다
 *       (실측 1280×600 에서 3.3px 겹침). 지금은 flex 열로 두고 mt-auto 로
 *       아래로 민다: 자리가 남으면 화면 아래에 붙고, 모자라면 min-h 를 넘겨
 *       히어로가 조금 길어질 뿐 절대 겹치지 않는다. pt 가 최소 간격을 보장한다.
 *
 * ★★ 문구를 줄였다 (2026-08-21, 운영자: "문구 너무 많은데 간단히 줄이자") ★★
 *    소개 문구 전문(3줄)을 첫 화면에 그대로 얹고 있었다. 첫 화면은 다 읽는
 *    자리가 아니라 '여기가 어디고 무엇을 하는 곳인지'만 남기는 자리다.
 *    → 지역 한 줄 + 핵심 한 문장 + 진료 항목 한 줄로 줄였다.
 *    ⚠️ 줄이되 **지어내지 않는다** — 세 줄 모두 lib/clinic.ts 의 VERIFIED
 *       description 을 쪼갠 것이지 새로 쓴 문장이 아니다.
 *
 * ★★ 참고 화면 티를 걷어냈다 (2026-08-21, 운영자: "너무 이고운치과처럼 하지말고") ★★
 *    서울이고운치과에서 그대로 옮겨 온 서명 세 가지를 뺐다:
 *      · 문구 앞의 짧은 가로 대시(—)
 *      · 자간 넓은 영문 대문자 눈금줄(CIRCLE DENTAL CLINIC)
 *      · 전화 버튼 앞의 ☎ 아이콘
 *    배치(왼쪽 아래 + 하단 사실 띠)는 운영자가 요청한 구성이라 유지하고,
 *    표기는 우리 식(한글 지역 한 줄)으로 바꿨다.
 *
 * ⚠️ 영상 뒤에 사진을 항상 깐다 — 사내망·백신이 Vimeo 를 막는 환경이 있다
 *    (HeroVideo.tsx 참조).
 */

/** 영상이 못 뜰 때(차단·오프라인)의 폴백 사진 한 장. */
const FALLBACK_STILL = INTERIOR[2];

/**
 * 왼쪽 기준선 — 문구와 사실 띠가 **같은 식**을 쓴다.
 * ⚠️ 한쪽만 고치면 넓은 창에서 기준선이 어긋난다(실측 이력: 본문 160px, 띠 250px).
 */
const EDGE = 'max(24px, 7.24vw)';

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0d1113]">
      <HeroVideo on stills={[FALLBACK_STILL]} index={0} />

      {/* 세로 스크림 — 위(헤더)와 아래(문구·띠) 대비를 위해 양끝을 더 누른다. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(180deg,rgba(8,12,14,.62) 0%,rgba(8,12,14,.40) 40%,rgba(8,12,14,.88) 100%)',
        }}
      />

      {/* 마퀴 — 화면 맨 위. 흐름 안에 둔다(위 주석 참조). */}
      <div className="relative z-10 shrink-0 pt-[calc(76px+4vh)]">
        <LetterMarquee text={CLINIC.marquee} seconds={30} colorClass="text-brand-2" />
      </div>

      {/* ── 아래 한 덩어리: 문구 + 버튼 + 사실 띠 ─────────────────────
          mt-auto = 남는 자리를 전부 위에 몰아주고 아래에 붙는다.
          pt-16 = 자리가 모자랄 때도 마퀴와 최소 64px 은 벌린다. */}
      <div className="relative z-10 mt-auto pt-16">
        <div style={{ paddingLeft: EDGE, paddingRight: EDGE }} className="pb-9">
          {/*
            지역 — 어디 병원인지. 짧게 한 줄.
            ⚠️ 브랜드색(민트)으로 뒀다가 실측에서 안 읽혔다. 이 줄이 앉는 높이는
               배경이 밝은 벽일 때가 많은데 13px 민트는 그 위에서 사라진다.
               흰색 + 그림자로 간다 — 스크림을 더 어둡게 하면 사진이 죽는다.
          */}
          <p
            className="text-[13px] font-bold tracking-[-0.01em] text-white/75"
            style={{ textShadow: '0 1px 12px rgba(6,10,12,.8)' }}
          >
            {CLINIC.address.locality} 화정동
          </p>

          {/*
            핵심 한 줄.
            ★★ 병원 태그라인으로 확정 (2026-08-21, 운영자 선택) ★★
               직전에는 "자연치아를 최대한 살리는 방향을 먼저 검토합니다"(소개문
               발췌)를 썼는데 운영자가 다른 문구를 원했다. 후보 넷(발치 전 검토 /
               태그라인 / 환자의 질문문 / 오래 쓰는 쪽) 중 태그라인을 골랐다.
            ⚠️ CLINIC.tagline 을 그대로 읽는다 — 여기에 문자열을 직접 적으면
               lib/clinic.ts 와 어긋난다. 문구를 바꾸려면 저기를 고칠 것.
            ★★ 한 줄로 쭉 (2026-08-21, 운영자: "한줄로 쭉 나오게") ★★
               폭(max-w 11ch)으로 두 줄에 앉히던 것을 없애고, 글자 크기를 화면
               폭에 매어(7vw) 어떤 폭에서도 한 줄에 들어가게 했다. 좌우 여백
               (EDGE)도 7.24vw 라 같은 비율로 움직이므로 여유가 유지된다.
               실측: 이 문구의 폭은 글자 크기의 11배(44px 일 때 484px)이고
               쓸 수 있는 폭은 화면의 85.5% 라, 7vw 면 320~1920px 전 구간에서
               10% 이상 여유를 두고 한 줄에 앉는다.
            ⚠️ vw 값을 올리거나 EDGE 를 키우면 좁은 화면에서 두 줄이 된다.
               둘 중 하나만 만지지 말 것.
            ⚠️⚠️ 여기에 whitespace-nowrap 을 쓰지 않는다 ⚠️⚠️
               '한 줄'을 nowrap 으로 강제하면, 슬로건이 지금보다 길어지는 날
               문장이 화면 밖으로 나가고 섹션의 overflow-hidden 에 **소리 없이
               잘린다.** 지금처럼 두면 그런 경우 두 줄로 접힐 뿐이다 —
               보기엔 아쉬워도 글자가 사라지는 것보다 낫다.
               (슬로건은 lib/clinic.ts 에서 언제든 바뀔 수 있는 값이다.)
          */}
          <h1 className="mt-3 text-[clamp(18px,7vw,44px)] font-extrabold leading-[1.34] tracking-[-0.03em] text-white">
            {CLINIC.tagline}
          </h1>

          {/* 무엇을 보는지 — 항목만. 문장으로 늘리지 않는다. */}
          <p className="mt-4 text-[15px] font-medium tracking-[-0.01em] text-white/70">
            임플란트 · 심미치료 · 사랑니 발치
          </p>

          {/*
            버튼 두 개 — 채운 예약(네이버) + 테두리 전화.
            '오시는 길' 섹션의 두 버튼과 같은 어휘를 쓴다.
          */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href={CLINIC.booking.naver}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-full bg-brand px-8 py-3.5 text-[15px] font-bold text-white"
              >
                예약하기
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={CLINIC.phoneHref}
                className="inline-block rounded-full border border-white/35 px-7 py-3.5 text-[15px] font-bold tabular-nums text-white transition-colors hover:bg-white/10"
              >
                {CLINIC.phone}
              </a>
            </Magnetic>
          </div>
        </div>

        {/*
          ★★ 확인된 사실 띠 (2026-08-21, 운영자: "의료진3명 야간진료 뭐 저런거
             저렇게 넣고") ★★ 예전엔 히어로 아래 별도 섹션(#about)에서 큰 카운터
             숫자로 보여주던 값이다. 값은 전부 lib/aeo.ts 의 FACTS 그대로 —
             지어낸 지표는 하나도 없다.
          ⚠️ "14:00까지" 는 세지 않는다 — 시각을 0 부터 세면 뜻이 달라진다
             (Counter 미사용, 값을 그대로 출력).
          ⚠️⚠️ 여기에 Reveal(스크롤 등장)을 쓰면 **영원히 안 보인다** ⚠️⚠️
             Reveal 의 관찰 범위는 rootMargin '0 0 -8% 0' 이라 화면 아래 8% 를
             깎는데, 이 띠는 화면 맨 아래에 붙어 있어 그 밖으로 나가지 못하고
             opacity 0 인 채로 남는다(2026-08-21 실측으로 잡음).
             첫 화면 요소는 '스크롤하면 나타나는' 게 아니라 '뜨자마자 올라오는'
             것이어야 한다 → 로드 즉시 도는 .menu-rise 를 쓴다(--d 로 시차).
        */}
        <div
          className="border-t border-white/15"
          style={{ paddingLeft: EDGE, paddingRight: EDGE }}
        >
          {/* ⚠️ 좁은 화면에서는 2열 격자로 고정한다. flex-wrap 으로 두면 항목
              글자 길이에 따라 2줄이 됐다 3줄이 됐다 해서(375px 에서 실측)
              띠 높이가 들쭉날쭉하고 마지막 항목이 화면 밖으로 밀린다. */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 py-5 md:flex md:flex-wrap md:gap-x-10">
            {FACTS.map((s, i) => (
              <div
                key={s.label}
                className="menu-rise min-w-[92px]"
                style={{ '--d': `${420 + i * 70}ms` } as React.CSSProperties}
              >
                <dt className="text-[11.5px] font-bold tracking-[0.14em] text-white/60">{s.label}</dt>
                {/* ⚠️ 좁은 화면에서는 설명을 값 아래 줄로 내린다 — 한 줄에 이어
                    붙이면 칸 폭이 반으로 줄면서 값과 설명이 뒤엉켜 접힌다. */}
                <dd className="mt-1.5 text-[15px] font-bold leading-[1.45] text-white">
                  {s.value}{' '}
                  <span className="mt-0.5 block text-[12.5px] font-normal leading-[1.5] text-white/65 md:mt-0 md:inline md:text-[15px]">
                    {s.note}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
