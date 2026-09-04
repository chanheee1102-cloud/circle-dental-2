import Link from 'next/link';

/**
 * **브랜드 마크 세 개** — 전화 · 카카오 · 네이버.
 *
 * ★ 왜 따로 뺐나 (2026-09-04) — 하단 퀵메뉴(components/QuickMenu.tsx)와 페이지 마무리의
 *   예약 단추가 같은 마크를 쓴다. 두 벌로 두면 한쪽만 고쳐져 색이 갈라진다.
 * ⚠️ 카카오 노랑(#FEE500)·네이버 초록(#03C75A)은 **브랜드 규정 색**이다. 사이트 팔레트에
 *    맞춘다고 바꾸지 말 것 — 색이 곧 '어디로 가는가' 이고, 바꾸면 알아볼 수 없다.
 * ⚠️ 전화 마크만 currentColor 다. 이건 브랜드가 아니라 우리 아이콘이라 놓이는 면을 따른다.
 */
export function PinIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
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
 * **마무리 예약 — 동그라미 세 개.**
 *
 * ★★ 왜 원형인가 (2026-09-04 오너: "너무 똑같잖아. 우리는 동그라미 세개 가로로 나타내자") ★★
 *   직전 판은 참고한 화면(이고운치과)의 '가로로 긴 단추 세 줄' 을 그대로 옮겨 놓은 것이었다.
 *   보기는 멀쩡한데 남의 화면이다. 이 병원의 이름이 **동그라미**이고 로고도 원이므로,
 *   같은 세 갈래를 원 세 개로 늘어놓으면 그것만으로 이 병원의 것이 된다.
 *
 * ⚠️ aspect-square + w-full — 크기를 px 로 박지 말 것. 오른쪽 칸 폭에 맞춰 원이 늘어나야
 *    "여백 안 남게" 가 유지된다(오너 지시). 고정 크기로 두면 칸이 넓어질 때 오른쪽이 빈다.
 * ⚠️ 세 개는 한 줄이다 — grid-cols-3 을 좁은 화면에서도 유지한다. 세로로 쌓으면 다시
 *    '남의 화면' 이 되고, 원이 화면 폭만큼 커져 우스워진다.
 * ⚠️ 전화번호는 원 안에 넣지 않는다 — 원 안에서 11자리는 글자가 8px 로 내려간다.
 *    원 아래 한 줄로 두고, 그 줄도 누르면 걸리게 한다.
 * ⚠️ 브랜드 색(카카오 #FEE500 · 네이버 #03C75A)은 규정 색이다. 팔레트에 맞춘다고 바꾸지 말 것.
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
  /** 놓이는 면 — 어두운 면에서는 우리 색 카드를 밝게 뒤집는다. */
  tone?: 'light' | 'dark';
}) {
  /*
   * ★★ 세로 넉 줄, 한 줄에 하나 (2026-09-04 오너: "로고 없애고, 버튼 하나당 한줄씩해서 세로로 네줄로") ★★
   *   한 줄 넷이던 판은 카드가 157px 로 좁아 이름이 접히고 화살표도 못 넣었다.
   *   세로로 쌓으면 카드가 오른쪽 칸 폭을 다 쓰므로 이름·화살표가 여유 있게 들어간다.
   * ⚠️ 로고는 뺐다 — 넉 줄이 위쪽 빈자리를 이미 채운다. 다시 넣으면 오른쪽이 답답해진다.
   * ⚠️ 순서를 바꾸지 말 것 — 전화가 맨 위다. 급한 사람이 먼저 닿아야 하는 것이 전화이고,
   *    나머지는 시간을 정해서 쓰는 길이다(app/visit/page.tsx 의 안내와 같은 순서).
   * ⚠️ 오시는 길만 **테두리형**이다. 전화와 같은 단색으로 두면 나란히 선 두 갈색이 같은 단추로
   *    보인다(clay-600 은 ink 와 거의 같은 갈색이라 채워도 구별이 안 된다 — 실제로 해 보고 바꿨다).
   * ⚠️ 브랜드 색은 규정 색이다. 카카오 노랑 위 글자는 검정 — 흰 글자면 1.7:1 로 안 읽힌다.
   */
  const row =
    'group flex w-full items-center gap-3 rounded-2xl px-6 py-[18px] text-[16.5px] font-bold transition-transform duration-300 hover:-translate-y-0.5';
  const own = tone === 'dark' ? 'bg-parchment text-dusk' : 'bg-ink text-wine-bg';
  const arrow = (
    <span
      aria-hidden
      className="ml-auto shrink-0 opacity-70 transition-transform group-hover:translate-x-1"
    >
      →
    </span>
  );
  return (
    <div className="reveal flex w-full flex-col gap-3">
      <a href={phoneHref} aria-label={`전화 ${phone}`} className={`${row} ${own}`}>
        <PhoneIcon size={22} />
        <span className="whitespace-nowrap">전화 상담</span>
        {arrow}
      </a>
      <a
        href={kakao}
        target="_blank"
        rel="noopener noreferrer"
        className={`${row} bg-[#FEE500] text-[#191600]`}
      >
        <KakaoIcon size={22} />
        <span className="whitespace-nowrap">카카오톡 상담</span>
        {arrow}
      </a>
      <a
        href={naver}
        target="_blank"
        rel="noopener noreferrer"
        className={`${row} bg-[#03C75A] text-white`}
      >
        <NaverIcon size={22} />
        <span className="whitespace-nowrap">네이버 예약</span>
        {arrow}
      </a>
      <Link
        href="/visit"
        className={`${row} border-[1.5px] ${
          tone === 'dark'
            ? 'border-parchment/70 text-parchment'
            : 'border-ink/45 text-ink hover:bg-ink hover:text-wine-bg'
        }`}
      >
        <PinIcon size={22} />
        <span className="whitespace-nowrap">오시는 길</span>
        {arrow}
      </Link>
    </div>
  );
}
