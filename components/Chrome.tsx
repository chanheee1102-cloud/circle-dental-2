'use client';

import { useEffect, useState } from 'react';
import { CLINIC, NAV, PILLARS, INTERIOR } from '@/lib/clinic';

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
  /* 전체화면 메뉴에서 지금 펼쳐 보고 있는 묶음 */
  const [menuAt, setMenuAt] = useState(0);

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

        {/*
          ══ 메뉴 (2026-08-20 운영자: "메뉴도 좀 깔끔하게") ══

          ★★ 6개를 큰 글씨로 세로로 쌓던 것을 **묶음 격자**로 바꿨다 ★★
            전에는 목록이 화면 한가운데를 세로로 가로지르고, 각 항목은 그 아래
            무엇이 있는지 알려 주지 않았다. 방문자가 '증상으로 찾기' 를 눌러
            목록 페이지로 들어간 다음에야 뭐가 있는지 알 수 있었다.
            묶어서 펼치면 **메뉴 한 화면에서 사이트 전체가 보인다.**
          ★ 왼쪽 사진은 봄온과 같은 장치다 — 글자만 가득한 화면에 숨 쉴 곳을 만든다.
          ⚠️ 여기 있는 경로는 전부 실제 라우트여야 한다. 메뉴의 죽은 링크는
             사이트가 관리되지 않는다는 신호다.
          ⚠️ 좁은 화면에서는 사진을 감춘다(hidden lg:block). 사진 때문에 메뉴가
             스크롤돼야 한다면 그 사진은 방해물이다.
        */}
        {/*
          ⚠️⚠️ 스크롤 상자에 justify-center 를 걸면 안 된다 ⚠️⚠️
            내용이 화면보다 길어지면 가운데 정렬이 **위쪽을 음수 방향으로 밀어내고**,
            그 부분은 스크롤로도 닿을 수 없다. 실제로 모바일에서 첫 묶음이 통째로 잘렸다.
            바깥은 스크롤만, 안쪽은 min-h-full 로 두고 세로 가운데를 잡는다 —
            짧으면 가운데, 길면 위에서부터 자연스럽게 흐른다.
        */}
        {/*
          ══ 메뉴 — 3단 (2026-08-20 운영자, SPACE DERMATOLOGY 참고) ══
            [ 브랜드 | 대분류 | 선택한 분류의 상세 ]

          ★ 오른쪽 칸은 가운데에서 고른 것에 따라 **아래에서 올라오며** 바뀐다.
            홈의 'Ask us' 카드가 올라오는 것과 같은 결이다(y 이동 + 시차).
          ★ 대분류에 마우스를 올리면 바뀐다 — 누르지 않아도 그 아래에 뭐가 있는지 보인다.
            누르면 그 분류의 대표 페이지로 간다.
          ⚠️ 마우스가 없는 기기에는 3단이 성립하지 않는다. 좁은 화면(lg 미만)에서는
             네 묶음을 그냥 다 펼친다 — 고르는 단계 없이 바로 보이는 게 낫다.
          ⚠️ hover 뿐 아니라 focus 에도 반응해야 한다. 키보드로 훑는 사람에게
             hover 만 걸면 오른쪽 칸이 영영 안 바뀐다.
          ⚠️⚠️ 스크롤 상자에 justify-center 를 걸지 말 것 ⚠️⚠️
             내용이 화면보다 길면 가운데 정렬이 위쪽을 스크롤 범위 밖으로 밀어낸다.
             (실제로 모바일에서 첫 묶음이 통째로 잘렸다.) min-h-full 로 잡는다.
        */}
        <div className="gnb-inner relative h-full overflow-y-auto overscroll-contain">
          <div className="flex min-h-full items-center py-24">
            <div className="shell w-full">
              {/* ── 넓은 화면: 3단 ── */}
              <div className="hidden lg:grid lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)_minmax(0,1fr)]">
                {/* ① 브랜드 */}
                <div className="pr-10">
                  <p className="text-[21px] font-bold tracking-[-0.03em] text-white">{CLINIC.name}</p>
                  <p className="display mt-2.5 text-[12px] tracking-[0.24em] text-brand-2">{CLINIC.nameEn}</p>
                  <a href={CLINIC.phoneHref} className="mt-9 block text-[25px] font-bold tabular-nums text-white">
                    {CLINIC.phone}
                  </a>
                  <p className="mt-3 text-[13px] leading-[1.8] text-white/60">{CLINIC.address.full}</p>
                </div>

                {/* ② 대분류 */}
                <ul className="border-l border-white/15 pl-12">
                  {MENU.map((g, i) => (
                    <li key={g.title}>
                      <a
                        href={g.items[0].href}
                        onClick={() => setOpen(false)}
                        onMouseEnter={() => setMenuAt(i)}
                        onFocus={() => setMenuAt(i)}
                        aria-current={menuAt === i}
                        className="group flex items-center gap-3 py-3.5"
                      >
                        {/* 지금 보고 있는 자리 표시 — 화살표는 색맹과 무관하게 읽힌다 */}
                        <span
                          aria-hidden
                          className="display w-4 shrink-0 text-[15px] text-brand-2 transition-all duration-500"
                          style={{ opacity: menuAt === i ? 1 : 0, transform: menuAt === i ? 'none' : 'translateX(-6px)' }}
                        >
                          ›
                        </span>
                        <span
                          className={`text-[clamp(21px,2vw,29px)] font-bold leading-tight tracking-[-0.035em] transition-colors duration-400 ${
                            menuAt === i ? 'text-white' : 'text-white/55 group-hover:text-white'
                          }`}
                        >
                          {g.title}
                        </span>
                        {/* ⚠️ /40 은 ink 위에서 3.86:1 — 13px 은 4.5:1 이 필요하다. */}
                        <span className="display text-[13px] text-white/65">{g.en}</span>
                      </a>
                    </li>
                  ))}
                </ul>

                {/* ③ 상세 — 아래에서 올라온다 */}
                <ul key={menuAt} className="border-l border-white/15 pl-12">
                  {MENU[menuAt].items.map((it, n) => (
                    <li key={it.href} className="menu-rise" style={{ '--d': `${n * 55}ms` } as React.CSSProperties}>
                      <a
                        href={it.href}
                        onClick={() => setOpen(false)}
                        className="block py-3 text-[17px] leading-snug text-white/70 transition-colors duration-300 hover:text-white"
                      >
                        {it.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── 좁은 화면: 네 묶음을 다 펼친다 ── */}
              <div className="lg:hidden">
                <p className="t-eyebrow text-white/60">Menu</p>
                <div className="mt-8 grid gap-x-8 gap-y-11 sm:grid-cols-2">
                  {MENU.map((g) => (
                    <nav key={g.title} aria-label={g.title}>
                      <p className="flex items-baseline gap-2.5 border-b border-white/15 pb-4 text-[18px] font-bold tracking-[-0.03em] text-white">
                        {g.title}
                        <span className="display text-[13px] font-normal text-brand-2">{g.en}</span>
                      </p>
                      <ul className="mt-4 space-y-1">
                        {g.items.map((it) => (
                          <li key={it.href}>
                            <a
                              href={it.href}
                              onClick={() => setOpen(false)}
                              className="block py-2 text-[16px] leading-snug text-white/70 transition-colors hover:text-white"
                            >
                              {it.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  ))}
                </div>
                <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-white/15 pt-8 text-[14px] text-white/60">
                  <a href={CLINIC.phoneHref} className="text-[22px] font-bold tabular-nums text-white">
                    {CLINIC.phone}
                  </a>
                  <span>{CLINIC.address.full}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * 메뉴 묶음.
 * ⚠️ 경로는 전부 app/ 아래 실제 라우트와 대조해 적었다.
 *    메뉴의 죽은 링크는 사용자에게도 크롤러에게도 관리되지 않는 사이트라는 신호다.
 * ★ 순서는 '환자가 자기 상태를 말하는 순서' 다 — 증상 → 진료 → 알아두기 → 병원.
 *   병원 소개를 맨 앞에 두는 배치는 병원 편의지 방문자 편의가 아니다.
 */
const MENU = [
  {
    title: '증상·질환',
    en: 'Symptom',
    items: [
      { label: '증상으로 찾기', href: '/insight/symptom' },
      { label: '질환으로 찾기', href: '/insight/condition' },
      { label: '치료 과정 미리보기', href: '/insight/journey' },
      { label: '자주 묻는 질문', href: '/faq' },
    ],
  },
  {
    title: '진료',
    en: 'Treatment',
    items: [
      { label: '전체 진료', href: '/treatment' },
      { label: '자연치아살리기', href: '/treatment/save-natural-tooth' },
      { label: '임플란트', href: '/treatment/implant' },
      { label: '잇몸치료', href: '/treatment/periodontal' },
      { label: '사랑니치료', href: '/treatment/wisdom-tooth' },
      { label: '어린이 진료', href: '/treatment/pediatric' },
    ],
  },
  {
    title: '미리 알아두기',
    en: 'Insight',
    items: [
      { label: '알아두면 좋은 것', href: '/insight' },
      { label: '비용 기준', href: '/insight/cost' },
      { label: '용어 사전', href: '/insight/glossary' },
    ],
  },
  {
    title: '병원 안내',
    en: 'Clinic',
    items: [
      { label: '진료시간', href: '/#hours' },
      { label: '오시는 길', href: '/#visit' },
      { label: '의료진', href: '/#doctors' },
      { label: '진료 공간', href: '/#interior' },
    ],
  },
] as const;
