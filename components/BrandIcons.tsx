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
  /** 놓이는 면 — 어두운 면에서는 우리 색 원을 밝게 뒤집는다. */
  tone?: 'light' | 'dark';
}) {
  const dot =
    'group flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-full text-center transition-transform duration-300 hover:-translate-y-1';
  const own = tone === 'dark' ? 'bg-parchment text-dusk' : 'bg-ink text-wine-bg';
  return (
    /*
      ⚠️ 넷을 한 줄에 둔다 (2026-09-04 오너: "map 버튼 추가해서 버튼 4개로"). 좁은 화면에서도
         줄을 바꾸지 않는다 — 세로로 쌓으면 원이 화면 폭만큼 커져 우스워진다.
      ⚠️ gap 을 넓히지 말 것 — 오너가 "간격이 너무 넓다" 고 한 자리다. 원 사이는 좁게 붙이고
         칸 폭이 남으면 **원이 커지게** 둔다(aspect-square + w-full).
      ⚠️ 번호 줄은 뺐다 (오너: "번호는 지워 밑에"). 전화 원이 그 역할을 하고,
         번호는 푸터·내원 안내·하단 고정 바에 이미 세 번 있다.
    */
    <div className="reveal grid w-full grid-cols-4 gap-2.5 sm:gap-3">
      <a href={phoneHref} aria-label={`전화 ${phone}`} className={`${dot} ${own}`}>
        <PhoneIcon size={24} />
        <span className="text-[13.5px] font-bold">전화상담</span>
      </a>
      <a
        href={kakao}
        target="_blank"
        rel="noopener noreferrer"
        className={`${dot} bg-[#FEE500] text-[#191600]`}
      >
        <KakaoIcon size={24} />
        <span className="text-[13.5px] font-bold">카카오톡</span>
      </a>
      <a
        href={naver}
        target="_blank"
        rel="noopener noreferrer"
        className={`${dot} bg-[#03C75A] text-white`}
      >
        <NaverIcon size={24} />
        <span className="text-[13.5px] font-bold">네이버예약</span>
      </a>
      <Link href="/visit" className={`${dot} ${own}`}>
        <PinIcon size={24} />
        <span className="text-[13.5px] font-bold">오시는 길</span>
      </Link>
    </div>
  );
}
