'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { DEFINITIONS } from '@/lib/aeo';
import { CLINIC } from '@/lib/clinic';
import { Reveal } from '@/components/Motion';

/**
 * "이건 무슨 치료인가요?" — 환자가 쓰는 말로 들어가 한 문장으로 답한다.
 *
 * ★★ 진입을 병원의 말에서 환자의 말로 바꿨다 (2026-08-20 운영자) ★★
 *   전에는 왼쪽이 "자연치아살리기 / 임플란트 / 심미치료 / 사랑니치료" 였다.
 *   그런데 발치를 권유받고 검색해서 들어온 사람은 **"자연치아살리기" 라는 단어를 모른다.**
 *   자기 상태를 "이를 뽑아야 한다고 들었어요" 라고 말한다.
 *   → 질문을 앞에 두고 병원 용어는 그 아래 작게 남겼다. 용어를 없애는 게 아니라
 *     환자의 말에서 병원의 말로 건너가게 만드는 것이다.
 *   답변형 AI 도 질문문을 그대로 인용하므로 이 배치가 인용에도 유리하다.
 *
 * ★ 4개 → 6개.
 *   섹션 940px 중 내용이 392px(42%)뿐이라 아래가 텅 비어 있었다.
 *   새로 넣은 잇몸치료·어린이 진료는 **지어낸 게 아니라**
 *   lib/treatments-content.ts 의 검증된 본문에서 옮겨 적은 것이다.
 *
 * ★★ 대비 — 재 보고 고쳤다 (실측) ★★
 *   안 고른 항목 2.33:1 (27px 굵은 글씨는 3:1 기준) — 목록 4개 중 3개가 안 읽혔다
 *   항목 번호      2.33:1 (12px 는 4.5:1 기준)
 *   **주의 문장    3.72:1** — 의료법상 반드시 읽혀야 할 문장이 제일 안 읽혔다
 *   ⚠️ 원인은 --color-ink-3(#767c85) 과 ink-4(#9aa0a8) 다. surface(#f2f1ee) 위에서
 *      각각 3.74:1 / 2.33:1 이라 **작은 본문에 쓰면 안 되는 색**이다.
 *      여기서는 ink-2(#4a5058, 7.2:1) 로 올렸다. 장식이 아닌 글에는 ink-3 이하를 쓰지 않는다.
 *   ⚠️ 좌우에 번호가 두 번(01 … 01) 나오던 것도 없앴다. 같은 정보를 두 번 그릴 이유가 없다.
 *
 * ⚠️ 글을 줄여도 '주의' 는 남긴다 — 효과·용도 설명 옆에서 한계를 빼면 그 순간 의료광고다.
 *    다만 6개를 동시에 띄우지 않고 고른 것 하나만 보여 준다.
 * ⚠️ 자동 전환은 넣지 않는다. 읽는 중에 글이 바뀌면 그건 방해다.
 */
export default function DefinitionSwitch() {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const d = DEFINITIONS[i];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(true); return; }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setShown(true); io.unobserve(e.target); } }),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-20">
      {/* ── 고르는 쪽 — 환자의 말 ──
        ★★ 리스트 → 카드 (2026-08-21, 운영자: "카드 형식으로 할까 한개씩?") ★★
          한 번에 하나만 보여주는 카드 슬라이드는 추천하지 않았다 — 6개를 한눈에
          훑어보는 지금 방식(질문+답을 한 덩어리로 인용하는 AEO 의도와도 맞물림)이
          더 낫다고 판단해서, 대신 "항목을 카드처럼" 만드는 절충안으로 갔다
          (운영자 동의: "추천하는대로 해봐").
          카드마다 테두리·배경으로 선택 상태를 표시하므로, 예전의 미끄러지는
          왼쪽 막대(퍼센트 높이 계산이 카드 사이 gap 과는 안 맞는다)는 없앴다 —
          카드 자체의 테두리·그림자가 그 역할을 대신한다.
      */}
      <ul className="flex flex-col gap-3">
        {/*
          ★★ 목록 항목 등장 모션 추가 (2026-08-21, 운영자 지적) ★★
            오른쪽 답변 패널(defFocus)은 이미 움직이는데 왼쪽 질문 목록 6개는
            아무 모션 없이 한꺼번에 나타났다. 다른 목록들(FACTS 통계, 의료진 카드)
            과 같은 어휘로 맞춘다 — 항목마다 살짝 시차를 두고 아래에서 떠오른다.
            Reveal as="li" 로 감싸 추가 div 없이 li 자체에 모션을 건다.
        */}
        {DEFINITIONS.map((x, n) => (
          <Reveal as="li" key={x.key} delay={n * 70}>
            {/*
              ★★ 카드에 움직임을 넣었다 (2026-08-21, 운영자: "여기만 애니메이션이나
                 효과 넣어서 ai티 없애면 되겠는데") ★★
                 색만 바뀌던 카드에 세 가지를 더했다 — 고른 카드 왼쪽에서 세로로
                 자라는 강조 막대, 손을 올리면 살짝 떠오르는 반응, 고른 카드에서
                 미끄러져 들어오는 화살표. 전부 이 사이트가 이미 쓰는 어휘
                 (--ease-soft, 0.5s 전환)로 맞췄다.
              ⚠️ 강조 막대는 **카드 안에** 둔다. 예전에 목록 전체를 훑는 하나짜리
                 막대를 뒀다가, 카드 사이 gap 때문에 퍼센트 높이 계산이 안 맞아
                 걷어냈다. 카드마다 자기 막대를 갖는 지금 방식은 그 계산이 없다.
            */}
            <button
              type="button"
              onClick={() => setI(n)}
              aria-current={n === i}
              className={`group relative block w-full overflow-hidden rounded-2xl border p-6 pl-7 text-left transition-all duration-500 ${
                n === i
                  ? 'border-brand/70 bg-white shadow-[0_18px_40px_-28px_rgba(20,23,28,.4)]'
                  : 'border-line bg-transparent hover:-translate-y-[2px] hover:border-brand/30 hover:bg-white/60 hover:shadow-[0_14px_30px_-26px_rgba(20,23,28,.45)]'
              }`}
              style={{ cursor: 'pointer', transitionTimingFunction: 'var(--ease-soft)' }}
            >
              {/* 고른 카드 왼쪽에서 세로로 자라는 막대. 위에서 아래로 자란다. */}
              <span
                aria-hidden
                className="absolute inset-y-5 left-0 w-[3px] rounded-r-full bg-brand transition-transform duration-500"
                style={{
                  transformOrigin: 'top',
                  transform: n === i ? 'scaleY(1)' : 'scaleY(0)',
                  transitionTimingFunction: 'var(--ease-soft)',
                }}
              />

              {/* 고른 카드에만 미끄러져 들어오는 화살표. */}
              <span
                aria-hidden
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[18px] text-brand transition-all duration-500"
                style={{
                  opacity: n === i ? 1 : 0,
                  transform: `translateY(-50%) translateX(${n === i ? '0' : '-8px'})`,
                  transitionTimingFunction: 'var(--ease-soft)',
                }}
              >
                →
              </span>

              <span
                className={`block pr-8 text-[clamp(17px,1.75vw,22px)] font-bold leading-[1.45] tracking-[-0.03em] transition-all duration-500 ${
                  n === i ? 'text-ink' : 'text-ink-2'
                }`}
                style={{ transform: n === i ? 'translateX(4px)' : 'none' }}
              >
                {x.question}
              </span>
              {/* ⚠️ 여기에 투명도(/70)를 걸었다가 실효 대비가 3.6:1 로 떨어졌다.
                  #4a5058 을 70% 로 깔면 surface 위에서 사실상 #7c8085 가 된다.
                  12.5px 글자는 4.5:1 이 필요하므로 투명도 없이 쓴다. */}
              <span
                className={`mt-1.5 block text-[13.5px] tracking-[0.02em] transition-colors duration-500 ${
                  n === i ? 'text-brand' : 'text-ink-2'
                }`}
                style={{ transform: n === i ? 'translateX(4px)' : 'none', transition: 'transform .5s var(--ease-soft), color .5s ease' }}
              >
                {x.term}
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      {/* ── 답하는 쪽 — 한 자리에서 바뀐다 ── */}
      <div className="lg:pt-3">
        {/*
          초점이 맞으며 들어온다 — key 를 바꿔 전환마다 다시 재생.
          ★★ 한 덩어리 → 줄줄이 (2026-08-21, 운영자: "애니메이션이나 효과 넣어서
             ai티 없애면") ★★ 예전에는 이 블록 전체가 한 번에 떠올랐다. 지금은
             질문 → 정의 → 이럴 때 → 주의 → 링크가 70ms 씩 어긋나 들어온다.
             같은 0.72s 라도 순서가 보이면 '누가 배치한 화면'으로 읽힌다.
          ⚠️ 지연은 rise() 한 곳에서만 만든다 — 각 줄에 숫자를 직접 적으면 항목을
             넣고 뺄 때 반드시 순서가 엉킨다.
          ⚠️ blur 는 비싸다. 전환마다 한 번 돌고 끝나야 한다(both, 무한 반복 금지).
        */}
        <div key={d.key}>
          {/*
            ★ 질문을 한 번 더 적고 그 아래 답을 둔다.
              오른쪽만 보고 있어도 "무엇에 대한 답인지" 가 문장 안에서 닫힌다 —
              AI 가 이 덩어리만 떼어 인용해도 말이 된다.
          */}
          <p className="flex items-center gap-3 text-[14px] font-bold tracking-[-0.01em] text-brand" style={rise(shown, 0)}>
            {/* 질문 앞에서 가로로 자라는 짧은 선 — 답이 시작되는 지점을 만든다. */}
            <span aria-hidden className="def-rule block h-px bg-brand/50" />
            {d.question}
          </p>
          <p
            className="mt-4 text-[clamp(17px,1.5vw,21px)] font-semibold leading-[1.72] tracking-[-0.025em] text-ink"
            style={rise(shown, 1)}
          >
            {d.definition}
          </p>
          <p className="mt-7 text-[15.5px] leading-[1.85] text-ink-2" style={rise(shown, 2)}>
            <span className="font-bold text-ink">이럴 때 — </span>
            {d.indication}
          </p>
          {/* ⚠️ 주의는 ink-2(7.2:1). 전에 쓰던 ink-3 은 3.72:1 로 기준 미달이었다. */}
          <p className="mt-7 border-t border-line pt-6 text-[14px] leading-[1.85] text-ink-2" style={rise(shown, 3)}>
            <span className="font-bold text-ink">주의 — </span>
            {d.caution}
          </p>
          <div style={rise(shown, 4)}>
            <Link
              href={`/treatment/${SLUG[d.key] ?? ''}`}
              className="tap group mt-8 inline-flex items-center gap-2 text-[14.5px] font-bold text-brand"
            >
              {d.term} 자세히 보기{' '}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/*
          어느 쪽인지 모르겠는 사람을 위한 출구.
          ⚠️ 전환 애니메이션 바깥에 둔다 — 항목을 바꿀 때마다 같이 깜빡이면 산만하다.
        */}
        <p className="mt-10 border-t border-line pt-6 text-[14px] leading-[1.8] text-ink-2">
          어느 쪽인지 모르겠다면 먼저 봐 드립니다.{' '}
          <a href={CLINIC.phoneHref} className="font-bold text-ink underline underline-offset-4">
            {CLINIC.phone}
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * 오른쪽 답변 패널의 줄들이 순서대로 들어오게 하는 지연 계산.
 *
 * ⚠️ 화면에 들어오기 전(shown=false)에는 **투명하게 숨긴다.** 애니메이션만 걸어
 *    두면 스크롤해서 도달하기 한참 전에 이미 다 재생되고 끝나 있다.
 * ⚠️ 지연 상한을 둔다 — 항목이 늘어도 마지막 줄이 0.3초 넘게 기다리면
 *    '느리다' 로 읽힌다.
 */
function rise(shown: boolean, n: number): React.CSSProperties {
  if (!shown) return { opacity: 0 };
  return {
    animation: 'defFocus 0.72s cubic-bezier(0.22,1,0.36,1) both',
    animationDelay: `${Math.min(n * 70, 300)}ms`,
  };
}

/**
 * 정의 키 → 치료 문서 slug.
 * ⚠️ lib/aeo 의 key 와 lib/treatments-content 의 slug 는 이름이 다르다.
 *    여기서 한 번만 잇는다 — 양쪽에 같은 문자열을 두면 반드시 어긋난다.
 */
const SLUG: Record<string, string> = {
  natural: 'save-natural-tooth',
  periodontal: 'periodontal',
  implant: 'implant',
  wisdom: 'wisdom-tooth',
  aesthetic: 'aesthetic',
  pediatric: 'pediatric',
};
