import Link from 'next/link';
import { CLINIC } from '@/lib/clinic';
import { Container, Sentences } from '@/components/ui';

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
  title,
  lead,
  links,
  glow = false,
}: {
  title: string;
  lead: string;
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
        {/* ⚠️ items-end — 단추 밑선을 설명 마지막 줄에 맞춘다. items-center 로 바꾸면 단추가 떠 보인다. */}
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-10">
          <div className="min-w-0 flex-1 basis-[26rem]">
            <h2 className="reveal display-sm max-w-[14em] text-[clamp(26px,3.8vw,44px)] leading-[1.16] tracking-[-0.025em] text-ink">
              {title}
            </h2>
            <p className="reveal mt-7 max-w-[34em] text-[17.5px] leading-[1.9] text-twilight">
              <Sentences text={lead} />
            </p>
          </div>
          <div className="reveal flex shrink-0 flex-wrap gap-3">
            <a
              href={CLINIC.booking.naver}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-[17px] font-semibold text-wine-bg transition-opacity hover:opacity-90"
            >
              진료 예약하기 <span aria-hidden>→</span>
            </a>
            <a
              href={CLINIC.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/60 px-8 py-4 text-[17px] font-semibold tabular-nums text-ink transition-colors hover:bg-ink hover:text-wine-bg"
            >
              {CLINIC.phone}
            </a>
          </div>
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
