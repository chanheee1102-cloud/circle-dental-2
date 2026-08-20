'use client';

import { useEffect, useState } from 'react';
import { CLINIC } from '@/lib/clinic';

/**
 * 퀵메뉴 — 오른쪽 아래, **동그란 버튼 세 개가 한 줄로.**
 *
 * ══ 여기까지 온 과정 (2026-08-20) ═════════════════════════════
 *   ① 넓은 화면 = 우측 세로 독 / 좁은 화면 = 하단 바  → 하단 바가 70px 영구 점유,
 *      세로 독은 본문과 부딪혀 1620px 임계폭 계산이 필요했다.
 *   ② 우측 하단으로 합치고 펼침/접힘을 뒀다  → 접었다 펴는 한 번이 군더더기였다.
 *   ③ 지금: **토글 없이 세 개가 늘 보인다.** 누르면 바로 간다.
 *
 * ★ 브랜드 색은 그대로 쓴다 — 카카오 노랑(#FEE500), 네이버 초록(#03C75A).
 *   이건 우리가 정하는 색이 아니라 **알아보는 색**이다. 병원 색으로 칠하면
 *   사용자가 그게 카톡인지 네이버인지 모른다.
 * ⚠️ 아이콘은 SVG 로 직접 그린다 — 아이콘 폰트나 외부 이미지를 붙이면 그거 하나 때문에
 *    네트워크 요청과 의존성이 늘고, 차단된 환경에서 빈 네모가 뜬다.
 * ⚠️ 히어로에서는 안 띄운다(420px 이후). 첫 화면의 On 토글과 서로 싸운다.
 */
export default function QuickMenu() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = [
    {
      key: 'kakao',
      label: '카카오톡 상담',
      href: CLINIC.booking.kakao,
      bg: '#FEE500',
      fg: '#3C1E1E',
      icon: <KakaoIcon />,
    },
    {
      key: 'booking',
      label: '네이버 예약',
      href: CLINIC.booking.naver,
      bg: '#03C75A',
      /* ⚠️ 흰 글자는 이 초록 위에서 2.25:1 — 어두운 글자로. 색은 그대로 둔다. */
      fg: '#0d2b18',
      icon: <span className="text-[14px] font-bold tracking-[-0.03em]">예약</span>,
    },
    {
      key: 'tel',
      label: `전화 상담 ${CLINIC.phone}`,
      href: CLINIC.phoneHref,
      bg: 'var(--color-brand)',
      fg: '#ffffff',
      icon: <PhoneIcon />,
    },
  ];

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 md:bottom-7 md:right-7"
      style={{
        opacity: show ? 1 : 0,
        visibility: show ? 'visible' : 'hidden',
        transform: show ? 'none' : 'translateY(12px)',
        transition: 'opacity .5s var(--ease-soft), transform .5s var(--ease-soft), visibility .5s',
      }}
    >
      {items.map((q, i) => (
        <a
          key={q.key}
          href={q.href}
          {...(q.key === 'tel' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          aria-label={q.label}
          title={q.label}
          className="grid h-[54px] w-[54px] place-items-center rounded-full shadow-[0_12px_30px_-12px_rgba(20,23,28,.65)] transition-transform duration-400 hover:-translate-y-1"
          style={{
            background: q.bg,
            color: q.fg,
            /* 하나씩 순서대로 떠오른다 — 셋이 동시에 튀어나오면 산만하다. */
            transitionDelay: show ? `${i * 70}ms` : '0ms',
          }}
        >
          {q.icon}
        </a>
      ))}
    </div>
  );
}

/** 카카오톡 — 말풍선. 공식 심볼의 실루엣만 단순화해 그렸다. */
function KakaoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor" aria-hidden="true">
      <path d="M12 3C6.9 3 2.8 6.3 2.8 10.3c0 2.6 1.7 4.9 4.3 6.2-.2.7-.7 2.5-.8 2.9-.1.5.2.5.4.4.2-.1 2.6-1.8 3.7-2.5.5.1 1.1.1 1.6.1 5.1 0 9.2-3.3 9.2-7.3S17.1 3 12 3Z" />
    </svg>
  );
}

/** 전화 — 수화기. */
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path
        d="M6.2 3.5h2.3l1.6 3.9-1.9 1.2a11.4 11.4 0 0 0 5.2 5.2l1.2-1.9 3.9 1.6v2.3a1.7 1.7 0 0 1-1.9 1.7C10.2 16.9 7.1 13.8 4.5 5.4A1.7 1.7 0 0 1 6.2 3.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
