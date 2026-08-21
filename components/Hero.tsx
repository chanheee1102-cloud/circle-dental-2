'use client';

import { CLINIC, INTERIOR } from '@/lib/clinic';
import { FACTS } from '@/lib/aeo';
import { LetterMarquee, Magnetic, Lede } from './Motion';
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
 *    않는다). STILLS 순환·진행 점(예전 '꺼짐' 상태 전용 UI)도 함께 걷어냈다 —
 *    다시 쓸 일이 생기면 git 이력(이 커밋 직전)에서 되살릴 수 있다.
 *    (문구+예약 버튼은 가운데 정렬을 한 번 시도했다가 "안 어울린다"는 피드백으로
 *    다시 왼쪽 정렬로 되돌렸다 — 아래 Lede 블록 주석 참조.)
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
        ★★ 중앙 스포트라이트(어두운 타원) 제거 (2026-08-21, 운영자: "거무스름한
           효과 없애") ★★ 글이 흰색으로 바뀌면서(아래) 세로 스크림만으로도
           대비가 충분해 별도 어두운 얼룩이 필요 없어졌다.
      */}

      {/* 마퀴 — 화면 맨 위. */}
      <div className="absolute inset-x-0 top-[calc(76px+4vh)] z-10">
        <LetterMarquee text={CLINIC.marquee} seconds={30} colorClass="text-brand-2" />
      </div>

      {/*
        소개 문구 + 예약 버튼.
        ⚠️⚠️ 세로 위치를 **뷰포트 비율(svh)로 잡으면 안 된다** ⚠️⚠️
          마퀴 글자 크기는 화면 **폭**(13.9vw)을 따르는데 svh 로 잡으면 폭이 넓고
          세로가 짧은 창에서 마퀴와 겹친다(실측 1879×940, 회귀 이력 있음).
          → 마퀴의 실제 아래끝(헤더 76 + 4vh + 글자높이)에서 44px 띄운다.
        ★★ 가운데 정렬 → 다시 왼쪽 정렬 (2026-08-21, 운영자: "가운데 문구도
           별로야 ... 가운데 정렬 자체가 안 어울린다") ★★ 원래(bom-on 실측)
           좌표로 되돌렸다 — left: max(24px, 7.24vw).
        ⚠️ 아래 여백(44 → 24)과 폭(560 → 700)은 **하단 사실 띠와의 충돌을 실측하고
           정한 값이다.** 1879×940 처럼 폭이 넓고 세로가 짧은 창에서는 마퀴가
           313px 를 먹어 글 · 버튼 · 띠가 정확히 만난다(실측 18px 겹침 → 수정).
           둘 중 하나만 되돌리면 그 창에서 다시 겹친다.
      */}
      <div
        className="absolute z-10 max-w-[700px] px-6"
        style={{ top: 'calc(76px + 4vh + clamp(56px, 13.9vw, 268px) * 1.2 + 24px)', left: 'max(24px, 7.24vw)' }}
      >
        {/*
          ★★ 위쪽 눈금줄(eyebrow) 추가 (2026-08-21, 운영자: 참고 화면 —
             서울이고운치과의 "SEOUL EGOWOON DENTAL CLINIC | 윤정·파주" 줄과
             같은 느낌으로) ★★ 영문명 + 태그라인을 작게 얹는다. 둘 다 이미
             lib/clinic.ts 에 있는 VERIFIED 값이다.
          ⚠️ 여기에 지역(address.locality)을 넣지 않는다 — 바로 아래 소개 문구가
             "고양시 덕양구 화정동…" 으로 시작해서 같은 말이 두 번 나온다.
          ⚠️ 자간(0.22em)은 영문에만 건다 — 한글에 넓은 자간을 주면 글자가 흩어진다.
          ⚠️ 그림자를 뺐다가 실측에서 안 읽혔다 — 이 줄이 앉는 높이(화면 42% 근처)는
             배경 스크림이 0.44 로 가장 옅은 구간이라, 12px 얇은 글씨는 밝은 사진
             위에서 사라진다. 스크림을 더 어둡게 하면 사진이 죽으므로 글자 쪽에
             그림자를 준다.
        */}
        <p
          className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] font-bold text-brand-2"
          style={{ textShadow: '0 1px 12px rgba(6,10,12,.75)' }}
        >
          <span aria-hidden className="h-px w-8 shrink-0 bg-brand-2/70" />
          <span className="tracking-[0.22em]">{CLINIC.nameEn}</span>
          <span className="text-white/80">{CLINIC.tagline}</span>
        </p>

        {/*
          ★★ 짧은 태그라인 → 원래 소개 문구 (2026-08-21, 운영자: "여기를 원래
             동그라미치과 설명문구랑 예약하기 버튼으로 하자") ★★
             CLINIC.description 은 기존 홈페이지 문구를 그대로 옮긴 VERIFIED 값
             (lib/clinic.ts) — 여기서 새로 쓴 문구가 아니다.
          ★★ 줄바꿈 · 색 · 크기 조정 (2026-08-21, 운영자: "마침표에서 줄바꿈해,
             문구 흰색이 나을것 같아" 이후 "글자 크기·굵기가 어중간하다") ★★
             Lede 로 마침표·쉼표 뒤에서만 줄이 갈리게 했고(이 사이트 다른 본문이
             전부 쓰는 컴포넌트), 색은 흰색을 유지하되 크기·굵기를 캡션 수준
             (15~19px)에서 **소제목 수준**(clamp 22~32px, extrabold)으로 키워
             히어로의 실제 헤드라인으로 확실히 읽히게 했다.
        */}
        <Lede
          as="h1"
          text={CLINIC.description}
          className="mt-4 text-[clamp(22px,2.6vw,32px)] font-extrabold leading-[1.42] tracking-[-0.02em] text-white"
        />

        {/*
          ★★ 버튼 두 개 나란히 (2026-08-21, 운영자: 참고 화면처럼) ★★
             채운 예약 버튼(네이버 예약) + 테두리만 있는 전화 버튼. 기존
             '오시는 길' 섹션의 두 버튼(네이버 예약/카카오 문의)과 같은 어휘를
             재사용하되, 여기서는 전화가 더 즉각적인 문의 수단이라 카카오
             대신 전화번호를 넣었다(대표번호는 이미 VERIFIED 값).
        */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
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
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
            >
              <span aria-hidden>☎</span>
              {CLINIC.phone}
            </a>
          </Magnetic>
        </div>

        {/*
          ⚠️ 여기 있던 영상 제목 캡션은 뺐다 (2026-08-21) — 하단 사실 띠가 들어오면서
             1400×900 / 1879×940 에서 띠와 **실제로 겹쳤다**(실측). 화면 낭독기용
             설명은 이미 HeroVideo 의 iframe title 과 폴백 img alt 가 갖고 있으므로
             접근성 손실은 없다. 눈에 보이는 캡션만 없앤 것이다.
        */}
      </div>

      {/*
        ★★ 확인된 사실 띠 — 히어로 하단 밴드 (2026-08-21, 운영자: "의료진3명
           야간진료 뭐 저런거 저렇게 넣고", 참고 화면 서울이고운치과의 하단
           스펙 띠) ★★ 예전엔 히어로 아래 별도 섹션(#about)에서 큰 카운터
           숫자로 보여줬다. 여기서는 참고 화면처럼 압축된 형태로 옮겨
           스크롤 없이 히어로 안에서 바로 보이게 했다 — 값은 전부 lib/aeo.ts
           의 FACTS 그대로(지어낸 지표 없음). 스크롤 지시자 자리를 대신한다.
        ⚠️ "14:00까지" 는 세지 않는다 — 시각을 0 부터 세면 뜻이 달라진다(Counter
           미사용, 값을 그대로 출력).
        ⚠️⚠️ 여기에 Reveal(스크롤 등장)을 쓰면 **영원히 안 보인다** ⚠️⚠️
           Reveal 의 관찰 범위는 rootMargin '0 0 -8% 0' 이라 화면 아래 8% 를
           깎는다. 이 띠는 히어로 맨 아래(=화면 맨 아래)에 붙어 있어서 그
           깎인 영역 밖으로 나가지 못하고 opacity 0 인 채로 남는다 —
           실제로 한 번 그렇게 만들었다가 실측으로 잡았다(2026-08-21).
           첫 화면 요소는 '스크롤하면 나타나는' 게 아니라 '뜨자마자 올라오는'
           것이어야 한다 → 로드 즉시 도는 .menu-rise 를 쓴다(--d 로 시차).
      */}
      {/* ⚠️ 왼쪽 여백은 위 문구 블록과 **같은 식**이어야 한다 — 가운데 정렬
          (mx-auto)로 두면 1879 처럼 넓은 창에서 띠만 안쪽으로 밀려 기준선이
          어긋난다(실측: 본문 160px, 띠 250px). 문구 블록의 left(max(24px,7.24vw))
          + 그 안쪽 px-6(24px) 을 그대로 더한 값이다. 한쪽만 고치지 말 것. */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15"
        style={{ paddingLeft: 'calc(max(24px, 7.24vw) + 24px)', paddingRight: '24px' }}
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-4 py-5">
          {FACTS.map((s, i) => (
            <div
              key={s.label}
              className="menu-rise min-w-[92px]"
              style={{ '--d': `${420 + i * 70}ms` } as React.CSSProperties}
            >
              <dt className="text-[11.5px] font-bold tracking-[0.14em] text-white/60">{s.label}</dt>
              <dd className="mt-1.5 text-[15px] font-bold text-white">
                {s.value} <span className="font-normal text-white/65">{s.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
