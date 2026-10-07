import Image from 'next/image';
import { CLINIC } from '@/lib/clinic';
import { IMG } from '@/lib/assets';
import { Container, Breadcrumb, Sentences, MaskWords } from '@/components/ui';
import { headingId } from '@/components/article';

/**
 * 치과소개 메뉴(병원 소개·의료진·근거·첫 방문·오시는 길·특별함) 의 머리말.
 *
 * ★★ 사진을 **배경**으로 (2026-09-28 오너: "치과 소개 하위메뉴들까지 왜 사진이 배경으로 안 갔어,
 *    다른 서브페이지처럼? 그것만 통일해") ★★
 *   진료 메뉴 페이지들은 TreatmentHero(components/TreatmentShell.tsx) — 사진 배경 · 두 겹 덮개 ·
 *   가운데 흰 세리프 제목 · 예약/전화 단추 — 인데, 여기만 '왼쪽 글 + 오른쪽 사진 액자'(09-16 판)라
 *   메뉴를 넘길 때 다른 사이트처럼 보였다. **TreatmentHero 와 같은 짜임·같은 값**으로 맞춘다.
 * ⚠️ 덮개 두 겹을 걷지 말 것 — 흰 글자를 사진 위에 올리는 구조에서 덮개는 조건이다(TreatmentShell 머리말의 반려 이력).
 * ⚠️ 덮개 색은 TreatmentHero 와 같은 중성 먹색(SCRIM). 여기만 다른 값을 쓰면 메뉴 사이에서 색이 튄다.
 * ⚠️ h1 id(headingId)는 남긴다 — 답변 엔진이 문서 전체가 아니라 이 제목을 지목해 인용한다.
 */

/** TreatmentShell.tsx 의 SCRIM 과 같은 값 — 한쪽만 바꾸지 말 것 */
const SCRIM = '30,28,25';

/**
 * 띠에 깔 병원 사진 — 이름표로 고른다.
 * ⚠️ 페이지가 파일 경로를 알 필요가 없게 여기 한 곳에 모은다. 사진을 바꾸면 여기만 고친다.
 */
const PHOTOS = {
  corridor: IMG.interior[2], // 진료실로 이어지는 복도 — 시선이 가운데로 모인다
  booth: IMG.interior[0], // 유리 파티션 상담 부스
  consult: IMG.interior[3], // 엑스레이 화면을 놓고 설명하는 장면
  room: IMG.interior[1], // 창가 진료실
  sterile: IMG.interior[5], // 멸균 기구를 꺼내는 장면
} as const;

export type AboutHeroPhoto = keyof typeof PHOTOS;

export function AboutHero({
  trail,
  eyebrow,
  title,
  lead,
  photo,
  position = '50% 42%',
}: {
  trail: { name: string; path: string }[];
  /** 제목 위 한 줄. 없으면 지역명 + 병원 이름(진료 페이지 눈썹과 같은 자리·같은 색). */
  eyebrow?: string;
  /**
   * ⚠️ 되도록 문자열로 줄 것 — 문자열일 때만 앵커 id 가 붙는다.
   */
  title: React.ReactNode;
  lead?: string;
  photo: AboutHeroPhoto;
  /** 사진에서 살릴 부분. 인물이나 표지가 잘리면 여기로 옮긴다. */
  position?: string;
}) {
  const brow = eyebrow ?? `${CLINIC.address.locality} ${CLINIC.address.dong} · ${CLINIC.name}`;
  return (
    /* ⚠️ 음수 margin + 같은 값의 padding — 띠가 헤더 뒤까지 올라간다. TreatmentHero 와 같은 수치. */
    <section data-hero className="relative isolate -mt-[68px] overflow-hidden bg-night pt-[112px] pb-16 sm:-mt-[94px] sm:pt-[154px] sm:pb-24 lg:pb-32">
      {/* ⚠️ alt 를 채우지 말 것 — 장식 사진이다. 뜻은 제목이 전부 진다. */}
      {/* 2026-09-29 모션: TreatmentHero 와 같다 — 사진이 스며 나오며 가라앉고, 내리면 느리게 내려간다(.hero-sub-photo). */}
      <div aria-hidden className="hero-sub-photo">
        <Image
          src={PHOTOS[photo].src}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: position }}
        />
      </div>

      {/* 두 겹 덮개 — 방사형(가운데를 살림) + 선형(위아래를 눌러 줌). TreatmentHero 와 같은 값. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(80% 64% at 50% 38%, rgba(${SCRIM},0.45) 0%, rgba(${SCRIM},0.76) 62%, rgba(${SCRIM},0.88) 100%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(${SCRIM},0.66) 0%, rgba(${SCRIM},0.40) 38%, rgba(${SCRIM},0.82) 100%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(56%_42%_at_50%_-6%,rgba(185,196,202,0.14)_0%,transparent_66%)]"
      />

      <Container className="hero-sub-copy relative text-center">
        <div className="mb-10 flex justify-center">
          <Breadcrumb trail={trail} tone="dark" />
        </div>

        <p className="enter text-[13.5px] font-black text-clay-200" style={{ animationDelay: '40ms' }}>
          {brow}
        </p>

        <h1
          id={typeof title === 'string' ? headingId(title) : undefined}
          className="hero-words serif-head mx-auto mt-7 max-w-[16em] scroll-mt-28 text-[clamp(32px,5.4vw,62px)] leading-[1.2] text-parchment"
        >
          {/* 어절이 가림막 뒤에서 차례로 솟는다(페이지가 열리면 바로). ⚠️ 관형형+의존명사 묶음(bindKo)은 MaskWords 안에서 한다. */}
          {typeof title === 'string' ? <MaskWords text={title} mode="load" start={120} /> : title}
        </h1>

        {/* 넓은 화면은 문장 하나 = 한 줄(선치과 규칙, 2026-10-07) — 34em(612px)에 갇혀 620~830px 문장이 반으로 쪼개졌다 → lg 50em(900px) */}
        {lead ? (
          <p
            className="lead enter mx-auto mt-8 max-w-[34em] text-[18px] leading-[1.9] text-parchment/85 lg:max-w-[50em]"
            style={{ animationDelay: '260ms' }}
          >
            {/* ⚠️ tone="dark" 를 빼지 말 것 — 빼면 강조가 밝은 면용 짙은 색으로 나와 읽히지 않는다. */}
            <Sentences text={lead} tone="dark" />
          </p>
        ) : null}

        {/* 휴대폰에서는 감춘다 — 하단 고정 바에 예약·전화가 늘 떠 있다(TreatmentHero 와 같은 규칙). */}
        <div className="enter mt-10 hidden flex-wrap justify-center gap-3 sm:flex" style={{ animationDelay: '380ms' }}>
          <a
            href={CLINIC.booking.naver}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-parchment px-8 py-4 text-[17px] font-semibold text-dusk transition-opacity hover:opacity-90"
          >
            진료 예약하기 <span aria-hidden>→</span>
          </a>
          <a
            href={CLINIC.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-parchment/80 px-8 py-4 text-[17px] font-semibold tabular-nums text-parchment transition-colors hover:bg-white/10"
          >
            {CLINIC.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
