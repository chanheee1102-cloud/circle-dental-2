'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CLINIC } from '@/lib/clinic';

/**
 * 대표전화 번호 판 — 누르면 뜨는 작은 판. **두 곳이 같은 것을 쓴다.**
 *
 * ★ 왜 판인가 (2026-09-11 오너) — 전화 버튼이 `tel:` 링크뿐이면 거는 장치가 없는 PC 에서는
 *   눌러도 아무 일이 없다. 누른 사람에게는 고장 난 버튼이다. 번호를 아예 화면에 상시로
 *   적어도 봤지만(되돌림) 좁은 자리에 숫자가 꽉 차 답답했다.
 *   → 평소엔 이름/버튼만, **누르면 번호가 뜬다.**
 *
 * ★ 쓰는 곳 두 군데 —
 *     ① 우측 퀵메뉴 레일의 전화상담 (components/QuickMenu.tsx)
 *     ② 헤더 예약하기 오른쪽의 전화 버튼 (components/SiteHeader.tsx)
 *   ⚠️⚠️ 한쪽만 고치지 말 것 ⚠️⚠️ 같은 화면에 같은 판이 두 벌 있으면, 하나만 바뀐 순간
 *        같은 물건이 두 가지로 보인다. 고칠 것이 있으면 **이 파일 하나만** 고친다.
 *
 * ★ 담는 것은 번호와 '번호 복사' 뿐이다. 진료시간·주소까지 끌어오면 판이 또 하나의
 *   페이지가 된다 — 그건 /visit 이 한다(그래서 링크만 한 줄 둔다).
 */

/**
 * 여닫는 상태와 바깥 클릭·Esc 처리.
 *
 * ⚠️⚠️ `wrapRef` 는 **버튼과 판을 함께** 감싼 칸에 걸어야 한다 ⚠️⚠️
 *   버튼이 이 칸 밖에 있으면 버튼을 누를 때 '바깥 클릭' 으로 먼저 닫히고,
 *   이어서 click 이 토글을 해 다시 열린다 — 눌러도 안 닫히는 판이 된다.
 * ⚠️ 열려 있을 때만 듣는다. 늘 붙여 두면 페이지의 모든 클릭이 헛일을 한다.
 * ⚠️ `mousedown` 으로 듣는다 — `click` 으로 들으면 판 안의 링크를 누를 때 먼저 닫히면서
 *    링크가 사라져 이동이 씹히는 브라우저가 있다.
 */
export function usePhonePopover() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  /* ⚠️ useCallback 을 빼지 말 것 — 헤더가 이 함수를 useEffect 의존성으로 쓴다.
        매 렌더마다 새 함수면 그 effect 가 무한히 다시 돈다. */
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  return { open, wrapRef, toggle, close };
}

/**
 * 번호 판 본체.
 *
 * @param className 자리 잡는 값만 넘긴다(absolute·top·right 따위). 재질·크기는 여기가 진다 —
 *                  부르는 쪽마다 다르게 주면 두 판이 서로 달라진다.
 */
export function PhonePopover({
  open,
  onClose,
  className = '',
}: {
  open: boolean;
  onClose: () => void;
  className?: string;
}) {
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
      /*
        ⚠️⚠️ 재질을 .pane-glass 로 되돌리지 말 것 (2026-09-11) ⚠️⚠️
          헤더 쪽 판은 **헤더 띠 안**에 있는데 그 띠가 이미 backdrop-filter 를 쓴다.
          backdrop-filter 를 쓰는 요소 안에서 backdrop-filter 를 또 걸면 안쪽 것이
          통째로 죽는다(globals.css 의 .card-glass 주석 — 메가메뉴에서 겪은 것과 같다).
          그러면 퀵메뉴 판은 흐리고 헤더 판은 안 흐린, 같은데 다른 판 두 개가 된다.
          → 흐림에 기대지 않는 **거의 불투명한 베이지**로 둔다. 두 곳이 똑같이 보인다.
      */
      className={`w-[216px] rounded-[18px] border border-brand-200 bg-[linear-gradient(135deg,#f7f2e9,#efe8db)] p-4 shadow-[0_18px_40px_-18px_rgba(43,30,20,0.5)] ${className}`}
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
      {/*
        ⚠️ `tel:` 링크를 벗기지 말 것 — 태블릿·통화 연동 브라우저에서는 눌러서 걸린다.
           PC 에서 안 걸리는 것이 문제였지 링크가 문제가 아니었다.
        ⚠️ select-all — 드래그 한 번에 번호 전체가 잡힌다. 복사 버튼이 막힌 환경의 대비책이다.
      */}
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
        진료시간은{' '}
        <Link href="/visit" className="underline underline-offset-2 hover:text-ink">
          오시는 길
        </Link>{' '}
        에 있습니다.
      </p>
    </div>
  );
}

/**
 * 수화기 글리프 — 헤더·퀵메뉴·모바일 바가 **같은 획**을 쓴다.
 *
 * ⚠️ 한 화면에 다른 수화기가 두 개 있으면 서로 다른 물건으로 읽힌다. 새로 그리지 말 것.
 * ⚠️ currentColor 를 고정 색으로 바꾸지 말 것 — 사진 위에서는 흰색, 밝은 면에서는 먹색이다.
 */
export function PhoneGlyph({ size = 22, stroke = 1.5 }: { size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M6.5 3.2 8.2 6.4 6.6 8.1a10.5 10.5 0 0 0 5.3 5.3l1.7-1.6 3.2 1.7v2.9c0 .7-.6 1.3-1.4 1.2C8.2 16.8 3.2 11.8 2.4 5c-.1-.8.5-1.4 1.2-1.4h2.9Z"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinejoin="round"
      />
    </svg>
  );
}
