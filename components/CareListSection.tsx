import Link from 'next/link';
import { TREATMENTS } from '@/lib/treatments';
import { Sentences } from '@/components/ui';
import { Reveal } from '@/components/Reveal';

/**
 * 진료 영역 전체 목록 — 번호 + 이름 + 한 줄 요약 + '이런 경우' + 링크. (/treatment 전용)
 *
 * ★★ 홈에서 /treatment 로 옮겼다 (2026-08-14 운영자: "이것도 서브페이지로") ★★
 *   홈에는 이미 사진 카드 네 장(PillarSection)이 '어떤 진료를 받을 수 있나요?' 에 답하고
 *   있었다. 그 아래에 열 줄짜리 목록을 또 두니 **같은 질문에 두 번 답하면서** 홈만
 *   길어졌다. 목록은 훑어서 자기 것을 찾는 도구라, 진료과목 페이지에 있는 편이 맞다.
 *   ⚠️ 홈에서 뺀 만큼 길은 남긴다 — PillarSection 아래에 '전체 진료과목' 링크를 두었다.
 *
 * ★ 여기에 들어가는 문구는 전부 lib/treatments.ts 에서 온다. 새로 만들지 않는다.
 *   '이런 경우에 봅니다'(whoFor)를 쓰는 이유 — 장비나 브랜드를 늘어놓는 것보다
 *   환자가 자기 상황을 찾는 데 실제로 쓸모 있다.
 *
 * ★★ 밝은 띠 위에 둔다 (2026-09-02 오너: "너무 어둡고 침침해") ★★
 *   이 페이지는 열 줄을 훑어 자기 것을 찾는 자리다. 어두운 바탕에서 열 줄이 이어지면
 *   글이 다 비슷하게 가라앉아 훑기가 어렵다. 목록은 밝은 면이 맞다.
 *   ⚠️ 밝은 띠 안에서는 선 색이 한 단 진해진다(globals.css .light-band) — 그래서 여기
 *      가로줄이 실제로 보인다. 어두운 결에서 쓰던 옅은 선을 그대로 두면 1.05:1 로 묻힌다.
 *
 * ⚠️⚠️ 되돌리지 말 것 ⚠️⚠️
 *   ① 번호를 테두리 원에 담지 말 것 — 알약·동그라미 테두리는 사이트 전체에서 걷어냈다
 *      (2026-09-01 오너: "클로드 테두리 디자인 전부 없애줘"). 번호는 금색 글자로 충분하다.
 *   ② '이런 경우' 를 알약 칩으로 되돌리지 말 것 — 같은 이유다. 가운뎃점으로 잇는다.
 *   ③ headless 프로퍼티를 되살리지 말 것 — 이 부품을 쓰는 곳은 /treatment 하나뿐이라
 *      다른 분기는 렌더된 적 없는 죽은 코드였다.
 *
 * ★ 진료명이 h2 다 — 페이지의 h1 은 머리말이 갖는다. h1 → h3 으로 건너뛰면 위계가 깨진다.
 */
export function CareListSection() {
  return (
    <ul>
      {TREATMENTS.map((t, i) => (
        <li key={t.slug} className="border-b border-brand-200/70 first:border-t">
          <Reveal delay={Math.min(i, 5) * 40}>
            <Link
              href={`/treatment/${t.slug}`}
              className="group grid items-start gap-x-9 gap-y-3 px-2 py-8 transition-colors hover:bg-brand-100/50 sm:px-4 lg:grid-cols-[auto_minmax(0,260px)_1fr_auto] lg:items-center lg:py-9"
            >
              {/*
                번호 — 금색 글자. 영문 세리프라 본문 글꼴과 결이 달라 '표식' 으로 읽힌다.
                ⚠️ 테두리 원으로 되돌리지 말 것(위 주석 ①).
              */}
              <span
                aria-hidden
                className="display-en shrink-0 text-[21px] leading-none tabular-nums text-clay-600"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="min-w-0">
                {/* ⚠️ 아래에 '질문 N개' 를 되살리지 말 것 (2026-09-02 오너) — 훑을 때 쓰는 정보가
                    아닌데 이름 바로 밑에 붙어 이름과 무게를 나눠 가졌다. */}
                <h2 className="display-sm text-[clamp(21px,2.1vw,26px)] leading-snug text-ink transition-colors group-hover:text-clay-700">
                  {t.name}
                </h2>
              </div>

              <div className="min-w-0">
                {/* 한 줄 요약 — '이런 경우' 만으로는 무엇을 하는 치료인지 모른다. */}
                <p className="max-w-[62ch] text-[17px] leading-[1.8] text-twilight">
                  <Sentences text={t.summary} />
                </p>

                {/*
                  '이런 경우' — 셋까지만. 넷을 넘으면 줄이 두 줄이 되어 목록의 리듬이 깨진다.
                  ⚠️ 알약 칩으로 되돌리지 말 것(위 주석 ②).
                */}
                <p className="mt-3 max-w-[62ch] text-[15.5px] leading-[1.75] text-twilight">
                  <span className="font-bold text-clay-700">이런 경우</span>
                  {'  '}
                  {t.whoFor.slice(0, 3).join(' · ')}
                </p>
              </div>

              <span
                aria-hidden
                className="hidden text-[18px] text-clay-600 transition-transform group-hover:translate-x-1 lg:inline"
              >
                →
              </span>
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
