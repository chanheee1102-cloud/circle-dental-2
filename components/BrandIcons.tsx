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
   * ★★ 가로 넉 장 카드 (2026-09-07 오너: "이고운치과랑 너무 똑같아서, 카드 형태로 가로로 네개") ★★
   *   세로로 쌓은 넉 줄은 같은 손이 만든 다른 병원 사이트와 판박이였다(글 왼쪽·단추 오른쪽 2단).
   *   여기서는 제목 아래 **전폭으로 카드 넉 장을 한 줄**에 세운다 — 칸 하나가 ~300px 라
   *   이름·설명·화살표가 여유 있게 들어간다(전에 한 줄 넷이 실패한 건 오른쪽 반 칸(157px)에
   *   욱여넣어서였다. 이번엔 전폭이라 그 문제가 없다).
   * ★ 카드마다 **둘째 줄**이 있다 — 전화번호 · 무엇을 하는 길인지. 단추가 아니라 카드로 읽히는
   *   것은 이 둘째 줄 덕이다. 지우면 다시 단추 네 개가 된다.
   * ★ 행·열 규격: grid 로 폭을 4등분하고 h-full 로 높이를 맞춘다. 설명이 두 줄인 카드가
   *   있어도 옆 카드가 같이 늘어난다 — 카드끼리 높이가 다르면 규격이 어긋나 보인다.
   * ⚠️ 순서를 바꾸지 말 것 — 전화가 맨 앞이다. 급한 사람이 먼저 닿아야 하는 것이 전화이고,
   *    나머지는 시간을 정해서 쓰는 길이다(app/visit/page.tsx 의 안내와 같은 순서).
   * ⚠️ 오시는 길만 **테두리형**이다. 전화와 같은 단색으로 두면 나란히 선 두 갈색이 같은 카드로
   *    보인다(clay-600 은 ink 와 거의 같은 갈색이라 채워도 구별이 안 된다 — 실제로 해 보고 바꿨다).
   * ⚠️ 브랜드 색은 규정 색이다. 카카오 노랑 위 글자는 검정 — 흰 글자면 1.7:1 로 안 읽힌다.
   * ⚠️ 좁은 화면은 2×2 다(sm:grid-cols-2). 한 줄 넷을 고집하면 카드가 접힌다.
   */
  /* ⚠️ 채운 카드에도 투명 테두리 1.5px — 테두리형(오시는 길)과 높이가 3px 어긋나던 것을 맞춘다(실측 158 vs 160). */
  const card =
    'group flex h-full min-h-[148px] flex-col rounded-2xl border-[1.5px] border-transparent p-6 transition-transform duration-300 hover:-translate-y-0.5';
  const own = tone === 'dark' ? 'bg-parchment text-dusk' : 'bg-ink text-wine-bg';
  const Body = ({ icon, label, sub, dim }: { icon: React.ReactNode; label: string; sub: string; dim: string }) => (
    <>
      <span aria-hidden className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-current/10">
        {icon}
      </span>
      <span className="mt-auto pt-6 text-[17px] font-bold leading-tight whitespace-nowrap">{label}</span>
      <span className={`mt-1.5 flex items-center justify-between gap-3 text-[13.5px] leading-snug ${dim}`}>
        <span className="min-w-0">{sub}</span>
        <span aria-hidden className="shrink-0 transition-transform group-hover:translate-x-1">→</span>
      </span>
    </>
  );
  return (
    <div className="reveal-stack grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <a href={phoneHref} aria-label={`전화 ${phone}`} className={`reveal ${card} ${own}`}>
        <Body icon={<PhoneIcon size={20} />} label="전화 상담" sub={phone} dim="opacity-75" />
      </a>
      <a href={kakao} target="_blank" rel="noopener noreferrer" className={`reveal ${card} bg-[#FEE500] text-[#191600]`}>
        <Body icon={<KakaoIcon size={20} />} label="카카오톡 상담" sub="채팅으로 먼저 물어보기" dim="opacity-70" />
      </a>
      <a href={naver} target="_blank" rel="noopener noreferrer" className={`reveal ${card} bg-[#03C75A] text-white`}>
        <Body icon={<NaverIcon size={20} />} label="네이버 예약" sub="원하는 시간 골라 예약" dim="opacity-85" />
      </a>
      <Link
        href="/visit"
        className={`reveal ${card} border-[1.5px] ${
          tone === 'dark'
            ? 'border-parchment/70 text-parchment'
            : 'border-ink/45 text-ink hover:bg-ink hover:text-wine-bg'
        }`}
      >
        <Body icon={<PinIcon size={20} />} label="오시는 길" sub="화정역 · 주차 안내" dim="opacity-70" />
      </Link>
    </div>
  );
}
