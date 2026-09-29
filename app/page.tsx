import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { CLINIC, UNVERIFIED, TREATMENT_PILLARS } from '@/lib/clinic';
import { SPECIALS } from '@/lib/specials';
import { DOCTORS, PUBLICATION_DETAIL } from '@/lib/doctors';
import {
  HERO_PHOTO,
  HERO_WARM_SRC,
  PRINCIPLES,
  PRINCIPLE_STATEMENT,
  CLINIC_CARDS,
  SPECIAL_CARD_ART,
  PRESERVE_PHOTO,
  TOUR_PHOTOS,
  STORY_FALLBACK_COVERS,
  doctorPhoto,
} from '@/lib/homeContent';
import { allPostsMerged } from '@/lib/insightFeed';
import type { BlogPost } from '@/lib/blog';
import { Container, Sentences, SeqLetters } from '@/components/ui';
import { HomeHead, CenterHead, FillBtn, LineBtn, QuietLink } from '@/components/home';
import { CredentialFan } from '@/components/CredentialFan';
import { HeroMarquee } from '@/components/HeroMarquee';
import { PRINCIPLE_ICONS } from '@/components/PrincipleIcons';
import { DoctorPanels } from '@/components/DoctorPanels';
import { ClinicAccordion } from '@/components/ClinicAccordion';
import { SpecialSlider } from '@/components/SpecialSlider';
import { CopyButton } from '@/components/CopyButton';
import { ClinicMap } from '@/components/ClinicMap';
import { Reveal } from '@/components/Reveal';
import { Chars, Em, SplitLines } from '@/components/motion';
import { HomeMotion } from '@/components/HomeMotion';
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
 *   3 Clinic      주요 진료 과목 — 더뉴치과 짜임(2026-09-28): 올린 카드만 두 배로 넓어지는 네 장, 켜진 카드에 환자의 말
 *   4 Preserve    자연치아 보존 — 어두운 블루그레이 띠 (페이지에서 유일한 어두운 면)
 *   5 Doctors     더뉴치과 짜임(2026-09-28): 한 사람당 가로 판, 올리면 이름이 빠지고 경력이 올라옴 + 인증패 넷(CredentialFan) + 논문 배너(라이브 짜임, 색만 블루그레이)
 *   5-1 Special   동그라미치과의 특별함 — 더뉴치과 짜임(2026-09-28): 세로 사진 카드 일곱 장이 3초마다 흐름, 올리면 토프에 잠기며 설명
 *   6 Tour        둘러보기
 *   7 Story       인사이트 최신 글 4장(로컬+중앙 합본) + 인스타그램·블로그 줄
 *   8 Visit       원 안 아이콘 세 줄(주소·진료시간·전화) + 예약·전화 버튼 + 지도
 *
 * ⚠️ 목업과 일부러 다르게 둔 것 (사실 관계)
 *   · 헤더 워드마크의 영문은 CIRCLE DENTAL CLINIC 이다(lib/clinic.ts). 목업의 'DONGGRAMI DENTAL CLINIC' 은
 *     디자이너 임시 표기라 쓰지 않는다(components/Logo.tsx Wordmark).
 *   · 의료진 사진은 **본인이 확인되는 사진**만 쓴다(lib/doctors.ts). 목업의 진료 장면 사진은
 *     누구인지 특정할 수 없어 이름 아래 둘 수 없다. 원장 말투의 인용문도 본인 말이 아니면 넣지 않는다.
 *   · 목업의 이야기(SNS 피드) 타일은 갈 곳 없는 장식이라 인사이트 최신 글로 바꿨다(오너 결정).
 * ⚠️ 사진은 이 병원의 실제 사진이다(lib/homeContent.ts). 스톡을 넣지 말 것.
 *    예외는 AI 생성 정물 3장(gen/ — 보존 띠 + 표지 없는 인사이트 글의 대체 표지 둘, 2026-09-17 오너 GO)뿐이며 사물만 그렸다.
 * ⚠️ 채운 버튼은 화면당 하나 — 히어로 '진료 알아보기', 오시는 길 '네이버 예약하기'.
 * ⚠️ FAQ 구획을 되살리려면 faqSchema 도 함께 되살릴 것(보이는 것과 알리는 것이 어긋난다).
 */
/* 인사이트 최신 글이 홈에 실린다 — 한 시간마다 다시 그린다(인사이트 허브와 같은 주기). */
export const revalidate = 3600;

export default async function HomePage() {
  const heroImage = imageMeta(HERO_PHOTO.src, HERO_PHOTO.alt);
  const posts = (await allPostsMerged()).slice(0, 4);

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
      <HomeMotion />
      <Hero />
      <PrinciplesSection />
      <KineticBand />
      <ClinicSection />
      <PreserveBand />
      <DoctorsSection />
      <SpecialSection />
      <TourSection />
      <StorySection posts={posts} />
      <VisitSection />
    </>
  );
}

/* ─────────────────────────── 1. 첫 화면 ─────────────────────────── */
/*
 * ★★ 밝은 첫 화면 (2026-09-28 오너: 목업 캡처를 주며 "메인 히어로도 저런 느낌과 색상으로") ★★
 *   어두운 블루그레이 덮개 + 흰 글자 → **따뜻한 아이보리 바탕 + 차콜 세리프 글자**.
 *   사진은 오른쪽 70% 에 깔리고, 왼쪽 글자 자리는 아이보리로 부드럽게 번진다(.hero-lt-fade).
 *   목업 색은 캡처에서 잰 값: 바탕 #ebe5de · 채운 버튼 #313e51 · 제목 #2d2824.
 * ★ 사진은 **같은 실제 사진**(HERO_PHOTO)을 결만 다듬은 판 — public/img/hero-warm-2.jpg
 *   (C:/tmp/cd-new/hero-grade2.cjs: 검은 곳을 들고 채도를 낮춰 따뜻한 빛, 왼쪽 앞의 환자만 흐리게 = 얕은 심도).
 *   목업의 사진은 AI 로 그린 가상 인물이라 쓰지 않는다 — 결과 분위기만 옮겼다.
 * ★ 헤더는 이제 사진 위에 뜨지 않는다(SiteHeader overHero=false) — 밝은 첫 화면이라 헤더도 아이보리 띠. 그래서 -mt 도 없다.
 * ⚠️ 지역명 줄은 남긴다 — "화정동 치과" 질의의 근거가 이 자리다.
 * ⚠️ 좁은 화면의 아래 여백(pb)은 하단 고정 바(QuickMenu) 높이만큼 더 둔다.
 */
function Hero() {
  return (
    <section className="hero-lt" data-hero>
      {/* 2026-09-29 모션: 사진이 동그랗게 열리고(.hero-lt-photo) 제자리로 가라앉는다(.hero-pan). 내리면 느리게 커진다(--hp, HomeMotion). */}
      <div className="hero-lt-photo">
        <div className="hero-pan">
          <Image src={HERO_WARM_SRC} alt={HERO_PHOTO.alt} fill priority sizes="(max-width: 1023px) 100vw, 72vw" className="hero-lt-img" />
        </div>
      </div>
      <div aria-hidden className="hero-lt-fade" />
      <div aria-hidden className="hero-lt-sun" />
      <div aria-hidden className="hero-orbs">
        <i />
        <i />
      </div>

      <Container className="hero-lt-in">
        <div className="hero-lt-copy">
          <p className="enter kicker hero-lt-kicker">
            Preserve
            <br />
            your natural smile
          </p>
          {/* 한 글자씩 흐림 속에서 떠오르고, 마지막 글자가 서면 '한 번 더' 를 손으로 그린 동그라미가 두른다(components/motion Chars). */}
          <h1 className="serif-head hero-lt-h1">
            <Chars lines={['뽑기 전에,', '[[한 번 더]] 살펴봅니다.']} start={220} />
          </h1>
          <p className="enter hero-lt-lead" style={{ animationDelay: '760ms' }}>
            자연치아를 오래 사용할 수 있도록
            <br />{' '}
            <span className="em em-mark em-now" style={{ ['--ed' as string]: '1650ms' }}>
              필요한 치료부터
            </span>{' '}
            함께 판단합니다.
          </p>
          <div className="enter hero-lt-cta" data-magnet style={{ animationDelay: '900ms' }}>
            <FillBtn href="/treatment" className="hero-lt-fill">
              진료 알아보기
            </FillBtn>
            <LineBtn href={CLINIC.booking.naver} external className="hero-lt-line">
              예약하기
            </LineBtn>
          </div>
          <p className="enter hero-lt-loc" style={{ animationDelay: '1000ms' }}>
            {CLINIC.address.locality} {CLINIC.address.dong} · {CLINIC.nearestStation} 인근 ·{' '}
            <a href={CLINIC.phoneHref} className="tabular-nums">
              {CLINIC.phone}
            </a>
          </p>
        </div>

        {/* 목업의 바닥 줄 — 왼쪽 SCROLL 과 세로선, 오른쪽 사진 위 반투명 판의 영문 세 줄 */}
        <div className="enter hero-lt-foot" style={{ animationDelay: '1150ms' }}>
          <p className="scroll-cue kicker hero-lt-scroll">Scroll</p>
          <p className="kicker hero-lt-note">
            Better choices
            <br />~<br />a healthier tomorrow
          </p>
        </div>
      </Container>

      {/* 도는 글자 원 — 누르면 다음 구획으로. 1280px 이상에서만(좁으면 버튼과 겹친다). 문구는 첫 화면 영문 그대로. */}
      <a href="#philosophy" className="hero-badge" aria-label="진료 철학으로 내려가기">
        <svg viewBox="0 0 128 128" aria-hidden focusable="false">
          <defs>
            <path id="hero-badge-path" d="M64 64m-50 0a50 50 0 1 1 100 0a50 50 0 1 1-100 0" />
          </defs>
          <text>
            {/* 둘레(2π×50≈314)에 꼭 맞게 글자 사이를 늘린다 — 안 맞추면 끝과 시작이 겹친다(실측) */}
            <textPath href="#hero-badge-path" textLength={310} lengthAdjust="spacing">
              PRESERVE YOUR NATURAL SMILE · CIRCLE DENTAL ·
            </textPath>
          </text>
        </svg>
        <span className="hero-badge-dot">
          <svg viewBox="0 0 14 20" fill="none" aria-hidden focusable="false">
            <path d="M7 1v17M1.5 12.5 7 18l5.5-5.5" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </span>
      </a>
    </section>
  );
}

/* ─────────────────────────── 2. 가장 먼저 생각하는 것 ─────────────────────────── */
function PrinciplesSection() {
  return (
    <section id="philosophy" className="section-y-home">
      <Container>
        <div className="grid gap-x-20 gap-y-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_1fr]">
          {/* 제목 — 오른쪽 위에 옅은 잎 장식(목업). 장식이라 색을 아주 옅게, 글을 가리지 않게. */}
          <div className="reveal relative lg:col-start-1">
            <LeafDeco />
            <p className="eyebrow-chip text-ash">진료 철학</p>
            <h2 className="serif-head split-in mt-4 text-[clamp(28px,4vw,44px)] text-charcoal">
              <SplitLines lines={['동그라미가', '==가장 먼저== 생각하는 것']} />
            </h2>
          </div>

          {/* 01~04 — 원 안 선 아이콘, 작은 번호, 한 줄 제목. 좁은 화면에서는 제목 바로 아래. */}
          {/* 2026-09-29 모션: 줄이 오른쪽에서 차례로 들어오고, 원이 한 바퀴 그려진 뒤 아이콘이 돌며 들어서고, 줄 아래로 선이 스친다(.rows-in). */}
          <ol className="rows-in divide-y divide-wine-line border-b border-wine-line lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:border-t">
            {PRINCIPLES.map((p, i) => {
              const Icon = PRINCIPLE_ICONS[i] ?? PRINCIPLE_ICONS[0];
              return (
                <li key={p.n} className="flex items-center gap-5 py-6 first:pt-0 lg:py-7 lg:first:pt-7" style={{ ['--i' as string]: i }}>
                  <span className="icon-ring">
                    <RingSvg />
                    <Icon />
                  </span>
                  <span className="min-w-0">
                    <span className="kicker block text-[11px]">{p.n}</span>
                    <span className="mt-1 block text-[17.5px] leading-[1.5] text-charcoal sm:text-[19px]">
                      <KeyWord text={p.title} word={PRINCIPLE_KEYS[i]} />
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>

          {/* 한 문장과 다음 페이지로 가는 줄 — 좁은 화면에서는 목록 아래, 넓은 화면에서는 제목 아래. */}
          {/* ⚠️ lg:self-end 를 되살리지 말 것 — 문장이 바닥으로 내려가 왼쪽 열 가운데가 170px 비었다(2026-09-28 전문가 검토). */}
          <div className="reveal lg:col-start-1">
            {/* 네 물음을 묶는 말 — '네 가지를 먼저 묻고' 에 형광펜(보일 때 칠해진다, .em-scope strong). 문구는 lib 원문 그대로. */}
            <p className="em-scope max-w-[26em] text-[17px] leading-[1.9] text-charcoal/85">
              <Sentences text={PRINCIPLE_STATEMENT.replace('네 가지를 먼저 묻고', '**네 가지를 먼저 묻고**')} />
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

/*
 * 네 물음의 열쇠말 — 굵게 + 블루그레이(2026-09-29 오너 "문구 강조도"). 문구는 lib/homeContent 원문 그대로, 모양만 얹는다.
 * ⚠️ 원문에 그 낱말이 없으면(문구가 바뀌면) 조용히 강조 없이 그린다.
 */
const PRINCIPLE_KEYS = ['정말', '살릴 방법', '지금 꼭', '충분히 이해'] as const;
function KeyWord({ text, word }: { text: string; word?: string }) {
  const at = word ? text.indexOf(word) : -1;
  if (!word || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <strong className="font-semibold text-clay-700">{word}</strong>
      {text.slice(at + word.length)}
    </>
  );
}

/** 잎 장식 — 목업 두 번째 화면의 옅은 가지. 단색 면, 아주 옅게. 뜻이 없으므로 aria-hidden. */
function LeafDeco() {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 120 170"
      className="leaf-sway pointer-events-none absolute -top-14 right-0 h-[170px] w-[120px] text-brand-400 opacity-[0.16] lg:-top-16 lg:right-6"
    >
      <path d="M52 166C56 122 66 80 100 24" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M72 96c-3-20 9-36 30-38-1 20-12 35-30 38Z" fill="currentColor" />
      <path d="M62 126c-19-6-30-23-27-43 18 6 30 23 27 43Z" fill="currentColor" />
      <path d="M84 60c-1-15 8-26 23-28 0 15-9 26-23 28Z" fill="currentColor" />
      <path d="M58 150c-15-4-24-17-22-33 14 4 24 17 22 33Z" fill="currentColor" />
    </svg>
  );
}

/* ─────────────────────────── 3. 주요 진료 ─────────────────────────── */
/*
 * ★★ '어떤 고민이 있으신가요?' 다섯 카드 → 더뉴치과 '주요 진료 과목' 짜임 (2026-09-28 오너) ★★
 *   네 진료(자연치아살리기·임플란트·심미치료·사랑니발치 = 헤더 메뉴 넷)가 한 줄에 서고, 마우스가 올라간 카드만
 *   두 배로 넓어지며 환자의 말·설명·'자세히 보기' 가 올라온다(components/ClinicAccordion).
 * ★ 고민 카드의 **환자의 말은 그대로 옮겼다** — 켜진 카드의 첫 줄이 그 말이다(lib/homeContent CLINIC_CARDS.quote).
 *   빠진 것은 '이가 아파요 → 충치/신경치료' 한 장뿐이고, 그 길은 '전체 보기'(/treatment)에 있다.
 * ★ 이름·설명·주소는 lib/clinic.ts TREATMENT_PILLARS 원문. 여기서 진료 문구를 새로 쓰지 않는다.
 */
function ClinicSection() {
  const cards = CLINIC_CARDS.map((c) => {
    const p = TREATMENT_PILLARS.find((x) => x.key === c.key)!;
    return { key: c.key, en: c.en, quote: c.quote, tone: c.tone, photo: c.photo, name: p.name, copy: 'copy' in c ? c.copy : p.copy, href: p.href };
  });
  return (
    <section className="section-y-home border-t border-wine-line">
      <Container>
        <HomeHead
          label="진료"
          split={['주요 진료 과목']}
          asideInline
          aside={<QuietLink href="/treatment">전체 보기</QuietLink>}
        />
        <ClinicAccordion cards={cards} />
      </Container>
    </section>
  );
}

/* ─────────────────────────── 4. 자연치아 보존 띠 ─────────────────────────── */
function PreserveBand() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-wine-deep text-parchment">
      {/* 2026-09-29 모션: 사진은 틀보다 위아래 12% 크게 두고 스크롤 반대로 민다(시차, data-par). 뒤로 번지는 동그라미 셋(--p). */}
      <div aria-hidden className="par-img -z-20" data-par="0.1">
        <Image
          src={PRESERVE_PHOTO.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[70%_60%] lg:object-[80%_50%]"
        />
      </div>
      <div aria-hidden className="tint-bluegray absolute inset-0 -z-10" />
      <div aria-hidden className="pv-rings" data-scrub>
        <i />
        <i />
        <i />
      </div>
      <Container className="py-28 pb-[60vw] sm:pb-[44vw] lg:py-40">
        <div className="reveal max-w-[34em]">
          {/* 영문 'NATURAL TOGETHER FOR A LONGER SMILE' 은 뺐다(2026-09-28) — 영어 문장이 되지 않고 첫 화면 영문과 같은 뜻이었다. */}
          <h2 className="serif-head split-in text-[clamp(30px,4.4vw,50px)] text-parchment">
            <SplitLines lines={['자연치아 보존,', '가능할 때가 __가장 좋습니다.__']} />
          </h2>
          <p className="mt-7 max-w-[28em] text-[17.5px] leading-[1.9] text-parchment/85">
            <Em text="==살릴 수 있는 치아인지== 확인하고," delay={300} />
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
        {/*
          ★★ 더뉴치과 '대표원장 소개' 짜임 (2026-09-28 오너) — 가운데 머리말 + 한 사람당 가로 판(components/DoctorPanels).
             이름 탭·‹ 1/3 › 로 넘기던 DoctorShowcase 는 홈에서 걷었다(세 사람이 한 화면에 다 선다).
          ⚠️ 문구는 lib/doctors.ts 로 확인되는 범위만 — '10년 이상 경력'·'교수 출신' 은 근거가 없어 쓰지 않는다.
             '인정' 이 아니라 '보건복지부인증'(전 페이지 통일, lib/doctors.ts 머리말). 옛 문장은 대표원장이 전문의가 아닌 것처럼 읽혔다.
        */}
        <CenterHead
          label="의료진"
          split={['동그라미치과의 의료진을 소개합니다']}
          desc="세 원장 모두 **보건복지부인증 통합치의학과 전문의**이며, 대표원장은 경희대학교 치의학전문대학원 외래교수입니다."
        />
        <DoctorPanels doctors={doctors} />
      </Container>

      {/*
        근거 · 인증 — 의료진 아래 한 단 들어간 아이보리 면 (2026-09-17 오너: "인증 쪽 전문적으로").
        ★ 인증패 사진은 원본이 236px 라 크게 쓰면 뭉개진다 → 작은 표식으로만 두고 **이름을 글자로** 읽힌다.
        ★ 논문은 한 줄이 아니라 제 자리를 준다 — 세로 사진(768×800)과 제목, 한국어 풀이 한 문장.
        ⚠️ 라벨·문구는 lib/assets.ts / lib/doctors.ts 원문 그대로다. 새 인증을 여기서 적지 않는다.
      */}
      {/*
        ★★ 인증패 + 논문 배너 — **라이브(b9adf93) 홈의 짜임 그대로, 색만 새 팔레트** ★★
          (2026-09-17 오너: "여기는 기존 디자인에서 색감만 바꾸는 느낌으로".)
          한 줄짜리 인증 목록으로 바꿨던 판은 걷어냈다. 인증패 넷이 하나씩 떠오르는 CredentialFan,
          그 뒤로 흐르는 영문 마퀴, 아래에 가로 배너(왼쪽 글·오른쪽 노트북 논문 사진)가 원래 짜임이다.
        ⚠️ 배너의 어두운 판은 고동(36,20,23)이 아니라 **블루그레이 딥(46,55,61)** — 바뀐 것은 이 색뿐이다.
        ⚠️ 논문 제목은 원문 그대로 산세리프 — 잘라낸 세리프 글꼴에 없는 글자가 섞인다(라이브 주석과 같다).
      */}
      <Container>
        <div className="relative mt-20 overflow-hidden lg:mt-28">
          <div
            aria-hidden
            className="pointer-events-none absolute top-[42%] left-1/2 z-0 w-screen -translate-x-1/2 -translate-y-1/2"
          >
            <HeroMarquee
              text="Circle Dental Clinic ·"
              seconds={46}
              size="clamp(64px, 9.5vw, 176px)"
              colorClass="text-driftwood/[0.16]"
            />
          </div>
          <CredentialFan />
        </div>

        <div className="mt-12 border-t border-wine-line pt-10">
          <div className="seq relative overflow-hidden rounded-[24px] bg-wine-deep lg:grid lg:grid-cols-[54%_minmax(0,1fr)]">
            <div className="relative z-10 px-7 py-12 sm:px-10 lg:py-16 xl:py-20">
              <p className="eyebrow-chip text-clay-300">
                <SeqLetters text="발표논문" step={90} />
              </p>
              <p className="mt-5 text-[19px] leading-[1.6] font-semibold text-parchment sm:text-[21px]">
                <SeqLetters text={PUBLICATION_DETAIL.title} step={11} start={420} />
              </p>
              <p className="seq-fade mt-3 text-[16px] text-clay-300/80" style={{ ['--d' as string]: '1400ms' }}>
                {PUBLICATION_DETAIL.authors}
              </p>
              <div className="seq-fade mt-8 flex flex-wrap gap-2.5" style={{ ['--d' as string]: '1560ms' }}>
                <FillBtn href="/about/trust" tone="dark">
                  주요 이력 전체 보기
                </FillBtn>
                <LineBtn href="/about/doctors" tone="dark">
                  의료진 소개
                </LineBtn>
              </div>
            </div>

            {/* 사진 — 배너 전체에 깔리고 왼쪽 글 뒤만 덮는다. 큰 화면은 왼쪽만 짙게, 노트북이 있는 오른쪽은 비운다. */}
            <div aria-hidden className="seq-fade absolute inset-0" style={{ ['--d' as string]: '1180ms' }}>
              <Image
                src={PUBLICATION_DETAIL.banner}
                alt=""
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 1320px"
                className="object-cover object-right"
              />
              <div className="absolute inset-0 bg-wine-deep/82 lg:hidden" />
              <div className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,rgba(46,55,61,0.97)_0%,rgba(46,55,61,0.94)_40%,rgba(46,55,61,0.72)_56%,rgba(46,55,61,0)_74%)]" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 5-1. 특별함 ─────────────────────────── */
/*
 * ★★ 더뉴치과 '더뉴 치과의 특별함' 짜임 (2026-09-28 오너) ★★
 *   세로로 긴 사진 카드 일곱 장이 흐르고 3초마다 넘어간다. 올리면 모서리가 둥글어지고 사진이 토프에 잠기며
 *   설명이 열린다(components/SpecialSlider). 카드마다 /about/special/<slug> 로 간다.
 * ★ 글은 lib/specials.ts 원문(단, medical-team 제목만 확인된 범위로 — lib/homeContent SPECIAL_CARD_ART 주석).
 * ★ 사진은 전부 이 병원의 실제 사진 — 세로 카드에 맞는 것을 골라 잘라 쓴다(SPECIAL_CARD_ART).
 */
function SpecialSection() {
  const cards = SPECIALS.filter((s) => !SPECIAL_CARD_ART[s.slug]?.skip).map((s) => {
    const art = SPECIAL_CARD_ART[s.slug];
    return {
      slug: s.slug,
      key: s.key,
      title: art?.title ?? s.title,
      body: s.body,
      photo: art ?? { src: s.thumb?.src ?? s.image, alt: s.thumb?.alt ?? s.alt, pos: s.thumb?.position ?? '50% 50%' },
    };
  });
  return (
    <section className="sp-sec section-y-home overflow-x-clip">
      <Container>
        <CenterHead label="특별함" split={['동그라미치과의 ==특별함==']} />
        <SpecialSlider cards={cards} />
      </Container>
    </section>
  );
}

/* ─────────────────────────── 6. 둘러보기 ─────────────────────────── */
/*
 * ★ 2026-09-28 전문가 검토 반영 — 머리말 한 줄(제목·설명·링크를 위에 모음, 주요 진료와 같은 짜임), 작은 사진 16:10,
 *   상담 부스 사진(접수 사진처럼 하얗고 평평했다) → 창가 진료실(창·로고 유리·화분). 문장은 사진이 보여 주는 것만.
 *   옛 문장 '편안하고 안전한 진료 환경에서 늘 같은 마음으로' 는 '안전한' 단정 + 빈말이라 뺐다.
 */
function TourSection() {
  return (
    <section className="section-y-home border-t border-wine-line">
      <Container>
        <HomeHead
          label="공간"
          split={['동그라미치과 둘러보기']}
          desc="접수·대기 공간과 진료실을 미리 둘러보세요."
          asideInline
          aside={<QuietLink href="/about/tour">둘러보기</QuietLink>}
        />
        {/* 2026-09-29 모션: 사진마다 아래에서 막이 걷히며(.clip-in) 가라앉고, 스크롤에 따라 틀 안에서 천천히 흐른다(data-par). */}
        <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="tour-shot clip-in relative aspect-[4/3] overflow-hidden rounded-[8px] bg-wine-soft lg:aspect-auto">
            <div className="par-img" data-par="0.1">
              <Image
                src={TOUR_PHOTOS.main.src}
                alt={TOUR_PHOTOS.main.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {TOUR_PHOTOS.sub.map((s, i) => (
              <div
                key={s.src}
                className="tour-shot clip-in relative aspect-[4/3] overflow-hidden rounded-[8px] bg-wine-soft lg:aspect-[16/10]"
                style={{ ['--i' as string]: i + 1 }}
              >
                <div className="par-img" data-par="0.1">
                  <Image src={s.src} alt={s.alt} fill sizes="(max-width: 1024px) 50vw, 40vw" className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 7. 이야기 ─────────────────────────── */
/*
 * ★★ 슬로건 타일 → **인사이트 최신 글** (2026-09-17 오너: "여기는 무슨 목적으로?" → "1번(최신 글)으로 가자") ★★
 *   목업 7번째 화면을 옮긴 사진+슬로건 타일은 눌러도 갈 곳이 없는 장식이었다. 이 사이트는 자체 블로그(인사이트)가
 *   계속 발행되므로, 그 최신 글 넷을 여기 둔다 — 홈에 새 내용이 자동으로 돌고 내부 링크가 생긴다.
 * ★ 글은 lib/insightFeed.allPostsMerged() — 로컬(content/blog) + 중앙(winaid) 합본, 최신순. 쪽은 ISR 3600 으로 다시 그린다.
 * ★ 표지 없는 글(중앙 글에 흔하다)은 gen/ 의 AI 정물 두 장을 번갈아 표지로 쓴다 — 빈 상자보다 낫고 결이 같다.
 * ⚠️ 글이 하나도 없으면 구획을 통째로 숨긴다(빈 제목만 남기지 않는다).
 */
function StorySection({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  const ko = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return `${y}년 ${Number(m)}월 ${Number(d)}일`;
  };
  return (
    /* 바탕 한 단 들어간 면(#efece5) — 둘러보기·오시는 길의 아이보리와 번갈아 서도록(2026-09-28 색 검토). 색이 경계라 위 실선은 뺐다. */
    <section className="section-y-home bg-wine-soft">
      <Container>
        <HomeHead
          label="인사이트"
          split={['더 건강한 미소를 위한', '==동그라미의 이야기==']}
          desc="진료실에서 다 담기 어려운 이야기를 글로 적습니다."
          aside={<QuietLink href="/insight/blog">블로그 전체 보기</QuietLink>}
        />

        <ul className="reveal-stack mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((p, i) => {
            /* 요약 첫머리 '결론부터 말씀드리면' 이 네 장 중 세 장에 되풀이돼 홈 카드에서만 뗀다(글 본문은 그대로). */
            const summary = (p.summary ?? '').replace(/^결론부터 말씀드리면[,，]?[ ]*/, '');
            const cover = p.image ?? STORY_FALLBACK_COVERS[i % STORY_FALLBACK_COVERS.length].src;
            const coverAlt = p.image ? (p.imageAlt ?? '') : '';
            return (
              /* 휴대폰은 두 장만 — 세로로 네 장이 쌓이면 이 구획만 2,500px 였다 */
              <li key={p.slug} className={i >= 2 ? 'max-sm:hidden' : undefined}>
                <Link
                  href={`/insight/blog/${p.slug}`}
                  className="photo-card group flex h-full flex-col overflow-hidden rounded-[6px] border border-wine-line bg-white transition-colors hover:border-brand-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-wine-soft">
                    <Image src={cover} alt={coverAlt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col px-5 pt-5 pb-6">
                    <p className="flex items-center gap-2 text-[12.5px] text-ash">
                      <time dateTime={p.date} className="tabular-nums">
                        {ko(p.date)}
                      </time>
                      {p.category ? <span aria-hidden>·</span> : null}
                      {p.category ? <span>{p.category}</span> : null}
                    </p>
                    <h3 className="mt-2.5 line-clamp-2 text-[17px] leading-[1.45] font-medium text-charcoal">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-[14.5px] leading-[1.7] text-ash">{summary}</p>
                    <span className="mt-auto flex items-center gap-1.5 pt-4 text-[13.5px] text-charcoal/70">
                      읽어보기
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 채널 줄 — 인스타그램·네이버 블로그. 글 카드 아래로 내려 '더 보려면' 의 자리에 둔다. */}
        <div className="reveal mt-8 flex items-center justify-between gap-6 border-t border-wine-line pt-5">
          <a
            href={CLINIC.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-w-0 items-center gap-3 text-[15px] font-medium text-charcoal"
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
            <HomeHead label="내원 안내" split={['오시는 길']} />

            {/*
              원 안 아이콘 세 줄(목업) — 주소 · 진료시간 · 전화. 주차는 /visit 에 있다.
              ⚠️ 라벨 글자 대신 아이콘이 뜻을 지므로 sr-only 로 이름을 남긴다.
            */}
            <Reveal delay={60}>
              <ul className="rows-in mt-10 space-y-8">
                <li className="flex items-start gap-5" style={{ ['--i' as string]: 0 }}>
                  <span className="icon-ring">
                    <RingSvg />
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
                  <li className="flex items-start gap-5" style={{ ['--i' as string]: 1 }}>
                    <span className="icon-ring">
                      <RingSvg />
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

                <li className="flex items-center gap-5" style={{ ['--i' as string]: 2 }}>
                  <span className="icon-ring">
                    <RingSvg />
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
            {/* 지도는 가운데에서 동그랗게 번지며 열린다(.clip-circle) */}
            <div className="clip-in clip-circle overflow-hidden rounded-[8px] lg:h-full [&>div>div]:rounded-[8px] [&>div>div]:border-wine-line [&>div>div]:shadow-none">
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

/** 원 안 아이콘의 테두리 — .rows-in 안에서 한 바퀴 그려진다(app/motion.css .ring-svg). */
function RingSvg() {
  return (
    <svg className="ring-svg" viewBox="0 0 50 50" aria-hidden focusable="false">
      <circle cx="25" cy="25" r="24.5" pathLength={1} />
    </svg>
  );
}

/*
 * 흐르는 큰 글자 — 진료 철학과 주요 진료 사이 (2026-09-29 오너: "모션그래픽 엄청").
 *   스크롤한 만큼 두 줄이 서로 반대로 흐른다(--p, HomeMotion). 속이 빈 큰 글자 한 줄 + 옅게 채운 작은 글자 한 줄.
 * ★ 문구는 첫 화면의 영문 두 줄 그대로(새 문장 없음). 장식이라 보조기기에는 숨긴다.
 */
function KineticBand() {
  const a = 'Preserve your natural smile';
  const b = 'Better choices ~ a healthier tomorrow';
  return (
    <div aria-hidden className="kin" data-scrub>
      <p className="kin-row kin-a">{[a, a, a].join('  ·  ')}</p>
      <p className="kin-row kin-b">{[b, b, b, b].join('  ·  ')}</p>
    </div>
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
