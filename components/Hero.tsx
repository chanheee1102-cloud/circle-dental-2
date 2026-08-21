'use client';

import { CLINIC, INTERIOR, VIDEO } from '@/lib/clinic';
import { LetterMarquee, Magnetic } from './Motion';
import HeroVideo from './HeroVideo';

/**
 * 첫 화면 — bom-on 히어로의 배치 치수 + 병원 실제 소개 영상.
 *
 * ══ 원본 실측 (1920×1080) ═══════════════════════════════════════
 *   마퀴 밴드   top 40px          ← 화면 맨 위
 *   글자        267px / line-height 1.0 / weight 400
 *
 * ★★ On/Off 토글 제거 (2026-08-21, 운영자: "on 버튼 없애고 문구 가운데에다가
 *    예약하기 버튼이랑 같이 넣어 전문적으로") ★★
 *    bom-on 의 서명이던 토글을 걷어내고, 영상은 항상 재생을 시도한다(꺼지지
 *    않는다). 문구+예약 버튼을 화면 가운데로 옮겨 더 정돈된 인상으로 갔다.
 *    STILLS 순환·진행 점(예전 '꺼짐' 상태 전용 UI)도 함께 걷어냈다 —
 *    다시 쓸 일이 생기면 git 이력(이 커밋 직전)에서 되살릴 수 있다.
 *
 * ⚠️ 영상 뒤에 사진을 항상 깐다 — 사내망·백신이 Vimeo 를 막는 환경이 있다.
 *    이 안전장치는 토글 제거와 무관하게 그대로 유지한다(HeroVideo.tsx 참조).
 */

/** 영상이 못 뜰 때(차단·오프라인)의 폴백 사진 한 장. */
const FALLBACK_STILL = INTERIOR[2];

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-[#0d1113]">
      <HeroVideo on stills={[FALLBACK_STILL]} index={0} />

      {/* 세로 스크림 — 헤더·스크롤 지시자 대비를 위해 위아래를 더 누른다. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(180deg,rgba(8,12,14,.62) 0%,rgba(8,12,14,.44) 44%,rgba(8,12,14,.84) 100%)',
        }}
      />

      {/*
        글 자리 대비용 중앙 스포트라이트.
        ⚠️ 좌표식은 아래 글 블록의 top 과 **같은 식**이다. 하나만 고치면 어긋난다.
        ⚠️ `clamp(...) * 1.2` 의 1.2 — 마퀴 실제 렌더 높이는 폰트 크기 그대로가 아니라
           디센더 여백(20%, Motion.tsx LetterMarquee 참조)만큼 더 크다.
        ★ 문구가 가운데로 오면서(2026-08-21) x 좌표도 50%(화면 중앙)로 맞췄다 —
          예전엔 왼쪽 정렬 문구 위치(7.24vw + 11rem)에 맞춰 비대칭이었다.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(42rem 16rem at 50% calc(76px + 4vh + clamp(56px, 13.9vw, 268px) * 1.2 + 44px + 4rem), rgba(6,10,12,.95) 0%, rgba(6,10,12,.9) 44%, rgba(6,10,12,.52) 72%, rgba(6,10,12,0) 100%)',
        }}
      />

      {/* 마퀴 — 화면 맨 위. */}
      <div className="absolute inset-x-0 top-[calc(76px+4vh)] z-10">
        <LetterMarquee text={CLINIC.marquee} seconds={30} colorClass="text-brand-2" />
      </div>

      {/*
        소개 문구 + 예약 버튼 — 화면 가운데.
        ⚠️⚠️ 세로 위치를 **뷰포트 비율(svh)로 잡으면 안 된다** ⚠️⚠️
          마퀴 글자 크기는 화면 **폭**(13.9vw)을 따르는데 svh 로 잡으면 폭이 넓고
          세로가 짧은 창에서 마퀴와 겹친다(실측 1879×940, 회귀 이력 있음).
          → 마퀴의 실제 아래끝(헤더 76 + 4vh + 글자높이)에서 44px 띄운다.
        ★ 좌우는 50% + translateX(-50%) 로 가운데 정렬, 안의 글도 text-center.
      */}
      <div
        className="absolute inset-x-0 z-10 flex flex-col items-center px-6 text-center"
        style={{ top: 'calc(76px + 4vh + clamp(56px, 13.9vw, 268px) * 1.2 + 44px)' }}
      >
        {/*
          ★★ 짧은 태그라인 → 원래 소개 문구 (2026-08-21, 운영자: "여기를 원래
             동그라미치과 설명문구랑 예약하기 버튼으로 하자") ★★
             CLINIC.description 은 기존 홈페이지 문구를 그대로 옮긴 VERIFIED 값
             (lib/clinic.ts) — 여기서 새로 쓴 문구가 아니다.
        */}
        <h1 className="max-w-[440px] text-[clamp(15px,1.25vw,19px)] font-semibold leading-[1.7] tracking-[-0.01em] text-brand-2">
          {CLINIC.description}
        </h1>

        {/* 예약하기 — 기존 '오시는 길' 섹션과 같은 스타일(네이버 예약, 브랜드색 버튼). */}
        <div className="mt-8">
          <Magnetic>
            <a
              href={CLINIC.booking.naver}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full bg-brand px-8 py-3.5 text-[15px] font-bold text-white"
            >
              예약하기
            </a>
          </Magnetic>
        </div>

        {/* 지금 뜨는 영상이 뭔지 — 화면 낭독기·저속 회선에서도 맥락을 준다. */}
        <p className="mt-6 text-[13px] leading-[1.5] text-white/50">{VIDEO.title}</p>
      </div>

      {/* 스크롤 지시자 */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5 md:flex">
        <span className="text-[11.5px] tracking-[0.3em] text-white/45">SCROLL</span>
        <span className="bouncy block h-7 w-px bg-white/45" />
      </div>
    </section>
  );
}
