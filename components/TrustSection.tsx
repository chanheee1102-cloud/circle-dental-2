import Link from 'next/link';
import { TRUST_STATS, CREDENTIAL_ROWS, MEDIA_APPEARANCES } from '@/lib/trustSignals';
import { PUBLICATION_DETAIL } from '@/lib/doctors';
import { Container, Sentences } from '@/components/ui';
import { Reveal } from '@/components/Reveal';
import { headingId } from '@/components/article';

/**
 * 신뢰 지표 — 숫자 · 인증표 · 논문 · 언론. (/about/trust 전용)
 *
 * ★★ 왜 한 자리에 모으나 ★★
 *   자격도 인증패도 논문도 방송도 원래 이 사이트에 다 있었다. 그런데 **흩어져 있어서
 *   세어지지 않았다.** 답변 엔진은 "전문의 3명, 인증 4건, 논문 1편" 처럼 셀 수 있는 것을
 *   인용하지, 여러 페이지에 흩어진 인상을 인용하지 않는다.
 *
 * ⚠️⚠️ 여기에 환자 후기·별점·치료 전후 사진을 넣지 말 것 ⚠️⚠️
 *   의료법 제56조 제2항이 **치료경험담 광고를 금지**한다. 일반 업종의 '고객 후기' 를
 *   그대로 옮기면 그 자체가 위법이다. 의료에서 쓸 수 있는 신뢰 지표는
 *   **자격 · 학회 · 논문 · 언론** 쪽이고, 이 섹션은 그것만 다룬다.
 *
 * ★ 숫자는 전부 저장소 데이터를 센 값이다(lib/trustSignals.ts). 손으로 적은 값이 없어
 *   원장이 늘거나 인증이 추가되면 화면이 저절로 따라온다.
 *
 * ★★ 난잡함을 걷어낸 세 가지 (2026-09-01 오너: "난잡하다 또") ★★
 *   ① 숫자 여섯 칸이 3열 두 줄이라 아래 줄이 어중간했다 → 네 칸 한 줄.
 *      (뺀 둘은 '진료 영역'·'증상 문서' — **우리 사이트 분량**이지 제3자가 준 근거가 아니다.
 *       이 페이지의 주장이 "제3자가 준 것만 근거다" 인데 그 옆에 두면 주장이 흐려진다.)
 *   ② 왼쪽 표 + 오른쪽 카드 세 장이 좌우로 붙어 밀도가 크게 달랐다 → 위아래로 편다.
 *      표는 전폭, 논문과 방송은 두 칸.
 *   ③ '언제 갈 수 있나요'(진료시간·주차)가 여기 있었다 → 뺐다. 근거 페이지에 올 이야기가
 *      아니고, 같은 내용이 내원 안내에 이미 있다.
 * ⚠️ headless 프로퍼티를 되살리지 말 것 — 이 부품을 쓰는 곳은 /about/trust 하나뿐이라
 *    다른 분기는 렌더된 적이 없는 죽은 코드였다.
 */
export function TrustSection() {
  return (
    <>
      {/*
        ── 숫자 ──
        ⚠️ 실선 격자(gap-px)로 되돌리지 말 것 — 어두운 결에서 그 선이 바탕과 가까워져
           칸들이 한 덩어리로 뭉개졌다(2026-08-31 오너 지적). 나누는 것은 선이 아니라 면이다.
      */}
      <Container>
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TRUST_STATS.map((s, i) => (
            <div key={s.label} className="rounded-2xl border border-brand-200/70 bg-parchment px-7 py-8">
              <Reveal delay={(i % 4) * 40}>
                <dt className="text-[14px] leading-snug font-bold text-ink-muted">{s.label}</dt>
                <dd className="display mt-3 text-[clamp(30px,3vw,40px)] tracking-[-0.01em] text-clay-600">
                  {s.value}
                </dd>
              </Reveal>
            </div>
          ))}
        </dl>
      </Container>

      {/* ── 인증과 자격 — 전폭 표 ── */}
      {/* ⚠️ 어두운 면으로 되돌리지 말 것 — 표는 흰 종이의 문법이다. */}
      <section className="reveal light-band mt-16">
        <Container className="py-12 lg:py-16">
          <h2
            id={headingId('인증과 자격은 어디서 받았나요')}
            className="display-sm scroll-mt-28 text-[clamp(24px,2.6vw,32px)] text-ink"
          >
            인증과 자격은 어디서 받았나요?
          </h2>
          <p className="mt-4 max-w-[62ch] text-[16.5px] leading-[1.8] text-twilight">
            <Sentences text="아래 자격과 인증은 발급처를 함께 적었습니다. 어디서 받은 것인지까지 확인하실 수 있습니다." />
          </p>

          {/*
            ⚠️ overflow-x-auto 를 지우지 말 것 — 표 최소 폭이 520px 이라 좁은 화면에서
               문서 전체가 가로로 밀린다(실측 153px). 넘치는 것은 표가 아니라 표를 담은 칸이다.
            ⚠️ 표를 유리 카드에 다시 넣지 말 것 — 카드 안의 표는 '카드 하나' 로 읽혀서
               정작 표의 줄이 안 보인다. 줄로 나누는 것이 표의 일이다.
          */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <caption className="sr-only">동그라미치과의원 의료진의 인증·자격과 발급처</caption>
              <thead>
                {/* ⚠️ 머리줄에 색을 빼지 말 것 — 본문 줄과 같아지면 표가 목록으로 읽힌다. */}
                <tr className="border-y border-brand-200/70">
                  <th scope="col" className="py-3.5 pr-5 text-[13.5px] font-black tracking-[0.06em] text-clay-600">
                    항목
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-[13.5px] font-black tracking-[0.06em] text-clay-600">
                    발급처
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-[13.5px] font-black tracking-[0.06em] text-clay-600">
                    구분
                  </th>
                </tr>
              </thead>
              <tbody>
                {CREDENTIAL_ROWS.map((c) => (
                  <tr key={c.name} className="border-b border-brand-200/80">
                    <th scope="row" className="py-4 pr-5 align-top text-[16px] font-bold text-ink">
                      {c.name}
                    </th>
                    <td className="px-5 py-4 align-top text-[16px] text-twilight">{c.issuer}</td>
                    <td className="px-5 py-4 align-top text-[15px] whitespace-nowrap text-ink-soft">
                      {c.kind}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* ── 논문 · 언론 — 두 칸 ── */}
      <section className="reveal border-t border-brand-200/80">
        <Container className="grid gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <div>
            <h2
              id={headingId('학술 활동이 있나요')}
              className="display-sm scroll-mt-28 text-[clamp(22px,2.3vw,28px)] text-ink"
            >
              학술 활동이 있나요?
            </h2>
            <p className="mt-4 text-[16.5px] leading-[1.8] text-twilight">
              대표원장이 공저자로 참여한 논문이 국제 학술지에 실려 있습니다.
            </p>
            <p className="mt-5 border-l-2 border-clay-600/45 pl-5 text-[16px] leading-[1.7] text-ink">
              {PUBLICATION_DETAIL.title}
              <span className="mt-2 block text-[14.5px] text-ink-soft">
                {PUBLICATION_DETAIL.authors}
              </span>
            </p>
          </div>

          {MEDIA_APPEARANCES.length > 0 && (
            <div>
              <h2
                id={headingId('방송에 나온 적이 있나요')}
                className="display-sm scroll-mt-28 text-[clamp(22px,2.3vw,28px)] text-ink"
              >
                방송에 나온 적이 있나요?
              </h2>
              <ul className="mt-4 space-y-3">
                {MEDIA_APPEARANCES.map((m) => (
                  <li key={m.program} className="text-[16.5px] leading-[1.8] text-twilight">
                    <span className="font-black text-clay-600">{m.outlet}</span> {m.program} —{' '}
                    {m.what}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </section>

      <Container className="py-10">
        <Link
          href="/about/doctors"
          className="group inline-flex items-center gap-2 text-[17px] font-bold text-ink transition-colors hover:text-clay-600"
        >
          인증패 · 논문 실물 사진 보기{' '}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </Container>
    </>
  );
}
