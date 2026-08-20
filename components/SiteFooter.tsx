import Link from 'next/link';
import { CLINIC } from '@/lib/clinic';
import { LetterMarquee } from './Motion';
import { SITE_MODIFIED, formatKoreanDate } from '@/lib/contentMeta';

/**
 * 전역 푸터.
 *
 * ★★ 왜 다 적는가 (2026-08-20 운영자: "푸터도 다 가져와서 넣어") ★★
 *   전에는 마퀴 한 줄 + 주소 한 줄 + 고지 한 줄이 전부였다. 그런데 푸터는
 *   장식이 아니라 **이 병원이 실재한다는 것을 증명하는 자리**다:
 *     · 사업자등록번호·대표자 — 없으면 "누가 운영하는지 모르는 사이트" 가 된다
 *     · 공식 채널 — 여기 걸린 주소가 그대로 JSON-LD 의 sameAs 로 나가
 *       "이 홈페이지와 저 계정이 같은 병원" 이라는 선언이 된다
 *     · 개인정보처리방침 — 「개인정보 보호법」 제30조가 공개를 의무로 정하고,
 *       그 관행상의 자리가 푸터다
 *     · 최종 확인일 — 없으면 사이트 전체가 "언제 기준인지 모르는 곳" 으로 읽힌다
 *   답변형 AI 가 병원의 신뢰도를 판단할 때 실제로 읽는 항목들이기도 하다.
 *
 * ★ 사업자 정보는 **여기 한 곳에만** 적는다. 두 군데 적으면 반드시 어긋난다.
 *
 * ⚠️⚠️ 사업자등록번호·대표자·채널 주소는 지어낼 수 없는 종류의 정보다 ⚠️⚠️
 *   전부 기존 circle-dental 프로젝트에서 VERIFIED 로 확인된 값만 옮겼다.
 *   없는 계정 주소를 걸면 404 를 가리키는 동일성 선언이 되어 신호를 오히려 해친다.
 *
 * ⚠️ 메뉴를 4칸 격자에 넣을 때 항목 수가 칸 수와 어긋나면 한 칸이 아래로 밀리고
 *    그 위로 빈 화면이 생긴다(원본 프로젝트에서 실제로 겪은 결함).
 *    여기서는 열마다 항목 수를 다르게 두되 격자는 열 기준으로 고정한다.
 */
export default function SiteFooter() {
  /*
   * ⚠️ 아래 여백(pb)은 퀵메뉴(components/QuickMenu.tsx)를 피할 만큼 둔다.
   *    퀵메뉴는 화면 오른쪽 아래에 **고정**돼 있어서(54px + 여백 28px ≈ 82px),
   *    푸터 맨 아랫줄이 그 자리에 오면 저작권 문구가 통째로 가려진다.
   *    실제로 그렇게 가려져 있었다. 퀵메뉴를 옮기면 이 값도 같이 본다.
   */
  return (
    <footer className="bg-ink pb-28 pt-20 text-white md:pb-32">
      {/* 마퀴 — bom-on 히어로와 짝을 이루는 마감. */}
      <LetterMarquee text={`${CLINIC.shortName} ·`} seconds={30} colorClass="text-white/[0.07]" />

      <div className="shell mt-16">
        <div className="grid gap-x-10 gap-y-14 lg:grid-cols-[minmax(0,1.15fr)_repeat(3,minmax(0,1fr))]">
          {/* ── 브랜드 칸 ── */}
          <div>
            <p className="text-[17px] font-bold tracking-[-0.03em] text-white">{CLINIC.name}</p>
            {/*
              영문명은 세리프로 — 라틴 문자만 있는 자리라 조건에 맞고,
              푸터에서 한 줄이 결이 다르면 그것만으로 마감이 정돈돼 보인다.
              (지어낸 문구가 아니라 로고 이미지 안에도 들어 있는 정식 표기다.)
            */}
            <p className="display mt-2 text-[12px] tracking-[0.24em] text-brand-2">{CLINIC.nameEn}</p>
            <p className="mt-6 max-w-[42ch] text-[13.5px] leading-[1.9] text-white/60">
              {CLINIC.description}
            </p>

            <a
              href={CLINIC.phoneHref}
              className="mt-7 flex h-12 w-full max-w-[320px] items-center justify-center rounded-full bg-white/10 text-[16px] font-bold tabular-nums text-white transition-colors hover:bg-white/20"
            >
              {CLINIC.phone}
            </a>

            {/*
              공식 채널.
              ★ 아이콘만 두지 않고 이름을 함께 적는다 — 아이콘만 있으면 화면 낭독기에서
                "링크" 로만 읽히고, 검색엔진도 어디로 가는 링크인지 알 수 없다.
              ★ rel="me" — "이 사이트의 운영자가 저 계정" 이라는 표준 표기다.
            */}
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
              공식 채널
            </p>
            <ul className="mt-3.5 grid max-w-[320px] grid-cols-2 gap-2.5">
              {CHANNELS.map((ch) => (
                <li key={ch.label}>
                  <a
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${CLINIC.name} ${ch.label} (새 창)`}
                    className="group flex h-11 items-center justify-between gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 text-[12.5px] font-bold text-white/85 transition-all duration-400 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    <span className="min-w-0 truncate">{ch.label}</span>
                    <span aria-hidden className="shrink-0 text-[11px] text-white/45 transition-transform duration-400 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── 사이트맵 3칸 ── */}
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={`푸터 ${col.title}`}>
              <p className="text-[12.5px] font-bold tracking-[0.02em] text-white">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((it) => (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className="text-[13px] leading-snug text-white/60 transition-colors hover:text-white"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/*
          ★★ 사업자 정보 — 라벨을 세워 값과 짝지어 둔다 ★★
            문장으로 이어 붙이면 어느 값이 무엇인지 읽어야 알 수 있다.
            dl 로 쓰면 '주소'·'대표자' 가 장식이 아니라 값의 이름이 되어
            사람도 기계도 짝을 그대로 읽는다.
        */}
        <dl className="mt-16 grid gap-x-10 gap-y-8 border-t border-white/10 pt-10 text-[12.5px] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/60">주소</dt>
            <dd className="mt-2.5 space-y-1 leading-[1.85] text-white/70">
              <span className="block">{CLINIC.address.full}</span>
              <span className="block">
                {CLINIC.address.building} · {CLINIC.nearestStation} 인근
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/60">연락처</dt>
            <dd className="mt-2.5 space-y-1 leading-[1.85] text-white/70">
              <span className="block tabular-nums">대표전화 / FAX {CLINIC.phone}</span>
              <span className="block break-all">{CLINIC.email}</span>
            </dd>
          </div>
          <div>
            <dt className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/60">사업자 정보</dt>
            <dd className="mt-2.5 space-y-1 leading-[1.85] text-white/70">
              <span className="block">대표자 {CLINIC.director}</span>
              <span className="block tabular-nums">사업자등록번호 {CLINIC.bizNo}</span>
            </dd>
          </div>
          <div>
            <dt className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/60">진료시간</dt>
            {/*
              ⚠️ 요일별로 값이 다르므로 한 줄에 이어 붙이지 않는다.
                 이어 붙이면 어디서 끊어 읽어야 할지 알 수 없다.
              ⚠️ 화면 위의 표(HoursStrip)와 **같은 데이터**를 쓴다. 여기에 시간을 다시
                 적어 두면 언젠가 한쪽만 고쳐져 두 값이 어긋난다.
            */}
            <dd className="mt-2.5 space-y-1 leading-[1.85] text-white/70">
              {CLINIC.hours.map((h) => (
                <span key={h.label} className="flex justify-between gap-3">
                  <span>{h.label.replace(' · 공휴일', '·공휴일')}</span>
                  <span className="tabular-nums">{h.time}</span>
                </span>
              ))}
              <span className="flex justify-between gap-3 pt-1 text-white/50">
                <span>점심시간</span>
                <span className="tabular-nums">{CLINIC.lunch.time}</span>
              </span>
            </dd>
          </div>
        </dl>

        {/*
          의료법상 고지.
          ⚠️ 구분선(border-t)은 **바깥 칸**에 건다. 문단에 직접 걸면 선이 글줄 폭까지만
             그어져 화면 중간에서 뚝 끊긴 줄로 보인다.
        */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="max-w-[86ch] text-[11.5px] leading-[1.9] text-white/60">
            본 사이트의 진료 정보는 일반적인 이해를 돕기 위한 것으로 개별 진단을 대신하지 않습니다.
            치료 결과는 개인의 구강 상태와 전신 건강에 따라 다를 수 있으며, 모든 의료 행위에는
            부작용이 따를 수 있습니다. 정확한 진단은 내원 후 검사를 통해 이루어집니다.
          </p>
        </div>

        {/*
          맨 아랫줄.
          ★ 최종 확인일 — 없으면 사이트 전체가 "언제 기준인지 모르는 곳" 으로 읽힌다.
            사람에게는 한국어로, 기계에게는 <time datetime> 의 ISO 8601 로 준다.
          ⚠️ 이 날짜는 lib/contentMeta.ts 의 SITE_MODIFIED 다. **실제로 내용을 고친 날만**
             올린다 — 안 고쳤는데 날짜만 올리면 사실과 다른 표시다.
          ⚠️ 저작권 연도에 new Date() 를 쓰지 않는다. 정적 생성 사이트라 빌드 시점에
             값이 굳어, 해가 바뀌어도 재배포 전까지 지난해가 박혀 있게 된다.
             연도를 안 쓰면 틀릴 일도 없다.
        */}
        <div className="mt-8 flex flex-col gap-3 text-[11.5px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="font-bold text-white/70 transition-colors hover:text-white">
              개인정보처리방침
            </Link>
            <span className="text-white/45">
              병원 정보 최종 확인{' '}
              <time dateTime={SITE_MODIFIED} className="font-semibold text-white/65">
                {formatKoreanDate(SITE_MODIFIED)}
              </time>
            </span>
          </div>
          <span className="text-white/55">&copy; {CLINIC.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

/**
 * 사이트맵 3칸.
 * ⚠️ 여기 있는 경로는 **전부 실제로 존재하는 라우트**여야 한다.
 *    푸터의 죽은 링크는 사용자에게도 크롤러에게도 사이트가 관리되지 않는다는 신호다.
 *    (app/ 아래 실제 폴더와 대조해 적었다.)
 */
const COLUMNS = [
  {
    title: '증상으로 찾기',
    items: [
      { label: '증상 목록', href: '/insight/symptom' },
      { label: '질환으로 찾기', href: '/insight/condition' },
      { label: '치료 과정 미리보기', href: '/insight/journey' },
      { label: '자주 묻는 질문', href: '/faq' },
    ],
  },
  {
    title: '진료',
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
    title: '병원 안내',
    items: [
      { label: '진료시간', href: '/#hours' },
      { label: '오시는 길', href: '/#visit' },
      { label: '의료진', href: '/#doctors' },
      { label: '둘러보기', href: '/#interior' },
      { label: '비용 기준', href: '/insight/cost' },
      { label: '용어 사전', href: '/insight/glossary' },
    ],
  },
] as const;

/**
 * 공식 채널 네 개.
 * ⚠️ 여기 걸린 주소가 그대로 JSON-LD 의 sameAs 로도 나간다(lib/schema.ts).
 *    **확인된 계정만** 건다.
 */
const CHANNELS = [
  { label: '네이버 예약', href: CLINIC.booking.naver },
  { label: '카카오톡 상담', href: CLINIC.booking.kakao },
  { label: '네이버 블로그', href: CLINIC.social.naverBlog },
  { label: '인스타그램', href: CLINIC.social.instagram },
] as const;
