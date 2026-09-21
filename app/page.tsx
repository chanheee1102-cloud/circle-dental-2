import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { CLINIC, UNVERIFIED, STRENGTHS, TREATMENT_PILLARS } from '@/lib/clinic';
import { DOCTORS, PUBLICATION_DETAIL } from '@/lib/doctors';
import { TRUST_STATS } from '@/lib/trustSignals';
import { FIRST_VISIT_FLOW } from '@/lib/firstVisit';
import { CLINIC_QA, HOME_FAQ_COUNT } from '@/lib/faq';
import { IMG } from '@/lib/assets';
import { HERO_PHOTO, PRINCIPLES, PRINCIPLE_STATEMENT, HOME_CONCERNS, PRESERVE_PHOTO, STORY_FALLBACK_COVERS, doctorPhoto } from '@/lib/homeContent';
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
 * 홈 — 레퍼런스 5곳의 **구획 자체**를 가져와 다시 짰다 (2026-09-21 오너 2차: "바뀐 게 없잖아. 레퍼런스 많이 참고해서 다시").
 *   dentalclinic.design · interseoul.com · 서울0.1치과 · jseouldental.com · thenewdent.com
 *   색·글꼴·버튼 규칙은 디자인 수정 요청서(2026-09-16) 그대로: 아이보리 바탕, 블루그레이는 필요한 곳에만, 세리프 제목, 실제 사진만.
 *
 * ★ 구획 (레퍼런스 → 여기)
 *    1 Hero          인터서울 — 글자 사이의 원이 내리면 화면 전체 사진, 그 위에 **가운데 정렬** 영문 세리프 + 한글 한 줄
 *    2 Quick         디자인치과·서울0.1 — 네이버 예약 / 카톡 상담 / 전화 세 타일
 *    3 Worries       디자인치과 "많은 분들이, 같은 걱정을 합니다" — 환자의 말 인용 카드(HOME_CONCERNS)
 *    4 Criteria      디자인치과 "좋은 진료는, 기준에서 나온다고 믿습니다" — 기준 넷, 유령 숫자 + 선 아이콘(PRINCIPLES)
 *    5 Dark band     디자인치과·더뉴 — 어두운 띠 한 장: 자연치아 보존
 *    6 First visit   디자인치과 "처음 오신 날" — 번호 원 + 세로 선 단계(FIRST_VISIT_FLOW)
 *    7 Treatments    디자인치과 "같은 기준을, 모든 진료에" / 인터서울 4 카드 — 진료 4대 축 사진 카드(TREATMENT_PILLARS + IMG.treatment)
 *    8 Values        인터서울 "전문성/안전성/정확성/심미성" 격자 — 특별함 다섯(STRENGTHS) + 센 숫자(TRUST_STATS)
 *    9 Doctors       한 사람씩 펼침면 + 인증패 + 논문 배너(오너 승인 구획, 그대로)
 *   10 FAQ           인터서울 어두운 01~05 목록 + '+' — 자주 묻는 질문(CLINIC_QA)
 *   11 Story         인터서울 아티클 — 왼쪽 제목 + 가로 흐름 글 카드
 *   12 Contact       인터서울 Contact Us / Location — 세 칸 정보 + 가로 지도, 마지막에 디자인치과의 어두운 마감 CTA
 *
 * ⚠️ 레퍼런스와 일부러 다르게 둔 것 (사실 관계·의료법)
 *   · 사진은 이 병원의 실제 사진뿐(lib/assets · lib/homeContent). 스톡 인물·모델 사진은 쓰지 않는다.
 *     예외는 AI 생성 정물 3장(gen/ — 2026-09-17 오너 GO)뿐이다. 첫 방문 단계의 AI 설명 사진은 홈에서 쓰지 않는다(고지가 필요해서).
 *   · 치료 전후 사진·후기·건수·"1위" 류는 싣지 않는다(의료법 제56조). 숫자는 저장소 데이터를 센 것(lib/trustSignals)뿐이다.
 *   · 문구는 전부 lib 원문이다 — 이 파일에서 병원에 대한 문장을 새로 만들지 않는다.
 * ⚠️ 채운 버튼은 화면당 하나. FAQPage 스키마는 /faq 만 낸다(HomeFaqSection 주석) — 여기서 내지 않는다.
 */
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
      <QuickTiles />
      <WorriesSection />
      <CriteriaSection />
      <PreserveBand />
      <FirstVisitSection />
      <TreatmentsSection />
      <ValuesSection />
      <DoctorsSection />
      <FaqSection />
      <StorySection posts={posts} />
      <ContactSection />
      <ClosingBand />
    </>
  );
}

/* ─────────────────────────── 1. 첫 화면 ─────────────────────────── */
/*
 * 인터서울 — 밝은 바탕 + 글자 사이의 동그란 사진 → 내리면 원이 화면 전체 사진. 그 위 장면은 인터서울처럼 **가운데 정렬**:
 * 영문 세리프 두 줄(Marcellus — 라틴 문자 자리) + 한글 한 줄 + 버튼. 진행도는 components/HeroStage, 움직임은 globals.css .hstage.
 * ⚠️ 헤더는 사진 위에 얹히지 않는다(SiteHeader overHero=false). ⚠️ 채운 버튼은 사진 위에서 흰색(tone=dark).
 */
function Hero() {
  return (
    <HeroStage className="relative h-[190svh] lg:h-[200svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-wine-bg">
        {/* data-focus = 원 안에 보일 볼거리(태블릿 치아 모형)의 사진 안 위치. data-pos 는 object-[50%_38%] 와 같은 값, data-size 는 원본. 사진을 바꾸면 셋을 함께. */}
        <div className="hs-photo absolute inset-0" data-focus="0.55 0.42" data-pos="0.5 0.38" data-size="1920 1416">
          {/* 원은 바깥(.hs-photo)이 자르고, 사진의 이동·배율은 이 안쪽 상자가 진다 — 한 요소에 같이 걸면 원이 사진과 함께 밀린다. */}
          <div className="hs-img absolute inset-0">
            <Image src={HERO_PHOTO.src} alt={HERO_PHOTO.alt} fill priority sizes="100vw" className="object-cover object-[50%_38%]" />
          </div>
          <div aria-hidden className="hs-shade absolute inset-0 bg-[linear-gradient(180deg,rgba(23,26,29,0.35)_0%,rgba(23,26,29,0.25)_45%,rgba(46,55,61,0.72)_100%)]" />
        </div>

        {/* 장면 A — 아이보리 위의 글자. 넓은 화면은 한 줄 "뽑기 전에, ○ 한 번 더 살펴봅니다.", 좁은 화면은 세로로 쌓인다. */}
        <div className="hs-a absolute inset-0 grid grid-rows-[1fr_auto_1fr] px-5">
          <p className="enter kicker self-end pb-8 text-center lg:pb-10">Circle Dental Clinic · Hwajeong</p>
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
        <div className="hs-cue pointer-events-none absolute inset-x-0 bottom-[96px] flex justify-center text-ash 2xl:bottom-10">
          <p className="scroll-cue kicker flex flex-col items-center text-inherit">Scroll</p>
        </div>

        {/* 장면 B — 사진 위, 가운데(인터서울 "Prove Professionalism by the Results"). */}
        <div className="hs-b absolute inset-0 flex items-center justify-center px-5 text-center text-white">
          <div className="max-w-[46rem] pb-16 2xl:pb-0">
            <p className="display-en on-photo text-[clamp(34px,5.6vw,76px)] leading-[1.15] text-white">
              For a longer,
              <br />
              healthier smile
            </p>
            <p className="on-photo mt-6 text-[17px] leading-[1.8] text-white/90 sm:text-[19px]">
              자연치아를 오래 사용할 수 있도록
              <br className="sm:hidden" /> 필요한 치료부터 함께 판단합니다.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <FillBtn href="/treatment" tone="dark">
                진료 알아보기
              </FillBtn>
              <LineBtn href={CLINIC.booking.naver} external tone="dark">
                예약하기
              </LineBtn>
            </div>
            {/* ⚠️ 지역명은 첫 화면에 남긴다 — "화정동 치과" 질의의 근거가 이 자리다. */}
            <p className="on-photo mt-8 text-[14px] text-white/75">
              {CLINIC.address.locality} {CLINIC.address.dong} · {CLINIC.nearestStation} 인근 ·{' '}
              <a href={CLINIC.phoneHref} className="tabular-nums hover:text-white">
                {CLINIC.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </HeroStage>
  );
}

/* ─────────────────────────── 2. 예약 · 상담 · 전화 ─────────────────────────── */
/* 디자인치과·서울0.1 — 첫 화면 바로 아래 세 타일. 같은 셋이 맨 아래 어두운 마감(ClosingBand)에 한 번 더 온다. */
const QUICK = [
  { href: CLINIC.booking.naver, external: true, label: '네이버\n예약하기', icon: 'naver' },
  { href: CLINIC.booking.kakao, external: true, label: '카톡\n상담하기', icon: 'kakao' },
  { href: CLINIC.phoneHref, external: false, label: '전화\n연결하기', icon: 'phone' },
] as const;

function QuickTiles({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  const tiles = (
    <ul className="reveal-stack mx-auto grid max-w-[640px] grid-cols-3 gap-3 sm:gap-4">
      {QUICK.map((q) => (
        <li key={q.icon}>
          <a
            href={q.href}
            {...(q.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={`cta-tile ${dark ? 'cta-tile-dark' : ''}`}
          >
            <QuickBadge kind={q.icon} />
            <span className="whitespace-pre-line text-center text-[14.5px] leading-[1.45] font-medium sm:text-[15.5px]">{q.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
  if (dark) return tiles;
  return (
    <section className="pt-12 pb-4 lg:pt-16">
      <Container>{tiles}</Container>
    </section>
  );
}

function QuickBadge({ kind }: { kind: 'naver' | 'kakao' | 'phone' }) {
  if (kind === 'naver')
    return (
      <span className="cta-badge bg-[#03c75a] text-white">
        <NaverGlyph />
      </span>
    );
  if (kind === 'kakao')
    return (
      <span className="cta-badge bg-[#fee500] text-[#191919]">
        <KakaoGlyph />
      </span>
    );
  return (
    <span className="cta-badge bg-dusk text-white">
      <PhoneIcon />
    </span>
  );
}

/* ─────────────────────────── 3. 같은 걱정 ─────────────────────────── */
/* 디자인치과 "많은 분들이, 같은 걱정을 합니다" — 한 단 들어간 아이보리 면, 환자의 말 인용 카드가 한 장씩 밀려 들어온다. */
function WorriesSection() {
  return (
    <section className="section-y-home bg-wine-soft">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="reveal">
            <p className="eyebrow-chip text-ash">치과에 가기 전</p>
            <h2 className="serif-head mt-4 text-[clamp(28px,4vw,44px)] text-charcoal">
              많은 분들이,
              <br />
              같은 걱정을 합니다.
            </h2>
            <p className="mt-8 max-w-[24em] text-[17px] leading-[1.9] text-charcoal/85">
              동그라미치과는 이런 걱정에
              <br />
              <span className="font-medium text-dusk">뽑기 전에 한 번 더 살펴보는 것</span>으로 답합니다.
            </p>
            <div className="mt-7">
              <QuietLink href="/treatment">증상별 진료 안내</QuietLink>
            </div>
          </div>
          <ul className="reveal-stack space-y-3">
            {HOME_CONCERNS.map((c) => (
              <li key={c.href + c.quote}>
                <Link href={c.href} className="quote-card group flex items-center justify-between gap-4">
                  <span>
                    <span className="block text-[17.5px] leading-[1.5] font-medium text-charcoal">{c.quote}</span>
                    <span className="mt-1 block text-[13.5px] text-ash">{c.tag}</span>
                  </span>
                  <span aria-hidden className="text-ash transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 4. 네 가지 기준 ─────────────────────────── */
/* 디자인치과 "좋은 진료는, 기준에서 나온다고 믿습니다" — 2×2 흰 카드, 오른쪽 위 유령 숫자, 선 아이콘. 카드 테두리가 양옆에서 그어진다(.card-draw). */
function CriteriaSection() {
  const words = ['하나', '둘', '셋', '넷'];
  return (
    <section className="section-y-home">
      <Container>
        <HomeHead label="네 가지 진료 기준" title={<>좋은 진료는,<br />기준에서 나온다고 믿습니다.</>} />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:gap-5">
          {PRINCIPLES.map((p, i) => {
            const Icon = PRINCIPLE_ICONS[i] ?? PRINCIPLE_ICONS[0];
            return (
              <li key={p.n} className="card-draw relative overflow-hidden rounded-[12px] bg-white px-7 py-8 lg:px-9 lg:py-10">
                <span aria-hidden className="ghost-num">{i + 1}</span>
                <p className="eyebrow-chip text-dusk">기준 {words[i]}</p>
                <div className="mt-4 flex items-start justify-between gap-6">
                  <h3 className="serif-head text-[clamp(24px,2.4vw,30px)] text-charcoal">{p.title}</h3>
                  <span className="icon-ring shrink-0">
                    <Icon />
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="reveal mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-[30em] text-[17px] leading-[1.9] text-charcoal/85">
            <Sentences text={PRINCIPLE_STATEMENT} />
          </p>
          <QuietLink href="/about">동그라미의 진료 철학</QuietLink>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 5. 어두운 띠 ─────────────────────────── */
/* 디자인치과 "가장 가까운 검증" / 더뉴 '약속' — 페이지에서 유일하게 어두운 큰 면. 글은 짧게(긴 문단 금지), 가운데. */
function PreserveBand() {
  return (
    <section className="relative isolate overflow-hidden bg-wine-deep text-parchment">
      <Image src={PRESERVE_PHOTO.src} alt="" aria-hidden fill sizes="100vw" className="-z-20 object-cover object-[70%_50%] opacity-60" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_80%_at_50%_50%,rgba(46,55,61,0.55)_0%,rgba(46,55,61,0.94)_100%)]" />
      <Container className="py-24 text-center lg:py-32">
        <div className="reveal mx-auto max-w-[40em]">
          <p className="kicker text-parchment/70">Natural together · for a longer smile</p>
          <h2 className="serif-head mt-6 text-[clamp(30px,4.4vw,52px)] text-parchment">
            자연치아 보존,
            <br />
            가능할 때가 가장 좋습니다.
          </h2>
          <div className="rule-mid mt-8" />
          <p className="mt-8 text-[17px] leading-[1.9] text-parchment/85 sm:text-[18px]">
            살릴 수 있는 치아인지 정확하게 판단하고,
            <br className="hidden sm:block" /> 가능한 방법을 함께 찾아갑니다.
          </p>
          <div className="mt-9 flex justify-center">
            <QuietLink href="/treatment/save-natural-tooth" tone="dark">
              자연치아 보존 자세히 보기
            </QuietLink>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 6. 처음 오신 날 ─────────────────────────── */
/* 디자인치과 "처음 오신 날, 치료보다 확인과 설명이 먼저입니다" — 번호 원 + 세로 선 + 단계 글. 선은 위에서 아래로 자란다. */
function FirstVisitSection() {
  const steps = FIRST_VISIT_FLOW.slice(0, 4);
  return (
    <section className="section-y-home bg-wine-soft">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow-chip text-ash">첫 방문 안내</p>
            <h2 className="serif-head mt-4 text-[clamp(28px,4vw,44px)] text-charcoal">
              처음 오신 날,
              <br />
              치료보다 확인과 설명이 먼저입니다.
            </h2>
            <p className="mt-6 max-w-[26em] text-[16.5px] leading-[1.9] text-ash">
              급한 통증이나 감염이 있으면 순서가 바뀔 수 있습니다. 전체 절차는 첫 방문 안내에서 볼 수 있습니다.
            </p>
            <div className="mt-7">
              <QuietLink href="/about/process">첫 방문 안내 전체 보기</QuietLink>
            </div>
          </div>
          <ol className="reveal-stack relative">
            <span aria-hidden className="step-rail depth-fill" />
            {steps.map((s) => (
              <li key={s.n} className="relative flex gap-6 pb-10 last:pb-0 sm:gap-8">
                <span className="num-ring relative z-10 shrink-0 bg-wine-soft">{s.n}</span>
                <div className="min-w-0 pt-2">
                  <h3 className="text-[19px] leading-[1.4] font-medium text-charcoal sm:text-[20px]">{s.t}</h3>
                  <p className="mt-2.5 max-w-[34em] text-[15.5px] leading-[1.85] text-ash">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 7. 같은 기준을 모든 진료에 ─────────────────────────── */
/* 디자인치과 "같은 기준을, 모든 진료에 적용합니다" / 인터서울 4 카드 — 진료 4대 축. 사진은 기존 홈페이지의 실제 자산(IMG.treatment). */
function TreatmentsSection() {
  return (
    <section className="section-y-home">
      <Container>
        <HomeHead
          label="진료 안내"
          title={<>같은 기준을,<br />모든 진료에 적용합니다.</>}
          aside={<QuietLink href="/treatment">전체 진료과목</QuietLink>}
        />
        <ul className="reveal-stack mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5">
          {TREATMENT_PILLARS.map((t) => {
            const img = IMG.treatment[t.key];
            return (
              <li key={t.key}>
                <Link href={t.href} className="photo-card group flex h-full flex-col overflow-hidden rounded-[12px] border border-wine-line bg-white transition-colors hover:border-brand-300">
                  <div className="img-in relative aspect-[4/3] overflow-hidden bg-wine-soft">
                    <Image src={img.src} alt={img.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col px-6 pt-6 pb-7">
                    <h3 className="serif-head text-[24px] text-charcoal">{t.name}</h3>
                    <p className="mt-3 text-[15px] leading-[1.8] text-ash">{t.copy}</p>
                    {/* 디자인치과 카드의 테두리 단추 — 손을 올리면 차콜로 채워진다. 채운 버튼(FillBtn)이 아니라 화면당 하나 규칙과 무관하다. */}
                    <div className="mt-auto pt-6">
                      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-charcoal/25 px-4 py-2 text-[13.5px] font-medium text-charcoal transition-colors group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-white">
                        {t.name} 자세히 보기 <span aria-hidden>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 8. 특별함 격자 ─────────────────────────── */
/* 인터서울 "전문성 / 안전성 / 정확성 / 심미성" — 얇은 선 격자. 위 영문 라벨, 큰 한글 제목, 본문. 여섯째 칸은 센 숫자 넷. */
const VALUE_EN: Record<string, string> = { pain: 'Comfort', digital: 'Digital', faculty: 'Experience', warranty: 'Warranty', hygiene: 'Hygiene' };

function ValuesSection() {
  return (
    <section className="section-y-home border-t border-wine-line">
      <Container>
        <HomeHead
          label="동그라미치과의 특별함"
          title={<>치료의 완성도를 위해<br />다섯 가지를 먼저 챙깁니다.</>}
        />
        <ul className="reveal-stack mt-12 grid border-t border-l border-wine-line sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {STRENGTHS.map((s) => (
            <li key={s.key} className="value-cell">
              <p className="kicker">{VALUE_EN[s.key] ?? s.key}</p>
              <h3 className="serif-head mt-5 text-[clamp(24px,2.4vw,30px)] text-charcoal">{s.title}</h3>
              <p className="mt-4 text-[15px] leading-[1.8] text-ash">{s.body}</p>
            </li>
          ))}
          {/* 여섯째 칸 — 센 숫자. 값은 저장소 데이터를 센 것(lib/trustSignals). 건수·후기·성공률은 넣지 않는다. */}
          <li className="value-cell bg-wine-soft">
            <p className="kicker">By the numbers</p>
            <ul className="mt-5 grid flex-1 grid-cols-2 gap-x-4 gap-y-5">
              {TRUST_STATS.map((s) => {
                const m = s.value.match(/^(\d+)(.*)$/);
                return (
                  <li key={s.label}>
                    <p className="count-in text-[30px] leading-none font-light text-charcoal tabular-nums" data-count={m ? m[1] : undefined} data-suffix={m ? m[2] : undefined}>
                      {s.value}
                    </p>
                    <p className="mt-2 text-[12.5px] leading-[1.5] text-ash">{s.label}</p>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5">
              <QuietLink href="/about/trust">근거 · 인증 전체</QuietLink>
            </div>
          </li>
        </ul>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 9. 의료진 ─────────────────────────── */
/* 한 사람씩 펼침면 + 인증패 넷 + 논문 배너 — 라이브(b9adf93) 짜임 그대로(2026-09-17 오너 승인). 색만 새 팔레트. */
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
    <section className="section-y-home border-t border-wine-line">
      <Container>
        <HomeHead
          label="의료진"
          title={<>동그라미치과의<br />의료진을 소개합니다.</>}
          /* ⚠️ 문구는 lib/doctors.ts 로 확인되는 범위만. */
          desc="경희대학교 치의학전문대학원 외래교수인 대표원장과 보건복지부 인정 통합치의학과 전문의로 구성된 의료진이 진료합니다."
        />
        <div className="reveal mt-12 lg:mt-16">
          <DoctorShowcase doctors={doctors} />
        </div>
      </Container>
      <Container>
        <div className="relative mt-20 overflow-hidden lg:mt-28">
          <div aria-hidden className="pointer-events-none absolute top-[42%] left-1/2 z-0 w-screen -translate-x-1/2 -translate-y-1/2">
            <HeroMarquee text="Circle Dental Clinic ·" seconds={46} size="clamp(64px, 9.5vw, 176px)" colorClass="text-dusk/[0.10]" />
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
              <Image src={PUBLICATION_DETAIL.banner} alt="" fill loading="lazy" sizes="(max-width: 1024px) 100vw, 1320px" className="object-cover object-right" />
              <div className="absolute inset-0 bg-wine-deep/82 lg:hidden" />
              <div className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,rgba(46,55,61,0.97)_0%,rgba(46,55,61,0.94)_40%,rgba(46,55,61,0.72)_56%,rgba(46,55,61,0)_74%)]" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 10. 자주 묻는 질문 ─────────────────────────── */
/*
 * 인터서울 before/after 의 어두운 01~05 목록 + '+' — 여기서는 자주 묻는 질문. <details> 라 자바스크립트 없이 여닫히고
 * 답이 HTML 에 그대로 있어 크롤러가 읽는다. ⚠️ FAQPage 스키마는 /faq 만 낸다(HomeFaqSection 주석). 개수는 lib/faq.ts 가 정한다.
 */
function FaqSection() {
  const items = CLINIC_QA.slice(0, HOME_FAQ_COUNT);
  return (
    <section className="bg-wine-deep py-24 text-parchment lg:py-32">
      <Container>
        <div className="reveal text-center">
          <p className="kicker text-parchment/60">Questions</p>
          <h2 className="serif-head mt-4 text-[clamp(28px,4vw,44px)] text-parchment">자주 묻는 질문</h2>
        </div>
        <div className="reveal-stack mx-auto mt-12 max-w-[960px] border-t border-white/15 lg:mt-14">
          {items.map((it, i) => (
            <details key={it.q} className="faq-row group">
              <summary className="flex items-center gap-5 py-5 text-left sm:gap-8 sm:py-6">
                <span className="kicker w-[2.4em] shrink-0 text-parchment/60">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 text-[16.5px] leading-[1.5] font-medium text-parchment sm:text-[18px]">{it.q}</span>
                <span aria-hidden className="faq-plus text-parchment/80" />
              </summary>
              <div className="faq-a pb-7 pl-[calc(2.4em+20px)] sm:pl-[calc(2.4em+32px)]">
                <p className="max-w-[44em] text-[15.5px] leading-[1.9] text-parchment/80">
                  <Sentences text={it.a} tone="dark" />
                </p>
              </div>
            </details>
          ))}
        </div>
        <div className="reveal mt-10 flex justify-center">
          <LineBtn href="/faq" tone="dark">
            질문 전체 보기
          </LineBtn>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 11. 이야기 ─────────────────────────── */
/* 인터서울 아티클 — 왼쪽 제목, 오른쪽으로 글 카드가 흐른다(‹ › RowNav). 글은 로컬+중앙 합본 최신 여섯, ISR 3600. 표지 없는 글은 AI 정물 대체 표지. */
function StorySection({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) return null;
  const ko = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return `${y}년 ${Number(m)}월 ${Number(d)}일`;
  };
  return (
    <section className="section-y-home">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)] lg:gap-14">
          <div className="reveal flex flex-col">
            <p className="eyebrow-chip text-ash">인사이트</p>
            <h2 className="serif-head mt-4 text-[clamp(28px,4vw,44px)] text-charcoal">
              아티클로 전하는
              <br />
              동그라미의 이야기
            </h2>
            <p className="mt-5 max-w-[24em] text-[16.5px] leading-[1.9] text-ash">진료실에서 다 담기 어려운 이야기를 글로 적습니다. 새 글이 올라오면 이 자리에 먼저 보입니다.</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
              <QuietLink href="/insight/blog">블로그 전체 보기</QuietLink>
              <RowNav target="story-row" label="글" className="hidden lg:flex" />
            </div>
            <div className="mt-auto hidden gap-5 pt-10 lg:flex">
              <a href={CLINIC.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-[14.5px] text-charcoal">
                <span className="icon-ring icon-ring-sm">
                  <InstagramGlyph />
                </span>
                @circle_dental
              </a>
              <a href={CLINIC.social.naverBlog} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[14.5px] text-ash transition-colors hover:text-charcoal">
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
                  <Link href={`/insight/blog/${p.slug}`} className="photo-card group flex h-full flex-col overflow-hidden rounded-[8px] border border-wine-line bg-white transition-colors hover:border-brand-300">
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
                        읽어보기 <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="reveal mt-8 flex items-center justify-between gap-6 border-t border-wine-line pt-5 lg:hidden">
          <a href={CLINIC.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-w-0 items-center gap-3 text-[15px] font-medium text-charcoal">
            <span className="icon-ring icon-ring-sm">
              <InstagramGlyph />
            </span>
            <span className="truncate">@circle_dental</span>
          </a>
          <a href={CLINIC.social.naverBlog} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[14.5px] text-ash">
            네이버 블로그 <span aria-hidden>→</span>
          </a>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────── 12. Contact Us · Location ─────────────────────────── */
/* 인터서울 — 큰 영문 세리프 "Contact Us", 세 칸(주소·진료시간·전화), 그 아래 가로로 꽉 찬 지도(Location). */
function ContactSection() {
  const { hours } = UNVERIFIED;
  return (
    <section className="border-t border-wine-line">
      <Container className="section-y-home !pb-14 lg:!pb-16">
        <div className="reveal grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <p className="display-en text-[clamp(40px,5.2vw,64px)] leading-none text-charcoal">Contact Us</p>
            <p className="mt-6 max-w-[24em] text-[17px] leading-[1.9] text-charcoal/85">
              {CLINIC.address.locality} {CLINIC.address.dong}, {CLINIC.nearestStation} 인근.
              <br />
              화·목은 야간 진료로 늦게까지 봅니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <FillBtn href={CLINIC.booking.naver} external label="네이버 예약하기 — 새 창으로 열기">
                <NaverGlyph /> 네이버 예약하기
              </FillBtn>
              <LineBtn href={CLINIC.phoneHref}>
                <PhoneIcon /> 전화 상담하기
              </LineBtn>
            </div>
          </div>
          <dl className="grid gap-8 border-t border-wine-line pt-8 sm:grid-cols-3 lg:border-t-0 lg:pt-2">
            <div>
              <dt className="flex items-center gap-3 text-[13px] text-ash">
                <span className="icon-ring icon-ring-sm">
                  <PinIcon />
                </span>
                주소
              </dt>
              <dd className="mt-4 text-[15.5px] leading-[1.75] text-charcoal">
                {CLINIC.address.full}
                <span className="mt-1 block text-[14px] text-ash">{CLINIC.address.building}</span>
                <span className="mt-3 block">
                  <CopyButton text={CLINIC.address.full} />
                </span>
              </dd>
            </div>
            {hours.verified && (
              <div>
                <dt className="flex items-center gap-3 text-[13px] text-ash">
                  <span className="icon-ring icon-ring-sm">
                    <ClockIcon />
                  </span>
                  진료시간
                </dt>
                <dd className="mt-4 text-[15px] leading-[1.8] text-charcoal">
                  {hours.display.map((h) => (
                    <span key={h.label} className="flex justify-between gap-3">
                      <span>
                        {h.label}
                        {h.note ? <span className="ml-1.5 text-[12.5px] text-ash">{h.note}</span> : null}
                      </span>
                      <span className="tabular-nums">{h.time}</span>
                    </span>
                  ))}
                  <span className="mt-1 block text-[14px] text-ash">{hours.closed}</span>
                </dd>
              </div>
            )}
            <div>
              <dt className="flex items-center gap-3 text-[13px] text-ash">
                <span className="icon-ring icon-ring-sm">
                  <PhoneIcon />
                </span>
                전화
              </dt>
              <dd className="mt-4">
                <a href={CLINIC.phoneHref} className="tabular-nums text-[24px] leading-none font-medium text-charcoal transition-colors hover:text-dusk">
                  {CLINIC.phone}
                </a>
                <span className="mt-3 block text-[14px] text-ash">진료 중에는 접수에서 받습니다.</span>
              </dd>
            </div>
          </dl>
        </div>
      </Container>
      {/* Location — 가로로 꽉 찬 지도. 인터서울처럼 지도 위 왼쪽에 라벨. */}
      <div className="relative [&>div>div]:rounded-none [&>div>div]:border-0 [&>div>div]:shadow-none">
        <ClinicMap height={460} variant="compact" />
        <div className="pointer-events-none absolute top-6 left-0 right-0">
          <Container>
            <span className="display-en pointer-events-auto inline-block rounded-full bg-white/92 px-5 py-2 text-[15px] tracking-[0.12em] text-charcoal shadow-[var(--shadow-soft)] backdrop-blur">
              Location
            </span>
          </Container>
        </div>
        <div className="absolute right-0 bottom-5 left-0">
          <Container className="flex justify-end">
            <Link href="/visit" className="btn-pane inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-medium text-charcoal">
              지도 앱으로 길찾기 <span aria-hidden>→</span>
            </Link>
          </Container>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── 13. 마감 ─────────────────────────── */
/* 디자인치과의 어두운 마감 — 한 문장 + 예약·상담·전화 세 타일 한 번 더. 긴 문단 없이. */
function ClosingBand() {
  return (
    <section className="bg-wine-deep py-20 text-parchment lg:py-28">
      <Container>
        <div className="reveal mx-auto max-w-[46em] text-center">
          <h2 className="serif-head text-[clamp(24px,3.2vw,36px)] text-parchment">
            치료를 결정하기 전에,
            <br />
            내 치아 상태를 아는 것부터 시작해도 됩니다.
          </h2>
          <p className="mt-5 text-[16.5px] leading-[1.9] text-parchment/80">사진과 자료를 함께 보며, 필요한 치료부터 같이 판단합니다.</p>
        </div>
        <div className="mt-10">
          <QuickTiles tone="dark" />
        </div>
      </Container>
    </section>
  );
}

/* 선 아이콘 — 단색 currentColor. */
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
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M6.5 3.2 8.2 6.4 6.6 8.1a10.5 10.5 0 0 0 5.3 5.3l1.7-1.6 3.2 1.7v2.9c0 .7-.6 1.3-1.4 1.2C8.2 16.8 3.2 11.8 2.4 5c-.1-.8.5-1.4 1.2-1.4h2.9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
function NaverGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4.5 16.5v-13h3.9l4.5 6.9V3.5h3.9v13H13L8.4 9.6v6.9H4.5Z" fill="currentColor" />
    </svg>
  );
}
function KakaoGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 3.5c-4.1 0-7.4 2.6-7.4 5.8 0 2.1 1.4 3.9 3.5 4.9l-.8 3 3.4-2.2c.4.1.9.1 1.3.1 4.1 0 7.4-2.6 7.4-5.8S14.1 3.5 10 3.5Z" fill="currentColor" />
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
