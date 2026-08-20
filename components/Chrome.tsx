'use client';

import { useEffect, useState } from 'react';
import { CLINIC, NAV, PILLARS } from '@/lib/clinic';

/**
 * 헤더 + 전체화면 메뉴. (퀵메뉴는 components/QuickMenu.tsx 로 분리)
 *
 * ══ 원본(bom-on) 실측 배치 — 1920×1080 기준 ═══════════════════════
 *   헤더        흰 바가 화면 맨 위에 떠 있고 **로고가 가운데**, 우측에 햄버거
 *   좌측 드롭   시술 하나를 고르는 알약형 셀렉터
 *
 * ★ 흰 바인 것이 중요하다 — 그래야 병원의 **원본 로고(짙은 회색)** 를 그대로 쓸 수 있다.
 *   어두운 히어로 위에 투명 헤더를 두면 짙은 로고가 사라져서, 흰 로고를 따로 만들거나
 *   반전시켜야 한다. 원본이 흰 바를 쓴 이유가 아마 이것이다.
 *
 * 실측 옮긴 전환:
 *   .main-header  { transition: 0.7s }
 *   .header-inner { width 0.5s cubic-bezier(0.75,1.27,0.17,0.92) 0.2s }   ★ 1.27 = 되튐
 *   .gnb-outer { opacity 0.8s cubic-bezier(0.23,1,0.32,1) }
 *   .gnb-inner { 1.2s 0.2s }   .gnb_logo_bg { 0.5s 0.5s }
 *
 * ⚠️ 스크롤에 따라 헤더 높이를 바꾸면 떨림이 난다 — 들어가고 나오는 문턱을 벌린다(40/8).
 */
export default function Chrome() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState(0);
  const [pickOpen, setPickOpen] = useState(false);

  useEffect(() => {
    let on = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (!on && y > 40) { on = true; setSolid(true); }
      else if (on && y < 8) { on = false; setSolid(false); }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setPickOpen(false); } };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  return (
    <>
      {/* ══ 헤더 — 흰 바, 로고 가운데 ══ */}
      <header className={`site-header fixed inset-x-0 top-0 z-50 ${solid ? 'pt-0' : 'pt-4'}`}>
        <div
          className={`header-inner relative mx-auto flex items-center bg-white ${
            solid
              ? 'h-[68px] w-full rounded-none px-6 shadow-[0_8px_30px_-22px_rgba(20,23,28,.45)] md:px-10'
              : 'h-[76px] w-[min(1740px,calc(100%-32px))] rounded-[14px] px-6 md:px-9'
          }`}
        >
          {/* 좌 — 시술 셀렉터 (원본 'On 미니 아이리프팅' 자리) */}
          <div className="relative hidden shrink-0 md:block">
            <button
              type="button"
              onClick={() => setPickOpen((v) => !v)}
              aria-expanded={pickOpen}
              className="flex items-center gap-2.5 text-[16px] font-semibold tracking-[-0.02em] text-ink"
            >
              <span className="display text-[20px] italic text-brand">On</span>
              {PILLARS[pick].name}
              <span
                className="text-[10px] text-brand"
                style={{ transform: pickOpen ? 'rotate(180deg)' : 'none', transition: 'transform .3s var(--ease-soft)' }}
              >
                ▼
              </span>
            </button>
            <ul
              className="absolute left-[-14px] top-[calc(100%+16px)] w-[248px] overflow-hidden rounded-[10px] bg-white py-2.5 shadow-[0_18px_50px_-24px_rgba(20,23,28,.5)]"
              style={{
                opacity: pickOpen ? 1 : 0,
                visibility: pickOpen ? 'visible' : 'hidden',
                transform: pickOpen ? 'none' : 'translateY(-8px)',
                transition: 'opacity .34s var(--ease-soft), transform .34s var(--ease-soft), visibility .34s',
              }}
            >
              {PILLARS.map((p, i) => (
                <li key={p.key}>
                  <button
                    type="button"
                    onClick={() => { setPick(i); setPickOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[15.5px] text-ink-2 transition-colors hover:text-brand"
                  >
                    <span className="display text-[17px] italic text-brand">On</span>
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 중앙 — 원본 로고 */}
          <a
            href="#top"
            aria-label={`${CLINIC.name} 홈`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/logo.png"
              alt={CLINIC.name}
              className={`w-auto transition-all duration-700 ${solid ? 'h-[34px]' : 'h-[40px]'}`}
            />
          </a>

          {/* 우 — 전화 + 햄버거 */}
          <div className="ml-auto flex shrink-0 items-center gap-4">
            <a href={CLINIC.phoneHref} className="hidden text-[16px] font-bold tabular-nums text-ink lg:block">
              {CLINIC.phone}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="메뉴 열기"
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-surface"
            >
              <span className="flex flex-col gap-[6px]">
                <span className="block h-[2px] w-[22px] bg-brand" />
                <span className="block h-[2px] w-[22px] bg-brand" />
                <span className="block h-[2px] w-[22px] bg-brand" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/*
        퀵메뉴는 components/QuickMenu.tsx 로 옮겼다 — 오른쪽 **아래 모서리** 한 벌.
        예전에는 넓은 화면 = 우측 세로 독, 좁은 화면 = 화면 폭 전체 하단 바 였는데
          · 하단 바가 모든 화면에서 70px 을 영구히 차지했고
          · 세로 독은 본문과 부딪혀 1620px 이라는 임계폭 계산이 필요했다.
        아래 모서리는 본문이 거의 안 지나가는 자리라 문턱 계산이 통째로 사라진다.
      */}

      {/* ══ 전체화면 메뉴 — 3겹 시차 ══ */}
      <div className={`gnb-outer fixed inset-0 z-[70] bg-ink ${open ? 'open' : ''}`}>
        <div className="gnb-logo-bg pointer-events-none absolute inset-0 grid place-items-center">
          <span className="display text-[38vw] leading-none text-white/[0.04]">C</span>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="메뉴 닫기"
          className="absolute right-6 top-6 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-10 md:top-8"
        >
          <span className="relative block h-4 w-4">
            <span className="absolute left-0 top-1/2 block h-[1.5px] w-4 rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 block h-[1.5px] w-4 -rotate-45 bg-current" />
          </span>
        </button>

        <div className="gnb-inner relative flex h-full flex-col justify-center">
          <div className="shell">
            <p className="t-eyebrow mb-10 text-white/60">Menu</p>
            <ul className="space-y-3 md:space-y-5">
              {NAV.map((n, i) => (
                <li key={n.href}>
                  <a href={n.href} onClick={() => setOpen(false)} className="gnb-item group flex items-baseline gap-5 text-white">
                    <span className="w-8 shrink-0 text-[13px] tabular-nums text-white/35">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="relative inline-block text-[clamp(30px,5.4vw,66px)] font-bold leading-tight tracking-[-0.035em]">
                      {n.label}
                    </span>
                    <span className="display hidden text-[19px] text-white/30 md:inline">{n.en}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 text-[14.5px] text-white/55">
              <a href={CLINIC.phoneHref} className="text-[20px] font-bold tabular-nums text-white">
                {CLINIC.phone}
              </a>
              <span>{CLINIC.address.full}</span>
              <span>{CLINIC.nearestStation}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
