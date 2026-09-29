import { Fragment, type CSSProperties, type ReactNode } from 'react';

/*
 * ★★ 홈 모션 조각 — 문구 강조 · 줄 가림막 · 글자 떠오름 (2026-09-29 오너: "모션그래픽 엄청 넣어줘" + "문구 강조도") ★★
 *
 *   전부 **서버 컴포넌트**다. 클래스와 지연값(--d · --ld · --ed)만 붙이고, 켜는 일은
 *   RevealScript 의 '늦은 관찰자'(화면 안으로 12% 들어왔을 때)가 한다. 움직임 값은 app/motion.css.
 *
 * ★ 강조 표시 (한 문자열 안에 섞어 쓴다)
 *     [[한 번 더]]   손으로 그린 동그라미가 낱말을 한 바퀴 두른다 — 병원 이름(동그라미)이 곧 강조 표시다.
 *     ==필요한 치료==  형광펜이 왼쪽에서 오른쪽으로 칠해진다.
 *     __가장 좋습니다__ 밑줄이 그어진다(어두운 면).
 *   ⚠️ 표시는 문구를 바꾸지 않는다 — 글자는 원문 그대로, 모양만 얹는다(의료광고 문구 검토를 다시 받을 일이 없다).
 *   ⚠️ 짝이 안 맞는 표시는 글자로 남는다. 한 줄(line) 안에서 여닫을 것.
 */
const TOKEN = /(\[\[.+?\]\]|==.+?==|__.+?__)/g;

type Seg = { kind: 'plain' | 'circle' | 'mark' | 'under'; text: string };

export function parseEm(text: string): Seg[] {
  return text
    .split(TOKEN)
    .filter(Boolean)
    .map((t) =>
      t.startsWith('[[') && t.endsWith(']]')
        ? { kind: 'circle' as const, text: t.slice(2, -2) }
        : t.startsWith('==') && t.endsWith('==') && t.length > 4
          ? { kind: 'mark' as const, text: t.slice(2, -2) }
          : t.startsWith('__') && t.endsWith('__') && t.length > 4
            ? { kind: 'under' as const, text: t.slice(2, -2) }
            : { kind: 'plain' as const, text: t },
    );
}

/** 강조 표시를 뺀 맨 글자 — aria-label·검색 요약에 쓴다. */
export const plainText = (text: string) => parseEm(text).map((s) => s.text).join('');

/**
 * 손으로 그린 동그라미 — 시작점을 지나 조금 겹쳐 끝난다(펜으로 두른 자국).
 * ★ viewBox 를 늘려 낱말 상자에 맞춘다(preserveAspectRatio none). 선 굵기가 옆면에서 조금 굵어지는데, 붓펜 결이라 그대로 둔다.
 */
export function CircleMark() {
  return (
    <svg className="em-ring" viewBox="0 0 240 90" preserveAspectRatio="none" aria-hidden focusable="false">
      <path
        pathLength={1}
        d="M196 15C150 3 62 6 27 25 3 39 8 70 60 80c60 11 146 4 168-20 16-20-6-42-58-50-30-4-60-2-78 2"
      />
    </svg>
  );
}

/** 문자열 → 강조가 입혀진 조각들. delay 는 강조가 그려지기 시작하는 때(ms, 요소가 켜진 뒤). */
export function Em({ text, delay = 0 }: { text: string; delay?: number }) {
  const segs = parseEm(text);
  const style = delay ? ({ ['--ed' as string]: `${delay}ms` } as CSSProperties) : undefined;
  return (
    <>
      {segs.map((s, i) =>
        s.kind === 'plain' ? (
          <Fragment key={i}>{s.text}</Fragment>
        ) : s.kind === 'circle' ? (
          <span key={i} className="em em-circle" style={style}>
            {s.text}
            <CircleMark />
          </span>
        ) : (
          <span key={i} className={`em em-${s.kind}`} style={style}>
            {s.text}
          </span>
        ),
      )}
    </>
  );
}

/**
 * 줄 가림막 — 줄마다 보이지 않는 틀 안에서 아래에서 위로 밀려 올라온다.
 * 부모 제목에 `split-in` 을 붙이면(HomeHead·CenterHead 의 split) 늦은 관찰자가 켠다.
 * 강조는 줄이 다 올라온 뒤(emDelay) 그려진다.
 */
export function SplitLines({ lines, step = 110, emDelay }: { lines: readonly string[]; step?: number; emDelay?: number }) {
  const ed = emDelay ?? 620 + lines.length * step;
  return (
    <>
      {lines.map((l, i) => (
        <span key={i} className="ln">
          <span className="ln-in" style={{ ['--ld' as string]: `${i * step}ms` } as CSSProperties}>
            <Em text={l} delay={ed} />
          </span>
        </span>
      ))}
    </>
  );
}

/**
 * 한 글자씩 떠오르는 제목(첫 화면용 — 페이지가 열릴 때 바로 돈다, 관찰자 없음).
 * ⚠️ 글자 span 을 inline-block 으로 만들지 말 것 — innerText 에서 낱말 경계로 잡혀 '뽑 기 전 에' 가 된다
 *    (globals.css .seq-letter 주석과 같은 이유). 움직임은 position:relative + top 으로 만든다.
 * 동그라미 강조([[…]])는 그 글자들을 감싸고, 마지막 글자가 선 뒤(ringAt) 그려진다.
 */
export function Chars({
  lines,
  start = 0,
  step = 45,
  ringGap = 260,
}: {
  lines: readonly string[];
  start?: number;
  step?: number;
  /** 마지막 글자가 선 뒤 강조가 그려지기까지(ms). */
  ringGap?: number;
}) {
  let n = -1;
  const total = lines.reduce((a, l) => a + [...plainText(l)].filter((c) => c !== ' ').length, 0);
  const ringAt = start + total * step + ringGap;
  const chars = (t: string) =>
    [...t].map((ch, k) => {
      if (ch === ' ') return ' ';
      n += 1;
      return (
        <span key={k} className="ch" style={{ ['--d' as string]: `${start + n * step}ms` } as CSSProperties}>
          {ch}
        </span>
      );
    });
  const out: ReactNode[] = [];
  lines.forEach((l, li) => {
    if (li) out.push(<br key={`br${li}`} />);
    parseEm(l).forEach((s, si) => {
      const key = `${li}-${si}`;
      if (s.kind === 'plain') out.push(<Fragment key={key}>{chars(s.text)}</Fragment>);
      else if (s.kind === 'circle')
        out.push(
          <span key={key} className="em em-circle em-now" style={{ ['--ed' as string]: `${ringAt}ms` } as CSSProperties}>
            {chars(s.text)}
            <CircleMark />
          </span>,
        );
      else
        out.push(
          <span key={key} className={`em em-${s.kind} em-now`} style={{ ['--ed' as string]: `${ringAt}ms` } as CSSProperties}>
            {chars(s.text)}
          </span>,
        );
    });
  });
  return <>{out}</>;
}
