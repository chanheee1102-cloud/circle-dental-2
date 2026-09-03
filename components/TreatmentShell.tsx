import Image from 'next/image';
import { CLINIC } from '@/lib/clinic';
import { Container, Breadcrumb, Sentences } from '@/components/ui';

/*
 * 진료과목 페이지의 공통 껍데기 (2026-09-01 오너: "진료 메뉴 전체를 충치치료 페이지 디자인으로").
 *
 * ★★ 무엇이 문제였나 ★★
 *   진료 페이지 아홉 곳이 머리말을 저마다 손으로 그려 뒀다. 어떤 곳은 가운데 정렬,
 *   어떤 곳은 왼쪽 정렬, 눈썹 글씨도 알약·점·맨글씨가 뒤섞여 있었다.
 *   같은 메뉴 안에서 페이지를 넘길 때마다 다른 사이트처럼 보였다.
 *
 * ★ 기준은 충치치료 페이지다 — 가운데 정렬, 사진 위 두 겹 덮개, 금색 눈썹, 큰 제목,
 *   두 개의 버튼, 그 아래 세 칸 띠.
 *
 * ⚠️⚠️ 덮개를 걷지 말 것 (2026-09-02, 다섯 번째 판) ⚠️⚠️
 *   덮개를 없애려는 시도를 세 번 했고 세 번 다 반려됐다.
 *     ① 글을 사진 밖으로  → "이거 배경으로 들어가야지 영상"
 *     ② 흰 덮개 + 진한 글자 → "왜 배경에 흐릿하게 생기는거야"
 *     ③ 덮개 0 + 흰 판     → "그냥 원본 느낌으로 가는데"
 *   흰 글자를 사진 위에 올리는 구조에서 덮개는 **선택이 아니라 조건**이다.
 * ⚠️ 덮개 색은 중성 먹색(SCRIM)이다. 갈색으로 바꾸면 사진이 누렇게 뜬다.
 * ⚠️ 눈썹은 13.5px 라 가장 먼저 깨진다. 값을 낮추면 반드시 실측할 것.
 */

/**
 * 사진 위 두 겹 덮개의 기준색 — night(#241a12) 을 rgba 로 적은 것이다.
 * ⚠️ 갈색·붉은색으로 바꾸지 말 것. 중성 먹색이라야 사진이 제 색으로 보인다.
 */
const SCRIM = '30,28,25';

export interface HeroPhoto {
  src: string;
  alt: string;
  /** 사진에서 살릴 부분. 얼굴이 잘리면 여기로 옮긴다. */
  position?: string;
}

export function TreatmentHero({
  trail,
  eyebrow,
  title,
  lead,
  photo,
}: {
  trail: { name: string; path: string }[];
  /** 금색 한 줄 — 지역명 + 진료명 + 확인되는 자격까지. */
  eyebrow: string;
  /** 줄 단위로 넘긴다. 줄마다 아래에서 밀려 올라온다(.line-rise). */
  title: string[];
  lead: string;
  photo?: HeroPhoto;
}) {
  return (
    /* ⚠️ 음수 margin + 같은 값의 padding — 띠가 헤더 뒤까지 올라간다. 수치를 페이지마다 바꾸지 말 것. */
    /* ⚠️ 휴대폰 값(pt-[112px] pb-16)은 버튼을 감춘 뒤 다시 잡은 것이다 — 되돌리면 첫 화면에
         빈 자리가 남는다. sm 부터는 예전 값 그대로다. */
    <section className="relative isolate -mt-[68px] overflow-hidden bg-night pt-[112px] pb-16 sm:-mt-[94px] sm:pt-[154px] sm:pb-16 sm:pb-24 lg:pb-32">
      {/* ⚠️ alt 는 비운다 — 장식 사진이다. 뜻은 아래 제목이 전부 진다. */}
      {photo && (
        <Image
          src={photo.src}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={photo.position ? { objectPosition: photo.position } : undefined}
        />
      )}

      {/* 두 겹 덮개 — 방사형(가운데를 살림) + 선형(위아래를 눌러 줌). */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(80% 64% at 50% 38%, rgba(${SCRIM},0.45) 0%, rgba(${SCRIM},0.76) 62%, rgba(${SCRIM},0.88) 100%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(${SCRIM},0.66) 0%, rgba(${SCRIM},0.40) 38%, rgba(${SCRIM},0.82) 100%)`,
        }}
      />
      {/* 위에서 스미는 금빛 — 강조색은 금색 하나뿐이다. 다른 색을 가져오지 말 것. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(56%_42%_at_50%_-6%,rgba(217,164,65,0.14)_0%,transparent_66%)]"
      />

      <Container className="relative text-center">
        {/* ⚠️ 손으로 다시 그리지 말 것 — 공용 부품이라야 규칙이 바뀔 때 같이 따라온다. */}
        <div className="mb-10 flex justify-center">
          <Breadcrumb trail={trail} tone="dark" />
        </div>

        <p className="enter text-[13.5px] font-black text-clay-200" style={{ animationDelay: '40ms' }}>
          {eyebrow}
        </p>

        <h1 className="line-rise reveal display-sm mx-auto mt-7 max-w-[16em] text-[clamp(32px,5.4vw,62px)] leading-[1.14] tracking-[-0.03em] text-parchment">
          {/*
            ⚠️ 줄 끝의 공백 한 칸을 지우지 말 것 (2026-09-01) — 제목을 줄마다 span 으로
              쪼개면 기계가 읽는 문자열이 '어떤 경우에어떤 진료를' 처럼 붙어 버린다.
          */}
          {title.map((line, i) => (
            <span key={line}>
              <span>{i < title.length - 1 ? `${line} ` : line}</span>
            </span>
          ))}
        </h1>

        <p
          className="enter mx-auto mt-8 max-w-[34em] text-[18px] leading-[1.9] text-parchment/85"
          style={{ animationDelay: '320ms' }}
        >
          {/* ⚠️ tone="dark" 를 빼지 말 것 — 빼면 강조가 밝은 면용 짙은 금색으로 나와 2.69:1 이 된다. */}
          <Sentences text={lead} tone="dark" />
        </p>

        {/*
          ★★ 휴대폰에서는 감춘다 (2026-09-03 오너: "밑에 저렇게 예약버튼이랑 전화버튼있으니깐
             저 예약하기랑 전화번호 없애도 되지 않을까 모바일은") ★★
             하단 고정 바(components/QuickMenu.tsx)에 네이버 예약과 전화가 **늘 떠 있다.**
             같은 두 가지를 첫 화면에서 또 크게 보여 주면 그만큼 제목과 설명이 밀린다.
          ⚠️ sm 부터는 되살린다 — 태블릿·데스크톱은 자리가 넉넉하고, 넓은 화면(2xl)에서는
             하단 바가 옆 세로 막대로 바뀌어 눈에 덜 띈다.
        */}
        <div className="enter mt-10 hidden flex-wrap justify-center gap-3 sm:flex" style={{ animationDelay: '440ms' }}>
          <a
            href={CLINIC.booking.naver}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-parchment px-8 py-4 text-[17px] font-semibold text-dusk transition-opacity hover:opacity-90"
          >
            진료 예약하기 <span aria-hidden>→</span>
          </a>
          <a
            href={CLINIC.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-parchment/80 px-8 py-4 text-[17px] font-semibold tabular-nums text-parchment transition-colors hover:bg-white/10"
          >
            {CLINIC.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}

/**
 * 머리말 바로 아래 세 칸 띠 — 한 단 올린 어두운 면.
 * ⚠️ 지어낸 숫자를 쓰지 않는다. 이 병원이 실제로 하는 일만 적는다.
 */
export function TreatmentStrip({
  items,
}: {
  items: { k: string; t: string; d?: string }[];
}) {
  return (
    <section className="border-y border-brand-200/70 bg-parchment py-10 sm:py-14 lg:py-20">
      <Container>
        {/*
          ★★ 칸 사이 세로 구분선 (2026-09-02 오너: "이렇게 구분선 들어가면 좋을 거 같아여") ★★
            셋을 여백만으로 나눠 두면 넓은 화면에서 **한 줄 문장처럼 이어져 읽힌다.**
            선이 들어가면 '따로 선 세 가지' 라는 것이 글을 읽기 전에 보인다.
          ⚠️ 첫 칸에는 선이 없다 — 선은 칸의 개수가 아니라 **사이의 개수**만큼 필요하다.
             모든 li 에 border-l 을 걸면 컨테이너 왼쪽 끝에 선이 하나 더 생긴다.
          ⚠️ 좁은 화면에서는 가로선으로 뒤집는다. 한 줄로 쌓이는데 세로선을 그으면
             글자 왼쪽에 짧은 막대만 남는다.
          ⚠️ gap 을 세로(gap-y)로만 준다 — 가로 gap 이 있으면 선이 칸 사이 한가운데가
             아니라 오른쪽 칸에 붙어 보인다. 가로 숨은 px-8 이 맡는다.
          ⚠️ items-stretch(격자 기본값)를 끄지 말 것 — 칸 높이가 다르면 선 길이도 달라진다.
        */}
        <ul className="reveal-stack grid gap-y-9 sm:grid-cols-3 sm:gap-y-0">
          {items.map((f, i) => (
            <li
              key={f.t}
              className={`reveal ${
                i === 0
                  ? 'sm:pr-8'
                  : 'border-t border-brand-300/60 pt-9 sm:border-t-0 sm:border-l sm:border-brand-300/70 sm:px-8 sm:pt-0 sm:last:pr-0'
              }`}
            >
              {/* ⚠️ 2026-09-02 오너: "하단 글씨 전체적으로 크기 키우고". 되돌리지 말 것 —
                  눈썹 11.5px / 제목 19px 이던 자리다. 히어로 바로 아래라 그만큼 작아 보였다. */}
              <p className="text-[13px] font-black tracking-[0.06em] text-clay-700">{f.k}</p>
              <p className="mt-3 text-[22px] font-black tracking-[-0.02em] text-ink sm:text-[23.5px]">
                {f.t}
              </p>
              {f.d && (
                <p className="mt-3.5 max-w-[24em] text-[17px] leading-[1.8] text-twilight"><Sentences text={f.d} /></p>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
