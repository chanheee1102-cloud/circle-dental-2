import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { IMG } from '@/lib/assets';
import { DOCTORS, PUBLICATION_DETAIL } from '@/lib/doctors';
import {
  HERO_PHOTO,
  PRINCIPLES,
  PRINCIPLE_STATEMENT,
  HOME_CONCERNS,
  PRESERVE_PHOTO,
  TOUR_PHOTOS,
  STORY_TILES,
  STORY_BRAND_TILE,
  doctorPhoto,
} from '@/lib/homeContent';
import { Container, Sentences } from '@/components/ui';
import { HomeHead, FillBtn, LineBtn, QuietLink } from '@/components/home';
import { PRINCIPLE_ICONS } from '@/components/PrincipleIcons';
import { DoctorShowcase } from '@/components/DoctorShowcase';
import { CopyButton } from '@/components/CopyButton';
import { ClinicMap } from '@/components/ClinicMap';
import { Reveal } from '@/components/Reveal';
import { JsonLd } from '@/components/JsonLd';
import { medicalWebPageSchema, imageObjectSchema } from '@/lib/seo';
import { imageMeta } from '@/lib/imageSize';

export const metadata: Metadata = {
  title: `${CLINIC.name} | 고양시 덕양구 화정동 치과`,
  description:
    '고양시 덕양구 화정동 동그라미치과의원. 뽑기 전에 한 번 더 살펴보고, 자연치아를 오래 사용할 수 있도록 필요한 치료부터 함께 판단합니다. 자연치아살리기·임플란트·심미치료·사랑니치료. 화·목 야간진료 오후 8시 30분까지.',
  alternates: { canonical: '/' },
};

/**
 * 홈 — 디자인 수정 요청서(2026-09-16, sukho) + 목업 8장 기준. 2026-09-17 목업에 더 가깝게 다시 짰다.
 *
 * ★★ 요청서가 정한 것 ★★
 *   · "흰 배경 + 파란 포인트 + 의료진 정면 사진 + 정보 카드" 의 전형을 피한다.
 *   · 신뢰는 장비·문구가 아니라 **사진·여백·색·타이포**로 느끼게 한다.
 *   · 아이보리 바탕에 충분한 여백, 블루그레이는 필요한 곳에만.
 *
 * ★ 구획 순서 (목업 순서 그대로)
 *   1 Hero        뽑기 전에, 한 번 더 살펴봅니다 — 아래에 SCROLL · FOR A LONGER HEALTHIER SMILE
 *   2 Principles  동그라미가 가장 먼저 생각하는 것 — 원 안 선 아이콘 + 01~04, 그 아래 한 문장
 *   3 Concerns    어떤 고민이 있으신가요? — 사진 왼쪽·말 오른쪽의 가로 카드(아이보리 한 단)
 *   4 Preserve    자연치아 보존 — 어두운 블루그레이 띠 (페이지에서 유일한 어두운 면)
 *   5 Doctors     한 사람씩 크게(사진·이름·경력 펼침면, 이름 탭·‹ 1/3 ›) + 아래 블루그레이 면에 논문·인증
 *   6 Tour        둘러보기
 *   7 Story       인스타그램 줄 + 2×2 타일
 *   8 Visit       원 안 아이콘 세 줄(주소·진료시간·전화) + 예약·전화 버튼 + 지도
 *
 * ⚠️ 목업과 일부러 다르게 둔 것 (사실 관계)
 *   · 헤더 워드마크의 영문은 CIRCLE DENTAL CLINIC 이다(lib/clinic.ts). 목업의 'DONGGRAMI DENTAL CLINIC' 은
 *     디자이너 임시 표기라 쓰지 않는다(components/Logo.tsx Wordmark).
 *   · 의료진 사진은 **본인이 확인되는 사진**만 쓴다(lib/doctors.ts). 목업의 진료 장면 사진은
 *     누구인지 특정할 수 없어 이름 아래 둘 수 없다. 원장 말투의 인용문도 본인 말이 아니면 넣지 않는다.
 *   · 이야기 타일의 재생 표시는 영상 채널이 없어 넣지 않았다(재생 표시는 영상이 있다는 약속이다).
 * ⚠️ 사진은 이 병원의 실제 사진이다(lib/homeContent.ts). 스톡을 넣지 말 것.
 *    예외는 AI 생성 정물 3장(gen/ — 보존 띠·이야기 2·4번 타일, 2026-09-17 오너 GO)뿐이며 사물만 그렸다.
 * ⚠️ 채운 버튼은 화면당 하나 — 히어로 '진료 알아보기', 오시는 길 '네이버 예약하기'.
 * ⚠️ FAQ 구획을 되살리려면 faqSchema 도 함께 되살릴 것(보이는 것과 알리는 것이 어긋난다).
 */
export default function HomePage() {
  const heroImage = imageMeta(HERO_PHOTO.src, HERO_PHOTO.alt);

  return (
    <>
      <JsonLd
        data={[
          medicalWebPageSchema({
            title: `${CLINIC.name} — 고양시 덕양구 화정동 치과`,
            description: metadata.description as string,
            path: '/',
            image: heroImage,
          }),
          heroImage ? imageObjectSchema({ path: '/', ...heroImage }) : null,
        ]}
      />
      <Hero />
      <PrinciplesSection />
      <ConcernsSection />
      <PreserveBand />
      <DoctorsSection />
      <TourSection />
      <StorySection />
      <VisitSection />
    </>
  );
}

/* ─────────────────────────── 1. 첫 화면 ─────────────────────────── */
/*
 * ★ 사진이 **배경**이다 (2026-09-17 오너: "히어로 섹션 사진을 배경으로 넣어").
 *   헤더 아래로 파고들어(-mt) 화면 맨 위부터 사진이고, 헤더는 그 위에서 투명하다
 *   (SiteHeader 의 overHero — 홈 맨 위에서만). ⚠️ -mt 값은 헤더 높이(68/94)와 같아야 한다.
 * ★ 글자는 사진의 아래·왼쪽에 선다. 그 자리만 .hero-shade 가 어둡게 눌러 흰 글자가 읽힌다.
 * ★ 채운 버튼은 사진 위에서 **흰색**(FillBtn tone=dark) — 어두운 덮개 위에 dusk 를 채우면 묻힌다.
 * ⚠️ 좁은 화면의 아래 여백(pb)은 하단 고정 바(QuickMenu) 높이만큼 더 둔다. 안 그러면 버튼이 바 밑에 깔린다.
 */
function Hero() {
  return (
    <section className="relative isolate -mt-[68px] flex min-h-[100svh] flex-col justify-end overflow-hidden bg-wine-deep text-parchment sm:-mt-[94px]">
      <Image
        src={HERO_PHOTO.src}
        alt={HERO_PHOTO.alt}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[62%_30%]"
      />
      <div aria-hidden className="hero-shade absolute inset-0 -z-10" />

      <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-end px-5 pt-[120px] pb-[104px] sm:px-8 lg:min-h-[100svh] lg:pt-[160px] lg:pb-[108px] xl:px-16">
        <div className="max-w-[34em]">
          <h1 className="enter serif-head on-photo text-[clamp(38px,5.4vw,66px)] text-white">
            뽑기 전에,
            <br />
            한 번 더 살펴봅니다.
          </h1>
          <p
            className="enter on-photo mt-6 max-w-[30em] text-[17.5px] leading-[1.9] text-white/88 sm:text-[18.5px]"
            style={{ animationDelay: '80ms' }}
          >
            자연치아를 오래 사용할 수 있도록
            <br /> 필요한 치료부터 함께 판단합니다.
          </p>
          <div
            className="enter mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '160ms' }}
          >
            <FillBtn href="/treatment" tone="dark">
              진료 알아보기
            </FillBtn>
            <LineBtn href={CLINIC.booking.naver} external tone="dark">
              예약하기
            </LineBtn>
          </div>
          {/* ⚠️ 지역명은 첫 화면에 남긴다 — "화정동 치과" 질의의 근거가 이 자리다. */}
          <p
            className="enter on-photo mt-7 text-[14px] text-white/75"
            style={{ animationDelay: '240ms' }}
          >
            {CLINIC.address.locality} {CLINIC.address.dong} · {CLINIC.nearestStation} 인근 ·{' '}
            <a href={CLINIC.phoneHref} className="tabular-nums hover:text-white">
              {CLINIC.phone}
            </a>
          </p>
        </div>

        {/* 목업의 바닥 줄 — 왼쪽 SCROLL 과 세로선, 오른쪽에 네 줄 영문. 좁은 화면에도 둔다. */}
        <div
          className="enter mt-12 flex items-end justify-between text-white/75 lg:mt-16"
          style={{ animationDelay: '360ms' }}
        >
          <p className="scroll-cue kicker text-inherit">Scroll</p>
          <p className="kicker text-right leading-[1.9] text-inherit">
            For a
            <br />
            longer
            <br />
            healthier
            <br />
            smile
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── 2. 가장 먼저 생각하는 것 ─────────────────────────── */
function PrinciplesSection() {
  return (
    <section className="section-y-home">
      <Container>
        <div className="grid gap-x-20 gap-y-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_1fr]">
          {/* 제목 — 오른쪽 위에 옅은 잎 장식(목업). 장식이라 색을 아주 옅게, 글을 가리지 않게. */}
          <div className="reveal relative lg:col-start-1">
            <LeafDeco />
            <p className="eyebrow-chip text-ash">진료 철학</p>
            <h2 className="serif-head mt-4 text-[clamp(28px,4vw,44px)] text-charcoal">
              동그라미가
              <br />
              가장 먼저 생각하는 것
            </h2>
          </div>

          {/* 01~04 — 원 안 선 아이콘, 작은 번호, 한 줄 제목. 좁은 화면에서는 제목 바로 아래. */}
          <ol className="reveal-stack divide-y divide-wine-line border-b border-wine-line lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:border-t">
            {PRINCIPLES.map((p, i) => {
              const Icon = PRINCIPLE_ICONS[i] ?? PRINCIPLE_ICONS[0];
              return (
                <li key={p.n} className="flex items-center gap-5 py-6 first:pt-0 lg:py-7 lg:first:pt-7">
                  <span className="icon-ring">
                    <Icon />
                  </span>
                  <span className="min-w-0">
                    <span className="kicker block text-[11px]">{p.n}</span>
                    <span className="mt-1 block text-[17.5px] leading-[1.5] text-charcoal sm:text-[19px]">
                      {p.title}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>

          {/* 한 문장과 다음 페이지로 가는 줄 — 좁은 화면에서는 목록 아래, 넓은 화면에서는 제목 아래. */}
          <div className="reveal lg:col-start-1 lg:self-end">
            <p className="max-w-[26em] text-[17px] leading-[1.9] text-charcoal/85">
              <Sentences text={PRINCIPLE_STATEMENT} />
            </p>
            <div className="mt-7">
              <QuietLink href="/about">동그라미의 진료 철학</QuietLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** 잎 장식 — 목업 두 번째 화면의 옅은 가지. 단색 면, 아주 옅게. 뜻이 없으므로 aria-hidden. */
function LeafDeco() {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 120 170"
      className="pointer-events-none absolute -top-14 right-0 h-[170px] w-[120px] text-brand-400 opacity-[0.16] lg:-top-16 lg:right-6"
    >
      <path d="M52 166C56 122 66 80 100 24" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M72 96c-3-20 9-36 30-38-1 20-12 35-30 38Z" fill="currentColor" />
      <path d="M62 126c-19-6-30-23-27-43 18 6 30 23 27 43Z" fill="currentColor" />
      <path d="M84 60c-1-15 8-26 23-28 0 15-9 26-23 28Z" fill="currentColor" />
      <path d="M58 150c-15-4-24-17-22-33 14 4 24 17 22 33Z" fill="currentColor" />
    </svg>
  );
}

/* ─────────────────────────── 3. 어떤 고민이 있으신가요 ─────────────────────────── */
function ConcernsSection() {
  return (
    <section className="section-y-home border-t border-wine-line">
      <Container>
        <HomeHead
          label="진료"
          title="어떤 고민이 있으신가요?"
          asideInline
          aside={<QuietLink href="/treatment">전체 보기</QuietLink>}
        />
        {/*
          가로 카드 — 사진 왼쪽, 환자의 말 오른쪽, 아이보리 한 단 들어간 면(목업).
          넓은 화면에서는 다섯 장이 한 줄에 서야 하므로 사진을 위로 올린다(같은 카드, 방향만 다르다).
        */}
        <ul className="reveal-stack mt-10 grid grid-cols-1 gap-3 lg:mt-12 lg:grid-cols-5 lg:gap-4">
          {HOME_CONCERNS.map((c) => (
            <li key={c.href + c.quote}>
              {/*
                ⚠️ 카드 높이는 다섯 장이 같아야 한다 (2026-09-17 오너: "카드 크기 다 맞춰. 뒤죽박죽").
                   말의 길이가 한 줄·두 줄로 달라서 카드마다 키가 달랐다 → 카드는 h-full 로 줄 높이를
                   다 채우고, 글 칸은 flex-1, 진료 이름은 mt-auto 로 **바닥에 정렬**한다.
              */}
              <Link
                href={c.href}
                className="photo-card group flex h-full overflow-hidden rounded-[6px] bg-wine-soft transition-colors hover:bg-brand-200/70 lg:flex-col"
              >
                <div className="relative aspect-[4/3] w-[42%] shrink-0 overflow-hidden lg:w-full">
                  <Image
                    src={c.photo.src}
                    alt={c.photo.alt}
                    fill
                    sizes="(max-width: 1024px) 42vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center px-5 py-4 lg:justify-start lg:px-5 lg:py-5">
                  <p className="text-[16.5px] leading-[1.45] font-medium text-charcoal lg:text-[17px]">
                    {c.quote}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[13.5px] text-ash lg:mt-auto lg:pt-3">
                    {c.tag}
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 4. 자연치아 보존 띠 ─────────────────────────── */
function PreserveBand() {
  return (
    <section className="relative isolate overflow-hidden bg-wine-deep text-parchment">
      <Image
        src={PRESERVE_PHOTO.src}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[70%_60%] lg:object-[80%_50%]"
      />
      <div aria-hidden className="tint-bluegray absolute inset-0 -z-10" />
      <Container className="py-28 pb-[60vw] sm:pb-[44vw] lg:py-40">
        <div className="reveal max-w-[34em]">
          <p className="kicker text-parchment/70">
            Natural
            <br />
            together
            <br />
            for a longer smile
          </p>
          <h2 className="serif-head mt-7 text-[clamp(30px,4.4vw,50px)] text-parchment">
            자연치아 보존,
            <br />
            가능할 때가 가장 좋습니다.
          </h2>
          <p className="mt-7 max-w-[28em] text-[17.5px] leading-[1.9] text-parchment/85">
            살릴 수 있는 치아인지 정확하게 판단하고,
            <br className="hidden sm:block" /> 가능한 방법을 함께 찾아갑니다.
          </p>
          <div className="mt-9">
            <QuietLink href="/treatment/save-natural-tooth" tone="dark">
              자연치아 보존 자세히 보기
            </QuietLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 5. 의료진 ─────────────────────────── */
function DoctorsSection() {
  const doctors = DOCTORS.map((d) => ({
    slug: d.slug,
    name: d.name,
    role: d.role,
    license: d.license,
    keyCareer: d.keyCareer,
    careerCount: d.career.length,
    societyCount: d.societies.length,
    photo: doctorPhoto(d.slug, d.photo),
  }));
  return (
    <section className="section-y-home">
      <Container>
        <HomeHead
          label="의료진"
          title={
            <>
              동그라미치과의
              <br />
              의료진을 소개합니다.
            </>
          }
          /*
           * ⚠️ 문구는 lib/doctors.ts 로 확인되는 범위만 — '10년 이상 경력'·'교수 출신' 은
           *    근거가 없어 쓰지 않는다(app/page.tsx 이전 판의 주석과 같은 이유).
           */
          desc="경희대학교 치의학전문대학원 외래교수인 대표원장과 보건복지부 인정 통합치의학과 전문의로 구성된 의료진이 진료합니다."
        />

        <div className="reveal mt-12 lg:mt-16">
          <DoctorShowcase doctors={doctors} />
        </div>
      </Container>

      {/*
        근거 · 인증 — 의료진 아래 한 단 들어간 아이보리 면 (2026-09-17 오너: "인증 쪽 전문적으로").
        ★ 인증패 사진은 원본이 236px 라 크게 쓰면 뭉개진다 → 작은 표식으로만 두고 **이름을 글자로** 읽힌다.
        ★ 논문은 한 줄이 아니라 제 자리를 준다 — 세로 사진(768×800)과 제목, 한국어 풀이 한 문장.
        ⚠️ 라벨·문구는 lib/assets.ts / lib/doctors.ts 원문 그대로다. 새 인증을 여기서 적지 않는다.
      */}
      {/*
        ★ 블루그레이 면 (2026-09-17 오너: "논문·인증 쪽 블루그레이로 전문적으로").
          요청서의 포인트 색을 **면**으로 쓰는 자리는 페이지에서 여기와 보존 띠뿐이다 — 더 늘리지 말 것.
          글자는 흰색·parchment, 선은 흰색 18%, 표식은 흰 원. 논문 사진은 종이가 보이게 **아래를 맞춘다**
          (원본 768×800 의 위 절반은 흐린 배경이고 논문 제목은 아래에 있다).
      */}
      <div className="mt-20 bg-dusk text-parchment lg:mt-28">
        <Container className="py-16 lg:py-24">
          <div className="reveal grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-24">
            <div className="grid gap-7 sm:grid-cols-[168px_minmax(0,1fr)] sm:gap-9">
              <div className="relative aspect-[24/25] w-[168px] overflow-hidden rounded-[6px] bg-white/10 ring-1 ring-white/15">
                <Image
                  src={PUBLICATION_DETAIL.image}
                  alt="발표 논문 첫 장 — 제목과 저자"
                  fill
                  sizes="168px"
                  className="object-cover object-bottom"
                />
              </div>
              <div>
                <p className="eyebrow-chip text-mist/75">발표 논문</p>
                <p className="serif-head mt-4 text-[clamp(20px,1.8vw,25px)] leading-[1.45] text-white">
                  {PUBLICATION_DETAIL.title}
                </p>
                <p className="mt-3 text-[14px] text-mist/70">{PUBLICATION_DETAIL.authors}</p>
                <p className="mt-5 max-w-[36em] text-[15.5px] leading-[1.85] text-parchment/85">
                  {PUBLICATION_DETAIL.relevanceKo}
                </p>
              </div>
            </div>

            <div>
              <p className="eyebrow-chip text-mist/75">인증 · 수료</p>
              <ul className="mt-4 divide-y divide-white/15 border-y border-white/15">
                {IMG.credentials.map((c, i) => (
                  <li key={c.src} className="flex items-center gap-4 py-4">
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-white/40">
                      <Image src={c.src} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    <span className="kicker w-6 text-[11px] text-white/60">0{i + 1}</span>
                    <span className="text-[15.5px] leading-[1.5] text-white">{c.label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <QuietLink href="/about/trust" tone="dark">
                  근거 · 인증 전체 보기
                </QuietLink>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

/* ─────────────────────────── 6. 둘러보기 ─────────────────────────── */
function TourSection() {
  return (
    <section className="section-y-home border-t border-wine-line">
      <Container>
        <HomeHead
          label="공간"
          title={
            <>
              동그라미치과
              <br />
              둘러보기
            </>
          }
        />
        <div className="reveal mt-12 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="img-in relative aspect-[4/3] overflow-hidden rounded-[8px] bg-wine-soft lg:aspect-auto">
            <Image
              src={TOUR_PHOTOS.main.src}
              alt={TOUR_PHOTOS.main.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {TOUR_PHOTOS.sub.map((s) => (
              <div key={s.src} className="img-in relative aspect-[4/3] overflow-hidden rounded-[8px] bg-wine-soft">
                <Image src={s.src} alt={s.alt} fill sizes="(max-width: 1024px) 50vw, 40vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="reveal mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[26em] text-[17px] leading-[1.9] text-ash">
            편안하고 안전한 진료 환경에서
            <br className="hidden sm:block" /> 늘 같은 마음으로 진료합니다.
          </p>
          <QuietLink href="/about/tour">둘러보기</QuietLink>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 7. 이야기 ─────────────────────────── */
function StorySection() {
  return (
    <section className="section-y-home border-t border-wine-line">
      <Container>
        <HomeHead
          label="이야기"
          title={
            <>
              더 건강한 미소를 위한
              <br />
              동그라미의 이야기
            </>
          }
        />
        {/* 인스타그램 줄 — 왼쪽에 아이콘과 계정, 오른쪽 끝에 화살표(목업). 블로그는 그 옆에 조용히. */}
        <div className="reveal mt-8 flex items-center justify-between gap-6 border-y border-wine-line py-4">
          <a
            href={CLINIC.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-w-0 items-center gap-3 text-[15.5px] font-medium text-charcoal"
          >
            <span className="icon-ring icon-ring-sm">
              <InstagramGlyph />
            </span>
            <span className="truncate">@circle_dental</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <a
            href={CLINIC.social.naverBlog}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-[14.5px] text-ash transition-colors hover:text-charcoal"
          >
            네이버 블로그 <span aria-hidden>→</span>
          </a>
        </div>
        <ul className="reveal-stack mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {STORY_TILES.map((t) => (
            <li key={t.src} className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-wine-soft">
              <Image src={t.src} alt={t.alt} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-wine-deep/75 via-wine-deep/20 to-transparent" />
              <p className="serif-head on-photo absolute inset-x-5 bottom-5 whitespace-pre-line text-[clamp(18px,1.7vw,24px)] leading-[1.45] text-parchment">
                {t.line}
              </p>
            </li>
          ))}
          {/* 네 번째 — 사진 위, 아이보리 판 아래(목업). 병원 영문명과 한 줄. */}
          <li className="flex aspect-[4/5] flex-col overflow-hidden rounded-[6px] border border-wine-line bg-white">
            <div className="relative min-h-0 flex-1">
              <Image
                src={STORY_BRAND_TILE.src}
                alt={STORY_BRAND_TILE.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="px-4 pt-4 pb-4 lg:px-5">
              <p className="kicker text-[10.5px]">{CLINIC.nameEn}</p>
              <p className="serif-head mt-1.5 text-[clamp(15px,1.3vw,19px)] leading-[1.4] text-charcoal">
                {CLINIC.tagline}
              </p>
            </div>
          </li>
        </ul>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 8. 오시는 길 ─────────────────────────── */
function VisitSection() {
  const { hours } = UNVERIFIED;
  return (
    <section className="section-y-home border-t border-wine-line">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <HomeHead label="내원 안내" title="오시는 길" />

            {/*
              원 안 아이콘 세 줄(목업) — 주소 · 진료시간 · 전화. 주차는 /visit 에 있다.
              ⚠️ 라벨 글자 대신 아이콘이 뜻을 지므로 sr-only 로 이름을 남긴다.
            */}
            <Reveal delay={60}>
              <ul className="mt-10 space-y-8">
                <li className="flex items-start gap-5">
                  <span className="icon-ring">
                    <PinIcon />
                  </span>
                  <div className="min-w-0 pt-1.5 text-[16.5px] leading-[1.75] text-charcoal">
                    <span className="sr-only">주소</span>
                    <span className="block">{CLINIC.address.full}</span>
                    <span className="mt-0.5 block text-[15px] text-ash">
                      {CLINIC.address.building} · {CLINIC.nearestStation} 인근
                    </span>
                    <span className="mt-3 block">
                      <CopyButton text={CLINIC.address.full} />
                    </span>
                  </div>
                </li>

                {hours.verified && (
                  <li className="flex items-start gap-5">
                    <span className="icon-ring">
                      <ClockIcon />
                    </span>
                    <div className="min-w-0 flex-1 pt-1.5 text-[16.5px] leading-[1.75] text-charcoal">
                      <span className="sr-only">진료시간</span>
                      {hours.display.map((h) => (
                        <span key={h.label} className="flex justify-between gap-4 sm:max-w-[22em]">
                          <span>
                            {h.label}
                            {h.note ? <span className="ml-2 text-[14px] text-ash">{h.note}</span> : null}
                          </span>
                          <span className="tabular-nums">{h.time}</span>
                        </span>
                      ))}
                      <span className="mt-1 block text-[15px] text-ash">{hours.closed}</span>
                    </div>
                  </li>
                )}

                <li className="flex items-center gap-5">
                  <span className="icon-ring">
                    <PhoneIcon />
                  </span>
                  <div>
                    <span className="sr-only">전화</span>
                    <a
                      href={CLINIC.phoneHref}
                      className="tabular-nums text-[26px] leading-none font-medium text-charcoal transition-colors hover:text-dusk sm:text-[30px]"
                    >
                      {CLINIC.phone}
                    </a>
                  </div>
                </li>
              </ul>
            </Reveal>

            {/* 좁은 화면에서는 두 버튼이 세로로 꽉 차고(목업), 넓은 화면에서는 나란히. */}
            <Reveal delay={100}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <FillBtn
                  href={CLINIC.booking.naver}
                  external
                  label="네이버 예약하기 — 새 창으로 열기"
                  className="w-full sm:w-auto"
                >
                  <NaverGlyph /> 네이버 예약하기
                </FillBtn>
                <LineBtn href={CLINIC.phoneHref} className="w-full sm:w-auto">
                  <PhoneIcon /> 전화 상담하기
                </LineBtn>
              </div>
            </Reveal>
          </div>

          <Reveal delay={80}>
            <div className="overflow-hidden rounded-[8px] lg:h-full [&>div>div]:rounded-[8px] [&>div>div]:border-wine-line [&>div>div]:shadow-none">
              <ClinicMap height={520} variant="compact" />
            </div>
            <div className="mt-4">
              <QuietLink href="/visit">지도 앱으로 길찾기</QuietLink>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* 선 아이콘 — 단색 currentColor. 브랜드 색을 입히지 않는다. */
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 17.5s5.6-4.6 5.6-9a5.6 5.6 0 1 0-11.2 0c0 4.4 5.6 9 5.6 9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="10" cy="8.4" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6v4.3l2.8 1.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M6.5 3.2 8.2 6.4 6.6 8.1a10.5 10.5 0 0 0 5.3 5.3l1.7-1.6 3.2 1.7v2.9c0 .7-.6 1.3-1.4 1.2C8.2 16.8 3.2 11.8 2.4 5c-.1-.8.5-1.4 1.2-1.4h2.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
/* 네이버 'N' — 채운 버튼 안에서는 글자색(흰색)으로. 브랜드 초록은 밝은 면에서만 쓴다. */
function NaverGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4.5 16.5v-13h3.9l4.5 6.9V3.5h3.9v13H13L8.4 9.6v6.9H4.5Z" fill="currentColor" />
    </svg>
  );
}
function InstagramGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden focusable="false">
      <rect x="2.6" y="2.6" width="14.8" height="14.8" rx="4.4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14.3" cy="5.7" r="1" fill="currentColor" />
    </svg>
  );
}
