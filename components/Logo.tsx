import Image from 'next/image';
import { IMG } from '@/lib/assets';

/**
 * 로고.
 *
 * ★ 기존 홈페이지의 실제 로고 파일을 그대로 쓴다. 비슷하게 그린 SVG 를 쓰면
 *   간판·명함·기존 인쇄물과 미세하게 어긋나 브랜드가 두 개로 갈라진다.
 * ★ 어두운 배경(푸터)에서는 원본이 짙은 회색이라 안 보인다. CSS 필터로 반전시킨다 —
 *   흰색 버전 파일을 따로 받으면 `tone="light"` 분기를 그 파일로 바꾸면 된다.
 * ★ priority — 헤더 로고는 첫 화면에 반드시 보이는 이미지라 지연 로딩하지 않는다.
 *
 * @param tightWidths 자리가 빠듯한 구간에서 워드마크를 접고 마크만 둘지.
 *   ⚠️ **헤더만** true 다. 푸터는 자리가 넉넉하므로 늘 워드마크를 보여 준다 —
 *      기본값을 true 로 바꾸면 푸터에서도 병원 이름이 사라진다.
 */
export function LogoLockup({
  tone = 'brand',
  tightWidths = false,
}: {
  tone?: 'brand' | 'light';
  tightWidths?: boolean;
}) {
  if (!tightWidths) {
    return (
      <Image
        src={IMG.logo}
        alt="동그라미치과의원 CIRCLE DENTAL CLINIC"
        width={214}
        height={44}
        priority
        className={`block h-[38px] w-auto sm:h-[42px] ${tone === 'light' ? 'brightness-0 invert' : ''}`}
      />
    );
  }
  return (
    <>
      {/*
        ⚠️⚠️ 1024~1159px 에서만 **마크만** 보인다 (2026-09-14 실측) ⚠️⚠️
          이 구간은 데스크톱 메뉴가 켜지는(lg=1024) 첫 구간인데 메뉴 여섯 개가
          아직 안 들어간다. 실측으로 세 요소가 필요한 폭은
            워드마크 179 + 메뉴 752 + 예약 112 + 간격 32 = 1075px
          인데 1024px 창의 안쪽 폭은 960px 이다 — 115px 이 모자란다.
          예전에는 그 모자람을 **로고가 혼자 눌려서** 메웠다(1024px 에서 49x42, 원래 179x42).
        ★ 그래서 이 구간에서는 워드마크를 접고 마크(42px)만 둔다 — 135px 이 남아 들어간다.
        ★ 1160px 부터, 그리고 모바일(1024 미만, 메뉴가 서랍으로 들어간 구간)에서는
          워드마크를 그대로 보여 준다. 병원 이름이 보이는 쪽이 늘 낫다.
        ⚠️ 링크와 aria-label 은 바깥(SiteHeader)에 있어 마크만 보여도 병원명은 읽힌다.
           alt 를 지우지 말 것 — 워드마크가 보이는 구간에서는 이 글자가 이름을 대신한다.
      */}
      {/*
        ⚠️ 구간을 **한 규칙**으로 적는다 — `lg:hidden` 과 `min-[1160px]:block` 을 따로
           쓰면 안 된다. 두 규칙의 순서가 Tailwind 가 정하는 대로라 1160px 이상에서도
           `lg:hidden` 이 이겨서 워드마크가 영영 안 나왔다(2026-09-14 실측).
           `lg:max-[1159px]:` 는 `@media (min-width:1024px) and (max-width:1159px)` 한 줄이라
           기본값과 부딪히지 않는다.
      */}
      <span className="hidden lg:max-[1159px]:block" aria-hidden>
        <LogoMark size={42} tone={tone} />
      </span>
      <Image
        src={IMG.logo}
        alt="동그라미치과의원 CIRCLE DENTAL CLINIC"
        width={214}
        height={44}
        priority
        className={`block h-[38px] w-auto sm:h-[42px] lg:max-[1159px]:hidden ${
          tone === 'light' ? 'brightness-0 invert' : ''
        }`}
      />
    </>
  );
}

/**
 * 마크만 — 섹션 장식, 파비콘성 용도, 그리고 **헤더 알약 안의 로고**.
 *
 * @param tone 어두운 면에 놓을 때는 'light'.
 *   ⚠️ 기본값(brand)은 갈색 원이라 **어두운 유리 위에서 거의 안 보인다**(실제로 그랬다).
 *      어두운 면에서는 원을 밝게, 치아를 어둡게 뒤집는다. 색만 바꾸는 것으로는 안 된다 —
 *      원과 치아가 서로의 반대색이어야 형태가 읽힌다.
 */
export function LogoMark({ size = 44, tone = 'brand' }: { size?: number; tone?: 'brand' | 'light' }) {
  const light = tone === 'light';
  const ring = light ? 'rgba(255,255,255,0.55)' : 'var(--color-brand-400)';
  const body = light ? '#fefffc' : 'var(--color-brand-700)';
  const tooth = light ? '#1f1f29' : '#fff';
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden focusable="false">
      <path
        d="M24 2.5a21.5 21.5 0 1 0 0 43"
        stroke={ring}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="17" fill={body} />
      <circle cx="34" cy="14" r="4.2" fill={body} />
      <path
        d="M24 14.6c-3.5 0-6 2.2-6 5.4 0 2.3.62 3.75 1.05 5.4.42 1.66.52 3.4.74 4.7.22 1.3.65 2.6 1.65 2.6 1 0 1.22-1.1 1.43-2.4.22-1.3.44-2.5 1.13-2.5.7 0 .92 1.2 1.13 2.5.21 1.3.43 2.4 1.43 2.4 1 0 1.43-1.3 1.65-2.6.22-1.3.32-3.04.74-4.7.43-1.65 1.05-3.1 1.05-5.4 0-3.2-2.5-5.4-6-5.4Z"
        fill={tooth}
      />
    </svg>
  );
}

/**
 * 글자 워드마크 — 헤더 전용 (2026-09-17 오너: "헤더도 목업에 맞게").
 *
 * ★ 목업의 머리는 세리프 '동그라미치과' 와 그 아래 작은 영문 한 줄이다. 그림 로고 대신 글자로 쓴다.
 * ⚠️ 영문은 병원의 실제 영문명(CIRCLE DENTAL CLINIC)이다 — 목업의 'DONGGRAMI' 는 디자이너 임시 표기.
 * ⚠️ 한글은 서브셋 글꼴(Gowun Batang)이다. '동그라미치과' 여섯 자는 홈 제목에 이미 있어 서브셋에 들어 있다.
 *    다른 글자로 바꾸면 scripts/subset-gowun.py 를 다시 돌릴 것.
 * ⚠️ 푸터는 그대로 그림 로고(LogoLockup)를 쓴다 — 간판·명함과 같은 실물 로고가 한 군데는 있어야 한다.
 */
export function Wordmark({ tone = 'brand' }: { tone?: 'brand' | 'light' }) {
  const light = tone === 'light';
  return (
    <span className="flex items-center gap-2.5">
      {/*
        ★ 동그라미 마크 — 실제 로고 파일(IMG.logo)에서 마크 부분만 잘라 낸 것(public/img/logo-mark.png).
          2026-09-17 오너: "헤더에 동그라미치과 로고 들어가야지". 글자 워드마크 왼쪽에 실물 마크를 둔다.
        ⚠️ 그린 SVG(LogoMark)가 아니라 **원본 로고의 마크**다 — 간판·명함과 같은 모양이어야 한다.
      */}
      <Image
        src="/img/logo-mark.png"
        alt=""
        width={112}
        height={106}
        priority
        className={`h-[36px] w-auto sm:h-[40px] ${light ? 'brightness-0 invert' : ''}`}
      />
      <span className="flex flex-col leading-none">
      <span
        className={`serif-head text-[21px] tracking-[-0.01em] sm:text-[23px] ${light ? 'text-white' : 'text-charcoal'}`}
      >
        동그라미치과
      </span>
      <span
        className={`display-en mt-1 text-[8.5px] tracking-[0.26em] uppercase sm:text-[9.5px] ${
          light ? 'text-white/70' : 'text-ash'
        }`}
      >
        Circle Dental Clinic
      </span>
      </span>
    </span>
  );
}
