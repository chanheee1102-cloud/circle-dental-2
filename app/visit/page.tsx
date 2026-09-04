import type { Metadata } from 'next';
import { ArticleMeta, headingId } from '@/components/article';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { Container, PageHero, Sentences } from '@/components/ui';
import { ClinicMap } from '@/components/ClinicMap';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
import { PhoneIcon, KakaoIcon, NaverIcon } from '@/components/BrandIcons';

export const metadata: Metadata = {
  title: '오시는 길·진료시간',
  description: `${CLINIC.name} 위치와 진료시간. ${CLINIC.address.full}. 전화 ${CLINIC.phone}.`,
  alternates: { canonical: '/visit' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '내원 안내', path: '/visit' },
];

/** 창구 — 각각 무엇에 맞는지까지 적는다. 나열만 하면 고르는 부담을 넘기는 셈이다. */
const CHANNELS = [
  {
    key: 'phone',
    name: '전화',
    value: CLINIC.phone,
    href: CLINIC.phoneHref,
    external: false,
    best: '지금 아프거나 급할 때',
    detail:
      '증상을 말씀해 주시면 그날 오셔야 하는 상황인지 함께 확인합니다. 진료 중에는 연결이 늦어질 수 있습니다.',
  },
  {
    key: 'naver',
    name: '네이버 예약',
    value: '시간 선택 후 바로 확정',
    href: CLINIC.booking.naver,
    external: true,
    best: '급하지 않고 시간을 정하고 싶을 때',
    detail:
      '가능한 시간대를 보고 직접 고르실 수 있습니다. 통화 없이 예약이 끝나므로 진료 중이거나 근무 중이어도 잡을 수 있습니다.',
  },
  {
    key: 'kakao',
    name: '카카오톡 상담',
    value: '메시지로 문의',
    href: CLINIC.booking.kakao,
    external: true,
    best: '간단히 물어보고 싶을 때',
    detail:
      '진료시간·주차·준비물처럼 짧은 질문에 맞습니다. 증상 판단은 구강을 봐야 가능하므로 메시지만으로는 진단해 드릴 수 없습니다.',
  },
  /*
   * ⚠️ 이메일 칸을 되살리지 말 것 (2026-09-04 오너: "이거 없애주고").
   *   ① 셋은 한 줄인데 이것만 둘째 줄에 혼자 남아 화면이 어정쩡했다.
   *   ② 개인 한메일 주소가 그대로 노출돼 수집 로봇의 먹이가 된다.
   *   ③ 스스로도 "진료 문의는 전화나 카카오톡이 빠릅니다" 라고 말하던 칸이다.
   *   lib/clinic.ts 의 CLINIC.email 은 그대로 둔다 — 푸터·구조화 데이터가 쓴다.
   */
];

/**
 * 오시는 길.
 *
 * ★ 지도는 components/ClinicMap 이 담당한다(확대·축소 가능한 임베드 + 길찾기 버튼).
 *   좌표는 기존 홈페이지 /information 의 지도 위젯에서 추출한 실측값이다.
 * ★ 주소는 CLINIC 한 곳에서만 읽는다. 페이지마다 따로 적으면 반드시 어긋난다.
 */
export default function VisitPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(TRAIL)} />

      <PageHero
        trail={TRAIL}
        photo="corridor"
        eyebrow="내원 안내"
        title="화정동 현창빌딩 3층에서 진료합니다"
        desc={`${CLINIC.nearestStation} 인근이며, ${CLINIC.serviceArea.slice(0, 4).join(' · ')} 에서 오십니다.`}
      />

      <Container className="py-12 sm:py-16 lg:py-20">

        {/* 발행·수정일과 검토자 — 기계와 사람이 같은 값을 보게 한다. */}
        <div className="mt-8 max-w-[70ch]">
          <ArticleMeta path="/visit" />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* 위치 */}
          <div className="rounded-2xl border border-brand-200/70 bg-parchment p-8">
            <h2 className="display-sm text-[clamp(22px,2.4vw,28px)] leading-[1.3] text-ink">어디에 있나요?</h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-[13.5px] font-black tracking-[0.14em] text-ink-muted uppercase">주소</dt>
                <dd className="mt-2 max-w-[34em] text-[17px] font-semibold leading-relaxed text-ink">
                  {CLINIC.address.full}
                </dd>
                <dd className="mt-1 text-[15px] text-ink-soft">{CLINIC.address.building}</dd>
              </div>
              <div>
                <dt className="text-[13.5px] font-black tracking-[0.14em] text-ink-muted uppercase">전화</dt>
                <dd className="mt-2">
                  <a
                    href={CLINIC.phoneHref}
                    className="text-[22px] font-black text-clay-700 hover:underline"
                  >
                    {CLINIC.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[13.5px] font-black tracking-[0.14em] text-ink-muted uppercase">
                  가까운 역
                </dt>
                <dd className="mt-2 text-[16.5px] text-ink-soft">{CLINIC.nearestStation}</dd>
              </div>
              {/* 주차 — 무료 여부는 방문 결정에 직접 영향을 주므로 위치 정보와 같은 층위에 둔다. */}
              <div>
                <dt className="text-[13.5px] font-black tracking-[0.14em] text-ink-muted uppercase">
                  주차
                </dt>
                <dd className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[16.5px] font-bold text-ink">{CLINIC.parking.type}</span>
                  <span className="rounded-full bg-clay-tint px-3 py-1 text-[13.5px] font-black text-clay-700">
                    {CLINIC.parking.fee}
                  </span>
                </dd>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                  <Sentences text={CLINIC.parking.note} />
                </dd>
              </div>
            </dl>

            {/* 길찾기 버튼은 지도 바로 아래(ClinicMap)에 있다 — 여기에 또 두면 중복이다. */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              <a
                href={CLINIC.booking.naver}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-[1.5px] border-ink/60 px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-wine-bg"
              >
                네이버 예약
              </a>
              <a
                href={CLINIC.booking.kakao}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-[1.5px] border-ink/60 px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-wine-bg"
              >
                카카오톡 상담
              </a>
            </div>
          </div>

          {/* 진료시간 */}
          <div className="rounded-2xl border border-brand-200/70 bg-parchment p-8">
            <h2 className="display-sm text-[clamp(22px,2.4vw,28px)] leading-[1.3] text-ink">언제 진료하나요?</h2>
            <div className="mt-6">
              <ul className="divide-y divide-wine-line">
                {UNVERIFIED.hours.display.map((h) => (
                  <li
                    key={h.label}
                    className={`flex items-baseline justify-between gap-4 py-4 ${
                      h.label === '점심시간' ? 'text-ink-muted' : ''
                    }`}
                  >
                    <span className="text-[16.5px] font-bold text-ink">{h.label}</span>
                    <span className="text-right text-[16.5px] text-ink-soft">
                      {h.time}
                      {h.note && (
                        <span className="ml-2 rounded-full bg-clay-tint px-2 py-0.5 text-[13.5px] font-black text-clay-700">
                          <Sentences text={h.note} />
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[14.5px] font-semibold text-ink-muted">
                ※ {UNVERIFIED.hours.closed}
              </p>
              <a
                href={CLINIC.phoneHref}
                className="mt-6 inline-flex rounded-full bg-ink px-7 py-3.5 text-[16.5px] font-semibold text-wine-bg transition-opacity hover:opacity-90"
              >
                {CLINIC.phone}
              </a>
            </div>
          </div>
        </div>

        {/*
          연락 창구 — /contact 에서 옮겨 왔다 (2026-09-01, 두 페이지 합침).
          ⚠️ 다시 별도 페이지로 떼지 말 것 — 그때 '어디에 있나요 / 언제 진료하나요' 가
             양쪽에 생겨 같은 검색어를 두고 서로 경쟁했다.
          ★ 나열만 하지 않고 '이럴 때' 를 함께 적는다. 창구만 늘어놓으면 고르는 부담을
            읽는 사람에게 넘기는 셈이다.
        */}
        <div className="mt-14">
          <h2 id={headingId('어떻게 연락하면 되나요')} className="scroll-mt-28 display-sm text-[clamp(22px,2.4vw,28px)] leading-[1.3] text-ink">
            어떻게 연락하면 되나요?
          </h2>
          <ul className="mt-6 grid gap-4 lg:grid-cols-3">
            {CHANNELS.map((c) => (
              <li
                key={c.key}
                className="h-full rounded-2xl border border-brand-200/70 bg-parchment p-6"
              >
                {/*
                  ★ 브랜드 마크와 색을 얹는다 (2026-09-04 오너: "전화 네이버 카카오 색 넣고 로고도 넣어서
                    가시성 띄워줘"). 석 장이 글자만으로 늘어서 있어 어느 것이 무엇인지 읽어야 알았다.
                    색과 마크는 읽기 전에 알아보게 한다.
                  ⚠️ 카드 전체를 브랜드 색으로 칠하지 말 것 — 노랑·초록 판이 나란히 서면 이 페이지만
                     사이트에서 튄다. 색은 **원 하나**에만 둔다(마무리 CTA 의 동그라미와 같은 규칙).
                  ⚠️ 카카오 노랑 위의 글자는 검정이다. 흰 글자를 얹으면 1.7:1 로 안 읽힌다.
                */}
                <span
                  aria-hidden
                  className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full ${
                    c.key === 'naver'
                      ? 'bg-[#03C75A] text-white'
                      : c.key === 'kakao'
                        ? 'bg-[#FEE500] text-[#191600]'
                        : 'bg-ink text-wine-bg'
                  }`}
                >
                  {c.key === 'naver' ? (
                    <NaverIcon size={22} />
                  ) : c.key === 'kakao' ? (
                    <KakaoIcon size={22} />
                  ) : (
                    <PhoneIcon size={22} />
                  )}
                </span>
                <p className="text-[13px] font-black tracking-[0.14em] text-clay-600">{c.best}</p>
                <p className="display-sm mt-3.5 text-[19px] text-ink">{c.name}</p>
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="mt-2 inline-flex font-bold text-clay-700 underline underline-offset-4"
                >
                  {c.value}
                </a>
                <p className="mt-3.5 text-[15px] leading-[1.75] text-ink-soft">
                  <Sentences text={c.detail} />
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* 지도 — 확대·축소·드래그 가능. 아래에 네이버·카카오 길찾기 버튼이 함께 붙는다. */}
        <div className="mt-8">
          <h2 className="display-sm text-[clamp(22px,2.4vw,28px)] leading-[1.3] text-ink">어떻게 찾아가나요?</h2>
          <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-soft">
            <Sentences text="아래 네이버 지도나 카카오맵 버튼으로 길찾기를 하실 수 있습니다. 대중교통 경로와 로드뷰도 함께 보실 수 있습니다." />
          </p>
          <div className="mt-6">
            <ClinicMap height={460} />
          </div>
        </div>
      </Container>
    </>
  );
}
