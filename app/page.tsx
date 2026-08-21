import Hero from '@/components/Hero';
import JsonLd from '@/components/JsonLd';
import HoursStrip from '@/components/HoursStrip';
import ClinicMap from '@/components/ClinicMap';
import {
  Reveal, LineReveal, LetterMarquee, HorizontalScroll, Lede,
  Parallax, Magnetic, Tilt,
  DragCursor, FigureReveal,
  LetterReveal, FanRow, StickyMedia,
} from '@/components/Motion';
import { CLINIC, PILLARS, DOCTORS, INTERIOR, CREDENTIALS } from '@/lib/clinic';
import {
  clinicSchema, websiteSchema,
  physicianSchemas, faqSchema, videoSchema,
} from '@/lib/schema';

/**
 * 둘러보기 사진 줄의 리듬 — 비율과 폭·정렬을 번갈아 둔다.
 *
 * ⚠️ 전부 같은 크기로 쌓으면 스크롤이 '목록 넘기기'가 된다. 여섯 칸이 한 바퀴다.
 * ⚠️ 폭을 줄인 칸은 반드시 ml-auto / mr-auto 로 어느 쪽에 붙일지 정한다.
 *    안 정하면 기본값(왼쪽)으로 몰려 들여쓰기 리듬이 사라진다.
 */
const TOUR_SHAPE = [
  'aspect-[4/3] w-full',
  'aspect-[3/4] ml-auto w-[74%]',
  'aspect-[4/3] mr-auto w-[90%]',
  'aspect-[1/1] ml-auto w-[66%]',
  'aspect-[4/3] w-full',
  'aspect-[3/4] mr-auto w-[80%]',
];

export default function Home() {
  return (
    <>
      <main>
        {/*
          ★★ Pin 제거 (2026-08-21, 운영자: "두번째 이미지 효과 별로야") ★★
            원래는 히어로가 제자리에 고정되고 아래 섹션(#about)이 그 위를
            덮으며 올라오는 연출이었다(.main_top_cont pin + pinSpacing:false).
            그런데 Pin 은 정확히 **한 화면 높이(100svh)** 만큼 고정을 유지하는데,
            그 다음에 오는 #about(FACTS 통계 4개짜리 줄)은 실측 312px 밖에
            안 된다 — 덮는 섹션이 훨씬 짧아서 #about 이 지나간 뒤에도 히어로가
            남은 pin 구간(약 588px) 동안 다시 드러났다(실측 스크린샷으로 확인:
            #about 위·아래 양쪽에서 히어로가 비쳐 "샌드위치"로 보였다).
            pin 구간을 #about 실제 높이에 맞춰 동적으로 재는 것도 가능하지만,
            히어로를 이미 더 차분하게 다듬은 방향(토글 제거 등)과도 맞지 않아
            효과 자체를 뺐다 — 히어로도 그냥 평범하게 스크롤되어 나간다.
        */}
        <Hero />

        {/*
          ★★ 확인된 사실 띠(FACTS) → 히어로 하단 밴드로 이동 (2026-08-21,
             운영자: "의료진3명 야간진료 뭐 저런거 저렇게 넣고" — 참고 화면
             서울이고운치과의 히어로 하단 스펙 띠) ★★
             예전엔 히어로 바로 아래 별도 섹션(#about)으로 큼직한 카운터
             숫자와 함께 보여줬다. 참고 화면처럼 히어로 사진 위 하단 밴드로
             옮겨 압축된 형태(Hero.tsx 참조)로 보여주므로, 바로 아래서 같은
             값을 또 한 번 큼직하게 반복하지 않는다(중복 방지).
        */}

        {/* ── 마퀴 띠 ──────────────────────────────────────────── */}
        <div className="border-y border-line bg-surface py-6">
          <LetterMarquee text="Circle Dental Clinic ·" seconds={34} colorClass="text-ink/10" />
        </div>

        {/* ── 부채꼴로 펼쳐지는 인증패 띠 (실측 .slide0) ──────────────
             from { x:0, scale:.8, opacity:.5, blur:3px } → 펼쳐지며 선명해진다.
             ★ blur 가 핵심이다 — scale·opacity 만으로는 그냥 커지는 것으로 보인다.
             ★★ 인테리어 사진 → 인증패로 교체(2026-08-21 운영자: "의미없는 병원 사진보다
                인증패 4개 있던거 넣는게 낫겠다") ★★ 답변 엔진은 "인증 4건"처럼 셀 수 있는
                근거를 인용하지, 복도·대기실 같은 흩어진 인상 사진을 인용하지 않는다
                (TrustSection.tsx 의 같은 원칙). 기존 assets.ts credentials 를 그대로 옮겼다 —
                실제 병원이 취득한 인증·수료 실물이지 지어낸 이미지가 아니다.
             ★ 236×242(1장은 236×178) 스캔본이라 인테리어 사진과 비율이 다르다 — object-cover
                로 잘라내면 인증서 테두리 글자가 잘린다. aspect-square + object-contain +
                라벨(figcaption)로 무슨 인증인지 바로 읽히게 한다.
             ★★ 흰 카드 → 입체 (2026-08-21, 운영자: "여기 하얀 사각형 배경 없이 3D
                느낌나게 나오게 하자") ★★ 인증패를 흰 사각형 안에 넣어 두니 실물이
                아니라 '카드에 넣은 그림'으로 보였다. 흰 판·테두리·상자 그림자를
                걷어내고 세 가지로 입체를 만든다:
                  · Tilt — 커서를 따라 판이 기운다(원근 900px)
                  · translateZ — 인증패는 52px, 라벨은 20px 띄운다. 기울 때 둘이
                    서로 다른 속도로 움직이는 것이 3D 로 읽히는 핵심이다.
                    (같은 평면에 두면 아무리 회전해도 '기운 사진'일 뿐이다.)
                  · 바닥 그림자 — 판은 떠 있고 그림자는 바닥(Z 0)에 남는다.
                    상자 그림자가 아니라 타원이라 종이가 떠 있는 것처럼 보인다.
                또 상자가 사라졌으므로 그림자를 drop-shadow 로 바꿨다 — 인증패의
                실제 윤곽을 따라간다(box-shadow 는 네모난 상자만 따라간다).
             ⚠️ 손가락 입력·모션 감소 환경에서는 Tilt 가 스스로 꺼진다(Motion.tsx).
                그 경우에도 바닥 그림자와 띄운 간격은 남아 평면으로 무너지지 않는다. */}
        <div className="overflow-hidden bg-paper pt-24 md:pt-32">
          <div className="shell">
            <Reveal>
              <p className="t-eyebrow mb-10 text-center text-ink-2">Credentials</p>
            </Reveal>
          </div>
          <FanRow
            items={CREDENTIALS.map((c, i, arr) => (
              <Tilt key={c.src} deg={14}>
                {/*
                  ⚠️ 커서 기울기만으로는 부족하다 — 손가락 입력(모바일)에는 커서가
                     없고, 데스크톱에서도 네 장을 다 훑지는 않는다. 그래서 가만히
                     있을 때도 부채처럼 각자 조금씩 다른 각도로 서 있게 한다.
                     가운데를 0 으로 두고 바깥으로 갈수록 4도씩 더 돌린다.
                  ⚠️ 이 회전은 <figure> 에 건다. Tilt 는 바깥 .tilt 의 transform 을
                     직접 쓰고 커서가 빠지면 그 값을 지우므로, 여기에 기본 각도를
                     두면 지워진다.
                */}
                <figure
                  className="relative flex aspect-square flex-col items-center justify-center gap-5 px-3"
                  style={{ transform: `rotateY(${(i - (arr.length - 1) / 2) * 4}deg)` }}
                >
                  {/* 바닥 그림자 — 판만 뜨고 이건 바닥에 남는다(translateZ 없음). */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-[70%] h-[22px] w-[56%] -translate-x-1/2 rounded-[50%] bg-ink/25 blur-[13px]"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.src}
                    alt={c.label}
                    className="relative max-h-[74%] w-auto object-contain"
                    style={{
                      transform: 'translateZ(52px)',
                      filter:
                        'drop-shadow(0 22px 26px rgba(20,23,28,.28)) drop-shadow(0 3px 6px rgba(20,23,28,.16))',
                    }}
                    loading="lazy"
                  />
                  <figcaption
                    className="relative text-center text-[12.5px] font-medium leading-snug text-ink-2"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    {c.label}
                  </figcaption>
                </figure>
              </Tilt>
            ))}
          />
        </div>

        {/* ── 진료 — 가로 스크롤 ───────────────────────────────── */}
        <section id="treatment" className="bg-paper pt-28 md:pt-40">
          <div className="shell">
            <Reveal>
              <p className="t-eyebrow mb-7 text-ink-2">Treatment</p>
            </Reveal>
            <LineReveal as="h2" className="t-h2" lines={['어떤 진료를', '받을 수 있나요?']} delay={80} />
            <Reveal delay={240}>
              {/*
                ⚠️ 운영자 지적 — "한 문장으로 / 정리했습니다." 처럼 말이 끊기는 자리에서
                   줄이 바뀌고 있었다. Lede 가 마침표·쉼표 뒤로 줄바꿈을 몰아 준다.
              */}
              {/*
                ★ 질문형 제목은 **바로 뒤에 답**이 와야 성립한다.
                  답변형 AI 도 '질문 제목 + 다음 문단' 을 한 덩어리로 인용한다.
                  (v1 의 같은 자리에 있던 문장을 그대로 옮겼다.)
              */}
              <Lede
                className="t-body mt-8 max-w-2xl"
                text={`자연치아를 살리는 치료를 중심에 두고 임플란트, 심미치료, 사랑니 발치까지 진료합니다. 충치·신경·잇몸 치료와 스케일링 같은 기본 진료도 함께 보고 있습니다.`}
              />
            </Reveal>
          </div>

          <div id="hscroll" className="relative mt-16">
            <DragCursor hostId="hscroll" />
            <HorizontalScroll ariaLabel="진료 안내">
              {/*
                ★★ 진짜 진료 사진을 되살렸다 (2026-08-21, 운영자: "원래 홈페이지에 있는
                   저기에 맞는 사진 가져와서 갈라지는 모션 나오게 해줘") ★★
                   2026-08-20 엔 사진을 통째로 뺐다 — 그때 가진 건 공간 사진(복도·상담실)
                   뿐이라 임플란트 카드에 상담실 사진이 붙는 식으로 내용과 안 맞았다.
                   이제 lib/clinic.ts 의 PILLARS.photo 가 진짜 시술 사진(원본 IMG.treatment)
                   으로 채워져 있다 — 그때 남긴 "진짜 사진이 생기면 그때 넣는다"를 지킨다.
                ⚠️⚠️ 카드마다 --tilt 로 기울기가 다르다 ⚠️⚠️
                   참고 화면(청담봄온의원)은 사진 두 장을 서로 다른 각도로 겹쳐 놓는데,
                   그대로 베끼지 않고 카드 하나당 사진 한 장을 각자 다른 각도로 기울여
                   "흩어져 있던 사진이 스크롤에 맞춰 제자리를 찾아 앉는" 인상으로 바꿨다
                   (globals.css .pillar-photo 참조 — Reveal 의 .in 이 붙는 순간 0deg 에서
                   --tilt 값으로 회전하며 자리 잡는다).
                ★ 카드마다 Reveal(운영자 지적, 2026-08-21) — 가로 스크롤로 넘길 때마다
                  그 카드가 화면에 들어오는 순간 등장해야 하는데, 예전엔 카드에 아무 모션도
                  없어서 섹션에 진입하자마자 4장이 전부 처음부터 보여 버렸다.
                  replay 를 켜서 되돌아가면 다시 꺼졌다 스크롤로 다시 넘기면 또 켜진다.
                  Reveal as="article" 로 감싸 추가 div 없이 article 자체에 모션 클래스를 건다
                  (article 이 h-full 이라 감싸는 div 를 새로 넣으면 높이가 안 이어진다).
                ⚠️ JSX 에서 map 반환부 맨 앞에 주석만 두면 그게 반환값이 된다 —
                   주석은 map 바깥에.
              */}
              {PILLARS.map((p, i) => {
                const tilt = [-3, 2.5, -2, 3][i % 4];
                return (
                <Tilt key={p.key} className="w-[78vw] flex-none md:w-[400px]">
                <Reveal
                  as="article"
                  from="right"
                  replay
                  className="pillar-card group flex h-full flex-col justify-between overflow-hidden rounded-[26px] bg-surface p-7 md:p-8"
                >
                  <div
                    className="pillar-photo aspect-[4/5] w-full overflow-hidden rounded-[16px] bg-white shadow-[0_20px_36px_-22px_rgba(20,23,28,.5)]"
                    style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.photo} alt={p.photoAlt} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="mt-6 flex flex-1 flex-col">
                    <span className="display text-[30px] text-brand/35">{p.no}</span>
                    <h3 className="mt-4 text-[23px] font-bold tracking-[-0.03em]">{p.name}</h3>
                    <p className="display mt-1 text-[16px] text-ink-2">{p.en}</p>
                    <Lede className="t-body mt-5 flex-1 text-[15px]" text={p.copy} />
                  </div>
                </Reveal>
                </Tilt>
                );
              })}
              <div className="flex w-[78vw] flex-none items-center justify-center rounded-[26px] bg-brand p-9 text-white md:w-[400px]">
                <div>
                  <p className="display text-[46px] leading-none">
                    <LetterReveal text="Ask us" step={80} />
                  </p>
                  <p className="mt-5 text-[15px] leading-[1.9] text-white/90">
                    어떤 치료가 필요한지 모르겠다면 먼저 봐 드립니다.
                  </p>
                  <Magnetic className="mt-8">
                    <a href={CLINIC.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-bold text-brand">
                      {CLINIC.phone}
                    </a>
                  </Magnetic>
                </div>
              </div>
            </HorizontalScroll>
          </div>
        </section>

        {/*
          ── 패럴랙스 띠 ──
          ★ 봄온은 ScrollSmoother 를 effects:true 로 켜 둔다. 그 기능이 하는 일이
            이것이다 — 사진이 스크롤보다 느리게 움직여 뒤로 물러난다.
          ★★ 의료진 사진 되돌림 (2026-08-21, 운영자: "무섭다") ★★
             화면 전체 폭에 걸친 좁고 긴 띠에 정면 클로즈업 얼굴 3명을 꽉 채웠더니
             '분리된 거대한 얼굴들이 늘어선' 인상이 됐다 — object-position 을 아무리
             조정해도 이 사진은 애초에 세로형 인물 사진이라 이 가로 전면(full-bleed)
             포맷 자체와 안 맞았다. 원래 의도(공간 사진·숨 고르는 자리)로 되돌리되,
             INTERIOR[4](진료실 내부 — 창가 자연광·화분·CIRCLE DENTAL CLINIC 로고
             파티션)로 바꿨다. 기존 INTERIOR[3](상담실 사인)보다 더 밝고 안정적이다.
             의료진 사진은 다른 자리(작게, 여백 있는 카드형)로 옮기는 게 맞을지
             운영자 확인 대기 — DOCTORS_GROUP_PHOTO 는 지우지 않고 lib/clinic.ts 에
             남겨 둔다.
        */}
        <Parallax
          src={INTERIOR[4].src}
          alt={INTERIOR[4].alt}
          className="h-[clamp(280px,42vw,560px)] w-full"
          amount={0.14}
        />

        {/*
          ★★ "이건 무슨 치료인가요?"(한 문장 정의 6개) → /treatment 로 이동
             (2026-08-21, 운영자: "이건 그냥 서브페이지에 넣을까?") ★★
             홈이 진료를 두 번 연속으로 설명하고 있었다 — 바로 위의 '어떤 진료를
             받을 수 있나요?'(가로 스크롤 4개)와 이 정의 6개가 결국 같은
             /treatment/[slug] 로 보냈다. 정의는 '치료 알아보기' 페이지 위쪽으로
             옮겨, 환자가 쓰는 말로 들어가 전체 목록으로 넘어가는 흐름을 만들었다.
          ⚠️ 화면과 함께 procedureSchemas()(각 진료의 정의문 구조화 데이터)도
             /treatment 로 옮겼다. 구조화 데이터는 **그 페이지에 실제로 있는
             내용**을 설명해야 한다 — 본문을 옮기고 스키마만 홈에 남기면
             홈이 화면에 없는 내용을 주장하는 셈이 된다.
             (clinicSchema 의 availableService 는 병원이 제공하는 진료 목록이라
              홈에 남는 게 맞다 — 그건 페이지 내용이 아니라 병원 자체의 속성이다.)
        */}

        {/* ── 의료진 ───────────────────────────────────────────── */}
        <section id="doctors" className="bg-paper py-28 md:py-40">
          <div className="shell">
            <Reveal>
              <p className="t-eyebrow mb-7 text-ink-2">Doctors</p>
            </Reveal>
            <LineReveal as="h2" className="t-h2" lines={['누가', '진료하나요?']} delay={80} />

            <ul className="mt-16 grid gap-6 md:grid-cols-3">
              {DOCTORS.map((d, i) => (
                <li key={d.slug}>
                  <FigureReveal
                    src={d.photo}
                    alt={`${CLINIC.shortName} ${d.name} ${d.role}`}
                    delay={i * 120}
                    className="aspect-[3/4] overflow-hidden rounded-[22px] bg-surface"
                    imgClassName="h-full w-full object-cover object-top"
                  />
                  {/* 실측 gs_reveal fromRight — x:30 으로 아주 살짝만 붙는다. */}
                  <Reveal delay={i * 120 + 200} from="right">
                    <p className="mt-6 text-[13px] tracking-[0.16em] text-ink-2">{d.role}</p>
                    <h3 className="mt-2 text-[24px] font-bold tracking-[-0.03em]">{d.name}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{d.focus.join(' · ')}</p>
                    <ul className="mt-5 space-y-1.5 border-t border-line pt-5">
                      {d.career.slice(0, 4).map((c) => (
                        <li key={c} className="text-[14px] leading-[1.7] text-ink-2">{c}</li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 둘러보기 — sticky 사진 + 흐르는 글 (원본 .img_wrap) ── */}
        {/*
          ★★ 좌우를 맞바꿨다 (2026-08-21, 운영자: "여긴 중복되는데 왼쪽에 저 사진
             고정해두는것보다 문구를 왼쪽에 두고 오른쪽에 더 임팩트 있게 스크롤
             이벤트 넣는거 어때, 오른쪽에만 사진 넣고") ★★
             왼쪽에 내부 사진 한 장을 붙여 두고 오른쪽에도 내부 사진을 줄줄이
             흘리고 있었다 — 같은 종류의 사진이 양쪽에서 경쟁했다. 이제 왼쪽은
             제목이 붙어 있고(무엇을 보고 있는지 계속 남는다) 사진은 오른쪽에만
             흐른다. 왼쪽에 있던 사진(INTERIOR[1])은 버리지 않고 오른쪽 줄에
             합류시켰다 — 좋은 사진이고, 이제 짝이 없으니 겹치지 않는다.
          ⚠️ 사진 줄에 리듬을 준다 — 전부 같은 폭·같은 비율로 쌓으면 스크롤이
             '목록 넘기기'가 된다. 크기와 좌우 들여쓰기를 번갈아 둔다.
          ⚠️ 여기서는 FigureReveal(가림막이 걷히는 연출) 대신 Parallax 를 쓴다.
             둘을 겹치면 안 된다 — FigureReveal 은 img 의 transform 을 CSS 로
             제어하고 Parallax 는 같은 img 의 transform 을 매 프레임 인라인으로
             덮어써서, 함께 쓰면 걷히는 연출이 통째로 사라진다.
             등장은 Reveal(from="right")이 맡고, 스크롤 시차는 Parallax 가 맡는다.
        */}
        <section id="interior" className="bg-surface">
          <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            {/* ── 왼쪽: 붙어 있는 문구 (좁은 화면에서는 사진 위에 그냥 놓인다) ──
                ⚠️ 예전엔 이 블록을 hidden lg:block 으로 감추고 좁은 화면용 제목을
                   따로 하나 더 뒀다. 그러면 같은 h2 가 문서에 두 번 들어간다.
                   지금은 블록 하나로 두고 '붙는 것'만 화면 폭에 따라 끈다
                   (globals.css .sticky-media + Motion.tsx StickyMedia, 문턱 1024px). */}
            <StickyMedia className="pt-16 lg:pt-0">
              <div>
                <Reveal>
                  <p className="t-eyebrow mb-7 text-ink-2">Interior</p>
                </Reveal>
                {/*
                  여기만 줄 단위(LineReveal) 대신 글자 단위로 간다.
                  원본도 두 방식을 섞어 쓴다 — .single-line-inner(줄)와 .header-1~4(글자).
                */}
                <h2 className="t-h2">
                  <LetterReveal text="어떤 공간에서" />
                  {/* ⚠️ 화면은 두 줄이지만 크롤러·읽어주기에는 한 문장이어야 한다.
                      공백이 없으면 textContent 가 "어떤 공간에서진료하나요?" 로 붙는다. */}
                  <span className="sr-only"> </span>
                  <br />
                  <LetterReveal text="진료하나요?" delay={420} />
                </h2>
                <Reveal delay={260}>
                  <Lede
                    className="t-body mt-8 max-w-sm"
                    text="상담실과 진료실을 나누고, 쓰는 기구는 소독실에서 따로 관리합니다. 오시기 전에 미리 둘러보세요."
                  />
                </Reveal>
              </div>
            </StickyMedia>

            {/* ── 오른쪽: 사진만. 크기·들여쓰기를 번갈아 두고 스크롤에 맞춰 시차를 준다 ── */}
            <div className="pb-16 md:pb-28 lg:py-40">
              <div className="space-y-10 md:space-y-16">
                {INTERIOR.slice(1, 7).map((p, i) => (
                  <Reveal key={p.src} from="right" delay={(i % 2) * 90}>
                    <Parallax
                      src={p.src}
                      alt={p.alt}
                      amount={0.1 + (i % 3) * 0.03}
                      className={`rounded-[20px] bg-white ${TOUR_SHAPE[i % TOUR_SHAPE.length]}`}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문은 /faq 로 옮겼다 — 홈에서 9문답이 세로를 크게 잡아먹었고,
            검색으로 들어오는 사람은 홈이 아니라 그 문서에 직접 도착한다. */}

        {/* ── 오시는 길 ────────────────────────────────────────── */}
        {/* ── 진료시간 ─────────────────────────────────────────────
             ★★ 오시는 길과 나란히 두지 않는다 (2026-08-20 운영자) ★★
               두 개를 좌우로 붙여 놓으니 서로 폭을 절반씩 빼앗아 둘 다 좁고 길어졌다.
               진료시간은 **가로로 펴야 하는 표**(요일)이고, 오시는 길은 **지도가 필요한
               블록**이라 요구하는 모양이 정반대다. 위아래로 나눠 각자 폭을 다 쓴다. */}
        <section id="hours" className="bg-ink pb-16 pt-28 text-white md:pt-40">
          <div className="shell">
            <Reveal>
              <p className="t-eyebrow mb-7 text-white/60">Hours</p>
            </Reveal>
            <LineReveal as="h2" className="t-h2 text-white" lines={['진료시간이', '어떻게 되나요?']} delay={80} />
            <Reveal delay={200}>
              <HoursStrip />
            </Reveal>
          </div>
        </section>

        {/* ── 오시는 길 — 지도와 함께 ───────────────────────────── */}
        <section id="visit" className="bg-ink pb-28 pt-4 text-white md:pb-40">
          <div className="shell">
            <Reveal>
              <p className="t-eyebrow mb-7 mt-6 text-white/60">Visit</p>
            </Reveal>
            <LineReveal as="h2" className="t-h2 text-white" lines={['어디에 있고', '주차는 되나요?']} delay={80} />

            <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
              <div>
                <Reveal delay={200}>
                  <dl className="divide-y divide-white/10 border-y border-white/10">
                    <div className="grid gap-2 py-6 sm:grid-cols-[92px_minmax(0,1fr)]">
                      <dt className="text-[13.5px] tracking-[0.1em] text-white/50">주소</dt>
                      <dd className="text-[16px] leading-[1.8] text-white/90">{CLINIC.address.full}</dd>
                    </div>
                    <div className="grid gap-2 py-6 sm:grid-cols-[92px_minmax(0,1fr)]">
                      <dt className="text-[13.5px] tracking-[0.1em] text-white/50">주차</dt>
                      <dd className="text-[16px] leading-[1.8] text-white/90">
                        {CLINIC.parking}
                        <span className="mt-1.5 block text-[14px] leading-[1.8] text-white/60">{CLINIC.parkingNote}</span>
                      </dd>
                    </div>
                    <div className="grid gap-2 py-6 sm:grid-cols-[92px_minmax(0,1fr)]">
                      <dt className="text-[13.5px] tracking-[0.1em] text-white/50">전화</dt>
                      <dd>
                        <a href={CLINIC.phoneHref} className="display text-[30px] text-brand-2">{CLINIC.phone}</a>
                      </dd>
                    </div>
                  </dl>
                </Reveal>

                <Reveal delay={280}>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <Magnetic>
                      <a href={CLINIC.booking.naver} target="_blank" rel="noopener noreferrer" className="block rounded-full bg-brand px-7 py-3.5 text-[15px] font-bold text-white">
                        네이버 예약
                      </a>
                    </Magnetic>
                    <Magnetic>
                      <a href={CLINIC.booking.kakao} target="_blank" rel="noopener noreferrer" className="block rounded-full border border-white/35 px-7 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-white/10">
                        카카오톡 문의
                      </a>
                    </Magnetic>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={240}>
                <ClinicMap />
              </Reveal>
            </div>
          </div>
        </section>

      </main>

      {/* ⚠️ procedureSchemas() 는 /treatment 로 옮겼다 — 정의 본문이 거기 있다.
          여기 다시 넣지 말 것(같은 @id 가 두 페이지에 실리면 어느 쪽이 정본인지
          모호해진다). */}
      <JsonLd
        data={[
          clinicSchema(),
          websiteSchema(),
          ...physicianSchemas(),
          faqSchema(),
          videoSchema(),
        ]}
      />
    </>
  );
}
