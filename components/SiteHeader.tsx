'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV } from '@/lib/nav';
import { CLINIC } from '@/lib/clinic';
import { LogoLockup } from '@/components/Logo';
import { Sentences } from '@/components/ui';

/**
 * 전역 헤더.
 *
 * ★ 스크롤에 따라 두께와 그림자가 바뀐다 — 맨 위에서는 배경에 얹힌 듯 가볍게,
 *   내려가면 압축되면서 그림자가 생겨 본문 위에 떠 있다는 것이 분명해진다.
 *   고정 헤더가 항상 같은 모습이면 화면이 납작해 보인다.
 * ★ 전화번호를 데스크톱에서도 노출한다 — 치과 방문 결정의 마지막 한 걸음은 여전히 전화다.
 *
 * ★★ 드롭다운이 네 번 바뀌었다 — 지금 모습에 이른 경위 ★★
 *   ① 268px 상자에 이름만 세로로 쌓았다. 이름만 보고는 무엇을 하는 진료인지 알 수 없었다.
 *   ② 화면 폭을 다 쓰는 판. 설명은 보이게 됐지만 **내용이 화면 왼쪽에만** 몰려서,
 *      오른쪽 끝 메뉴를 눌렀는데 글자가 반대편에 나타났다. 누른 자리와 열린 자리가
 *      멀면 그 둘이 이어져 있다는 것을 눈이 못 잇는다.
 *   ③ 눌린 메뉴 아래에 600px 카드 하나. 위치는 맞았지만 **한 번에 한 그룹만** 보여
 *      전체 지도를 못 줬다.
 *   ④ 지금 (2026-09-02, 오너가 기존 홈페이지 화면을 보여 주며 이런느낌으로):
 *      판은 하나인데 **여섯 그룹이 한 번에**, 각 칸이 자기 메뉴의 가운데에 선다.
 *      ②의 넓이와 ③의 정렬을 동시에 만족하는 유일한 짜임이다.
 *   ⚠️ ①②③ 중 하나로 되돌리려면 위 이유부터 다시 볼 것 — 셋 다 겪고 버린 것들이다.
 *
 * ★ 열고 닫기 — hover, focus, Escape 셋 다 동작한다.
 *   키보드로 메뉴에 닿지 못하면 그 하위 페이지 전체가 닫힌 것과 같다.
 *   닫기는 헤더 전체에서 마우스가 나갈 때 한 번만 판정한다. 버튼과 판을 따로 감시하면
 *   그 사이 1px 를 지날 때 메뉴가 깜빡인다.
 */
export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  /** 모바일에서 펼쳐 놓은 그룹. 한 번에 하나만 — 전부 펼치면 접는 의미가 없다. */
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  /*
   * ★★ 첫 화면 위에서는 헤더를 투명하게 (2026-08-25 운영자: "아예 똑같이 해줘. 헤더랑 전부") ★★
   *   두 번째 버전처럼 사진이 화면 맨 위까지 이어지고 헤더가 그 위에 얹힌다.
   * ⚠️⚠️ 조건에서 pathname 을 빼지 말 것 ⚠️⚠️
   *   투명하게 만들면 로고·메뉴·전화번호를 전부 흰색으로 뒤집어야 하는데, 하위 페이지는
   *   맨 위가 밝은 크림색이라 흰 글자가 통째로 사라진다. 어두운 히어로가 깔린 홈에서,
   *   그것도 아직 안 내렸을 때만 투명이다.
   * ⚠️ 홈에서 이 모드가 성립하려면 히어로가 헤더 아래로 파고들어야 한다 —
   *   app/page.tsx 의 Hero 에 음수 위쪽 여백(-mt)이 그 짝이다. 한쪽만 고치면
   *   헤더 자리에 크림색 띠가 남거나 히어로가 헤더에 잘린다.
   */
  const pathname = usePathname();
  /*
   * ⚠️ 전에는 메뉴를 열면(openMenu) 사진 위 상태를 풀었다. 그때는 헤더가 **크림색 띠**로
   *    바뀌어야 흰 메가메뉴가 붙어 보였기 때문이다. 지금은 헤더가 떠 있는 유리판이라
   *    그럴 이유가 없고, 오히려 손을 올릴 때마다 어두운 유리 → 밝은 유리로 튄다.
   * ⚠️ 모바일 서랍(mobileOpen)은 여전히 뺀다 — 서랍이 크림색 판이라 위에 어두운 유리가
   *    얹히면 두 재질이 붙어 어색하다.
   */
  /*
   * ★ 히어로가 다시 어두워졌지만(2026-09-02) 알약은 **밝은 유리 그대로 둔다.**
   *   어두운 영상 위에서 밝은 유리 알약의 글자가 9.41:1 로 측정됐고(픽셀 실측),
   *   알약 안에 버건디→고동 예약 버튼이 들어와 있어 밝은 판이 그 버튼을 받쳐 준다.
   * ⚠️ 다시 켜려면 로고 tone · 메뉴 글자색 · 테두리 · 그림자 네 가지를 **함께** 뒤집어야
   *   한다(아래 overHero 분기 전부). 하나만 켜면 하위 페이지에서 흰 글자가 사라진다.
   */
  const overHero = false;

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Escape — 열린 판은 반드시 키보드로 닫을 수 있어야 한다. */
  useEffect(() => {
    if (!openMenu && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openMenu, mobileOpen]);

  /*
    Tab 으로 헤더 밖까지 빠져나가면 닫는다.
    ⚠️ relatedTarget 이 null 인 경우(창 밖으로 포커스가 나감)에도 닫아야 한다 —
       안 닫으면 다른 탭에 갔다 와도 판이 열린 채 남는다.
  */
  const onHeaderBlur = useCallback((e: React.FocusEvent<HTMLElement>) => {
    const next = e.relatedTarget as Node | null;
    if (!next || !headerRef.current?.contains(next)) setOpenMenu(null);
  }, []);

  /*
   * ★★ 메가메뉴 — 여섯 그룹을 **한 번에**, 각자 자기 메뉴 아래에 (2026-09-02 오너가
   *    기존 홈페이지 화면을 보여 주며: "헤더 메뉴 펼쳐질때 이런느낌으로") ★★
   *
   *   지난 두 판이 각각 반쪽이었다 —
   *     ① 화면 폭을 다 쓰는 판인데 **내용은 왼쪽에만** 몰려 있었다. 오른쪽 끝 메뉴를
   *        눌렀는데 글자가 반대편에 떠서, 둘이 이어져 있다는 것을 눈이 못 이었다.
   *     ② 그래서 눌린 메뉴 아래에 600px 카드 하나만 띄웠다. 위치는 맞았지만
   *        **한 번에 한 그룹만** 보여서 전체 지도를 못 준다.
   *   지금은 둘을 합친다 — 판은 하나지만 **각 그룹의 칸이 자기 메뉴의 가운데에 선다.**
   *
   * ⚠️⚠️ 칸 위치는 반드시 **실측**할 것 ⚠️⚠️
   *   메뉴 글자 길이가 제각각(치과소개 4자 ↔ 자연치아살리기 7자)이라 등분 격자로는
   *   절대 안 맞는다. 트리거의 실제 가운데를 재서 그 자리에 칸을 세운다.
   * ⚠️ 옮기는 것은 **칸**이지 판이 아니다 — 판은 backdrop-filter 를 쓰는데 transform 이
   *    걸리면 그 필터가 죽는다(알약 주석과 같은 이유).
   */
  const panelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [centers, setCenters] = useState<number[]>([]);

  useEffect(() => {
    if (!openMenu) return;
    const measure = () => {
      const panel = panelRef.current;
      const nav = navRef.current;
      if (!panel || !nav) return;
      const base = panel.getBoundingClientRect();
      /*
       * ⚠️ clientLeft(테두리 두께)를 빼 줄 것 — getBoundingClientRect 는 **테두리 바깥**을
       *    가리키는데, 절대배치 자식의 left 는 **테두리 안쪽**이 0 이다. 안 빼면 칸 전체가
       *    테두리 두께만큼(1px) 오른쪽으로 밀린다(실측으로 잡음).
       */
      const edge = panel.clientLeft;
      setCenters(
        [...nav.querySelectorAll<HTMLElement>('[data-nav-trigger]')].map((el) => {
          const r = el.getBoundingClientRect();
          return Math.round(r.left - base.left - edge + r.width / 2);
        }),
      );
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    /* ⚠️ scrolled 도 의존성이다 — 알약 높이가 바뀌면 트리거의 가로 위치도 미세하게 움직인다. */
  }, [openMenu, scrolled]);

  /**
   * 판 높이를 맡을 **가장 긴 그룹**(지금은 인사이트).
   * ⚠️ 항목 수가 같은 그룹이 여럿이면 앞의 것이 뽑힌다 — 높이만 쓰므로 어느 쪽이든 같다.
   */
  const tallest = NAV.reduce((a, b) =>
    (b.children?.length ?? 1) > (a.children?.length ?? 1) ? b : a,
  );

  return (
    <header
      ref={headerRef}
      onMouseLeave={() => setOpenMenu(null)}
      onBlur={onHeaderBlur}
      /*
       * ⚠️ 바깥 <header> 는 **아무것도 안 그린다.** 배경도 테두리도 없다.
       *    여기에 배경이나 그라디언트를 다시 넣으면 상자가 끝나는 자리에 가로줄이 생긴다
       *    (2026-08-27 에 실제로 생겼던 그 선이다).
       */
      className="sticky top-0 z-50"
    >
      {/*
        ⚠️ 여기에 여백(py)을 주지 말 것 — 띠가 화면 끝까지 닿아야 하고, 높이는 띠 자신이 진다.
           여백을 주면 그만큼 헤더 전체 높이가 늘어 히어로의 음수 여백과 어긋난다.
      */}
      <div className="relative">
        {/*
          ★★ 떠 있는 알약 → **화면을 가로지르는 띠** (2026-09-02 오너: "그냥 헤더를
             양옆 끝까지 펼치고 조금 키워줘") ★★
            알약은 2026-08-27 에 참고 사이트를 따라 넣은 것이었다. 그런데 메가메뉴를
            화면 폭으로 펼치고 나니 **좁은 알약 밑에 넓은 띠**가 붙는 모양이 됐다 —
            폭이 어긋나면 둘이 하나의 물건으로 안 읽힌다. 띠로 통일한다.
          ⚠️⚠️ 띠 높이(68 / 94)를 바꾸면 히어로의 음수 여백도 함께 바꿀 것 ⚠️⚠️
            app/page.tsx · AboutHero · TreatmentShell · ui.tsx 의 `-mt-[68px] sm:-mt-[94px]`
            가 **헤더 전체 높이와 같은 값**이어야 한다. 한쪽만 고치면 헤더 자리에 빈 띠가
            남거나 히어로가 헤더에 잘린다.
          ⚠️ 사진 위(overHero)와 밝은 면에서 재질이 반대다. 한쪽만 고치지 말 것.
          ⚠️ overflow-hidden 을 주지 말 것 — 메가메뉴가 이 띠 밖으로 내려와야 한다.

          ★★ 더 투명하게 (2026-08-27, 오너: "내가 보낸것처럼 더 투명하게") ★★
            색을 얹어 어둡게 하면 판이 **불투명한 회색 네모**가 된다. 참고 사이트의 판은
            뒤가 훤히 비치는데도 글자가 읽힌다 — 색을 얹는 대신 **뒤 배경 자체를 눌러서**다.
            backdrop-brightness 가 그 역할을 한다. 판은 비쳐 보이고 대비는 남는다.
          ⚠️ 얹는 색(gradient)을 다시 올리지 말 것 — 그 순간 투명함이 사라진다.
          ⚠️ 반대로 brightness 를 1 에 가깝게 되돌리면 밝은 사진 위에서 글자가 무너진다.
             값을 만지면 반드시 실측할 것 — 사진 위 글자는 CSS 만 봐선 알 수 없다.
        */}
        <div
          className={`transition-all duration-300 ${
            overHero
              ? // 사진 위 — 뒤가 훤히 비쳐야 한다. 흐림을 약하게 두어 형체가 남고,
                //   밝기만 눌러 흰 글자의 대비를 만든다.
                'border-b border-white/16 bg-[linear-gradient(180deg,rgba(23,23,26,0.30),rgba(23,23,26,0.10))] backdrop-blur-[7px] backdrop-brightness-[0.76] backdrop-saturate-150'
              : // ⚠️ 흐림을 줄이지 말 것 — 어두운 글자는 밝기를 눌러도 안 지워지므로,
                //    옅은 면 + 약한 흐림이면 본문이 헤더 글자와 겹쳐 읽힌다(실제로 겪었다).
                'border-b border-charcoal/25 bg-[linear-gradient(180deg,rgba(254,255,252,0.90),rgba(254,255,252,0.78))] backdrop-blur-[40px] backdrop-saturate-[1.6] shadow-[0_10px_24px_-18px_rgba(43,30,20,0.35)]'
          }`}
        >
          {/* ⚠️ 띠는 화면 폭, 내용은 본문 폭 — 안쪽 상자만 max-w 를 진다. */}
          <div
            className={`mx-auto flex w-full max-w-[1320px] items-center justify-between gap-6 px-5 transition-all duration-300 lg:px-8 ${
              // ⚠️ 히어로의 -mt-[68px] sm:-mt-[94px] 와 **같은 값**이어야 한다.
              scrolled ? 'h-[60px] sm:h-[74px]' : 'h-[68px] sm:h-[94px]'
            }`}
          >
        {/*
          ⚠️ 실시간 '진료 중' 배지를 뺐다 (2026-08-14 운영자: "저거 라이브도 빼줘").
             자동으로 여닫힘을 판정하는 표시는 **공휴일·임시 휴진을 알 수 없다**
             (lib/openStatus.ts 주석에 적어 둔 한계다). 쉬는 날 "진료 중" 이라고 떠 있으면
             그 표시 하나가 환자를 헛걸음시킨다 — 없는 편이 낫다.
             진료시간은 푸터와 /visit 에 정확히 적혀 있다.
             ⚠️ 되살리려면 그 한계(공휴일 판정 불가)부터 해결할 것.
        */}
        <div className="flex items-center gap-3">
          {/*
            ⚠️ 데스크톱 알약 안에서는 **마크만** 쓴다 — 워드마크(214px)가 알약을 두 배로 벌린다.
               좁은 화면은 알약이 화면 폭을 다 쓰므로 워드마크를 그대로 둔다.
            ⚠️ 링크와 aria-label 은 양쪽 다 같다 — 마크만 보여도 병원명은 읽힌다.
          */}
          <Link href="/" aria-label={`${CLINIC.name} 홈`} className="transition-opacity hover:opacity-80">
            <LogoLockup tone={overHero ? 'light' : 'brand'} />
          </Link>
        </div>

        {/*
          ★★ 판을 화면 폭에서 → **누른 메뉴 바로 아래** 로 (2026-08-14 운영자) ★★
            화면 전체를 덮는 흰 판에 내용은 왼쪽 끝에만 있어서, '내원 안내' 를 눌렀는데
            글자는 화면 반대편에 나타났다. 누른 자리와 열린 자리가 멀면 그 둘이
            이어져 있다는 것을 눈이 못 잇는다.
            → 각 메뉴가 자기 아래에 카드를 띄운다. 눌린 곳에서 바로 펼쳐지므로
              어느 메뉴에서 나온 것인지 위치만으로 분명하다.
          ⚠️ 카드를 감싼 껍데기의 위쪽 여백(pt-2.5)을 지우지 말 것 —
             버튼과 카드 사이에 빈틈이 생기면 마우스가 그 틈을 지날 때 hover 가 끊겨
             카드가 닫힌다. 여백이 껍데기 안에 있어야 마우스가 계속 안에 머문다.
        */}
        {/*
          ★★ 메뉴를 알약 하나에 담는다 (2026-08-27) ★★
            GIC 의 표식 중 하나가 **50px 알약 안에 든 메뉴**다. 줄글처럼 늘어놓던 메뉴가
            하나의 덩어리가 되면서 헤더가 '바' 가 아니라 '얹힌 물건' 으로 읽힌다.
          ⚠️ overflow-hidden 을 주지 말 것 — 메가메뉴가 이 알약 밖으로 내려와야 한다.
          ⚠️ 사진 위(overHero)에서는 알약을 그리지 않는다. 반투명 흰 알약이 사진 위에
             떠 있으면 헤더가 두 겹으로 보인다.
        */}
        {/*
          ⚠️ 유리판 안이므로 메뉴 알약에 테두리를 두지 않는다 — 상자 안의 상자가 된다.
             열린 항목만 옅은 면으로 표시한다.
        */}
        <nav
          ref={navRef}
          /*
            ⚠️ 메뉴 사이 간격을 좁히지 말 것 — 아래 메가메뉴의 칸이 **각 메뉴의 가운데**에
               서기 때문에, 메뉴가 붙으면 칸끼리 겹친다(2026-09-02 실측: gap-0.5 에서
               1·2번 칸이 겹쳤다). 띠가 화면 폭이라 자리는 넉넉하다.
          */
          className="hidden items-center gap-2 lg:flex xl:gap-4"
          aria-label="주 메뉴"
        >
          {NAV.map((item) => {
            const open = openMenu === item.label;
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.children ? item.label : null)}
              >
                {/*
                  ⚠️ 밑줄 표시를 뺐다 — 알약 안에서는 밑줄이 알약 테두리에 붙어 지저분해진다.
                     열린 항목은 **옅은 면**으로 표시한다. 채운 dusk 로 하면 메뉴 하나가
                     버튼처럼 보여 진짜 버튼(예약하기)과 다툰다.
                  ⚠️ 굵기를 500 으로 되돌리지 말 것 (2026-09-02 피드백: "헤더 메뉴 기존꺼
                     최대한 강조"). '굵기로 강조하지 않는다' 는 본문 규칙인데, 메뉴는 본문이
                     아니라 **조작부**라 예외로 둔다. 500 일 때는 배경에 묻혀 무엇을 누를 수
                     있는지 잘 안 보였다.
                */}
                <Link
                  href={item.href}
                  /* ⚠️ 이 표식으로 칸 위치를 잰다(위 실측 주석). 지우면 판이 왼쪽에 몰린다. */
                  data-nav-trigger=""
                  onFocus={() => setOpenMenu(item.children ? item.label : null)}
                  aria-expanded={item.children ? open : undefined}
                  className={`relative inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-[18px] font-bold transition-colors xl:px-5 ${
                    overHero
                      ? open
                        ? 'bg-white/14 text-white'
                        : 'text-white hover:text-white'
                      : open
                        ? 'bg-charcoal/8 text-charcoal'
                        : 'text-charcoal hover:text-clay-700'
                  }`}
                >
                  {item.label}
                  {item.children && <Chevron open={open} />}
                </Link>

              </div>
            );
          })}
        </nav>

        {/*
          ★★ 헤더 버튼 두 개도 알약형으로 (2026-08-14 운영자: "헤더 버튼들도 좀 바꿔") ★★
            히어로의 두 버튼을 알약형으로 바꿨는데 헤더만 각진 사각(rounded-lg)이라
            같은 화면에서 두 가지 버튼 언어가 섞여 있었다. 첫 화면에 보이는 버튼 넷은
            같은 모양이어야 한다.
          ★ 높이를 h-10 으로 **둘 다 못 박는다**. 전화 버튼에만 테두리가 있어
            여백으로 맞추면 1px 씩 어긋난다(히어로에서 겪은 것과 같은 문제다).
          ★ 무게로 나눈다 — 전화는 테두리만, 예약은 채운다.
            헤더가 거의 흰 바탕이라 채운 초록 버튼이 가장 먼저 눈에 든다.
        */}
        <div className="flex items-center gap-2">
          {/*
            ★★ 예약하기 버튼을 알약 맨 오른쪽에 **되돌렸다** (2026-09-02 오너:
               "헤더 맨 오른쪽에 예약하기 버튼은 있어야지") ★★
               2026-08-27 에 뺐던 이유는 "전화번호 버튼(약 170px) + 예약 버튼" 둘을 넣어
               알약이 두 배로 벌어져서였다. 그래서 **예약 하나만** 되돌린다 —
               전화는 히어로 보조 버튼·퀵메뉴·모바일 서랍·푸터에 그대로 있다.
            ⚠️ 전화번호 버튼을 여기 함께 넣지 말 것. 그러면 그때 그 문제가 그대로 돌아온다.
            ⚠️ lg 미만에서는 숨긴다 — 좁은 화면은 알약이 화면 폭을 다 쓰는 데다
               바로 아래 하단 고정 바에 같은 버튼이 있다.
          */}
          <a
            href={CLINIC.booking.naver}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="예약하기 — 네이버 예약 새 창으로 열기"
            className="hidden shrink-0 items-center gap-1.5 rounded-full bg-clay-700 px-5 py-2.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90 lg:inline-flex"
          >
            예약하기
            <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] border sm:h-11 sm:w-11 lg:hidden ${
              overHero ? 'border-white/40 text-white' : 'border-wine-line text-charcoal'
            }`}
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={mobileOpen}
          >
            <span className="text-lg leading-none">{mobileOpen ? '✕' : '☰'}</span>
          </button>
          </div>
        </div>
        </div>

        {/*
          ★★ 메가메뉴는 띠 **밖**에 그린다 ★★
            띠가 backdrop-filter 를 쓰기 때문에, 그 안에 있으면 판의 backdrop-filter 가
            통째로 죽는다(위 띠 주석 참고). 밖으로 빼야 판도 뒤를 눌러 글자를 살릴 수 있다.
          ⚠️ 그래도 <header> 의 자손으로는 남겨야 한다 — 밖으로 빼면 띠에서 판으로
             마우스를 옮기는 순간 header 의 onMouseLeave 가 떠서 메뉴가 닫힌다.
          ★ 어느 메뉴를 열어도 판은 한 자리에 뜬다 — 메뉴를 가로질러도 판이 움직이지 않는다.
        */}
        {openMenu && (
          /*
            ⚠️ 위쪽 여백을 다시 넣지 말 것 — 헤더가 띠가 되면서 띠와 판이 맞붙었다.
               사이를 띄우면 그 틈으로 뒤 배경(어두운 히어로)이 비쳐 검은 줄이 생기고,
               마우스가 그 틈을 지날 때 hover 가 끊겨 판이 닫힌다.
            ★★ 판도 띠와 같은 화면 폭이다 (2026-09-02 오너: "다 펼쳐지게 해") ★★
               헤더가 띠가 되면서 이 판의 부모가 이미 화면 폭이라, 폭을 되찾는 장치가
               필요 없어졌다(전에는 ml-[calc(50%-50vw)] + w-screen 으로 폈다).
            ⚠️ 다시 폭을 손대야 하면 transform 은 쓰지 말 것 — backdrop-filter 의 기준을
               새로 만들어 **판의 흐림이 죽는다.** 음수 margin 으로 편다.
          */
          <div className="absolute top-full right-0 left-0 z-10 hidden lg:block">
            <div
              ref={panelRef}
              className="mega-in relative w-full overflow-hidden border-b border-charcoal/12 bg-[linear-gradient(180deg,rgba(254,255,252,0.94),rgba(254,255,252,0.86))] px-4 py-8 shadow-[0_18px_40px_-22px_rgba(43,30,20,0.35)] backdrop-blur-[40px] backdrop-saturate-[1.6]"
              onMouseLeave={() => setOpenMenu(null)}
            >
              {/*
                판 높이를 잡는 **유령 칸**.
                ⚠️⚠️ 숫자로 높이를 적지 말 것 ⚠️⚠️
                  칸이 전부 절대배치라 부모가 높이를 못 잡는다. 전에는 92 + 줄수×36 으로
                  계산했는데, 글꼴·여백을 한 번만 손대도 아래가 남거나 잘린다.
                  여기서는 **가장 긴 그룹을 그대로 한 벌 더 그려** 높이를 맡긴다 —
                  메뉴가 늘든 여백이 바뀌든 언제나 정확히 맞는다.
                ⚠️ aria-hidden + invisible — 보이지도 읽히지도 않고 자리만 차지한다.
              */}
              {/* ⚠️ w-0 — 판이 화면 폭이라 이 유령 칸이 왼쪽 끝에서 가로로 넘칠 수 있다. */}
              {/*
                ⚠️⚠️ w-0 을 주지 말 것 (2026-09-02 실측) ⚠️⚠️
                  폭을 0 으로 만들면 글자가 **한 자씩 접혀** 유령 칸이 세로로 폭발하고,
                  판이 그만큼 높아진다(화면 절반이 빈 채로 늘어났다).
                  판에 이미 overflow-hidden 이 있으므로 폭은 그냥 두면 된다.
              */}
              <div aria-hidden className="invisible">
                <ul className="space-y-3">
                  {(tallest.children ?? []).map((c) => (
                    <li key={c.href} className="text-[16.5px]">
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>
              {NAV.map((item, i) => {
                const kids = item.children ?? [];
                return (
                  <nav
                    key={item.href}
                    aria-label={`${item.label} 하위 메뉴`}
                    /*
                      ⚠️ 가운데 정렬은 transform 으로 한다 — 이 칸에는 backdrop-filter 가
                         없으므로 안전하다. 판 자체에 걸면 판의 흐림이 죽는다.
                      ⚠️ left 는 실측값이다(useEffect). 등분 격자로 바꾸지 말 것.
                    */
                    className="absolute top-9 -translate-x-1/2 text-center"
                    style={{ left: centers[i] ?? 0, opacity: centers.length ? 1 : 0 }}
                  >
                    {/*
                      ⚠️⚠️ 여기에 그룹 이름을 다시 적지 말 것 (2026-09-02 오너) ⚠️⚠️
                        바로 위 띠에 같은 이름이 있고, 이 칸은 그 메뉴의 **가운데**에 서 있다.
                        위치가 이미 "이 칸은 저 메뉴의 것" 이라고 말한다.
                      ⚠️ 어느 메뉴를 가리키는지 표시하는 것도 띠가 한다(알약 배경).
                         여기서 또 표시하면 지금 없앤 그 중복이 되살아난다.
                    */}
                    <ul className="space-y-3">
                      {kids.map((c) => (
                        <li key={c.href}>
                          {/* ⚠️ 바깥 링크는 새 창 — lib/nav.ts 의 external 표시를 그대로 따른다. */}
                          <Link
                            href={c.href}
                            target={'external' in c && c.external ? '_blank' : undefined}
                            rel={'external' in c && c.external ? 'noopener noreferrer' : undefined}
                            onClick={() => setOpenMenu(null)}
                            className="block text-[16.5px] whitespace-nowrap text-ink-soft transition-colors hover:text-ink"
                          >
                            {c.label}
                            {'external' in c && c.external ? (
                              <span aria-hidden className="ml-1 opacity-70">↗</span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="border-t border-wine-line bg-wine-bg lg:hidden">
          {/*
            ★★ 예약·전화를 메뉴 맨 위에 (2026-08-14 운영자) ★★
              헤더에서 예약 버튼을 뺐으니 그 행동이 갈 곳이 있어야 한다. 메뉴를 연 사람은
              찾으러 온 사람이라, 목록을 훑기 전에 바로 할 수 있는 두 가지를 먼저 둔다.
          */}
          <div className="mx-auto max-w-[1320px] px-5 pt-4">
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={CLINIC.booking.naver}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                aria-label="예약하기 — 네이버 예약 새 창으로 열기"
                className="inline-flex items-center justify-center rounded-[8px] bg-dusk px-4 py-3.5 text-[16px] font-semibold text-parchment"
              >
                예약하기
              </a>
              <a
                href={CLINIC.phoneHref}
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-ink/40 card-glass px-4 py-3.5 text-[16px] font-semibold text-charcoal"
              >
                <PhoneIcon />
                {CLINIC.phone}
              </a>
            </div>
          </div>

          {/*
            ★★ 모바일은 접었다 편다 (2026-08-14) ★★
              항목이 스물다섯 개다. 전부 펼쳐 두면 메뉴를 연 순간 화면이 글자로 가득 차고
              원하는 곳을 찾으려면 한참을 굴려야 한다. 그룹만 보여 주고 누른 것만 편다.
            ★ 그룹 이름은 **버튼**이지 링크가 아니다 — 누르면 펴지는 것과 이동하는 것이
              같은 자리에 있으면 어느 쪽이 일어날지 알 수 없다. 그룹 페이지로 가는 길은
              펼쳐진 안에 '전체 보기' 로 따로 둔다.
            ⚠️ 메뉴가 길어질 수 있으므로 높이를 화면 안으로 제한하고 스크롤을 준다 —
               안 그러면 마지막 항목이 화면 밖으로 나가 닿지 못한다.
          */}
          <nav
            className="mx-auto max-h-[calc(100dvh-140px)] max-w-[1320px] overflow-y-auto px-5 py-4"
            aria-label="모바일 메뉴"
          >
            {NAV.map((item) => {
              const expanded = mobileGroup === item.label;
              return (
                <div key={item.href} className="border-b border-wine-line last:border-0">
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMobileGroup(expanded ? null : item.label)}
                        aria-expanded={expanded}
                        className="flex w-full items-center justify-between gap-3 py-4 text-left text-[16.5px] font-black text-charcoal"
                      >
                        {item.label}
                        <Chevron open={expanded} />
                      </button>

                      {expanded && (
                        <ul className="pb-3">
                          <li>
                            <Link
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center gap-2 py-2.5 text-[15px] font-black text-ash"
                            >
                              전체 보기
                              <span aria-hidden>→</span>
                            </Link>
                          </li>
                          {item.children.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                target={c.external ? '_blank' : undefined}
                                rel={c.external ? 'noopener noreferrer' : undefined}
                                onClick={() => setMobileOpen(false)}
                                className="block border-t border-mist-soft py-2.5"
                              >
                                <span className="block text-[15.5px] font-bold text-charcoal">
                                  {c.label}
                                </span>
                                {c.desc && (
                                  <span className="mt-0.5 block text-[13.5px] text-ash">
                                    <Sentences text={c.desc} />
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 text-[16.5px] font-black text-charcoal"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

/**
 * 메뉴 카드 — 누른 메뉴 바로 아래에 떠오르는 흰 카드.
 *
 * 위에 그룹 이름과 '전체 보기' 가 한 줄로 마주 보고, 그 아래 항목이 두 칸으로 깔린다.
 * 항목마다 이름 + 한 줄 설명이 함께 있어 눌러 보기 전에 무엇인지 안다.
 *
 * ⚠️ 카드 안의 링크를 누르면 반드시 카드를 닫는다(onNavigate). Next.js 는 페이지를 갈아
 *    끼우는 방식이라 헤더가 다시 마운트되지 않는다 — 안 닫으면 이동한 뒤에도 떠 있다.
 */
function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      focusable="false"
      className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden focusable="false">
      <path
        d="M5.2 2.5 6.6 5 5.3 6.4a8.4 8.4 0 0 0 4.3 4.3L11 9.4l2.5 1.4v2.3c0 .6-.5 1-1.1.9C6.6 13.4 2.6 9.4 1.9 4.6c-.1-.6.3-1.1.9-1.1h2.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
