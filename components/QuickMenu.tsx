'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CLINIC } from '@/lib/clinic';

/**
 * 우측 고정 퀵메뉴.
 *
 * ★ 실제 병원 홈페이지에 있던 요소다. 국내 병원 사이트에서 관습적으로 쓰이고,
 *   실제로 전환의 상당 부분이 여기서 나온다 — 본문 어디를 읽고 있든 전화·길찾기가 한 번에 닿는다.
 * ★ 모바일에서는 세로 목록 대신 **하단 고정 바**로 바뀐다.
 *   좁은 화면에서 우측 세로 메뉴는 본문을 가리고 엄지로 닿기도 어렵다.
 * ★ TOP 버튼은 스크롤이 내려갔을 때만 나타난다. 맨 위에서 '맨 위로' 는 의미가 없다.
 */
export function QuickMenu() {
  /*
   * ★ 여닫는 상태를 없앴다 (2026-08-27 오너) — 버튼 넷이 늘 떠 있으므로 열 이유가 없다.
   *   hovering / pinned / canHover / Esc 닫기가 전부 이 때문에 사라졌다.
   * ⚠️ 되살릴 거면 상자(배경 판)도 함께 되살려야 한다. 상자 없이 접으면 버튼이
   *    그냥 사라지는 것처럼 보인다.
   */
  const [showTop, setShowTop] = useState(false);
  /*
   * ★★ 전화상담을 '누르면 번호가 뜨는' 것으로 (2026-09-11 오너) ★★
   *   이 레일은 2xl(1536px) 이상, 즉 PC 에서만 뜨는데 PC 에는 거는 장치가 없다.
   *   `tel:` 만 걸려 있으면 눌러도 대개 아무 일이 없고, 누른 사람에게는 고장 난 버튼이다.
   *   번호를 이름 밑에 상시로 적어 봤지만(같은 날, 되돌림) 좁은 레일에 숫자가 꽉 차
   *   답답했다. 그래서 **평소엔 이름만, 누르면 번호 판**으로 바꾼다.
   */
  const [phoneOpen, setPhoneOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /*
   * 팝업 닫기 — Esc 와 바깥 클릭.
   * ⚠️ 열려 있을 때만 듣는다. 늘 붙여 두면 페이지 전체의 클릭마다 헛일을 한다.
   * ⚠️ `mousedown` 으로 듣는다 — `click` 으로 들으면 레일 안의 링크를 누를 때
   *    먼저 닫히면서 링크가 사라져 이동이 씹히는 브라우저가 있다.
   */
  useEffect(() => {
    if (!phoneOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPhoneOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setPhoneOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
  }, [phoneOpen]);

  return (
    <>
      {/*
        ★★ 우측 세로 레일 → 오른쪽 아래 버튼 셋 (2026-08-14 운영자: "퀵메뉴가 좀 가린다") ★★

          레일은 화면 세로 가운데에 94px 폭으로 서 있었다. 본문 폭이 1,320px 라
          화면이 1,530px 보다 좁으면 **본문 오른쪽을 그대로 덮었다**(실측: 1,280px 에서 81px).
          게다가 여섯 개나 있어서 덮는 면적이 컸다.

          → 오른쪽 **아래 모서리**로 내리고 **셋만** 남긴다. 카톡·예약·전화.
            아래 모서리는 본문이 거의 없는 자리라 무엇도 가리지 않고,
            국내 사용자에게 가장 익숙한 떠 있는 버튼 자리이기도 하다.

          ★ 왜 이 셋인가 — 나머지(진료시간·오시는 길)는 **읽는 정보**라 헤더 메뉴와
            푸터에 이미 있다. 여기 남길 것은 **누르면 바로 행동이 되는 것**뿐이다.
          ★ 전화를 맨 아래(엄지에 가장 가까운 자리)에 두고 색을 채운다 —
            급한 사람이 가장 많이 누르는 버튼이다.
      */}
      {/*
        ★★ 떠 있는 버튼 셋 → 접히는 QUICK 레일 (2026-08-18 운영자, 참고 화면 제공) ★★

          직전 판은 카톡·예약·전화 세 개가 **항상 떠 있었다.** 위 주석이 레일을 걷어낸
          이유(본문을 가린다)가 규모만 줄어든 채 그대로 남아 있던 셈이다.
          이제 평소에는 동그란 QUICK 하나만 있고, 누르면 세로 레일이 올라온다.
          국내 병원 사이트에서 가장 익숙한 형태이고, 접혀 있을 때 가리는 면적이 56px 짜리
          원 하나로 줄어든다.

        ★ 접힌 상태에서 항목 넷을 다 넣어도 비용이 0 이라 **오시는 길을 되살렸다.**
          '읽는 정보라 헤더에 있다' 는 앞의 판단은 항상 떠 있을 때 이야기다.
        ★ 맨 위로 버튼은 **자리를 늘 비워 둔다.** 스크롤 600px 에서 나타날 때
          없던 자리가 생기면 아래 정렬이라 QUICK 이 통째로 위로 튄다(실제로 튀었다).
          그래서 `hidden` 이 아니라 투명도로만 감춘다.
        ⚠️ 접힘은 `visibility` 로 한다 — `opacity-0` 만 쓰면 안 보이는 링크에 Tab 이 들어간다.
      */}
      {/*
        ★★ 원본 홈페이지 형태로 (2026-08-27 오너: "그냥 이런식으로 하되 투명하게만 하자") ★★
          이름 글자와 구분선이 있는 세로 패널이다. 배경만 헤더·히어로 칩과 같은 투명 유리다.
        ★ 이름을 글자로 되살렸다 — 직전에는 동그란 아이콘만 있어서 눌러 봐야 아는 버튼이었다.
          링크 글자가 돌아오면서 앵커 텍스트도 함께 돌아온다.
        ⚠️⚠️ 자리를 화면 **세로 가운데**로 옮기지 말 것 ⚠️⚠️
          원본은 가운데에 세워 두는데, 2026-08-14 에 그것 때문에 되돌린 적이 있다 —
          본문 폭이 1,320px 라 화면이 1,530px 보다 좁으면 **본문 오른쪽을 그대로 덮는다**
          (실측: 1,280px 에서 81px). 오른쪽 아래 모서리는 본문이 거의 없는 자리다.
        ⚠️ 'QUICK MENU' 머리글은 넣지 않았다 — 한국어 화면의 영문 라벨은 장식일 뿐이고,
           세로 공간만 먹는다(components/home.tsx 의 눈썹 규칙과 같은 이유).
        ⚠️ backdrop-brightness 를 빼지 말 것 — 밝은 사진 위에서 흰 글자가 사라진다.
        ⚠️ 이 패널 **안쪽** 요소에 backdrop-filter 를 또 걸지 말 것. 겹치면 안쪽 것이 죽는다
           (메가메뉴에서 겪었다).
      */}
      {/*
        ⚠️ 재질은 .pane-glass 하나에 모여 있다(globals.css). 진료 카드와 같은 값을 쓴다.
        ⚠️⚠️ lg(1024px)로 되돌리지 말 것 (2026-09-02 실측) ⚠️⚠️
           이 레일은 폭 86 + 오른쪽 여백 20 = 106px 를 먹는데, 본문 상자는 최대 1320px 라
           **화면이 1548px 보다 좁으면 본문 오른쪽을 덮는다.** 1280·1366·1440 전부
           해당한다(실제로 미백 페이지 카드 글자를 가리고 있었다).
           2xl(1536) 부터는 좌우 여백이 108px 라 딱 비껴간다.
        ★ 그 아래 폭에서는 아래 고정 바가 같은 네 가지를 그대로 한다 — 없어지는 기능은 없다.
      */}
      {/*
        ⚠️ 레일을 감싸는 칸이 하나 더 있는 이유 — 전화 팝업이 레일 **왼쪽**에 서야 하는데,
           레일 자신은 모서리를 둥글리려고 overflow-hidden 이라 그 안에 두면 잘린다.
           칸은 자리만 잡고(고정), 그리는 것은 없다. `top-0` 으로 팝업이 레일 맨 위 항목
           (= 전화상담) 과 같은 높이에 선다 — 맨 위로 버튼이 생겼다 사라져도 안 어긋난다.
      */}
      <div ref={wrapRef} className="fixed right-5 bottom-7 z-40 hidden 2xl:block">
      <nav
        className="pane-glass w-[86px] flex-col overflow-hidden rounded-[22px] flex"
        aria-label="빠른 연락"
      >
        <RailPhoneButton open={phoneOpen} onToggle={() => setPhoneOpen((v) => !v)} />
        {RAIL.map((r) => (
          <RailItem key={r.label} {...r} />
        ))}
        {/* 맨 위로 — 스크롤이 어느 정도 내려가야 나타난다. */}
        {showTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="맨 위로"
            className="group flex w-full flex-col items-center gap-1.5 border-t border-brand-200 px-1 py-3.5 text-[13.5px] font-semibold text-ink transition-colors hover:text-white"
          >
            <span
              aria-hidden
              className="flex h-6 w-6 items-center justify-center text-[18px] leading-none transition-transform group-hover:-translate-y-0.5"
            >
              ↑
            </span>
            맨 위로
          </button>
        )}
      </nav>
      <PhonePopover open={phoneOpen} onClose={() => setPhoneOpen(false)} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-wine-line bg-wine-bg/95 backdrop-blur 2xl:hidden">
        <div className="grid grid-cols-4">
          <Link
            href="/visit"
            className="flex flex-col items-center gap-1.5 py-3 text-[13.5px] font-bold text-twilight"
          >
            <PinIcon />
            오시는 길
          </Link>
          <a
            href={CLINIC.booking.kakao}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 border-x border-wine-line py-3 text-[13.5px] font-bold text-twilight"
          >
            <KakaoIcon />
            카톡 상담
          </a>
          <a
            href={CLINIC.booking.naver}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 border-r border-wine-line py-3 text-[13.5px] font-bold text-twilight"
          >
            <NaverIcon />
            네이버 예약
          </a>
          <a
            href={CLINIC.phoneHref}
            className="flex flex-col items-center gap-1.5 bg-dusk py-3 text-[13.5px] font-semibold text-white"
          >
            <PhoneIcon />
            전화
          </a>
        </div>
      </div>
      {/*
        하단 고정 바가 본문 마지막 줄을 가리지 않게 만드는 여백.
        ⚠️⚠️ 두 가지가 틀려 있었다 (2026-09-03 실측) ⚠️⚠️
          ① 높이 66px 인데 바는 **73px** 이다 — 푸터 마지막 줄이 7px 가려졌다(16페이지 전부).
          ② 끄는 시점이 lg 인데 바는 2xl 까지 뜬다 — 1024~1535px 에서는 여백이 아예 없어
             바가 본문을 통째로 덮었다.
        ⚠️ 바의 안쪽 여백(py-3)이나 글자 크기를 바꾸면 이 숫자도 함께 잴 것. 둘은 한 쌍이다.
      */}
      <div aria-hidden className="h-[73px] 2xl:hidden" />
    </>
  );
}


/**
 * 레일 항목 — 데이터로 둔다. 지연 시간을 순서에서 계산해야 해서 배열이 필요하다.
 * ⚠️ 순서가 곧 화면 순서다. 전화가 맨 위인 것은 급한 사람이 가장 많이 누르기 때문이다.
 */
const RAIL = [
  /*
   * ⚠️ 네이버·카카오는 **브랜드 아이콘**을 쓴다(모바일 하단 바와 같은 것). 예전에는
   *    일반 달력/말풍선 아이콘이라 어디로 가는 버튼인지 색으로 알 수 없었다.
   * ⚠️ chip 은 그 서비스의 색이다. 전화·오시는 길은 브랜드가 없으므로 우리 색을 쓴다.
   */
  /*
   * ⚠️ 아이콘은 전부 currentColor(흰색)다. 브랜드 색 글리프를 쓰지 말 것 —
   *    유리 버튼 위에서 색만 튀고 재질이 어긋난다.
   * ⚠️ 이름 글자를 화면에 안 그리므로 label 이 유일한 이름이다(aria-label·title).
   */
  /*
   * ⚠️ 전화상담은 여기 없다 — 링크가 아니라 **번호 판을 여는 버튼**이라
   *    RailPhoneButton 으로 따로 있고, 레일 맨 위 자리도 그대로다(위 ⚠️ 의 '전화가 맨 위').
   */
  { href: CLINIC.booking.naver, label: '네이버예약', external: true, icon: <NaverIcon /> },
  { href: CLINIC.booking.kakao, label: '카톡상담', external: true, icon: <KakaoIcon /> },
  { href: '/visit', label: '오시는 길', internal: true, icon: <PinIcon /> },
];

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 17.5s5.6-4.6 5.6-9a5.6 5.6 0 1 0-11.2 0c0 4.4 5.6 9 5.6 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8.4" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M6.5 3.2 8.2 6.4 6.6 8.1a10.5 10.5 0 0 0 5.3 5.3l1.7-1.6 3.2 1.7v2.9c0 .7-.6 1.3-1.4 1.2C8.2 16.8 3.2 11.8 2.4 5c-.1-.8.5-1.4 1.2-1.4h2.9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function KakaoIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="15" height="15" rx="3.4" fill="#FEE500" />
      <path
        d="M10 5.6c-2.9 0-5.2 1.8-5.2 4.1 0 1.5 1 2.8 2.5 3.5l-.6 2.2c-.05.2.16.35.33.24l2.6-1.7c.12.01.24.02.37.02 2.9 0 5.2-1.8 5.2-4.2S12.9 5.6 10 5.6Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}
function NaverIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="15" height="15" rx="3.4" fill="#03C75A" />
      <path d="M7.4 13.4V6.6h1.9l2.2 3.4V6.6h1.9v6.8h-1.9L9.3 10v3.4H7.4Z" fill="#fff" />
    </svg>
  );
}

/**
 * QUICK 레일의 항목 하나 — 아이콘 위, 이름 아래.
 *
 * ★ 이름을 **항상 글자로 보여 준다.** 직전 판은 마우스를 올려야 이름이 펼쳐졌는데,
 *   레일 안에서는 그럴 이유가 없다(폭이 이미 고정이다). 아이콘만 있는 버튼은
 *   무엇인지 눌러 봐야 아는 버튼이다.
 * ★ 레일 아이콘은 **단색 선**으로 통일한다. 네이버 초록·카카오 노랑을 갈색 그라데이션
 *   위에 얹으면 스티커를 붙인 것처럼 보인다. 색이 든 원본 아이콘은 흰 바탕인
 *   모바일 하단 바에 그대로 남아 있다.
 */
/** 레일 항목과 같은 생김새 — 이 값을 두 곳이 쓰므로 한 줄로 묶어 둔다. */
const RAIL_CLS =
  'flex w-full flex-col items-center gap-1.5 px-1 py-3.5 text-[13.5px] font-semibold text-ink transition-colors hover:text-clay-700';

/**
 * 전화상담 — 누르면 번호 판을 여는 버튼.
 *
 * ★ 링크가 아니라 버튼인 이유는 위 phoneOpen 주석에 있다(PC 에는 거는 장치가 없다).
 * ⚠️ 레일 맨 위 항목이므로 위 구분선을 그리지 않는다.
 * ⚠️ aria-expanded 를 빼지 말 것 — 화면 낭독기에서 '눌러야 뭔가 열린다' 를 아는 유일한 단서다.
 */
function RailPhoneButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-haspopup="dialog"
      className={`${RAIL_CLS} outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-clay-700/60 ${
        open ? 'bg-brand-100 text-clay-700' : ''
      }`}
    >
      <span aria-hidden className="flex h-6 w-6 items-center justify-center">
        <PhoneIcon />
      </span>
      전화상담
    </button>
  );
}

/**
 * 번호 판 — 레일 왼쪽에 선다.
 *
 * ★ 담는 것은 번호와 '번호 복사' 하나뿐이다. PC 에서 필요한 동작이 그 둘뿐이라
 *   진료시간·주소까지 끌어오면 판이 또 하나의 페이지가 된다(그건 /visit 이 한다).
 * ⚠️ 번호는 `<a href="tel:">` 그대로 둔다 — 태블릿·통화 연동 브라우저에서는 눌러서 걸린다.
 *    PC 에서 안 걸리는 것이 문제였지 링크가 문제가 아니었다.
 * ⚠️ select-all: 드래그 한 번에 번호 전체가 잡힌다. 복사 버튼을 못 쓰는 환경의 대비책이다.
 */
function PhonePopover({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  /* 판이 닫히면 '복사했습니다' 도 지운다 — 다시 열었을 때 지난 흔적이 남아 있으면 안 된다. */
  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  /* ⚠️ 2초 뒤 되돌리는 타이머는 반드시 치운다. 연타하면 타이머가 쌓인다. */
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  if (!open) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CLINIC.phone);
      setCopied(true);
    } catch {
      /* 클립보드가 막힌 환경(비 HTTPS·권한 거부)에서도 번호는 이미 화면에 있다. 조용히 넘어간다. */
    }
  };

  return (
    <div
      role="dialog"
      aria-label="대표전화"
      className="pane-glass absolute top-0 right-full mr-3 w-[216px] rounded-[18px] p-4 shadow-[0_18px_40px_-20px_rgba(43,30,20,0.45)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12.5px] font-semibold tracking-wide text-ink/55">대표전화</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="-mt-1 -mr-1 flex h-7 w-7 items-center justify-center rounded-full text-[15px] leading-none text-ink/45 transition-colors hover:bg-brand-100 hover:text-ink"
        >
          ✕
        </button>
      </div>
      <a
        href={CLINIC.phoneHref}
        className="mt-1.5 block select-all text-[21px] font-bold tracking-tight text-ink tabular-nums"
      >
        {CLINIC.phone}
      </a>
      <button
        type="button"
        onClick={copy}
        className="mt-3 w-full rounded-full bg-clay-700 py-2 text-[13.5px] font-bold text-white transition-opacity hover:opacity-90"
      >
        {copied ? '복사했습니다' : '번호 복사'}
      </button>
      <p className="mt-2.5 text-[12px] leading-relaxed text-ink/55">
        진료시간은 <Link href="/visit" className="underline underline-offset-2 hover:text-ink">오시는 길</Link> 에 있습니다.
      </p>
    </div>
  );
}

/**
 * 퀵메뉴 항목 하나 — 아이콘 위, 이름 아래.
 *
 * ★ 이름을 **항상 글자로 보여 준다.** 아이콘만 있는 버튼은 눌러 봐야 아는 버튼이다.
 *   글자가 있으면 링크의 앵커 텍스트로도 남는다.
 * ⚠️ 네이버·카카오는 브랜드 아이콘이라 색을 그대로 둔다 — 색이 곧 '어디로 가는가' 다.
 * ⚠️ 첫 항목에는 위 구분선을 그리지 않는다. 패널 맨 위에 선이 하나 더 생긴다.
 */
function RailItem({
  href,
  label,
  icon,
  external,
  internal,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
  internal?: boolean;
}) {
  /* ⚠️ 맨 위는 언제나 전화상담 버튼이므로 이 항목들은 전부 위 구분선을 가진다.
        예전의 `first` 갈래는 그래서 필요 없어졌다 — 되살리지 말 것. */
  const cls = `${RAIL_CLS} border-t border-brand-200`;
  const body = (
    <>
      <span aria-hidden className="flex h-6 w-6 items-center justify-center">
        {icon}
      </span>
      {label}
    </>
  );
  if (internal) {
    return (
      <Link href={href} className={cls}>
        {body}
      </Link>
    );
  }
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className={cls}>
      {body}
    </a>
  );
}
function RailButton({
  href,
  label,
  icon,
  external,
  internal,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
  internal?: boolean;
}) {
  /*
   * ⚠️ 브랜드 색으로 채웠다가 **색 없는 유리로 바꿨다** (2026-08-27 오너: "배경색은 투명으로
   *    하고, 그냥 색갈 없이 가자"). 헤더 알약·히어로 칩과 같은 재질이라 화면에 재질이 하나다.
   * ⚠️ backdrop-brightness 를 빼지 말 것 — 밝은 사진 위에서 흰 아이콘이 사라진다.
   */
  const cls =
    'flex h-14 w-14 items-center justify-center rounded-full border border-white/25 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_34px_-16px_rgba(0,0,0,0.6)] backdrop-blur-[8px] backdrop-brightness-[0.55] backdrop-saturate-150 transition-colors hover:bg-white/10';
  const body = <span aria-hidden>{icon}</span>;
  if (internal) {
    return (
      <Link href={href} aria-label={label} title={label} className={cls}>
        {body}
      </Link>
    );
  }
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cls}
    >
      {body}
    </a>
  );
}
function CalendarIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="3" y="4.6" width="14" height="12.4" rx="2.2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8.4h14M7 3.2v2.8M13 3.2v2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 3.6c3.6 0 6.5 2.3 6.5 5.2 0 2.9-2.9 5.2-6.5 5.2-.5 0-1-.04-1.4-.12L5.2 16.2l.7-2.7C4.4 12.6 3.5 11.1 3.5 8.8c0-2.9 2.9-5.2 6.5-5.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
