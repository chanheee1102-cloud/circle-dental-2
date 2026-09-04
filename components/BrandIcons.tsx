/**
 * **브랜드 마크 세 개** — 전화 · 카카오 · 네이버.
 *
 * ★ 왜 따로 뺐나 (2026-09-04) — 하단 퀵메뉴(components/QuickMenu.tsx)와 페이지 마무리의
 *   예약 단추가 같은 마크를 쓴다. 두 벌로 두면 한쪽만 고쳐져 색이 갈라진다.
 * ⚠️ 카카오 노랑(#FEE500)·네이버 초록(#03C75A)은 **브랜드 규정 색**이다. 사이트 팔레트에
 *    맞춘다고 바꾸지 말 것 — 색이 곧 '어디로 가는가' 이고, 바꾸면 알아볼 수 없다.
 * ⚠️ 전화 마크만 currentColor 다. 이건 브랜드가 아니라 우리 아이콘이라 놓이는 면을 따른다.
 */
export function PhoneIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M6.5 3.2 8.2 6.4 6.6 8.1a10.5 10.5 0 0 0 5.3 5.3l1.7-1.6 3.2 1.7v2.9c0 .7-.6 1.3-1.4 1.2C8.2 16.8 3.2 11.8 2.4 5c-.1-.8.5-1.4 1.2-1.4h2.9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KakaoIcon({ size = 22 }: { size?: number }) {
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

export function NaverIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="15" height="15" rx="3.4" fill="#03C75A" />
      <path d="M7.4 13.4V6.6h1.9l2.2 3.4V6.6h1.9v6.8h-1.9L9.3 10v3.4H7.4Z" fill="#fff" />
    </svg>
  );
}

/**
 * **마무리 예약 단추 석 장** — 전화 · 카카오톡 · 네이버.
 *
 * ★★ 이고운치과 참고 (2026-09-04 오너: "이고운 참고해서 오른쪽에 CTA 버튼 이쁘게 넣어봐") ★★
 *   전에는 알약 단추 둘이 글 아래에 나란히 붙어 있어서, 넓은 화면에서 오른쪽 절반이 비었다.
 *   가로로 꽉 찬 단추를 오른쪽에 세로로 쌓으면 그 자리가 채워지고, 무엇이 있는지도 한눈에 보인다.
 * ⚠️ 그라데이션을 넣지 말 것 — 이 사이트의 단추는 단색 아니면 테두리다(사이트 전체 규칙).
 *    브랜드 색은 단색이므로 규칙 안이다. 참고한 화면의 주황 그라데이션 **배경**은 가져오지 않았다.
 * ⚠️ 순서를 바꾸지 말 것 — 전화가 맨 위다. 급한 사람이 먼저 닿아야 하는 것이 전화이고,
 *    나머지 둘은 '시간을 정해서' 쓰는 길이다(app/visit/page.tsx 의 안내와 같은 순서).
 */
export function BookingButtons({
  phone,
  phoneHref,
  kakao,
  naver,
  tone = 'light',
}: {
  phone: string;
  phoneHref: string;
  kakao: string;
  naver: string;
  /** 놓이는 면 — 어두운 면에서는 전화 단추를 밝게 뒤집는다. */
  tone?: 'light' | 'dark';
}) {
  const row =
    'group flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-[18px] text-[17px] font-bold transition-opacity hover:opacity-90';
  const arrow = (
    <span aria-hidden className="shrink-0 transition-transform group-hover:translate-x-1">
      →
    </span>
  );
  return (
    <div className="reveal flex w-full flex-col gap-3">
      <a
        href={phoneHref}
        className={`${row} ${tone === 'dark' ? 'bg-parchment text-dusk' : 'bg-ink text-wine-bg'}`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <PhoneIcon />
          <span className="tabular-nums">전화 {phone}</span>
        </span>
        {arrow}
      </a>
      <a
        href={kakao}
        target="_blank"
        rel="noopener noreferrer"
        className={`${row} bg-[#FEE500] text-[#191600]`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <KakaoIcon />
          카카오톡 상담
        </span>
        {arrow}
      </a>
      <a
        href={naver}
        target="_blank"
        rel="noopener noreferrer"
        className={`${row} bg-[#03C75A] text-white`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <NaverIcon />
          네이버 예약
        </span>
        {arrow}
      </a>
    </div>
  );
}
