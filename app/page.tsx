import Hero from '@/components/Hero';
import JsonLd from '@/components/JsonLd';
import DefinitionSwitch from '@/components/DefinitionSwitch';
import HoursStrip from '@/components/HoursStrip';
import ClinicMap from '@/components/ClinicMap';
import {
  Reveal, LineReveal, LetterMarquee, HorizontalScroll, Lede,
  Parallax, Magnetic, Tilt,
  DragCursor, BlurText, FigureReveal,
  LetterReveal, PopIn, FanRow, StickyMedia,
} from '@/components/Motion';
import { CLINIC, PILLARS, DOCTORS, INTERIOR, CREDENTIALS } from '@/lib/clinic';
import {
  clinicSchema, websiteSchema, procedureSchemas,
  physicianSchemas, faqSchema, videoSchema,
} from '@/lib/schema';

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
                라벨(figcaption)로 무슨 인증인지 바로 읽히게 한다. */}
        <div className="overflow-hidden bg-paper pt-24 md:pt-32">
          <div className="shell">
            <Reveal>
              <p className="t-eyebrow mb-10 text-center text-ink-2">Credentials</p>
            </Reveal>
          </div>
          <FanRow
            items={CREDENTIALS.map((c) => (
              <figure
                key={c.src}
                className="flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-[22px] border border-line bg-white p-6 shadow-[0_30px_70px_-40px_rgba(20,23,28,.5)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.label} className="max-h-[65%] w-auto object-contain" loading="lazy" />
                <figcaption className="text-center text-[12px] leading-snug text-ink-2">{c.label}</figcaption>
              </figure>
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

        {/* ── AEO: 한 문장 정의 ─────────────────────────────────
             ★ 답변형 AI 는 페이지를 통째로 읽지 않고 **그대로 인용할 한 문장**을 찾는다.
               "아름다운 미소를 디자인합니다" 는 그 자리에 못 들어간다 — 질문에 답하지 않는다.
             ★ 효과와 주의를 **같은 카드 안에** 둔다. 떨어뜨려 놓으면 효과만 인용된다. */}
        <section id="definitions" className="relative overflow-hidden bg-surface py-28 md:py-40">
          {/*
            화면이 멈추고 **1초 뒤에** 혼자 떠오르는 배경 (실측 .re03_bg_n / .re06_bg:
            onEnter → setTimeout 1000 → scale .5→1, opacity 0→1, 1.2s power2.out).
            같이 나오면 그냥 배경이지만, 늦게 나오면 시선이 그리로 간다.
          */}
          <PopIn className="pointer-events-none absolute -right-40 top-24 h-[520px] w-[520px] rounded-full" aria-hidden>
            <div className="h-full w-full rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-brand)_16%,transparent)_0%,transparent_62%)]" />
          </PopIn>
          <div className="relative shell">
            <Reveal>
              <p className="t-eyebrow mb-7 text-ink-2">In one sentence</p>
            </Reveal>
            <h2 className="t-h2">
              <BlurText text="이건 무슨 치료인가요?" />
            </h2>
            <Reveal delay={200}>
              <Lede
                className="t-body mt-8 max-w-xl"
                text="검색하다 들어오신 분이 가장 먼저 궁금해하는 것부터 한 문장으로 적었습니다."
              />
            </Reveal>

            <DefinitionSwitch />
          </div>
        </section>

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
        <section id="interior" className="bg-surface">
          <div className="shell grid gap-10 lg:grid-cols-2 lg:gap-20">
            <StickyMedia className="hidden lg:block">
                <FigureReveal
                  src={INTERIOR[1].src}
                  alt={INTERIOR[1].alt}
                  className="aspect-[3/4] w-full overflow-hidden rounded-[26px] bg-white"
                />
            </StickyMedia>

            <div className="py-28 md:py-40">
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
              {/* 실측 gs_reveal fromLeft 는 x:-300 이다 — 오른쪽(30)보다 훨씬 크다. */}
              <div className="mt-14 space-y-6">
                {INTERIOR.slice(2, 7).map((p, i) => (
                  <FigureReveal
                    key={p.src}
                    src={p.src}
                    alt={p.alt}
                    delay={i * 60}
                    className={`aspect-[3/2] overflow-hidden rounded-[20px] bg-white ${i % 2 === 1 ? 'floaty' : ''}`}
                  />
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

      <JsonLd
        data={[
          clinicSchema(),
          websiteSchema(),
          ...procedureSchemas(),
          ...physicianSchemas(),
          faqSchema(),
          videoSchema(),
        ]}
      />
    </>
  );
}
