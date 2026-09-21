import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { CLINIC, UNVERIFIED } from '@/lib/clinic';
import { DOCTORS, PUBLICATION_DETAIL } from '@/lib/doctors';
import { TRUST_STATS } from '@/lib/trustSignals';
import {
  HERO_PHOTO,
  PRINCIPLES,
  PRINCIPLE_STATEMENT,
  HOME_CONCERNS,
  PRESERVE_PHOTO,
  TOUR_PHOTOS,
  STORY_FALLBACK_COVERS,
  doctorPhoto,
} from '@/lib/homeContent';
import { allPostsMerged } from '@/lib/insightFeed';
import type { BlogPost } from '@/lib/blog';
import { Container, Sentences, SeqLetters } from '@/components/ui';
import { HomeHead, FillBtn, LineBtn, QuietLink } from '@/components/home';
import { HeroStage } from '@/components/HeroStage';
import { RowNav } from '@/components/RowNav';
import { CredentialFan } from '@/components/CredentialFan';
import { HeroMarquee } from '@/components/HeroMarquee';
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
 * 홈 — 디자인 수정 요청서(2026-09-16, sukho)의 색·글꼴·버튼 규칙 위에, 레퍼런스 5곳의 **짜임과 움직임**을 얹었다
 * (2026-09-21 오너: "기본 틀은 유지하면서 레퍼런스 디자인이나 모션 구조 참고해서 다시").
 *   레퍼런스: dentalclinic.design · interseoul.com · 서울0.1치과 · jseouldental.com · thenewdent.com
 *   무엇을 어디서 가져왔는지는 globals.css 「홈 재조판」 머리말에 있다.
 *
 * ★★ 요청서가 정한 것(그대로) ★★
 *   · "흰 배경 + 파란 포인트 + 의료진 정면 사진 + 정보 카드" 의 전형을 피한다.
 *   · 신뢰는 장비·문구가 아니라 **사진·여백·색·타이포**로. 아이보리 바탕, 블루그레이는 필요한 곳에만.
 *
 * ★ 구획 순서 (여덟 구획 — 틀은 그대로, 짜임만 바꿨다)
 *   1 Hero        아이보리 바탕, "뽑기 전에, ○ 한 번 더 살펴봅니다." — 글자 사이의 원이 내리면 화면 전체 사진이 된다(인터서울)
 *   2 Principles  01~04 세리프 번호 + 원 안 선 아이콘 + 얇은 선 줄(더뉴·디자인치과)
 *   3 Concerns    사진 전체 카드 + 아래 어두운 덮개 + 환자의 말 + 원형 화살표(인터서울). 좁은 화면은 옆으로 흐른다
 *   4 Preserve    큰 문장에 강조 상자(인터서울) → 아래 가로로 긴 사진
 *   5 Doctors     얇은 선 숫자 격자(인터서울 4 가치) + 한 사람씩 펼침면 + 인증패 넷 + 논문 배너(라이브 짜임 그대로 — 오너 승인 구획)
 *   6 Tour        큰 사진 하나 + 세로 둘(더뉴 첫 화면의 3 판), 손을 올리면 사진 설명
 *   7 Story       왼쪽 제목 + 오른쪽 가로 흐름 카드(인터서울 아티클)
 *   8 Visit       흰 정보 판 + 지도(잠실서울)
 *
 * ⚠️ 목업·레퍼런스와 일부러 다르게 둔 것 (사실 관계)
 *   · 사진은 전부 이 병원의 실제 사진(lib/homeContent.ts). 레퍼런스의 스톡 인물·모델 사진은 쓰지 않는다.
 *     예외는 AI 생성 정물 3장(gen/ — 보존 사진 + 표지 없는 글의 대체 표지 둘, 2026-09-17 오너 GO)뿐이며 사물만 그렸다.
 *   · 치료 전후 사진·후기·건수는 싣지 않는다(의료법 제56조 — lib/trustSignals.ts 머리말). 숫자는 저장소 안 데이터를 센 것뿐이다.
 *   · 의료진 사진은 본인이 확인되는 사진만, 문구는 lib/doctors.ts 원문의 부분집합만.
 * ⚠️ 채운 버튼은 화면당 하나 — 첫 화면 '진료 알아보기', 오시는 길 '네이버 예약하기'.
 * ⚠️ FAQ 구획을 되살리려면 faqSchema 도 함께 되살릴 것(보이는 것과 알리는 것이 어긋난다).
 */
/* 인사이트 최신 글이 홈에 실린다 — 한 시간마다 다시 그린다(인사이트 허브와 같은 주기). */
export const revalidate = 3600;

export default async function HomePage() {
  const heroImage = imageMeta(HERO_PHOTO.src, HERO_PHOTO.alt);
  const posts = (await allPostsMerged()).slice(0, 6);

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
      <PreserveSection />
      <DoctorsSection />
      <TourSection />
      <StorySection posts={posts} />
      <VisitSection />
    </>
  );
}

/* ─────────────────────────── 1. 첫 화면 ─────────────────────────── */
/*
 * ★ 인터서울치과 첫 화면의 문법 — 밝은 바탕에 큰 글자, 글자 사이에 **동그란 사진**. 내리면 원이 화면 전체 사진으로 커지고
 *   글자는 뒤로 물러나며, 사진 위에 흰 글과 버튼이 올라온다. 무대 높이는 화면 두 개(190~200svh), 안쪽은 sticky 한 화면.
 *   진행도는 components/HeroStage 가 --p 로 넣고, 원의 반지름·투명도는 globals.css .hstage 가 정한다.
 * ★ 원은 화면 **정중앙**이다 — 제목을 [1fr auto 1fr] 격자에 두어 왼쪽 글은 오른끝, 오른쪽 글은 왼끝에 붙이고
 *   가운데 칸(.hs-hole)이 원의 자리를 잡는다. 그래서 글자 길이가 달라도 원은 늘 가운데다.
 * ⚠️ 헤더는 이제 사진 위에 얹히지 않는다(SiteHeader overHero=false). 무대 맨 위가 아이보리라 -mt 도 없다.
 * ⚠️ 좁은 화면의 아래 여백(pb)은 하단 고정 바(QuickMenu, 2xl 미만) 높이만큼 더 둔다. 안 그러면 버튼이 바 밑에 깔린다.
 * ⚠️ 채운 버튼은 사진 위에서 **흰색**(FillBtn tone=dark) — 어두운 덮개 위에 dusk 를 채우면 묻힌다.
 */
function Hero() {
  return (
    <HeroStage className="relative h-[190svh] lg:h-[200svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-wine-bg">
        {/* 사진 — 처음엔 글자 사이의 원, 내리면 화면 전체 */}
        {/*
          data-focus = 원 안에 보일 볼거리(태블릿의 치아 모형)의 **사진 안 위치**(가로 55%, 세로 42%) — HeroStage 가 이 점이
          구멍에 오도록 사진을 밀어 둔다. data-pos 는 아래 object-[50%_38%] 와 같은 값, data-size 는 원본(1920×1416).
          ⚠️ 사진을 바꾸면 세 값을 함께 바꿀 것.
        */}
        <div className="hs-photo absolute inset-0" data-focus="0.55 0.42" data-pos="0.5 0.38" data-size="1920 1416">
          {/* 원은 바깥(.hs-photo)이 자르고, 사진의 이동·배율은 이 안쪽 상자가 진다 — 한 요소에 같이 걸면 원이 사진과 함께 밀린다. */}
          <div className="hs-img absolute inset-0">
            <Image
              src={HERO_PHOTO.src}
              alt={HERO_PHOTO.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_38%]"
            />
          </div>
          <div aria-hidden className="hs-shade hero-shade absolute inset-0" />
        </div>

        {/* 장면 A — 아이보리 위의 글자. 원은 화면 정중앙(격자 가운데 칸). */}
        <div className="hs-a absolute inset-0 grid grid-rows-[1fr_auto_1fr] px-5">
          <p className="enter kicker self-end pb-8 text-center lg:pb-10">
            Circle Dental Clinic · Hwajeong
          </p>
          {/*
            한 줄에 "뽑기 전에, ○ 한 번 더 살펴봅니다." — 넓은 화면은 가로 한 줄(모자라면 마지막 구절만 아래로 접힌다),
            좁은 화면은 세로로 쌓인다(글 / 원 / 글). 원의 중심은 HeroStage 가 실제 자리를 재서 넣으므로 어느 쪽이든 사진은 구멍에서 시작한다.
          */}
          <h1 className="serif-head flex flex-col items-center justify-center gap-x-[0.38em] gap-y-4 text-center text-[clamp(34px,5vw,66px)] text-charcoal sm:flex-row sm:flex-wrap">
            <span className="enter">뽑기 전에,</span>
            <span aria-hidden className="hs-hole enter" style={{ animationDelay: '60ms' }} />
            <span className="enter" style={{ animationDelay: '120ms' }}>
              한 번 더 살펴봅니다.
            </span>
          </h1>
          <div className="enter self-start pt-8 text-center lg:pt-10" style={{ animationDelay: '220ms' }}>
            <p className="text-[15.5px] leading-[1.8] text-ash sm:text-[16.5px]">
              자연치아를 오래 사용할 수 있도록
              <br className="sm:hidden" /> 필요한 치료부터 함께 판단합니다.
            </p>
          </div>
        </div>

        {/* 장면 A 의 바닥 — 인터서울 "스크롤을 내려보세요" + 아래로 흐르는 선 */}
        <div className="hs-cue pointer-events-none absolute inset-x-0 bottom-[96px] flex justify-center text-ash 2xl:bottom-10">
          <p className="scroll-cue kicker flex flex-col items-center text-inherit">Scroll</p>
        </div>

        {/* 장면 B — 사진 위. 왼쪽 아래에 선다(아래 구획들과 같은 Container 세로선). */}
        <div className="hs-b absolute inset-0 flex items-end text-white">
          <Container className="pb-[104px] lg:pb-[108px] 2xl:pb-20">
            <div className="max-w-[46rem]">
              <p className="kicker text-white/70">For a longer healthier smile</p>
              <p className="serif-head on-photo mt-5 text-[clamp(28px,4.2vw,54px)] text-white">
                자연치아를 오래 사용할 수 있도록
                <br />
                필요한 치료부터 함께 판단합니다.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <FillBtn href="/treatment" tone="dark">
                  진료 알아보기
                </FillBtn>
                <LineBtn href={CLINIC.booking.naver} external tone="dark">
                  예약하기
                </LineBtn>
              </div>
              {/* ⚠️ 지역명은 첫 화면에 남긴다 — "화정동 치과" 질의의 근거가 이 자리다. */}
              <p className="on-photo mt-7 text-[14px] text-white/75">
                {CLINIC.address.locality} {CLINIC.address.dong} · {CLINIC.nearestStation} 인근 ·{' '}
                <a href={CLINIC.phoneHref} className="tabular-nums hover:text-white">
                  {CLINIC.phone}
                </a>
              </p>
            </div>
          </Container>
        </div>
      </div>
    </HeroStage>
  );
}

/* ─────────────────────────── 2. 가장 먼저 생각하는 것 ─────────────────────────── */
/*
 * 더뉴('약속 01')·디자인치과('기준 하나')의 번호 줄 — 세리프 숫자를 크게, 원 안 선 아이콘, 한 줄 제목.
 * 줄 사이 선은 왼쪽에서 오른쪽으로 그어진다(.line-in — RevealScript 의 같은 관찰자).
 */
function PrinciplesSection() {
  return (
    <section className="section-y-home">
      <Container>
        <div className="grid gap-x-20 gap-y-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_1fr]">
          <div className="reveal lg:col-start-1">
            <p className="eyebrow-chip text-ash">진료 철학</p>
            <h2 className="serif-head mt-4 text-[clamp(28px,4vw,44px)] text-charcoal">
              동그라미가
              <br />
              가장 먼저 생각하는 것
            </h2>
          </div>

          <ol className="reveal-stack border-t border-wine-line lg:col-start-2 lg:row-span-2 lg:row-start-1">
            {PRINCIPLES.map((p, i) => {
              const Icon = PRINCIPLE_ICONS[i] ?? PRINCIPLE_ICONS[0];
              return (
                <li key={p.n} className="relative grid grid-cols-[auto_auto_1fr] items-center gap-5 py-7 sm:gap-7 lg:py-9">
                  <span aria-hidden className="serif-num">
                    {p.n}
                  </span>
                  <span className="icon-ring">
                    <Icon />
                  </span>
                  <span className="min-w-0">
                    <span className="sr-only">{p.n}. </span>
                    <span className="block text-[18px] leading-[1.5] text-charcoal sm:text-[20px] lg:text-[21px]">{p.title}</span>
                  </span>
                  <span aria-hidden className="line-in absolute inset-x-0 bottom-0 h-px bg-wine-line" />
                </li>
              );
            })}
          </ol>

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

/* ─────────────────────────── 3. 어떤 고민이 있으신가요 ─────────────────────────── */
/*
 * 인터서울의 진료 카드 — 사진이 카드 전체, 아래로 갈수록 어두운 덮개, 흰 글, 오른쪽 아래 원형 화살표.
 * 좁은 화면에서는 다섯 장이 옆으로 흐르고(snap-row), 넓은 화면에서는 한 줄 다섯 칸.
 * ⚠️ quote 는 환자의 말(lib/homeContent.ts). 병원 말투로 다듬지 않는다.
 */
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
        <ul className="reveal-stack snap-row no-scrollbar -mx-5 mt-10 flex gap-3 overflow-x-auto px-5 lg:mx-0 lg:mt-12 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0">
          {HOME_CONCERNS.map((c) => (
            <li key={c.href + c.quote} className="w-[70vw] shrink-0 sm:w-[40vw] lg:w-auto">
              <Link
                href={c.href}
                className="photo-card group relative block aspect-[3/4] overflow-hidden rounded-[8px] bg-wine-deep"
              >
                <Image
                  src={c.photo.src}
                  alt={c.photo.alt}
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 20vw"
                  className="object-cover"
                />
                <div aria-hidden className="pcard-shade absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                  <div className="min-w-0">
                    <p className="text-[18px] leading-[1.4] font-medium sm:text-[19px]">{c.quote}</p>
                    <p className="mt-2 text-[13px] text-white/70">{c.tag}</p>
                  </div>
                  <span aria-hidden className="ring-arrow shrink-0">
                    <ArrowGlyph />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 4. 자연치아 보존 ─────────────────────────── */
/*
 * 인터서울의 큰 문장 — 첫 구절만 블루그레이 상자(.hl)로 세우고, 아래에 가로로 긴 사진이 천천히 제자리를 찾는다(.img-in).
 * 전에는 어두운 띠 위에 글을 얹었는데, 글은 아이보리에서 읽히고 사진은 사진대로 보이게 나눴다.
 */
function PreserveSection() {
  return (
    <section className="section-y-home border-t border-wine-line !pb-0">
      <Container>
        <div className="reveal max-w-[46em]">
          <p className="kicker">Natural together · for a longer smile</p>
          <h2 className="serif-head mt-6 text-[clamp(30px,4.6vw,54px)] leading-[1.35] text-charcoal">
            <mark className="hl">자연치아 보존,</mark> 가능할 때가
            <br />
            가장 좋습니다.
          </h2>
          <p className="mt-7 max-w-[30em] text-[17.5px] leading-[1.9] text-ash">
            살릴 수 있는 치아인지 정확하게 판단하고,
            <br className="hidden sm:block" /> 가능한 방법을 함께 찾아갑니다.
          </p>
          <div className="mt-9">
            <QuietLink href="/treatment/save-natural-tooth">자연치아 보존 자세히 보기</QuietLink>
          </div>
        </div>
      </Container>
      <div className="img-in relative mt-14 h-[62vw] max-h-[620px] min-h-[300px] overflow-hidden bg-wine-deep lg:mt-20">
        <Image src={PRESERVE_PHOTO.src} alt="" aria-hidden fill sizes="100vw" className="object-cover object-[70%_60%] lg:object-[50%_55%]" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(46,55,61,0)_55%,rgba(46,55,61,0.55)_100%)]" />
        <Container className="absolute inset-x-0 bottom-0 pb-8 lg:pb-10">
          <p className="display-en text-[clamp(18px,2.2vw,28px)] tracking-[0.12em] text-white/85">{CLINIC.nameEn}</p>
        </Container>
      </div>
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
           *    근거가 없어 쓰지 않는다.
           */
          desc="경희대학교 치의학전문대학원 외래교수인 대표원장과 보건복지부 인정 통합치의학과 전문의로 구성된 의료진이 진료합니다."
        />

        {/*
          인터서울 '전문성/안전성/정확성/심미성' 의 얇은 선 격자 — 여기서는 **센 숫자**만 넣는다(lib/trustSignals.ts).
          값은 저장소 데이터를 센 것이라 손으로 적은 숫자가 없다. 숫자는 화면에 들어올 때 0 에서 올라온다(.count-in — RevealScript).
          ⚠️ 건수·성공률·후기를 여기 넣지 말 것(의료법 제56조 — trustSignals 머리말).
        */}
        <ul className="reveal mt-12 grid grid-cols-2 border-t border-l border-wine-line lg:mt-14 lg:grid-cols-4">
          {TRUST_STATS.map((s) => {
            const m = s.value.match(/^(\d+)(.*)$/);
            const n = m ? Number(m[1]) : null;
            const unit = m ? m[2] : '';
            return (
              <li key={s.label} className="border-r border-b border-wine-line px-5 py-7 sm:px-7 sm:py-9">
                <p className="stat-num count-in" data-count={n ?? undefined} data-suffix={unit || undefined}>
                  {s.value}
                </p>
                <p className="mt-3 text-[14px] leading-[1.6] text-ash sm:text-[14.5px]">{s.label}</p>
              </li>
            );
          })}
        </ul>

        <div className="reveal mt-14 lg:mt-20">
          <DoctorShowcase doctors={doctors} />
        </div>
      </Container>

      {/*
        ★★ 인증패 + 논문 배너 — **라이브(b9adf93) 홈의 짜임 그대로, 색만 새 팔레트** ★★
          (2026-09-17 오너: "여기는 기존 디자인에서 색감만 바꾸는 느낌으로".) 이번 재조판에서도 손대지 않았다.
        ⚠️ 배너의 어두운 판은 블루그레이 딥(46,55,61). 논문 제목은 원문 그대로 산세리프.
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
              colorClass="text-dusk/[0.10]"
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

/* ─────────────────────────── 6. 둘러보기 ─────────────────────────── */
/*
 * 더뉴 첫 화면의 3 판(큰 것 하나 + 세로 둘). 손을 올리면 사진 설명(alt 와 같은 말)이 아래에서 올라온다 — 인터서울 카드의 결.
 * ⚠️ 설명은 lib/homeContent.ts 의 alt 그대로 — 사진에 실제로 보이는 것만.
 */
function TourSection() {
  const tiles = [TOUR_PHOTOS.main, ...TOUR_PHOTOS.sub];
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
          aside={<QuietLink href="/about/tour">둘러보기</QuietLink>}
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {tiles.map((t, i) => (
            <div
              key={t.src}
              className={`img-in photo-card group relative overflow-hidden rounded-[8px] bg-wine-soft ${
                i === 0 ? 'aspect-[4/3] lg:row-span-2 lg:aspect-auto' : 'aspect-[4/3] lg:aspect-[16/10]'
              }`}
            >
              <Image
                src={t.src}
                alt={t.alt}
                fill
                sizes={i === 0 ? '(max-width: 1024px) 100vw, 60vw' : '(max-width: 1024px) 100vw, 40vw'}
                className="object-cover"
              />
              <div
                aria-hidden
                className="pcard-shade absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <p
                aria-hidden
                className="absolute inset-x-0 bottom-0 translate-y-3 p-5 text-[14px] leading-[1.6] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
              >
                {t.alt}
              </p>
            </div>
          ))}
        </div>
        <p className="reveal mt-8 max-w-[30em] text-[16.5px] leading-[1.9] text-ash">
          편안하고 안전한 진료 환경에서
          <br className="hidden sm:block" /> 늘 같은 마음으로 진료합니다.
        </p>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 7. 이야기 ─────────────────────────── */
/*
 * 인터서울 아티클 — 왼쪽에 제목과 '전체 보기', 오른쪽으로 글 카드가 옆으로 흐른다(넓은 화면에서도 가로 흐름).
 * ★ 글은 lib/insightFeed.allPostsMerged() — 로컬 + 중앙 합본, 최신순 여섯. 쪽은 ISR 3600 으로 다시 그린다.
 * ★ 표지 없는 글은 gen/ 의 AI 정물 두 장을 번갈아 표지로 쓴다.
 * ⚠️ 글이 하나도 없으면 구획을 통째로 숨긴다(빈 제목만 남기지 않는다).
 */
function StorySection({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  const ko = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return `${y}년 ${Number(m)}월 ${Number(d)}일`;
  };
  return (
    <section className="section-y-home border-t border-wine-line">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)] lg:gap-14">
          <div className="reveal flex flex-col">
            <p className="eyebrow-chip text-ash">인사이트</p>
            <h2 className="serif-head mt-4 text-[clamp(28px,4vw,44px)] text-charcoal">
              더 건강한 미소를 위한
              <br />
              동그라미의 이야기
            </h2>
            <p className="mt-5 max-w-[24em] text-[16.5px] leading-[1.9] text-ash">
              진료실에서 다 담기 어려운 이야기를 글로 적습니다. 새 글이 올라오면 이 자리에 먼저 보입니다.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
              <QuietLink href="/insight/blog">블로그 전체 보기</QuietLink>
              <RowNav target="story-row" label="글" className="hidden lg:flex" />
            </div>
            <div className="mt-auto hidden gap-5 pt-10 lg:flex">
              <a
                href={CLINIC.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-[14.5px] text-charcoal"
              >
                <span className="icon-ring icon-ring-sm">
                  <InstagramGlyph />
                </span>
                @circle_dental
              </a>
              <a
                href={CLINIC.social.naverBlog}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[14.5px] text-ash transition-colors hover:text-charcoal"
              >
                네이버 블로그 <span aria-hidden className="ml-1">→</span>
              </a>
            </div>
          </div>

          <ul id="story-row" className="reveal-stack snap-row no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0">
            {posts.map((p, i) => {
              const cover = p.image ?? STORY_FALLBACK_COVERS[i % STORY_FALLBACK_COVERS.length].src;
              const coverAlt = p.image ? (p.imageAlt ?? '') : '';
              return (
                <li key={p.slug} className="w-[74vw] shrink-0 sm:w-[300px]">
                  <Link
                    href={`/insight/blog/${p.slug}`}
                    className="photo-card group flex h-full flex-col overflow-hidden rounded-[6px] border border-wine-line bg-white transition-colors hover:border-brand-300"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-wine-soft">
                      <Image src={cover} alt={coverAlt} fill sizes="(max-width: 640px) 74vw, 300px" className="object-cover" />
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
                      <p className="mt-2 line-clamp-2 text-[14.5px] leading-[1.7] text-ash">{p.summary}</p>
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
        </div>

        {/* 채널 줄 — 좁은 화면에서만 카드 아래(넓은 화면은 왼쪽 열 바닥에 있다) */}
        <div className="reveal mt-8 flex items-center justify-between gap-6 border-t border-wine-line pt-5 lg:hidden">
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
/* 잠실서울의 마감 — 흰 정보 판(주소·진료시간·전화·버튼) 옆에 지도. 원 안 아이콘 세 줄은 목업 그대로. */
function VisitSection() {
  const { hours } = UNVERIFIED;
  return (
    <section className="section-y-home border-t border-wine-line">
      <Container>
        <HomeHead label="내원 안내" title="오시는 길" />
        <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal delay={60}>
            <div className="h-full rounded-[8px] border border-wine-line bg-white p-6 sm:p-8 lg:p-10">
              <ul className="space-y-7">
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

              <div className="mt-9 flex flex-col gap-3 border-t border-wine-line pt-8 sm:flex-row sm:flex-wrap">
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
            </div>
          </Reveal>

          <Reveal delay={100}>
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
function ArrowGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 10h11M10.5 5.5 15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
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
