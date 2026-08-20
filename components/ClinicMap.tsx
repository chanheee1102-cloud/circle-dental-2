'use client';

import { CLINIC } from '@/lib/clinic';

/**
 * 위치 지도.
 *
 * ★ 왜 Google 임베드인가
 *   API 키 없이 확대·축소·드래그가 되는 지도를 넣을 수 있는 방법이 이것뿐이다.
 *   네이버·카카오 지도는 클라이언트 ID 발급 + 도메인 등록이 필요하다(무료지만 절차가 있다).
 *
 * ★ 그런데 한국 사용자는 길찾기를 네이버·카카오로 한다.
 *   그래서 지도는 '여기가 어디인지 보는 용도' 로 두고 **길찾기 버튼을 따로 크게 둔다.**
 *   지도만 있고 링크가 없으면 주소를 복사해 다른 앱에 붙여넣어야 한다.
 *
 * ⚠️ 좌표는 lib/clinic.ts 의 확인된 값만 쓴다. 추정 좌표로 지도를 띄우면
 *    없는 것보다 나쁘다 — 환자가 엉뚱한 곳으로 간다.
 * ⚠️ loading="lazy" — 지도는 페이지 아래쪽에 있어 첫 화면 로딩에 영향을 주지 않는다.
 *    다만 클릭해야 뜨는 방식으로는 만들지 않는다. 오시는 길에 왔는데 회색 상자가 있으면
 *    그게 고장으로 보인다.
 */
export default function ClinicMap({ height = 380 }: { height?: number }) {
  const { lat, lng } = CLINIC.geo;
  const q = encodeURIComponent(`${CLINIC.name} ${CLINIC.address.full}`);
  /** z=17 — 건물이 구분되면서 화정역 같은 주변 표지도 함께 보이는 배율. */
  const embed = `https://maps.google.com/maps?q=${lat},${lng}&z=17&hl=ko&output=embed`;

  const links = [
    { href: `https://map.naver.com/p/search/${q}`, label: '네이버 지도', bg: '#03C75A', fg: '#0d2b18' },
    { href: `https://map.kakao.com/?q=${q}`, label: '카카오맵', bg: '#FEE500', fg: '#3C1E1E' },
  ];

  return (
    <div>
      <div className="overflow-hidden rounded-[22px] border border-white/10">
        <iframe
          src={embed}
          title={`${CLINIC.name} 위치 지도`}
          referrerPolicy="no-referrer-when-downgrade"
          loading="lazy"
          allowFullScreen
          style={{ height }}
          className="w-full border-0"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-6 py-3 text-[14.5px] font-bold transition-transform duration-400 hover:-translate-y-0.5"
            style={{ background: l.bg, color: l.fg }}
          >
            {l.label}에서 길찾기
          </a>
        ))}
      </div>
    </div>
  );
}
