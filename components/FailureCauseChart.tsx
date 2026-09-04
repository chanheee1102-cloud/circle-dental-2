'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * **임플란트 재수술의 원인** — 화면에 들어오면 막대가 자라는 그래프.
 *
 * ★★ 왜 사진이 아니라 컴포넌트인가 (2026-09-04 오너: "아예 너가 그래프 저런식으로 만들어도 되고
 *    애니메이션? 모션 넣어서") ★★
 *   ① 그림으로 만들면 숫자가 픽셀에 갇힌다 — 자료가 바뀌면 다시 그려야 하고, 검색·AI 는 못 읽는다.
 *   ② 한글 글자를 이미지 모델에 맡기면 깨진다(이 저장소가 반복해서 겪은 일).
 *   ③ 막대가 자라는 움직임은 CSS 로 공짜다. 그림에는 넣을 수 없다.
 *
 * ⚠️⚠️ 숫자를 임의로 바꾸지 말 것 — 한국소비자원에 접수된 임플란트 피해유형(2012~2014) 이다.
 *    출처 표기를 함께 지우지 말 것. 출처 없는 통계는 의료광고에서 근거로 인정되지 않는다.
 * ⚠️ 이것은 **일반적인 통계**이고 이 병원의 실적이 아니다. 문구를 '우리는 …' 으로 바꾸지 말 것.
 * ⚠️ prefers-reduced-motion 을 존중한다 — 움직임을 끈 사람에게는 그냥 완성된 막대를 보여 준다.
 */
const ROWS = [
  { label: '임플란트 주위염', pct: 37.1, tone: 'high' as const },
  { label: '매식체 탈락 · 파손', pct: 25.7, tone: 'high' as const },
  { label: '보철물 탈락 · 파손', pct: 8.6, tone: 'low' as const },
  { label: '교합 불편감', pct: 8.6, tone: 'low' as const },
  { label: '기타', pct: 8.6, tone: 'low' as const },
];
const MAX = 40;

export function FailureCauseChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* ⚠️ 화면에 들어올 때 한 번만 — 스크롤할 때마다 다시 자라면 산만하다. */
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} className="reveal">
      <figcaption className="text-[13.5px] font-black tracking-[0.06em] text-clay-700">
        임플란트 재수술의 원인
      </figcaption>
      <p className="mt-3 max-w-[34em] text-[16px] leading-[1.85] text-twilight">
        재수술로 이어진 사례에서 가장 많이 보고된 것은 임플란트 주위염입니다. 심은 뒤의 관리가 왜
        중요한지가 여기서 드러납니다.
      </p>

      <ul className="mt-8 space-y-4">
        {ROWS.map((r, i) => (
          <li key={r.label}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[15px] font-bold text-ink">{r.label}</span>
              <span className="text-[15px] font-black tabular-nums text-clay-700">{r.pct}%</span>
            </div>
            {/* 막대 — 폭만 바뀌므로 레이아웃을 다시 계산하지 않는다(transform 이 아니어도 가볍다). */}
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-brand-200/60">
              <div
                className={`h-full rounded-full motion-reduce:!transition-none ${
                  r.tone === 'high' ? 'bg-clay-600' : 'bg-clay-400'
                }`}
                style={{
                  width: shown ? `${(r.pct / MAX) * 100}%` : '0%',
                  transition: 'width 900ms cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: `${i * 110}ms`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      {/* ⚠️ 출처를 지우지 말 것 — 출처 없는 통계는 근거가 아니다. */}
      <p className="mt-6 text-[13px] leading-[1.7] text-ink-muted">
        한국소비자원에 접수된 임플란트 피해유형 (2012~2014). 일반적인 통계이며 동그라미치과의
        치료 결과가 아닙니다.
      </p>
    </figure>
  );
}
