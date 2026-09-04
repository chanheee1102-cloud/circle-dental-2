import Link from 'next/link';
import { CLINIC } from '@/lib/clinic';
import { Container, Sentences } from '@/components/ui';
import { BookingButtons } from '@/components/BrandIcons';

/**
 * **진료 페이지 마무리** — 제목 · 설명 · 예약 단추 · 이어지는 곳 네 갈래.
 *
 * ★★ 왜 부품으로 뽑았나 (2026-09-04 오너: "cta 버튼을 오른쪽으로 옮겨달라는거야 전부 통일해주고") ★★
 *   이 블록이 진료 페이지 **일곱 곳에 각각 복사**돼 있었다. 그래서 페이지마다 조금씩 달랐다 —
 *   충치만 단추가 오른쪽이고 나머지 여섯은 왼쪽이라 오른쪽에 큰 여백이 남았고, 링크 줄의
 *   여백(mt-16/mt-20)과 선 색(wine-line/brand-200)도 제각각이었다. 한 곳으로 모은다.
 * ⚠️ 다시 페이지 안에 복사해 넣지 말 것 — 그렇게 해서 일곱 벌이 갈라졌다.
 *
 * ★ 단추는 **오른쪽**이다. 제목·설명이 왼쪽에서 끝나고 오른쪽이 비면 화면이 반쪽으로 보인다.
 *   items-end 라 단추 밑선이 설명 마지막 줄과 맞는다.
 * ★ 이어지는 곳 네 갈래에는 **칸 사이 세로선**을 둔다 (2026-09-04 오너: "가운데 선 추가").
 *   여백만으로 나누면 넓은 화면에서 네 줄이 한 문장처럼 이어져 읽힌다.
 * ⚠️ 선은 칸 수가 아니라 **사이 수**만큼이다 — 줄 맨 앞 칸에는 선이 없어야 한다.
 *   좁은 화면(2열)에서는 홀수 번째, 넓은 화면(4열)에서는 첫째를 뺀 전부가 선을 갖는다.
 * ⚠️ 가로 gap 을 주지 말 것 — 선이 칸 사이 한가운데가 아니라 오른쪽 칸에 붙어 보인다.
 *   가로 숨은 px-8 이 맡는다(components/TreatmentShell.tsx 의 띠와 같은 규칙).
 */
export interface ClosingLink {
  /** 작은 머리말 — '자주 묻는 질문' · '관련 증상' · '함께 보기'. */
  label: string;
  /** 링크 글. */
  title: string;
  href: string;
}

export function TreatmentClosing({
  title = '아직 아프지 않을 때 오시면 선택지가 더 많습니다',
  lead = '증상이 애매해도 괜찮습니다. 전화로 상태를 먼저 말씀해 주시면 언제 오시는 것이 좋을지 함께 정합니다.',
  links,
  glow = false,
}: {
  /* ⚠️ 기본값은 ContactCta 와 같은 문구다 — 진료 공용 화면(TreatmentLanding)이 그대로 쓴다.
        새 문구를 만들지 말 것. 이미 검토를 거친 문장이다. */
  title?: string;
  lead?: string;
  links: ClosingLink[];
  /** 충치 페이지처럼 아래에서 번지는 빛을 깔지 — 어두운 결 페이지에서만 쓴다. */
  glow?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-24 lg:py-32">
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(46%_60%_at_50%_120%,rgba(201,116,78,0.30)_0%,transparent_66%)]"
        />
      )}
      <Container className="relative">
        {/*
          ⚠️ lg:items-end — 단추 더미 밑선을 설명 마지막 줄에 맞춘다. items-center 로 바꾸면
             글이 짧은 페이지에서 단추가 공중에 뜬 것처럼 보인다.
          ⚠️ 오른쪽 칸을 26rem 으로 **고정**한다. fr 로 두면 페이지마다 제목 길이에 따라
             단추 폭이 달라져 페이지를 옮길 때마다 단추가 늘었다 줄었다 한다.
        */}
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div className="min-w-0">
            <p className="reveal eyebrow-chip text-clay-700">예약 · 상담</p>
            <h2 className="reveal display-sm mt-5 max-w-[14em] text-[clamp(26px,3.8vw,44px)] leading-[1.16] tracking-[-0.025em] text-ink">
              {title}
            </h2>
            <p className="reveal mt-7 max-w-[34em] text-[17.5px] leading-[1.9] text-twilight">
              <Sentences text={lead} />
            </p>
          </div>
          <BookingButtons
            phone={CLINIC.phone}
            phoneHref={CLINIC.phoneHref}
            kakao={CLINIC.booking.kakao}
            naver={CLINIC.booking.naver}
          />
        </div>

        {links.length > 0 && (
          <div className="mt-16 grid gap-y-8 border-t border-brand-200/70 pt-10 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
            {links.map((l, i) => (
              <Link
                key={l.href + l.title}
                href={l.href}
                className={`reveal group lg:pr-8 lg:last:pr-0 ${
                  i % 2 === 1
                    ? 'sm:border-l sm:border-brand-300/60 sm:pl-8'
                    : 'sm:pr-8'
                } ${i > 0 ? 'lg:border-l lg:border-brand-300/60 lg:pl-8' : ''}`}
              >
                <p className="text-[13.5px] font-black text-clay-600">{l.label}</p>
                <p className="mt-2 text-[16.5px] leading-[1.45] font-black text-ink transition-colors group-hover:text-clay-600">
                  {l.title} <span aria-hidden>→</span>
                </p>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
