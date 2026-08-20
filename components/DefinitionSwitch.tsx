'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { DEFINITIONS } from '@/lib/aeo';
import { CLINIC } from '@/lib/clinic';

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
      {/* ── 고르는 쪽 — 환자의 말 ── */}
      <ul className="relative">
        {/* 미끄러지는 막대 — 지금 어디를 보고 있는지 */}
        <span
          aria-hidden
          className="absolute left-0 w-[2px] rounded-full bg-brand"
          style={{
            height: `calc(100% / ${DEFINITIONS.length})`,
            transform: `translateY(${i * 100}%)`,
            transition: 'transform 0.62s var(--ease-expo)',
          }}
        />
        {DEFINITIONS.map((x, n) => (
          <li key={x.key}>
            <button
              type="button"
              onClick={() => setI(n)}
              aria-current={n === i}
              className="block w-full py-5 pl-7 text-left"
              style={{ cursor: 'pointer' }}
            >
              <span
                className={`block text-[clamp(17px,1.75vw,22px)] font-bold leading-[1.45] tracking-[-0.03em] transition-all duration-500 ${
                  n === i ? 'text-ink' : 'text-ink-2'
                }`}
                style={{ transform: n === i ? 'translateX(6px)' : 'none' }}
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
                style={{ transform: n === i ? 'translateX(6px)' : 'none', transition: 'transform .5s var(--ease-soft), color .5s ease' }}
              >
                {x.term}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* ── 답하는 쪽 — 한 자리에서 바뀐다 ── */}
      <div className="lg:pt-3">
        {/* 초점이 맞으며 들어온다 — key 를 바꿔 전환마다 다시 재생 */}
        <div
          key={d.key}
          style={{
            animation: shown ? 'defFocus 0.72s cubic-bezier(0.22,1,0.36,1) both' : undefined,
            opacity: shown ? undefined : 0,
          }}
        >
          {/*
            ★ 질문을 한 번 더 적고 그 아래 답을 둔다.
              오른쪽만 보고 있어도 "무엇에 대한 답인지" 가 문장 안에서 닫힌다 —
              AI 가 이 덩어리만 떼어 인용해도 말이 된다.
          */}
          <p className="text-[14px] font-bold tracking-[-0.01em] text-brand">{d.question}</p>
          <p className="mt-4 text-[clamp(17px,1.5vw,21px)] font-semibold leading-[1.72] tracking-[-0.025em] text-ink">
            {d.definition}
          </p>
          <p className="mt-7 text-[15.5px] leading-[1.85] text-ink-2">
            <span className="font-bold text-ink">이럴 때 — </span>
            {d.indication}
          </p>
          {/* ⚠️ 주의는 ink-2(7.2:1). 전에 쓰던 ink-3 은 3.72:1 로 기준 미달이었다. */}
          <p className="mt-7 border-t border-line pt-6 text-[14px] leading-[1.85] text-ink-2">
            <span className="font-bold text-ink">주의 — </span>
            {d.caution}
          </p>
          <Link
            href={`/treatment/${SLUG[d.key] ?? ''}`}
            className="tap mt-8 inline-flex items-center gap-2 text-[14.5px] font-bold text-brand"
          >
            {d.term} 자세히 보기 <span aria-hidden>→</span>
          </Link>
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
