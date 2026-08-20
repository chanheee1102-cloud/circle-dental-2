import Hero from '@/components/Hero';
import JsonLd from '@/components/JsonLd';
import DefinitionSwitch from '@/components/DefinitionSwitch';
import HoursStrip from '@/components/HoursStrip';
import ClinicMap from '@/components/ClinicMap';
import {
  Reveal, LineReveal, LetterMarquee, HorizontalScroll, Lede,
  DragCursor, BlurText, FigureReveal,
  LetterReveal, PopIn, FanRow, Counter, StickyMedia, Pin,
} from '@/components/Motion';
import { CLINIC, PILLARS, DOCTORS, INTERIOR } from '@/lib/clinic';
import { FACTS } from '@/lib/aeo';
import {
  clinicSchema, websiteSchema, procedureSchemas,
  physicianSchemas, faqSchema, videoSchema,
} from '@/lib/schema';

export default function Home() {
  return (
    <>
      <main>
        {/*
          히어로는 제자리에 고정되고 아래 섹션이 그 위를 덮으며 올라온다.
          실측 (.main_top_cont): pin + pinSpacing:false + scrub 3.
          ⚠️ 덮는 쪽(#about)에 배경색과 z-index 가 있어야 겹쳐 보이지 않는다.
        */}
        <Pin>
          <Hero />
        </Pin>

        {/* ── 소개 ─────────────────────────────────────────────── */}
        <section id="about" className="relative z-10 bg-paper py-28 md:py-40">
          <div className="shell grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-24">
            <div>
              <Reveal>
                <p className="t-eyebrow mb-7 text-ink-2">About</p>
              </Reveal>
              <LineReveal className="t-h2" lines={['자연치아를 왜', '먼저 살리나요?']} delay={80} />
              <Reveal delay={260}>
                <Lede
                  className="t-body mt-9 max-w-xl"
                  text={`자연 그대로의 치아를 최대한 살리는 것이 ${CLINIC.shortName}의 진료 철학입니다. 임플란트는 마지막 선택이 될 수 있도록 노력하고, 남길 수 있는 치아는 남기는 쪽을 먼저 검토합니다.`}
                />
              </Reveal>

              {/* AEO — 병원이 실제로 증명할 수 있는 사실만 */}
              <Reveal delay={340}>
                <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10">
                  {FACTS.map((s) => (
                    <div key={s.label}>
                      <dt className="text-[11.5px] tracking-[0.16em] text-ink-2">{s.label}</dt>
                      {/*
                        숫자로 시작하는 값만 세어 올린다 (실측: countUp / odometer 동봉).
                        ⚠️ "14:00까지" 는 제외된다 — 시각을 0 부터 세면 뜻이 달라진다.
                        ⚠️ 근거 있는 실제 값만 센다. 지어낸 지표를 세면 의료광고다.
                      */}
                      <dd className="stat mt-2 text-[30px] text-brand">
                        {(() => {
                          const m = /^([0-9]+)([^0-9:]*)$/.exec(s.value);
                          return m ? <Counter to={Number(m[1])} suffix={m[2]} /> : s.value;
                        })()}
                      </dd>
                      <dd className="mt-2 text-[12.5px] text-ink-2">{s.note}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            {/* 커튼 와이프 — 회색 판이 위에서 걷히며 사진이 드러난다 */}
            <FigureReveal
              src={INTERIOR[0].src}
              alt={INTERIOR[0].alt}
              delay={140}
              className="aspect-[4/5] overflow-hidden rounded-[26px] bg-surface"
            />
          </div>
        </section>

        {/* ── 마퀴 띠 ──────────────────────────────────────────── */}
        <div className="border-y border-line bg-surface py-6">
          <LetterMarquee text="Circle Dental Clinic ·" seconds={34} colorClass="text-ink/10" />
        </div>

        {/* ── 부채꼴로 펼쳐지는 사진 띠 (실측 .slide0) ──────────────
             from { x:0, scale:.8, opacity:.5, blur:3px } → 펼쳐지며 선명해진다.
             ★ blur 가 핵심이다 — scale·opacity 만으로는 그냥 커지는 것으로 보인다. */}
        <div className="overflow-hidden bg-paper pt-24 md:pt-32">
          <div className="shell">
            <Reveal>
              <p className="t-eyebrow mb-10 text-center text-ink-2">Inside</p>
            </Reveal>
          </div>
          <FanRow
            items={INTERIOR.slice(0, 4).map((p) => (
              <figure key={p.src} className="aspect-[3/4] overflow-hidden rounded-[22px] bg-surface shadow-[0_30px_70px_-40px_rgba(20,23,28,.5)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} className="h-full w-full object-cover" loading="lazy" />
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
            <LineReveal className="t-h2" lines={['네 가지 진료,', '하나의 기준']} delay={80} />
            <Reveal delay={240}>
              {/*
                ⚠️ 운영자 지적 — "한 문장으로 / 정리했습니다." 처럼 말이 끊기는 자리에서
                   줄이 바뀌고 있었다. Lede 가 마침표·쉼표 뒤로 줄바꿈을 몰아 준다.
              */}
              <Lede
                className="t-body mt-8 max-w-2xl"
                text="스크롤하면 옆으로 넘어갑니다. 각 진료가 어떤 상태에 쓰이는지 한 문장으로 정리했습니다."
              />
            </Reveal>
          </div>

          <div id="hscroll" className="relative mt-16">
            <DragCursor hostId="hscroll" />
            <HorizontalScroll ariaLabel="진료 안내">
              {PILLARS.map((p) => (
                <article key={p.key} className="group flex w-[78vw] flex-none flex-col overflow-hidden rounded-[26px] bg-surface md:w-[440px]">
                  <div className="img-zoom aspect-[4/3] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.photo} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex flex-1 flex-col p-9">
                    <span className="display text-[30px] text-brand/35">{p.no}</span>
                    <h3 className="mt-4 text-[22px] font-bold tracking-[-0.03em]">{p.name}</h3>
                    <p className="display mt-1 text-[15px] text-ink-2">{p.en}</p>
                    <Lede className="t-body mt-5 flex-1 text-[14px]" text={p.copy} />
                  </div>
                </article>
              ))}
              <div className="flex w-[78vw] flex-none items-center justify-center rounded-[26px] bg-brand p-9 text-white md:w-[400px]">
                <div>
                  <p className="display text-[46px] leading-none">
                    <LetterReveal text="Ask us" step={80} />
                  </p>
                  <p className="mt-5 text-[14px] leading-[1.9] text-white/90">
                    어떤 치료가 필요한지 모르겠다면 먼저 봐 드립니다.
                  </p>
                  <a href={CLINIC.phoneHref} className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-bold text-brand">
                    {CLINIC.phone}
                  </a>
                </div>
              </div>
            </HorizontalScroll>
          </div>
        </section>

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
            <LineReveal className="t-h2" lines={['처음부터 끝까지', '같은 의료진']} delay={80} />

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
                    <p className="mt-6 text-[12px] tracking-[0.16em] text-ink-2">{d.role}</p>
                    <h3 className="mt-2 text-[24px] font-bold tracking-[-0.03em]">{d.name}</h3>
                    <p className="mt-3 text-[13px] leading-relaxed text-ink-2">{d.focus.join(' · ')}</p>
                    <ul className="mt-5 space-y-1.5 border-t border-line pt-5">
                      {d.career.slice(0, 4).map((c) => (
                        <li key={c} className="text-[13px] leading-[1.7] text-ink-2">{c}</li>
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
                <LetterReveal text="들어서는 순간부터" />
                <br />
                <LetterReveal text="시작되는 진료" delay={420} />
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
            <LineReveal className="t-h2 text-white" lines={['진료시간이', '어떻게 되나요?']} delay={80} />
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
            <LineReveal className="t-h2 text-white" lines={['화정역에서', '가까운 3층']} delay={80} />

            <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
              <div>
                <Reveal delay={200}>
                  <dl className="divide-y divide-white/10 border-y border-white/10">
                    <div className="grid gap-2 py-6 sm:grid-cols-[92px_minmax(0,1fr)]">
                      <dt className="text-[12.5px] tracking-[0.1em] text-white/50">주소</dt>
                      <dd className="text-[15px] leading-[1.8] text-white/90">{CLINIC.address.full}</dd>
                    </div>
                    <div className="grid gap-2 py-6 sm:grid-cols-[92px_minmax(0,1fr)]">
                      <dt className="text-[12.5px] tracking-[0.1em] text-white/50">주차</dt>
                      <dd className="text-[15px] leading-[1.8] text-white/90">
                        {CLINIC.parking}
                        <span className="mt-1.5 block text-[13px] leading-[1.8] text-white/60">{CLINIC.parkingNote}</span>
                      </dd>
                    </div>
                    <div className="grid gap-2 py-6 sm:grid-cols-[92px_minmax(0,1fr)]">
                      <dt className="text-[12.5px] tracking-[0.1em] text-white/50">전화</dt>
                      <dd>
                        <a href={CLINIC.phoneHref} className="display text-[30px] text-brand-2">{CLINIC.phone}</a>
                      </dd>
                    </div>
                  </dl>
                </Reveal>

                <Reveal delay={280}>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <a href={CLINIC.booking.naver} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand px-7 py-3.5 text-[14px] font-bold text-white transition-transform hover:-translate-y-0.5">
                      네이버 예약
                    </a>
                    <a href={CLINIC.booking.kakao} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/35 px-7 py-3.5 text-[14px] font-bold text-white transition-colors hover:bg-white/10">
                      카카오톡 문의
                    </a>
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
