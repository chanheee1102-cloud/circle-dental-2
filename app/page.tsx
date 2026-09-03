import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  CLINIC,
  UNVERIFIED,
  TREATMENT_PILLARS,
  PUBLICATION,
} from '@/lib/clinic';
import { IMG } from '@/lib/assets';
import { HeroMedia } from '@/components/HeroMedia';
import { HeroMarquee } from '@/components/HeroMarquee';
import { CredentialFan } from '@/components/CredentialFan';
import { DoctorStage } from '@/components/DoctorStage';
import { Reveal } from '@/components/Reveal';
import { InteriorSlider } from '@/components/InteriorSlider';
import { DOCTORS, PUBLICATION_DETAIL } from '@/lib/doctors';
import { Container, SectionHead, ContactCta, Sentences, SeqLetters } from '@/components/ui';
import { HomeHead, FillBtn, LineBtn, QuietLink } from '@/components/home';
import { PILLAR_ICONS } from '@/components/PillarIcons';
import { CopyButton } from '@/components/CopyButton';
import { ClinicMap } from '@/components/ClinicMap';
import { HoursStrip } from '@/components/HoursStrip';
import { WhyUsSection } from '@/components/WhyUsSection';
import { ConcernsSection } from '@/components/ConcernsSection';
import { JsonLd } from '@/components/JsonLd';
import { medicalWebPageSchema, imageObjectSchema } from '@/lib/seo';
import { imageMeta } from '@/lib/imageSize';

export const metadata: Metadata = {
  title: `${CLINIC.name} | 고양시 덕양구 화정동 치과`,
  description:
    '고양시 덕양구 화정동 동그라미치과의원. 10년 이상 경력의 대학병원 교수 출신 대표원장이 진료합니다. 자연치아살리기·임플란트·심미치료·사랑니 발치. 화·목 야간진료 오후 8시 30분까지.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  /*
   * ★★ 홈에도 FAQPage 를 낸다 (2026-08-14) ★★
   *   전에는 "/faq 가 이미 같은 문답으로 내고 있어 두 URL 이 다투게 된다" 는 이유로
   *   홈에서는 일부러 안 냈다. 다시 보면 그건 과한 조심이었다 — 구글이 금지하는 것은
   *   **화면에 없는 문답을 마크업하는 것**이지, 같은 문답이 두 문서에 보이는 것이 아니다.
   *   홈의 여섯 개는 아래 FAQ 섹션이 실제로 화면에 그린다.
   *
   *   ⚠️⚠️ 여기 배열은 반드시 **화면이 그리는 것과 같은 slice** 여야 한다 ⚠️⚠️
   *      숫자를 여기서 새로 만들지 않고 lib/faq.ts 의 HOME_FAQ_COUNT 를 그대로 쓴다.
   *      화면은 6개인데 마크업에 12개를 넣는 순간 구조화 데이터 정책 위반이고
   *      수동 조치 대상이 된다.
   */
  /** 대표 이미지 — 크기는 파일에서 직접 읽는다. 손으로 적으면 사진 교체 순간 거짓값이 된다. */
  const heroImage = imageMeta(IMG.interior[0].src, IMG.interior[0].alt);

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
          /*
            ⚠️⚠️ 여기에 HowTo 를 다시 넣지 말 것 (2026-08-14) ⚠️⚠️
              절차 다섯 단계를 홈에서 /about/process 로 옮기면서 이 마크업도 함께 뺐다.
              **화면에 없는 절차를 HowTo 로 내면 구조화 데이터 정책 위반**이고 수동 조치 대상이다.
              절차 HowTo 는 그 단계들이 실제로 보이는 /about/process 가 그대로 내고 있다.
          */
        ]}
      />
      {/*
        ★★ 홈에 남길 것만 남긴다 (2026-08-18 운영자: "진짜 필요한 내용만") ★★

          13,434px 를 재 보니 열한 섹션이 5~15%씩 고르게 차지하고 있었다. 고르다는 것은
          **무엇이 중요한지 화면이 말해 주지 않는다**는 뜻이다. 처음 온 사람이 결정하는 데
          필요한 것만 남기고 나머지는 이미 있는 전용 페이지로 넘겼다.

            1 Hero       누구이고 지금 갈 수 있는가
            2 Doctor     누가 보는가 — 병원 선택에서 가장 강한 신호
            3 Concerns   내 망설임이 여기 있는가
            4 Pillar     무엇을 하는가 (사진 네 갈래)
            5 Interior   어떤 공간인가 (자동으로 넘어가는 슬라이드)
            6 FAQ        궁금증 해소
            7 Hours      언제·어디로
            8 Cta        연락

          옮긴 것 — WhyUs 12가지 → /about · 사회공헌 → /about(이미 있었음) ·
                   미리 알아두기 홍보 → 제거 · 지도 → /visit
          바꾼 것 — 증상으로 찾기 자리를 **병원 둘러보기**로 (2026-08-18 운영자).
                   증상 입구는 망설임 섹션의 "증상으로 찾아보기" 와 주 메뉴가 맡는다.

        ★ 검색·AI 는 순서보다 **문서에 있는가**를 본다. 옮긴 내용도 사이트 안에 그대로 있고
          링크가 살아 있으므로 인용 가능성은 유지된다. 반대로 사람은 순서와 분량에
          그대로 영향을 받는다.

        ★★ 지난 판단들 (되돌리기 전에 읽을 것) ★★
          · 섹션을 13 → 11 로 합쳤다가 되돌렸다 — "스크롤 안 줄여도 된다. 퀄리티가 우선."
            세로로 긴 것은 문제가 아니고 **한 화면에 두 이야기가 눌려 드는 것**이 문제다.
          · 신뢰 지표 표는 /about/trust, 진행 절차는 /about/process 가 맡는다.
          · 진료 열 줄 목록은 /treatment 가 맡는다.
          ⚠️ 위 셋을 홈으로 다시 가져오지 말 것 (가져오려면 운영자 GO 필요).
      */}
      {/*
        ★★ 홈을 덜어냈다 (2026-08-18 운영자: "진짜 필요한 내용만 남기고 다 다른 페이지로") ★★

          13,434px 를 재 보니 열한 섹션이 5~15%씩 고르게 차지하고 있었다. 고르다는 것은
          **무엇이 중요한지 화면이 말해 주지 않는다**는 뜻이다. 처음 온 사람이 결정하는 데
          필요한 것만 남기고 나머지는 이미 있는 전용 페이지로 넘긴다.

          남긴 것 — 누구이고(Hero) · 누가 보고(Doctor) · 내 망설임이 여기 있고(Concerns) ·
                   무엇을 하고(Pillar) · 내 증상에서 시작하고(Symptom) ·
                   자주 묻는 것(FAQ) · 언제 어디로(Hours)

          옮긴 것
            · WhyUs 12가지 (1,584px)  → /about  (그 페이지가 '무엇이 다른가' 를 다룬다)
            · 병원 둘러보기 (806px)    → /about/tour  **이미 같은 내용이 있었다**
            · 사회공헌 (707px)        → /about       **이미 같은 내용이 있었다**
            · 미리 알아두기 홍보 (678px) → 제거. 바로 위 증상 섹션이 같은 곳(/insight)으로
                                        보내고 있었다. 한 목적지에 두 섹션은 낭비다.
            · 지도 (약 550px)         → /visit 에만. 주소·전화는 홈에 남는다.

        ⚠️ 링크는 하나도 안 끊는다. 옮긴 것들은 전부 주 메뉴·푸터에서 닿고,
           /about 카드에서도 닿는다(아래 재크롤로 확인 — 고아 페이지 0).
        ⚠️ FAQ 는 남긴다. 홈의 FAQPage 스키마가 그 화면을 근거로 나가므로,
           섹션을 빼면 스키마도 함께 빼야 한다(app/page.tsx 위 JsonLd 주석 참고).
      */}
      {/*
        ★★ 히어로 → 진료과목 (2026-08-28 오너: "히어로 밑에 바로 의료진인데 진료과목부터") ★★
          처음 온 사람이 첫 화면 다음에 알고 싶은 것은 '누가' 보다 '무엇을' 이다.
          의료진은 그다음이다.
        ★★ 덮으며 올라오는 모션 ★★
          히어로가 제자리에 고정되고 진료과목 면이 그 위를 덮는다. 두 요소를 한 상자에
          담아야 그 상자를 지날 때 고정이 풀린다.
        ⚠️ 이 상자를 없애면 히어로가 페이지 끝까지 고정된 채 남는다.
        ⚠️ 덮는 쪽 배경(bg-wine-bg)을 투명하게 두지 말 것 — 히어로가 비쳐 글이 겹친다.
      */}
      <div className="relative">
        <Hero />
        <div className="hero-cover relative z-10 bg-wine-bg text-twilight">
          <PillarSection />
        </div>
      </div>

      {/*
        ⚠️ home-flow — 이어지는 구획 사이에 실선을 하나씩 긋는다(globals.css .home-flow).
           밝은 면이 계속되면 어디서 화제가 바뀌는지 안 보인다.
      */}
      <div className="home-flow relative z-10 bg-wine-bg text-twilight">
      <DoctorSection />
      <ConcernsSection />
      {/*
        ★★ 신뢰 지표를 /about/trust 로 옮겼다 (2026-08-14 운영자) ★★
          숫자 여섯 + 인증표 다섯 줄 + 논문 + 방송 + 진료시간을 홈 한 화면에 몰아넣으니
          **아무것도 눈에 안 들어왔다**(운영자: "가시성 가독성 떨어진다").
          홈은 의료진 섹션의 인증패 쇼케이스로 "그런 근거가 있다" 까지만 하고,
          실제 표와 목록은 전용 페이지가 맡는다.
        ⚠️ 홈에서 뺐다고 링크까지 빼면 안 된다 — 의료진 섹션 안에 '근거 · 인증 전체 보기'
           버튼을 두었고 주 메뉴에도 올렸다.
      */}
      {/*
        ★★ 진행 절차를 /about/process 로 되돌렸다 (2026-08-14 운영자) ★★
          다섯 단계를 가로로 펼치니 카드마다 글이 다섯 줄씩 들어가 홈에서 읽히지 않았다.
          절차는 **내원을 결심한 사람이 찾아 읽는 것**이지 훑는 사람에게 들이밀 것이 아니다.
        ⚠️ 링크는 살아 있다 — 주 메뉴(병원 소개 → 진료 절차), 푸터, 그리고 아래 FAQ 섹션에
           '처음 오시면 어떻게 진행하나요?' 로 걸어 두었다.
      */}

      {/*
        ★★ 진료 영역 열 줄 목록을 /treatment 로 옮겼다 (2026-08-14 운영자) ★★
          위 PillarSection 이 이미 '어떤 진료를 받을 수 있나요?' 에 사진 카드로 답하는데
          그 바로 아래에서 같은 질문에 열 줄로 다시 답하고 있었다. 홈만 길어지고
          어느 쪽도 끝까지 안 읽힌다.
        ⚠️ 링크는 살아 있다 — PillarSection 아래 '전체 진료과목' 버튼과 주 메뉴(진료),
           그리고 헤더 메가메뉴의 진료 목록이 그 길이다.
      */}
      <InteriorSection />
      {/*
        ⚠️ 자주 묻는 질문 구획을 홈에 되살리지 말 것 (2026-08-31 오너) — 같은 Q&A 가
           /faq 에 전부 있고, 구조화 데이터도 그쪽이 갖고 있다. 홈에 다시 넣으려면
           faqSchema 도 함께 되살려야 한다. 하나만 되살리면 '보이는 것' 과 '알리는 것' 이
           어긋난다.
      */}
      <HoursSection />
      {/*
        ⚠️ 홈 마무리 CTA 를 뺐다 (2026-08-28 오너). 되살리지 말 것 —
           바로 위 '오시는 길' 구획에 예약·전화 버튼이 이미 있어 같은 자리에서 같은 말을
           두 번 하고 있었다. 검색 쪽 손해도 없다(전화번호·예약 링크는 푸터·퀵메뉴·히어로에
           그대로 있고, 그 구획의 h2 는 질문형이 아니라 광고 문장이라 인용 가치가 낮았다).
      */}
      </div>
    </>
  );
}

/**
 * 히어로.
 *
 * ★★ 유리 카드를 걷어냈다 (2026-08-27 오너: "가운데에 투명 카드는 없애는 게 나아보이네?") ★★
 *   배경 영상에 붉은 구강 화면이 지나가는 구간이 있는데, 그 위에 반투명 판이 겹치면
 *   판이 탁한 회색 덩어리로 보였다. 원본 홈페이지도 글을 사진 위에 바로 올린다.
 *   ⚠️ 판이 지던 대비 책임을 **덮개가 통째로 진다.** 그래서 덮개가 전보다 세다.
 *      값을 낮추면 밝은 프레임에서 글자가 무너진다 — 만지면 반드시 실측할 것.
 *   ⚠️ 글자마다 .on-photo(두 겹 그림자)를 함께 건다. 사진 위 흰 글씨는 덮개만으로는
 *      가장자리가 뭉갠다(globals.css .on-photo 주석).
 *
 * ★★ 카피는 circle-dental.co.kr 1번 슬라이드 원문 그대로다 ★★
 *   ⚠️ '10년 이상 경력의 대학 병원 출신 의료진' 은 병원 자기 문구다. 우리 데이터
 *      (lib/doctors.ts)로 확인되는 것은 '통합치의학과 전문의 3인 / 경희대 외래교수' 까지다.
 *
 * ⚠️ 음수 위쪽 여백(68/94)은 SiteHeader 의 **전체 높이**와 같아야 한다.
 */
function Hero() {
  return (
    /*
     * ★★★ 다섯 번째 판 — **원본 짜임으로 복귀** ★★★
     *   (2026-09-02 오너가 배포본 화면을 보여 주며: "그냥 원본 느낌으로 가는데,
     *    서브페이지도 마찬가지로")
     *
     * ★★ 이 자리를 다섯 번 고쳤다. 되돌리기 전에 전부 읽을 것 ★★
     *   ① 원본: 영상 위 어두운 덮개 두 겹 + 흰 글자        ← 지금 이것
     *   ② 글을 영상 밖(위)으로  → "이거 배경으로 들어가야지 영상"
     *   ③ 흰 덮개 + 진한 글자   → "왜 배경에 흐릿하게 생기는거야"
     *   ④ 덮개 0 + 흰 판        → "그냥 원본 느낌으로 가는데"
     *   ②③④ 는 전부 ①의 덮개를 피하려던 시도였고 셋 다 반려됐다.
     *   **흰 글자를 영상 위에 올리는 한 덮개는 선택이 아니라 조건이다.**
     * ⚠️ ②③④ 중 하나로 다시 가려면 오너의 새 지시가 있어야 한다.
     *
     * ⚠️ sticky top-0 — 다음 구획이 이 위를 덮으며 올라온다(감싸는 상자 주석 참고).
     * ⚠️ 높이를 화면과 정확히 같게 둔다. min-h 로 두면 내용이 늘 때 고정이 어긋난다.
     * ⚠️ 음수 위쪽 여백(68/94)은 SiteHeader 의 전체 높이와 같아야 한다.
     * ⚠️ 이 자리에 중괄호로 감싼 JSX 주석을 쓰지 말 것 — return( 바로 뒤는 아직
     *    표현식 자리라 문법 오류가 난다. 평범한 블록 주석만 된다.
     */
    <section className="hero-pin sticky top-0 z-0 -mt-[68px] flex h-[100dvh] flex-col overflow-hidden sm:-mt-[94px]">
      {/* 폴백 배경 — 영상마저 늦게 뜨는 회선에서도 화면이 비지 않는다. */}
      <div aria-hidden className="absolute inset-0 bg-night" />

      <HeroMedia />

      {/*
        덮개 두 겹 —
          ① 가운데를 타원으로 진하게: 글이 놓이는 자리만 집중해서 누른다.
          ② 위아래로 한 겹 더: 헤더와 지역 줄의 글자를 받쳐 준다.
        ★ 화면 전체를 고르게 어둡게 하는 대신 이렇게 나누면 **모서리 쪽 영상이 살아 있다.**
        ⚠️ 색이 중성 먹색이다. 갈색 덮개를 쓰면 영상이 누렇게 뜬다.
        ⚠️ 값을 낮추려면 실측부터 — 배경 영상에는 흰 복도처럼 아주 밝은 프레임이 있다.
      */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 78% 62% at 50% 46%,rgba(20,20,22,.78) 0%,rgba(20,20,22,.66) 52%,rgba(20,20,22,.36) 100%)',
            'linear-gradient(180deg,rgba(20,20,22,.46) 0%,rgba(20,20,22,0) 26%,rgba(20,20,22,0) 68%,rgba(20,20,22,.62) 100%)',
          ].join(','),
        }}
      />

      {/*
        ⚠️ mt-auto 로 되돌리지 말 것 — 그러면 글이 지역 줄 바로 위에 붙어 아래로 쏠린다.
        ⚠️ 위쪽 여백(pt)은 헤더가 겹치는 만큼이다. 헤더 높이를 바꾸면 여기도 볼 것.
      */}
      <div className="hero-inner relative flex w-full flex-1 flex-col justify-center px-5 pt-[94px] pb-6 text-center sm:px-8">
        {/* 원문 1번 슬라이드의 윗줄. */}
        {/* ⚠️ text-white/90 으로 되돌리지 말 것 — 영상 밝은 프레임에서 4.16:1 로 미달했다(실측). */}
        <p className="enter on-photo text-[16.5px] leading-[1.7] font-medium text-white sm:text-[18px]">
          10년 이상 경력의 대학 병원 출신 의료진, 디지털 의료장비 활용
        </p>

        {/*
          ⚠️⚠️ 이 문구를 바꾸면 scripts/subset-gowun.py 를 다시 돌릴 것 ⚠️⚠️
             잘라낸 글꼴에 없는 글자는 그 글자만 Pretendard 로 떨어져 글꼴이 두 벌 보인다.
          ⚠️ 굵기를 올리지 말 것 — 400 으로 크게 쓰는 것이 이 시스템의 전부다.
          ⚠️ 강제 줄바꿈(<br />)을 넣지 말 것 — 원본 홈페이지가 한 줄이다 (2026-08-27 오너).
        */}
        <h1
          className="enter on-photo display-ko mt-7 text-[clamp(32px,5.4vw,62px)] leading-[1.24] text-white"
          style={{ animationDelay: '90ms' }}
        >
          환자 중심 진료, 소통하는 치과
        </h1>

        {/* 원문 1번 슬라이드의 아랫줄. */}
        <p
          className="enter on-photo mx-auto mt-8 max-w-[36em] text-[18px] leading-[1.85] text-white/90"
          style={{ animationDelay: '170ms' }}
        >
          환자들의 치과에 대한 두려움을 깊이 공감하며, 최대한 아프지 않고 과잉 진료없이 편안하게
          치료를 받고 가실 수 있도록 노력합니다.
        </p>

        {/*
          ⚠️ 헤더에 예약 버튼이 하나 있지만(2026-09-02) 전화로 가는 길은 여기 하나뿐이다.
             둘 다 지우지 말 것.
        */}
        {/*
          ★★ 휴대폰에서는 감춘다 (2026-09-03 오너) ★★
             하단 고정 바에 네이버 예약과 전화가 늘 떠 있다. 첫 화면에서 같은 두 가지를
             또 보여 주면 제목·설명·지역 한 줄이 그만큼 아래로 밀린다.
          ⚠️ 위 주석의 "전화로 가는 길은 여기 하나뿐" 은 이제 맞지 않는다 — 하단 바에 있다.
             단 sm 이상에서는 하단 바가 눈에 덜 띄므로 버튼을 되살린다.
        */}
        <div
          className="enter mt-9 hidden flex-wrap items-center justify-center gap-3 sm:flex"
          style={{ animationDelay: '250ms' }}
        >
          <FillBtn
            href={CLINIC.booking.naver}
            external
            tone="dark"
            label="예약하기 — 네이버 예약 새 창으로 열기"
          >
            예약하기
          </FillBtn>
          <LineBtn href={CLINIC.phoneHref} tone="dark" className="tabular-nums">
            {CLINIC.phone}
          </LineBtn>
        </div>
      </div>

      {/*
        ⚠️⚠️ 지역 한 줄을 지우지 말 것 ⚠️⚠️
          지역명은 h1 주변 본문에 있을 때 가장 세게 먹히고, "고양 화정동 치과" 같은 질의에
          AI 가 답할 때 근거로 삼는 자리가 거기다. 한 번 빠졌다가 되살린 줄이다.
          지우려면 지역명을 첫 화면 다른 자리에 대신 넣을 것.
      */}
      <div
        /*
          ⚠️ 아래 여백은 **하단 고정 바(약 64px)** 를 피하려고 크다 (2026-09-02 실측).
             줄이면 흰 바 위에 흰 글자가 얹혀 1.07:1 이 된다. 바가 안 뜨는 2xl 부터만 줄인다.
        */
        className="hero-inner relative mx-auto w-full max-w-[1320px] px-5 pb-[5.5rem] text-center sm:pb-24 lg:px-8 2xl:pb-14"
      >
        {/*
          ⚠️⚠️ .enter 를 이 줄의 **부모**(.hero-inner)에 걸지 말 것 ⚠️⚠️
            둘 다 opacity 를 애니메이션하는데 .hero-inner 는 스크롤 타임라인이고 fill: both
            라, 화면 맨 위(진행도 0)에서 .enter 의 시작값 0 을 그대로 붙들어 버린다.
            그래서 이 줄이 **통째로 안 보였다**(2026-09-02 실측 opacity: 0. 배포본에도 있던
            문제다). 스크롤 연출은 부모가, 등장은 이 글자가 맡는다.
        */}
        <p
          className="enter on-photo text-[15.5px] font-medium text-white/80 sm:text-[16.5px]"
          style={{ animationDelay: '340ms' }}
        >
          {CLINIC.address.locality} {CLINIC.address.dong} · {CLINIC.nearestStation} 인근
        </p>
      </div>
    </section>
  );
}

/**
 * 진료 4대 축 — **사진 없이 유리 카드 넷**, 한 줄에.
 *
 * ★★ 왜 사진을 뺐나 (2026-08-28 오너) ★★
 *   사진이 카드마다 색이 달라(검정·파랑·회색·청록) 넷이 한 줄에 서니 색이 네 벌로 보였다.
 *   글만 남기면 **읽는 순서가 이름 → 설명 하나로 정리되고**, 카드 넷이 한 덩어리로 읽힌다.
 * ★ 재질은 오른쪽 퀵메뉴와 같은 .pane-glass 다. 화면에 유리판이 두 종류가 되지 않는다.
 *   (2026-09-02 오너 "검은 느낌 아예 없애" 로 .pane-dark → .pane-glass 로 함께 뒤집었다.
 *    한쪽만 바꾸면 화면에 어두운 유리와 밝은 유리가 동시에 뜬다.)
 * ⚠️ 회전목마로 되돌리지 말 것 — 자동 이동 / 스크롤 연동 / 단계 이동 세 판을 다 해 봤다.
 *    git history 에 남아 있다.
 * ⚠️ 카피는 기존 홈페이지 원문 그대로다(lib/clinic.ts TREATMENT_PILLARS).
 */
function PillarSection() {
  return (
    /* ⚠️ 아래 여백을 위보다 짧게 둔다 — 카드 그림자가 아래로 퍼져 실제보다 더 비어 보인다. */
    <section className="relative pt-12 sm:pt-16 pb-12 lg:pt-24 lg:pb-16">
      {/*
        ★★ 배경 진료실 사진을 걷어냈다 (2026-09-02 오너: "사진에 거뭇거뭇하고 흐릿한
           느낌 다 걷어 선명하고 밝게") ★★
           여기 있던 것은 진료실 사진 한 장 + 그 위를 wine-bg 로 97%→48% 덮는 그라데이션
           + backdrop-blur 였다. 덮개를 옅게 하면 왼쪽 위 제목이 사진 밝은 부분에 걸려
           읽히지 않으므로 **'흐릿함'을 걷으면서 사진을 남길 방법이 없다.** 둘 중 하나다.
           사진은 뺐다 — 장식(alt="" aria-hidden)이라 문서에서 잃는 정보가 0 이고,
           같은 복도 사진이 바로 위 머리말 띠와 아래 둘러보기 슬라이드에 이미 두 번 나온다.
        ⚠️ 되살리려면 덮개도 함께 돌아온다는 것을 알고 되살릴 것.
      */}
      <Container>
        {/*
          제목과 '전체 보기' 를 한 줄에 둔다 — 제목 아래 따로 두면 그만큼 구획이 길어진다.
          ★ 제목을 질문형으로 둔다. AI 검색은 "질문과 같은 제목 + 바로 뒤 짧은 답" 을 찾아
            인용한다. 명사구는 환자가 실제로 치는 문장과 매칭이 약하다.
        */}
        <div>
          <HomeHead
            /* ⚠️ 되살리지 말 것 (2026-08-28 오너) — 카드가 먼저 서 있고 제목이 뒤늦게
               올라와 읽는 순서가 뒤집혔다. 이 구획은 통째로 처음부터 서 있는다. */
            reveal={false}
            className="max-w-[42em]"
            label="동그라미치과에서는"
            title="어떤 진료를 받을 수 있나요?"
            desc={
              <Sentences text="자연치아를 살리는 치료를 중심에 두고 임플란트, 심미치료, 사랑니 발치까지 진료합니다." />
            }
          />
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/*
            ⚠️ 여기에는 스크롤 등장(.reveal)을 걸지 않는다 (2026-08-28 오너: "굳이 스크롤
               이벤트 넣지말고"). 넷이 한눈에 들어오는 것이 이 구획의 목적인데, 하나씩
               차례로 뜨면 그 목적과 정면으로 어긋난다.
          */}
          {TREATMENT_PILLARS.map((p, i) => {
            const Icon = PILLAR_ICONS[i];
            /* ⚠️ .pillar-cycle 은 li 에 있어야 한다 — 카드에 걸면 hover 3D 가 죽는다(globals.css). */
            return (
              <li key={p.key} className="pillar-cycle">
                <Link
                  href={p.href}
                  className="pane-glass pane-card group flex h-full min-h-[300px] flex-col overflow-hidden rounded-[18px] border border-brand-200/70 p-7"
                >
                  {/*
                    ⚠️ 순번(01~04)을 되살리지 말 것 (2026-08-28 오너) — 진료 넷은 순서가
                       있는 것이 아니라 **나란한 것**이다. 번호를 붙이면 1번이 더 중요한
                       진료처럼 읽힌다.
                  */}
                  <h3 className="display-sm text-[22px] text-ink sm:text-[24px]">
                    {p.name}
                  </h3>
                  <p className="mt-3.5 flex-1 text-[15.5px] leading-[1.75] text-ink-soft">
                    <Sentences text={p.copy} />
                  </p>
                  {/*
                    ★★ 아이콘은 맨 아래 오른쪽이다 (2026-08-28 오너) ★★
                      위에 뒀을 때는 쉬는 동안 아이콘이 안 보이니 **제목 위가 빈 칸**으로
                      남아 글 배치가 어긋나 보였다. 아래 오른쪽으로 내리면 그 빈 자리가
                      '자세히 보기' 반대편의 여백이 되어 어긋나 보이지 않는다.
                    ⚠️ 위로 되돌리지 말 것 — 되돌리면 빈 칸 문제가 그대로 돌아온다.
                    ⚠️ 아이콘은 쉬는 동안 보이지 않는다. 손을 올리면 그려진다(globals.css).
                       뜻을 지고 있지 않으므로(진료 이름이 이미 글자로 있다) 안 보이는
                       동안 잃는 정보가 없다 — aria-hidden 인 이유다.
                  */}
                  <span className="mt-6 flex items-center justify-between gap-4 text-ink">
                    <span className="inline-flex items-center gap-1.5 text-[15px] font-medium">
                      자세히 보기
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                    <Icon />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/*
          ⚠️ 이 버튼을 제목 옆으로 되돌리지 말 것 (2026-08-28 오너) — 거기 있으면 제목의
             일부처럼 보이는데, 하는 일은 **넷을 다 본 다음**이다. 자리가 곧 순서다.
          ⚠️ 문구에 숫자를 박지 말 것 (오너: "9가지로 확정짓지마"). 진료 수가 바뀌면
             문구가 거짓이 되고, 애초에 숫자를 약속할 이유가 없다.
        */}
        {/* ⚠️ 여기에 진행 표시줄(막대 넷)을 다시 넣지 말 것 (2026-08-31 오너) —
            '로딩 중' 으로 읽혔다. 카드가 커지는 것만으로 지금 몇 번째인지는 이미 보인다. */}
        <div className="mt-10 flex justify-center">
          <LineBtn href="/treatment">전체 진료과목 보기</LineBtn>
        </div>
      </Container>
    </section>
  );
}

function DoctorSection() {
  return (
    /*
     * ⚠️ 한 칸 내려앉은 면이다 — 앞뒤(진료과목·고민)와 톤이 달라야 구획이 바뀐 것이 보인다.
     *    실선만 두고 이 배경을 지우지 말 것 (2026-08-28 오너: "세션 바뀌는게 저 선 하나야?").
     * ⚠️ 여기 있던 흐릿한 원(blur-3xl)은 뺐다 — 면 전체가 그 색이 되면서 할 일이 없어졌고,
     *    남겨 두면 얼룩으로 읽힌다(오너가 전에 지적한 '배경이 그라데이션' 건과 같은 것).
     */
    /*
     * ★★ 어두운 구역 → 밝은 구역으로 **되돌렸다** (2026-09-02 오너: "그냥 검은
     *    느낌 아예 없애") ★★
     *   2026-08-31 에는 반대였다 — "너무 황금색이랑 안 어울린다. 차라리 배경을 사랑니
     *   발치 페이지처럼 어둡게". 그때 문제는 **밝은 바탕에서 강조색(골드)이 라벨과 학회
     *   판에 두 번 찍혀 겉돌던 것**이었고, 어둡게 해서 그것을 덮었다.
     *   지금은 사이트 전체가 베이지 + 고동색으로 바뀌면서 강조색 자체가 clay(고동)로
     *   내려앉아 그 문제가 사라졌다 — 전제가 바뀐 것이지, 그때 판단이 틀렸던 것이 아니다.
     * ★ 앞뒤 구획과 톤이 달라야 구획이 바뀐 것이 보인다는 원칙은 그대로다. 다만 그
     *   차이를 '어두움' 이 아니라 **한 단 밝은 면(parchment)** 으로 낸다.
     * ⚠️ 밝은 면 위에서는 본문 색을 ink 계열로 둘 것. oat/parchment 로 되돌리면
     *    흰 바탕에 흰 글자가 된다(실측 1.0:1).
     */
    <section className="relative overflow-hidden bg-parchment py-16 sm:py-24 text-ink lg:py-32">
      <Container className="relative">
        <HomeHead
          className="max-w-3xl [&_*]:text-ink"
          label="의료진"
          title="누가 진료하나요?"
          desc={
            /*
              ★★ 선언형으로 바꿨다 (2026-08-31 운영자) ★★
                "보건복지부인증 치과전문의들로만 구성된 동그라미 의료진 / 이런느낌으로 전문적으로"
                앞 문장은 "세 분 원장 모두 ~ 전문의입니다" 로, 사실이지만 설명조였다.
                '~로만 구성된' 이 세 분 전원이라는 것을 한 번에 말한다.

              ⚠️⚠️ 표기 두 가지를 지킬 것 ⚠️⚠️
                ① 표기는 **'보건복지부인증'** 이다 (2026-09-02 오너 지시). 자격 제도의
                   공식 용어는 '인정' 이지만 오너가 전 페이지 통일을 지시했다 —
                   '인정' 으로 되돌리려면 오너 GO 필요.
                ② '치과 전문의' 로 뭉뚱그리지 않고 **'통합치의학과 전문의'** 라고 적는다 —
                   전문과목은 실제 취득한 과목으로 표시해야 한다(의료법 제56조).
                   세 분 다 통합치의학과이므로 '~로만 구성' 도 사실이다.
            */
            /*
              ★★ 기존 홈페이지 문구를 가져왔다 (2026-08-31 운영자) ★★
                원본(circle-dental.co.kr) — "손끝의 숙련도에 따라 결과가 달라지는 치과 치료,
                10년 이상 경력의 교수출신 대표원장님과 보건복지부인증 전문의들로만 구성된
                의료진이 개인 맞춤형 진료를 제공합니다."

              ⚠️⚠️ 세 군데를 원문 그대로 옮기지 않았다 ⚠️⚠️
                ① "10년 이상 경력" — lib/doctors.ts 어디에도 근거가 없다. 확인되지 않은
                   연차를 적는 것은 의료법 제56조의 경력 허위 표시가 된다.
                ② "교수출신" — 대표원장은 경희대 치의학전문대학원 외래교수다(현재).
                   '출신' 은 그만두었다는 뜻이라 사실과 다르다.
                ③ ⚠️ 이 항목은 철회됐다 (2026-09-02 오너) — 원문대로 '보건복지부인증' 이다.
                ⚠️ 병원이 확인해 주면 ①②를 원문대로 되돌려도 된다. 그 전에는 이대로 둘 것.
            */
            <Sentences text="손끝의 숙련도에 따라 결과가 달라지는 치과 치료, 경희대학교 치의학전문대학원 외래교수인 대표원장과 보건복지부인증 통합치의학과 전문의로만 구성된 의료진이 진료합니다." />
          }
        />

        {/*
          ★★ 카드 세 장 → 무대 구도 (2026-08-25 운영자: "대표원장 가운데에 딱 뜨고
             그 왼쪽 오른쪽 밑에 각각 원장들 뜨고, 좀 카드 형식 말고 이렇게 원래
             동그라미치과 참고해서 스크롤이벤트랑 넣고") ★★
             원본(circle-dental.co.kr)은 세 분을 누끼로 따서 가운데가 크고 높게,
             양옆이 작고 낮게 세워 뒀다. 한 줄로 늘어놓은 카드 세 장과 달리 **구도
             자체가 위계를 말한다** — 누가 대표원장인지 글을 안 읽어도 보인다.
          ⚠️ 흰 카드·테두리·그림자를 없앤 대신 사진 아래를 마스크로 지운다. 안 지우면
             스튜디오 배경의 회색 네모가 바닥에 남아 '상자를 없앤' 게 아니라
             '테두리만 지운' 것이 된다(components/DoctorStage.tsx 주석 참조).
          ⚠️ 여기서 IntersectionObserver 를 새로 만들지 않는다 — 등장은 이 사이트의
             .reveal 클래스와 레이아웃에 하나뿐인 RevealScript 가 맡는다.
        */}
        <DoctorStage />
        {/*
          ★★ 원본 홈페이지와 같은 배치 — 네 장을 한 줄에 (2026-08-14 운영자) ★★
            자동으로 넘기는 쇼케이스를 만들었다가 되돌렸다. 운영자 판단은
            "그냥 이대로 나오게 하되 **줄이랑 규격을 맞춰라**" 다.

          ★★ 원본이 어긋나 있던 두 가지를 여기서 바로잡는다 ★★
            원본 홈페이지는 사진을 그대로 흘려 두어서
              ① 세 번째(세계근관치료학회, 236×178)만 다른 셋(236×242)보다 납작한데
                 세로 가운데 정렬이라 **혼자 아래로 내려앉고**,
              ② 그 바람에 캡션도 혼자 한참 아래에 찍힌다.
            → 같은 높이의 칸에 `object-contain` + **아래 정렬**로 담는다.
              비율이 달라도 네 장의 **밑변이 한 선에 서고**, 캡션도 같은 줄에서 시작한다.
              잘리는 인증서는 없다.

          ★ 액자를 씌우지 않는다 — 인증서 사진에 이미 금색 액자가 찍혀 있어
            테두리를 더하면 액자 안의 액자가 되고 그 여백만큼 인증서가 작아진다.
            그림자만 옅게 깔아 바탕에서 떠 보이게 한다.
          ⚠️ 원본이 236px 라 그보다 크게 늘리면 뭉개진다. 칸 높이를 200px 선에서 멈춘다.
        */}
        {/*
          ★★ 상자를 걷어냈다 (2026-08-25 운영자: "여기도 테두리좀 없애고") ★★
             테두리 + 옅은 바탕 + 안쪽 여백으로 묶어 두던 것을 없앴다. 바로 위
             의료진 무대도 상자가 없어졌는데 여기만 네모가 남아 한 섹션 안에서
             두 가지 언어가 섞여 있었다.
          ⚠️ 상자가 사라진 만큼 위아래 여백이 구분을 대신한다 — mt 를 줄이지 말 것.
             줄이면 인증패가 의료진 경력 줄에 붙어 한 덩어리로 읽힌다.
        */}
        <div className="mt-20 lg:mt-24">
          {/* ⚠️ 영문 대문자 눈썹을 되살리지 말 것 — 한글에는 대문자가 없다(components/home.tsx 주석). */}
          {/*
            ⚠️⚠️ text-ash 로 되돌리지 말 것 (2026-08-31 실측) ⚠️⚠️
              ash 는 **밝은 페이지용 보조 글자색**(#5e5a52)이다. 여기는 어두운 구획이라
              바탕(#1f1f29)과 1.7:1 로 사실상 안 보였다(운영자: "문구 어두운건 다 흰색으로").
              .page-dark 안에서는 ash 가 밝은 값으로 뒤집히지만, 이 구획은 밝은 페이지 안의
              어두운 섬이라 그 치환이 닿지 않는다.
          */}
          {/*
            ⚠️ '인증' 으로 되돌리지 말 것 — 바로 위 의료진 구획이 '보건복지부인증 전문의' 를
               말하고 있어, 같은 화면에 '인증' 이 또 나오면 둘이 같은 것처럼 읽힌다.
               여기 걸린 넷은 위촉패·수료패·수료증·회원증, 즉 쌓아 온 기록이라 '경력' 이 맞다.
            ⚠️ 선 + 라벨로 되돌리지 말 것 — 구획 눈금은 사이트 전체가 유리 알약 하나를 쓴다.
          */}
          {/*
            ★★ 2026-09-02 오너: "경력 이런거 너무 작아" ★★
              눈썹 한 줄(13.5px)만 있어서 인증패 넷이 무엇인지 말해 주는 것이 없었다.
              눈썹을 키우고 **한 줄 설명을 제목으로** 세운다. 훑는 사람에게는 크기가,
              답변 엔진에게는 이 한 문장이 근거가 된다.
            ⚠️ '인증' 으로 되돌리지 말 것 — 바로 위 의료진 구획이 '보건복지부인증 전문의' 를
               말하고 있어, 같은 화면에 '인증' 이 또 나오면 둘이 같은 것처럼 읽힌다.
               여기 걸린 넷은 위촉패·수료패·수료증·회원증, 즉 쌓아 온 기록이라 '경력' 이 맞다.
          */}
          <p className="reveal eyebrow-chip text-[15px] text-clay-700">경력</p>
          <h3 className="reveal display-sm mt-4 max-w-[22em] text-[clamp(24px,3vw,34px)] leading-[1.35] tracking-[-0.02em] text-ink">
            {/*
              ★ 오너가 준 두 안 중 **첫째**를 골랐다 (2026-09-03).
                  ⓐ '더 나은 진료를 위해, 배움과 경험을 이어갑니다'  ← 이것
                  ⓑ '경험이 쌓여, 진료의 기준이 됩니다'
                ⓑ 의 '진료의 기준이 됩니다' 는 주어가 없어 **업계의 기준**이라는 뜻으로도
                읽힌다. 근거 없는 우월성 표현은 심의에서 지적받는 유형이라 피했다.
                ⓐ 는 아래 걸린 것이 수료증·위촉패, 즉 '배움과 경험' 그 자체라 화면과도 맞는다.
              ⚠️ 무엇이 걸려 있는지는 눈썹('경력')과 넉 장의 캡션이 진다 — 그 둘을 지우면
                 이 구획이 무엇인지 기계가 알 길이 없어진다.
            */}
            더 나은 진료를 위해, 배움과 경험을 이어갑니다
          </h3>

          {/*
            ★★ 조명 hover → 부채꼴 펼침 + 커서 3D (2026-08-25 운영자: "이렇게 버전2에서
               스크롤 이벤트를 버전 1에도 입혀보자") ★★
               전에는 손을 올리면 뒤에서 빛이 번지고 액자가 떠오르는 연출이었다
               (2026-08-14 운영자: "마우스 갖다대면 임팩트"). 그 의도 — 상패는 빛을 받는
               물건이라는 것 — 는 그대로 살리되, 두 번째 버전의 **스크롤로 펼쳐지는 진열**
               로 바꿨다. 손을 올려야만 반응하던 것이 이제 스크롤만 해도 움직인다.
            ⚠️ 스포트라이트는 뺐다 — 펼침·기울기·층·바닥 그림자 넷이 이미 충분히 말한다.
               넷 위에 빛까지 겹치면 지저분해진다. 되살릴 거면 넷 중 하나를 빼고 넣을 것.
            ★ 링크·밑변 정렬·두 줄 캡션 높이는 그대로 유지했다(컴포넌트 주석 참조).
              세 가지 다 여기서 겪고 고친 것들이라 연출이 바뀌어도 끌고 간다.
          */}
          {/*
            ★★ 인증패 뒤로 흐르는 병원 영문명 (2026-08-25 운영자: "여기 인증패 뒤에
               배경에 버전2에 있던 서클 덴탈 클리닉 움직이는거 넣자 배경으로") ★★
               두 번째 버전이 섹션 사이 띠로 쓰던 마퀴를, 여기서는 **배경**으로 깐다.
               인증패 넷이 흰 바탕에 떠 있기만 하던 자리에 결이 생긴다.
            ⚠️⚠️ 기준 상자는 **인증패 줄(ul)** 이어야 한다 ⚠️⚠️
               처음엔 눈금줄까지 포함한 바깥 div 를 기준으로 top-1/2 를 줬더니, 그 상자가
               캡션까지 품어 세로가 길어서 **마퀴가 인증패 아래 캡션 자리로 내려갔다**
               (실측). 배경이 아니라 '또 하나의 줄'로 보였다.
               → 줄만 감싼 상자를 따로 두고 거기서 가운데를 잡는다. 42% 는 캡션 몫을
                 뺀 값이다 — 액자 몸통 한가운데를 지나게 한다.
            ⚠️ 아주 옅은 색이어야 한다(brand-900/[0.055]). 조금만 진해도 그 위의
               인증서 글자와 다투고, 그러면 배경이 아니라 두 번째 내용이 된다.
            ⚠️ pointer-events 는 컴포넌트가 이미 꺼 둔다 — 인증패 클릭을 가리면 안 된다
               (실측: 인증패 위를 누르면 /about/doctors 로 간다).
            ⚠️ 바깥 섹션이 overflow-hidden 이라 가로로 넘쳐도 페이지가 밀리지 않는다.
               그 클래스를 지우면 여기서 가로 스크롤이 생긴다.
          */}
          <div className="relative">
            {/*
              ★★ 화면 양끝까지 (2026-08-25 운영자: "양옆에 꽉차게 흐르게 해줘") ★★
                 이 자리는 Container(최대 1320px) 안이라 마퀴가 본문 폭에서 잘리고 있었다.
                 배경으로 흐르는 글자는 화면 모서리까지 이어져야 '지나간다'로 읽힌다.
              ⚠️ left-1/2 + -translate-x-1/2 + w-screen — 가운데 정렬된 상자 안에서
                 화면 폭을 되찾는 방법이다. inset-x-0 만으로는 Container 폭에 갇힌다.
              ⚠️ w-screen 은 스크롤바 폭까지 포함해 살짝 넘칠 수 있다. 바깥 섹션의
                 overflow-hidden 이 그걸 잘라 준다 — 그 클래스를 지우면 여기서
                 가로 스크롤이 생긴다.
            */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-[42%] left-1/2 z-0 w-screen -translate-x-1/2 -translate-y-1/2"
            >
              <HeroMarquee
                text="Circle Dental Clinic ·"
                seconds={46}
                size="clamp(64px, 9.5vw, 176px)"
                /*
                 * ★★ 색이 두 번 뒤집혔고, 진하기는 세 번 바뀌었다 ★★
                 *   ① 밝은 면 시절: 옅은 검정 → ② 어두운 면 시절: 옅은 흰색(둘 다 5.5%)
                 *   ③ 2026-09-02 다시 밝은 면: 옅은 **버건디**, 그리고 오너 지시로 진하게
                 *      ("뒤에 배경에 서클 클리닉 영어로 지나가는거 더 진하게 잘보이게").
                 * ⚠️ 흰색 계열로 되돌리지 말 것 — 이 면은 흰색이라 통째로 사라진다(실측 1.0:1).
                 * ⚠️ 0.16 을 넘기지 말 것. 그 위에 인증패 캡션이 지나가는데, 더 진해지면
                 *    캡션이 무늬와 겹쳐 읽히기 시작한다 — 그때부터는 배경이 아니라 방해다.
                 */
                colorClass="text-clay-700/[0.13]"
              />
            </div>
            <CredentialFan />
          </div>

          {/*
            발표 논문 — 원본도 인증패 아래에 가로로 긴 배너로 뒀다.
            제목만 적어 두면 '있다는 말' 로만 읽히므로 실물 화면을 함께 보여 준다.
          */}
          {/*
            ★★ 사진을 오른쪽 상자에 가두지 않고 **면 전체로** 쓴다 (2026-08-18 운영자) ★★
              원본 홈페이지가 이 자리를 가로로 긴 배너 한 장으로 뒀다. 왼쪽은 흐린 여백,
              오른쪽에 노트북과 논문이 있는 구도라 **여백 위에 글을 얹으라고 만든 사진**이다.
              그동안은 이걸 420px 상자에 넣어 노트북만 잘라 보여 줬는데, 그러면 사진이
              '첨부물' 이 되고 논문은 옆에 적힌 글로만 남는다.
              배너로 깔면 논문 화면 자체가 근거가 되고, 이 섹션에서 가장 무거운 자리가 된다.

            ★ 큰 화면에서만 글을 사진 위에 얹는다(왼쪽 52%). 좁은 화면에서는 사진 오른쪽의
              흰 논문 위로 글이 겹쳐 읽을 수 없게 되므로 **어둡게 덮는 정도를 다르게** 준다.
            ⚠️ 흰 글씨는 `.on-photo` 두 겹 그림자를 함께 쓴다. 이 사진은 흐린 밝은 배경이라
               덮개만으로는 글자 가장자리가 뭉갠다(globals.css .on-photo 주석).
          */}
          {/*
            ★★ 먼지 효과 제거 → 글자가 먼저, 사진이 나중 (2026-08-25 운영자: "아니 이거
               이상하다. 이 효과 빼고 그냥 논문이라고 설명하는 문구 한글자씩 스크롤
               이벤트로 나오게 해서 저 이미지 뜨게 하자") ★★
               직전에 넣었던 캔버스 낟알 연출(DustReveal)은 통째로 걷어냈다 — 모여드는
               중간 상태가 '먼지'보다 '깨진 화면'으로 보였다. 컴포넌트와 CSS 도 지웠다.
               지금은 어두운 판 위에서 라벨 → 제목이 한 글자씩 올라오고, 글이 거의
               끝날 무렵 사진이 떠오른다.
            ⚠️ 순서가 뒤집히면 안 된다 — 사진이 먼저 뜨면 글자가 사진 위에서 튀어
               '읽는 순서'가 사라진다. 지연값(--d)은 그 순서를 만드는 유일한 장치다.
            ⚠️ 관찰자는 레이아웃에 하나뿐인 RevealScript 다. 여기서 새로 만들지 말 것 —
               바깥에 .seq 만 두르면 안쪽 .seq-letter / .seq-fade 가 따라온다.
          */}
          <div className="mt-12 border-t border-wine-line pt-10">
            {/* ⚠️ 모서리 24px — 이 시스템에서 '큰 면' 의 값이다(버튼 8 / 카드 14 / 큰 면 24). */}
            {/*
              ★★ 논문 배너만 **어두운 채로 남는다** (2026-09-02 오너: "논문은 이전 그대로
                 어둡게") ★★
                 같은 날 사이트 전체에서 어두운 면을 걷어냈지만 여기 하나는 예외다.
                 이유가 있다 — 이 배너의 사진은 **논문 화면**이라 종이가 희고, 흰 면 위에
                 흰 종이를 얹으면 사진이 배경에 녹아 근거로 안 읽힌다. 어두운 판 위에
                 놓일 때만 논문이 물건으로 선다.
              ⚠️ 이 하나를 밝게 바꾸지 말 것. 바꾸면 오너 지시를 어기는 것이고, 사진도 죽는다.
              ⚠️ 반대로 이 어두움을 다른 구획으로 퍼뜨리지도 말 것 — 사이트에 남은 어두운
                 큰 면은 여기 하나다.
              ★ 덮개는 두 장으로 나눈다. 한 요소에 background-color 와 background-image 를
                같이 걸면 큰 화면에서 둘 다 살아남아 사진 전체가 어두워진다(겪었다).
            */}
            <div className="seq relative overflow-hidden rounded-[24px] bg-wine-deep lg:grid lg:grid-cols-[54%_minmax(0,1fr)]">
              <div className="relative z-10 px-7 py-12 sm:px-10 lg:py-16 xl:py-20">
                {/*
                  ⚠️ 사진의 alt 를 비웠으므로(장식이다) 논문 제목은 여기 본문 글자가 진다.
                     아래 제목을 지우면 이 배너에 논문 정보가 문서상 사라진다.
                */}
                {/* ⚠️ 선 + 라벨로 되돌리지 말 것 — 구획 눈금은 사이트 전체가 알약 하나를 쓴다. */}
                <p className="eyebrow-chip text-clay-300">
                  <SeqLetters text="발표논문" step={90} />
                </p>
                {/* ⚠️ 논문 제목은 원문 그대로다 — 세리프를 씌우지 않는다. 잘라낸 글꼴에 없는
                       글자가 섞여 한 줄에 글꼴이 두 벌 보인다. */}
                <p className="mt-5 text-[19px] leading-[1.6] font-semibold text-parchment sm:text-[21px]">
                  <SeqLetters text={PUBLICATION_DETAIL.title} step={11} start={420} />
                </p>
                <p className="seq-fade mt-3 text-[16px] text-brand-400" style={{ ['--d' as string]: '1400ms' }}>
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

              {/*
                사진 — 배너 전체에 깔리고 왼쪽 글 뒤만 덮는다.
                ⚠️ absolute 다. next/image 의 fill 이 기준으로 삼을 위치 지정 조상이
                   필요해서 바깥 div 가 relative 다.
                ⚠️ 좁은 화면에서는 글이 사진 전체 위에 놓이므로 고르게 덮고,
                   큰 화면에서는 왼쪽만 짙게 덮고 노트북이 있는 오른쪽은 완전히 비운다.
              */}
              <div
                aria-hidden
                className="seq-fade absolute inset-0"
                style={{ ['--d' as string]: '1180ms' }}
              >
                <Image
                  src={PUBLICATION_DETAIL.banner}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 1320px"
                  /* 노트북이 오른쪽에 있다 — 좁아질수록 오른쪽을 남기고 왼쪽 여백부터 잘라낸다. */
                  className="object-cover object-right"
                />
                <div className="absolute inset-0 bg-wine-deep/82 lg:hidden" />
                <div className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,rgba(36,20,23,0.96)_0%,rgba(36,20,23,0.93)_40%,rgba(36,20,23,0.70)_56%,rgba(36,20,23,0)_74%)]" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * 내부 둘러보기 — 실제 병원 사진 갤러리.
 *
 * ★★ 홈에서 뺐다가 **되돌렸다** (2026-08-18 운영자) ★★
 *   홈을 덜어내면서 "같은 내용이 /about/tour 에 이미 있다" 는 이유로 지웠는데,
 *   운영자가 다시 넣기를 원했다. 맞는 판단이다 — 같은 사진이라도 **역할이 다르다.**
 *   /about/tour 는 찾아 들어가서 보는 자리이고, 홈의 이 슬라이드는 병원을 처음 보는
 *   사람에게 **공간을 먼저 보여 주는** 자리다. 저절로 넘어가는 움직임 자체가
 *   "볼 것이 더 있다" 를 알린다.
 * ⚠️ 다시 지우지 말 것 (지우려면 운영자 GO 필요).
 */
function InteriorSection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <Container>
        <HomeHead
          className="max-w-3xl"
          label="진료환경"
          title="동그라미치과 내부 둘러보기"
        />
        {/*
          ⚠️ "실제 사진입니다 / 옆으로 넘겨 보실 수 있습니다" 를 되살리지 말 것
             (2026-08-31 오너) — 사진과 슬라이더가 그 자리에서 이미 말하고 있다.
             글로 다시 적으면 읽는 사람이 얻는 것이 0 이다.
        */}
      </Container>

      {/*
        ★★ 사진 줄만 컨테이너 밖으로 — 화면 양끝까지 (2026-08-25 운영자: "여기 전체
           양옆에 꽉 채워주면 안되나? 사진 범위를?") ★★
           글은 다른 섹션과 같은 기준선에 두고, **사진 줄만** 화면 폭을 다 쓴다.
           옆으로 흐르는 줄은 가장자리에서 잘려 나가야 '계속 이어진다'로 읽힌다 —
           상자 안에 갇혀 있으면 거기서 끝난 목록으로 보인다.
        ⚠️ Container 를 여기서 닫고 아래 링크에서 다시 연다. 사진 줄을 Container
           안에 도로 넣지 말 것 — 그 순간 양옆 여백이 돌아온다.
        ⚠️ 가로 스크롤은 <ul> 안에서만 일어난다(overflow-x-auto). 이 div 에
           overflow 를 걸지 말 것 — 페이지 전체가 옆으로 밀린다.
        ⚠️⚠️ 2026-08-31: 여기를 큰 사진 + 썸네일 갤러리로 바꿨다가 **되돌렸다.**
           운영자 지시는 그 짜임을 /about/tour(둘러보기 페이지)에 넣으라는 것이었다 —
           "메인페이지는 아까처럼 자동으로 지나가는 그대로 냅두고". 다시 바꾸지 말 것.
      */}
      <div className="mt-12">
        <InteriorSlider />
      </div>

      <Container>
        <div className="mt-10">
          <QuietLink href="/about/tour">둘러보기 페이지에서 전체 보기</QuietLink>
        </div>
      </Container>
    </section>
  );
}
/**
 * 진료시간 + 오시는 길 — 한 단 밝은 판 위의 마감 구획.
 *
 * ★★ 두 번째 버전(circle-dental-2)의 디자인으로 갈아탔다
 *    (2026-08-25 운영자: "진료시간이나 어디에 주차 저런거 버전2 디자인으로 넣어줘") ★★
 *    흰 바탕에 카드를 얹던 것을 **깊은 초록 한 판**으로 바꾸고, 그 위에
 *    ① 7칸 가로 진료시간(components/HoursStrip.tsx)
 *    ② 줄 단위 주소·주차·전화 + 오른쪽 지도
 *    를 얹는다. 페이지 맨 아래가 한 덩어리로 닫혀 마감이 분명해진다.
 *
 * ★★ 여기 오기까지 버린 것들 (되돌리기 전에 읽을 것) ★★
 *    2026-08-18 에 이 자리를 네 번 고쳤다. 그때 버린 이유는 지금도 유효하다.
 *      ① 좌우 2단(진료시간 | 오시는 길) → 둘 다 좁아져 시간표의 요일과 시간이 붙었다.
 *      ② 탭으로 하나씩                → 운영자: "탭으로 나누지 말고."
 *      ③ 위아래로 쌓기                → 네 덩이가 세로로 늘어서 너무 길어졌다.
 *      ④ 각 덩이 안에서 왼쪽 제목 · 오른쪽 표
 *    지금(⑤)은 ①의 문제를 다른 방식으로 푼다 — 진료시간은 **가로 7칸**이라 폭을
 *    나눌 필요가 없고, 오시는 길만 좌우로 나눈다.
 *
 * ⚠️⚠️ 2026-09-02 에 밝은 면(parchment)으로 뒤집었다 (오너: "그냥 검은 느낌 아예 없애").
 *    글자·테두리를 전부 ink / twilight / brand 계열로 둔다. parchment / mist 계열로
 *    되돌리면 흰 바탕에 흰 글자가 된다.
 * ⚠️⚠️ signal(금색 #d9a441)을 글자로 되돌리지 말 것 — 어두운 면에서는 7.42:1 이었지만
 *    밝은 면에서는 **2.08:1** 이라 못 읽는다. 전화번호·주차요금은 clay-700 이다.
 */
function HoursSection() {
  return (
    /*
     * ★★ 화면 폭 어두운 띠 → 안쪽으로 들인 큰 면 (2026-08-27) ★★
     *   화면을 가로지르는 어두운 띠는 두 참고 사이트가 똑같이 쓰는 장치라, 색만 바꿔서는
     *   벗어나지지 않는다. 이 시스템은 **밝은 캔버스 위에 면을 얹는** 문법이므로
     *   같은 내용을 24px 모서리의 큰 면 하나에 담는다. 위아래로 parchment 가 보인다.
     * ⚠️ 안쪽에서 Container 를 다시 열지 말 것 — 이미 Container 안이라 여백이 두 겹이 된다.
     * ⚠️ 여기 있던 '질문형 제목' 판단은 그대로다 — AI 검색이 문서에서 찾는 것은
     *    "질문과 같은 제목 + 바로 뒤 짧은 답" 이다. 명사구로 바꾸지 말 것.
     */
    /*
     * ★ 화면 폭 어두운 띠 (2026-08-31 오너: "양옆에 간격 냅두지 말고").
     *   2026-08-27 에 '안쪽으로 들인 큰 면' 으로 바꿨던 것을 되돌린 것이다. 그때는 참고
     *   사이트와 달라 보이려는 판단이었는데, 지금은 페이지 아래쪽이 통째로 어두운 결이라
     *   양옆에 밝은 띠가 남는 쪽이 어색해졌다 — 전제가 바뀌었다.
     * ⚠️ 안쪽 Container 를 지우지 말 것. 면만 화면 폭이고 글은 본문 폭을 지킨다.
     */
    <section className="bg-parchment py-12 sm:py-16 text-ink lg:py-24">
      <Container>
        <div>
        <HomeHead
          className="max-w-3xl"
          label="진료시간"
          title="진료시간을 안내드립니다"
        />

        <Reveal delay={70}>
          <HoursStrip />
        </Reveal>

        {/* ── 오시는 길 ─────────────────────────────────────────── */}
        <div className="mt-24 lg:mt-28">
          <HomeHead
            className="max-w-3xl"
            label="오시는 길"
            title="오시는 길을 안내드립니다"
          />

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <div>
              <Reveal delay={70}>
                <dl className="divide-y divide-brand-200 border-y border-brand-200">
                  <div className="grid gap-2 py-6 sm:grid-cols-[76px_minmax(0,1fr)]">
                    <dt className="text-[15.5px] text-ink-soft">주소</dt>
                    <dd className="text-[17.5px] leading-[1.8] text-twilight">
                      <span className="block">{CLINIC.address.full}</span>
                      <span className="mt-1.5 block text-[16px] text-ink-soft">
                        {CLINIC.address.building} · {CLINIC.nearestStation} 인근
                      </span>
                      {/*
                        ★★ 주소는 '읽는 값' 이 아니라 '쓰는 값' 이다 ★★
                          택시 앱·카톡·지도 검색창에 붙여 넣으려고 보는 정보인데, 긴 주소를
                          손으로 드래그하는 것은 휴대폰에서 특히 성가시다. 복사 버튼을 둔다.
                        ⚠️ 디자인을 바꿨다고 이 버튼을 빼지 말 것 — 두 번째 버전에는 없지만
                           여기서는 실제로 쓰이는 기능이다.
                      */}
                      <span className="mt-3 block">
                        <CopyButton text={CLINIC.address.full} />
                      </span>
                    </dd>
                  </div>

                  <div className="grid gap-2 py-6 sm:grid-cols-[76px_minmax(0,1fr)]">
                    <dt className="text-[14px] text-ink-soft">주차</dt>
                    <dd className="text-[17px] leading-[1.8] text-twilight">
                      {CLINIC.parking.type} ·{' '}
                      {/* ⚠️ signal(파랑)은 어두운 면에서만 글자로 쓴다 — 밝은 면에선 2.90:1 이라 못 읽는다. */}
                      <strong className="font-semibold text-clay-700">{CLINIC.parking.fee}</strong>
                      {/* ⚠️ 기계식 주차장 주의사항을 빼지 말 것 — 큰 차량이 헛걸음하는 것을 막는다. */}
                      <span className="mt-1.5 block text-[16px] leading-[1.8] text-ink-soft">
                        <Sentences text={CLINIC.parking.note} />
                      </span>
                    </dd>
                  </div>

                  <div className="grid gap-2 py-6 sm:grid-cols-[76px_minmax(0,1fr)]">
                    <dt className="text-[14px] text-ink-soft">전화</dt>
                    <dd>
                      {/* 내원 결정의 마지막 한 걸음은 여전히 전화다 — 이 구획에서 가장 큰 글자. */}
                      <a
                        href={CLINIC.phoneHref}
                        className="tabular text-[34px] font-medium whitespace-nowrap text-clay-700 transition-opacity hover:opacity-80"
                      >
                        {CLINIC.phone}
                      </a>
                    </dd>
                  </div>

                  <div className="grid gap-2 py-6 sm:grid-cols-[76px_minmax(0,1fr)]">
                    <dt className="text-[14px] text-ink-soft">이메일</dt>
                    <dd className="min-w-0 text-[17.5px] break-all text-twilight">
                      <a href={`mailto:${CLINIC.email}`} className="hover:text-clay-700 hover:underline">
                        {CLINIC.email}
                      </a>
                    </dd>
                  </div>
                </dl>
              </Reveal>

              <Reveal delay={110}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <FillBtn
                    href={CLINIC.booking.naver}
                    external
                    label="예약하기 — 네이버 예약 새 창으로 열기"
                  >
                    예약하기
                  </FillBtn>
                  {/* ⚠️ 지도 전체와 길찾기 앱 버튼은 /visit 이 맡는다 — 여기 지도는 보기용이다. */}
                  <LineBtn href="/visit">
                    지도 · 길찾기 보기
                  </LineBtn>
                </div>
              </Reveal>
            </div>

            {/*
              ⚠️ compact — 주소 바와 지도 앱 버튼 셋은 뺀다. 바로 왼쪽에 주소가 있고
                 아래에 '지도 · 길찾기 보기' 가 있어서, full 을 쓰면 한 화면에서
                 주소가 세 번 · 길찾기 버튼이 두 벌 나온다(components/ClinicMap.tsx 주석).
              ⚠️ 여기서는 좁은 화면에서도 보여 준다. 왼쪽 칸 아래로 쌓이는 자리라
                 '빈 자리를 채우는' 용도가 아니라 이 구획의 한 축이다.
            */}
            <Reveal delay={90}>
              <ClinicMap height={420} variant="compact" />
            </Reveal>
          </div>
        </div>
        {/* ⚠️ 이 한 줄이 위에서 연 바깥 상자를 닫는다. 지우면 페이지가 깨진다. */}
        </div>
      </Container>
    </section>
  );
}

