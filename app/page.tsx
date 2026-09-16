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
  doctorPhoto,
} from '@/lib/homeContent';
import { Container, Sentences } from '@/components/ui';
import { HomeHead, FillBtn, LineBtn, QuietLink } from '@/components/home';
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
 * 홈 — 디자인 수정 요청서(2026-09-16, sukho) 목업 기준으로 다시 짰다.
 *
 * ★★ 요청서가 정한 것 ★★
 *   · "흰 배경 + 파란 포인트 + 의료진 정면 사진 + 정보 카드" 의 전형을 피한다.
 *   · 신뢰는 장비·문구가 아니라 **사진·여백·색·타이포**로 느끼게 한다.
 *   · 아이보리 바탕에 충분한 여백, 블루그레이는 필요한 곳에만.
 *
 * ★ 구획 순서 (목업 순서 그대로)
 *   1 Hero        뽑기 전에, 한 번 더 살펴봅니다
 *   2 Principles  동그라미가 가장 먼저 생각하는 것 (01~04)
 *   3 Concerns    어떤 고민이 있으신가요? (환자의 말 → 진료 페이지)
 *   4 Preserve    자연치아 보존 — 어두운 블루그레이 띠 (페이지에서 유일한 어두운 면)
 *   5 Doctors     의료진 셋 + 근거 한 줄
 *   6 Tour        둘러보기
 *   7 Story       인스타그램·블로그로 이어지는 이야기
 *   8 Visit       오시는 길 · 진료시간 · 전화 · 지도
 *
 * ⚠️ 사진은 전부 이 병원의 실제 사진이다(lib/homeContent.ts). 스톡을 넣지 말 것.
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
function Hero() {
  return (
    <section className="relative border-b border-wine-line bg-wine-bg">
      <div className="mx-auto grid max-w-[1440px] lg:min-h-[calc(100svh-94px)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        {/* 사진 — 좁은 화면에서는 위, 넓은 화면에서는 오른쪽 끝까지. */}
        <div className="hero-fade relative order-1 aspect-[4/5] overflow-hidden sm:aspect-[16/10] lg:order-2 lg:aspect-auto lg:min-h-full">
          <Image
            src={HERO_PHOTO.src}
            alt={HERO_PHOTO.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-[58%_30%]"
          />
        </div>

        <div className="order-2 flex flex-col justify-between px-5 pt-10 pb-12 sm:px-8 lg:order-1 lg:pt-20 lg:pb-12 lg:pl-8 lg:pr-16 xl:pl-16">
          <div className="lg:my-auto">
            <p className="enter kicker">Preserve your natural smile</p>
            <h1
              className="enter serif-head mt-6 text-[clamp(36px,5.2vw,64px)] text-charcoal"
              style={{ animationDelay: '80ms' }}
            >
              뽑기 전에,
              <br />
              한 번 더 살펴봅니다.
            </h1>
            <p
              className="enter mt-7 max-w-[30em] text-[17.5px] leading-[1.9] text-ash sm:text-[18.5px]"
              style={{ animationDelay: '160ms' }}
            >
              자연치아를 오래 사용할 수 있도록
              <br className="hidden sm:block" /> 필요한 치료부터 함께 판단합니다.
            </p>
            <div
              className="enter mt-10 flex flex-wrap items-center gap-3"
              style={{ animationDelay: '240ms' }}
            >
              <FillBtn href="/treatment">진료 알아보기</FillBtn>
              <LineBtn
                href={CLINIC.booking.naver}
                external
              >
                예약하기
              </LineBtn>
            </div>
            {/* ⚠️ 지역명은 첫 화면에 남긴다 — "화정동 치과" 질의의 근거가 이 자리다. */}
            <p
              className="enter mt-8 text-[14.5px] text-ink-muted"
              style={{ animationDelay: '320ms' }}
            >
              {CLINIC.address.locality} {CLINIC.address.dong} · {CLINIC.nearestStation} 인근 ·{' '}
              <a href={CLINIC.phoneHref} className="tabular-nums hover:text-charcoal">
                {CLINIC.phone}
              </a>
            </p>
          </div>

          <div
            className="enter mt-14 hidden items-end justify-between lg:flex"
            style={{ animationDelay: '420ms' }}
          >
            <p className="scroll-cue kicker">Scroll</p>
            <p className="kicker text-right leading-[1.9]">
              Better choices
              <br />
              a healthier tomorrow
            </p>
          </div>
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
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <div className="reveal">
            <p className="eyebrow-chip text-ash">진료 철학</p>
            <h2 className="serif-head mt-4 text-[clamp(28px,4vw,44px)] text-charcoal">
              동그라미가
              <br />
              가장 먼저 생각하는 것
            </h2>
            <p className="mt-8 max-w-[26em] text-[17px] leading-[1.9] text-ash">
              <Sentences text={PRINCIPLE_STATEMENT} />
            </p>
            <div className="mt-8">
              <QuietLink href="/about">동그라미의 진료 철학</QuietLink>
            </div>
          </div>

          <ol className="reveal-stack divide-y divide-wine-line border-y border-wine-line">
            {PRINCIPLES.map((p) => (
              <li key={p.n} className="flex items-center gap-6 py-6 sm:py-7">
                <span className="num-ring shrink-0">{p.n}</span>
                <span className="text-[18px] leading-[1.5] text-charcoal sm:text-[20px]">
                  {p.title}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
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
          aside={<QuietLink href="/treatment">전체 진료 보기</QuietLink>}
        />
        <ul className="reveal-stack mt-12 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          {HOME_CONCERNS.map((c) => (
            <li key={c.href + c.quote}>
              <Link href={c.href} className="photo-card group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-wine-soft">
                  <Image
                    src={c.photo.src}
                    alt={c.photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 text-[17.5px] leading-[1.5] font-medium text-charcoal">
                  {c.quote}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-ash">
                  {c.tag}
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </p>
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
        className="-z-20 scale-105 object-cover blur-[1.5px]"
      />
      <div aria-hidden className="tint-bluegray absolute inset-0 -z-10" />
      <Container className="py-28 lg:py-40">
        <div className="reveal max-w-[34em]">
          <p className="kicker text-parchment/70">Natural · together · for a longer smile</p>
          <h2 className="serif-head mt-6 text-[clamp(30px,4.4vw,50px)] text-parchment">
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
          aside={<QuietLink href="/about/doctors">의료진 자세히 보기</QuietLink>}
        />

        <ul className="reveal-stack mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-3">
          {DOCTORS.map((d) => (
            <li key={d.slug}>
              <Link href="/about/doctors" className="photo-card group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] bg-wine-soft">
                  <Image
                    src={doctorPhoto(d.slug, d.photo)}
                    alt={`${d.name} ${d.role}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover object-top"
                  />
                </div>
                <div className="mt-6 flex items-baseline gap-3">
                  <p className="text-[24px] leading-none text-charcoal">{d.name}</p>
                  <p className="text-[15px] text-ash">{d.role}</p>
                </div>
                <p className="mt-3 text-[15.5px] text-charcoal/80">{d.license}</p>
                <ul className="mt-3 space-y-1">
                  {d.keyCareer.map((c) => (
                    <li key={c} className="text-[14.5px] leading-[1.6] text-ash">
                      {c}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ul>

        {/*
          근거 — 크게 말하지 않는다. 인증패 넷과 논문 한 줄만 조용히 두고 전체는 /about/trust.
          ⚠️ 라벨·문구는 lib/assets.ts / lib/doctors.ts 원문 그대로다.
        */}
        <div className="reveal mt-16 grid gap-8 border-t border-wine-line pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-14">
          <ul className="grid grid-cols-4 gap-3">
            {IMG.credentials.map((c) => (
              <li key={c.src} className="flex flex-col items-center gap-2">
                <div className="relative h-[72px] w-full sm:h-[88px]">
                  <Image src={c.src} alt={c.label} fill sizes="120px" className="object-contain" />
                </div>
              </li>
            ))}
          </ul>
          <div>
            <p className="eyebrow-chip text-ash">발표 논문</p>
            <p className="mt-2 text-[15.5px] leading-[1.7] text-charcoal">{PUBLICATION_DETAIL.title}</p>
            <p className="mt-1 text-[14px] text-ash">{PUBLICATION_DETAIL.authors}</p>
            <div className="mt-4">
              <QuietLink href="/about/trust">근거 · 인증 전체 보기</QuietLink>
            </div>
          </div>
        </div>
      </Container>
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
          aside={
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <QuietLink href={CLINIC.social.instagram} external>
                @circle_dental
              </QuietLink>
              <QuietLink href={CLINIC.social.naverBlog} external>
                네이버 블로그
              </QuietLink>
            </div>
          }
        />
        <ul className="reveal-stack mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STORY_TILES.map((t) => (
            <li key={t.src} className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-wine-soft">
              <Image src={t.src} alt={t.alt} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-wine-deep/75 via-wine-deep/20 to-transparent" />
              <p className="serif-head on-photo absolute inset-x-5 bottom-5 whitespace-pre-line text-[clamp(18px,1.7vw,24px)] leading-[1.45] text-parchment">
                {t.line}
              </p>
            </li>
          ))}
          <li className="flex aspect-[4/5] flex-col justify-between rounded-[6px] border border-wine-line bg-parchment p-5">
            <p className="kicker">{CLINIC.nameEn}</p>
            <div>
              <p className="serif-head text-[clamp(18px,1.7vw,24px)] leading-[1.45] text-charcoal">
                {CLINIC.tagline}
              </p>
              <p className="mt-3 text-[14px] leading-[1.7] text-ash">
                {CLINIC.address.locality} {CLINIC.address.dong}
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

            <Reveal delay={60}>
              <dl className="mt-10 divide-y divide-wine-line border-y border-wine-line">
                <div className="grid gap-2 py-6 sm:grid-cols-[92px_minmax(0,1fr)]">
                  <dt className="flex items-center gap-2 text-[14.5px] text-ash">
                    <PinIcon /> 주소
                  </dt>
                  <dd className="text-[16.5px] leading-[1.8] text-charcoal">
                    <span className="block">{CLINIC.address.full}</span>
                    <span className="mt-1 block text-[15px] text-ash">
                      {CLINIC.address.building} · {CLINIC.nearestStation} 인근
                    </span>
                    <span className="mt-3 block">
                      <CopyButton text={CLINIC.address.full} />
                    </span>
                  </dd>
                </div>

                {hours.verified && (
                  <div className="grid gap-2 py-6 sm:grid-cols-[92px_minmax(0,1fr)]">
                    <dt className="flex items-center gap-2 text-[14.5px] text-ash">
                      <ClockIcon /> 진료시간
                    </dt>
                    <dd className="text-[16.5px] leading-[1.8] text-charcoal">
                      {hours.display.map((h) => (
                        <span key={h.label} className="flex justify-between gap-4 sm:max-w-[22em]">
                          <span>
                            {h.label}
                            {h.note ? <span className="ml-2 text-[14px] text-ash">{h.note}</span> : null}
                          </span>
                          <span className="tabular-nums">{h.time}</span>
                        </span>
                      ))}
                      <span className="mt-1.5 block text-[15px] text-ash">{hours.closed}</span>
                    </dd>
                  </div>
                )}

                <div className="grid gap-2 py-6 sm:grid-cols-[92px_minmax(0,1fr)]">
                  <dt className="flex items-center gap-2 text-[14.5px] text-ash">
                    <CarIcon /> 주차
                  </dt>
                  <dd className="text-[16.5px] leading-[1.8] text-charcoal">
                    {CLINIC.parking.type} · {CLINIC.parking.fee}
                    <span className="mt-1 block text-[15px] leading-[1.8] text-ash">
                      <Sentences text={CLINIC.parking.note} />
                    </span>
                  </dd>
                </div>

                <div className="grid gap-2 py-6 sm:grid-cols-[92px_minmax(0,1fr)]">
                  <dt className="flex items-center gap-2 text-[14.5px] text-ash">
                    <PhoneIcon /> 전화
                  </dt>
                  <dd>
                    <a
                      href={CLINIC.phoneHref}
                      className="tabular-nums text-[30px] leading-none font-medium text-charcoal transition-colors hover:text-dusk"
                    >
                      {CLINIC.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-8 flex flex-wrap gap-3">
                <FillBtn href={CLINIC.booking.naver} external label="네이버 예약하기 — 새 창으로 열기">
                  네이버 예약하기
                </FillBtn>
                <LineBtn href={CLINIC.phoneHref}>전화 상담하기</LineBtn>
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
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 17.5s5.6-4.6 5.6-9a5.6 5.6 0 1 0-11.2 0c0 4.4 5.6 9 5.6 9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="10" cy="8.4" r="2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 6v4.3l2.8 1.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function CarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 12.5 5.3 8.2c.2-.7.8-1.2 1.5-1.2h6.4c.7 0 1.3.5 1.5 1.2L16 12.5v3.3H4v-3.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="7" cy="13" r="1" fill="currentColor" />
      <circle cx="13" cy="13" r="1" fill="currentColor" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M6.5 3.2 8.2 6.4 6.6 8.1a10.5 10.5 0 0 0 5.3 5.3l1.7-1.6 3.2 1.7v2.9c0 .7-.6 1.3-1.4 1.2C8.2 16.8 3.2 11.8 2.4 5c-.1-.8.5-1.4 1.2-1.4h2.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
