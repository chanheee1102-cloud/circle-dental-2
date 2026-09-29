import { Fragment, type CSSProperties, type ReactNode } from 'react';

/*
 * ★★ 모션 조각 — 문구 강조 · 줄 가림막 · 글자 떠오름 · 낱말 짙어짐 ★★
 *   (2026-09-29 오너: "모션그래픽 엄청 넣어줘" + "문구 강조도" → 같은 날 "강조는 형광펜 밑줄로")
 *
 *   전부 **서버 컴포넌트**다. 클래스와 지연값(--d · --ld · --ed)만 붙이고, 켜는 일은
 *   RevealScript 의 '늦은 관찰자'(화면 안으로 12% 들어왔을 때)가 한다. 움직임 값은 app/motion.css.
 *
 * ★ 강조 표시 (한 문자열 안에 섞어 쓴다) — 셋 다 **형광펜 밑줄**: 글자 아래 40% 에 띠가 왼쪽에서 오른쪽으로 그어진다(.em-mark)
 *     ==필요한 치료==  ·  [[한 번 더]]  ·  __가장 좋습니다__
 *   이력: 손그림 원·옅은 형광펜(1차) → 글자색 번짐(2차, "너무 안 보인다") → 형광펜 밑줄(3차, 오너 "밑줄치는 그런거").
 *   표시 세 가지는 이제 모양이 같다 — 호출하는 쪽을 안 고쳐도 되게 문법만 남겼다.
 *   ⚠️ 표시는 문구를 바꾸지 않는다 — 글자는 원문 그대로, 띠만 얹는다(의료광고 문구 검토를 다시 받을 일이 없다).
 *   ⚠️ 짝이 안 맞는 표시는 글자로 남는다. 한 줄(line) 안에서 여닫을 것.
 */
const TOKEN = /(\[\[.+?\]\]|==.+?==|__.+?__)/g;

type Seg = { kind: 'plain' | 'mark'; text: string };

export function parseEm(text: string): Seg[] {
  return text
    .split(TOKEN)
    .filter(Boolean)
    .map((t) =>
      (t.startsWith('[[') && t.endsWith(']]')) ||
      (t.length > 4 && ((t.startsWith('==') && t.endsWith('==')) || (t.startsWith('__') && t.endsWith('__'))))
        ? { kind: 'mark' as const, text: t.slice(2, -2) }
        : { kind: 'plain' as const, text: t },
    );
}

/** 강조 표시를 뺀 맨 글자 — aria-label·검색 요약에 쓴다. */
export const plainText = (text: string) => parseEm(text).map((s) => s.text).join('');

/** 문자열 → 강조가 입혀진 조각들. delay 는 형광펜이 그어지기 시작하는 때(ms, 요소가 켜진 뒤). */
export function Em({ text, delay = 0 }: { text: string; delay?: number }) {
  const segs = parseEm(text);
  const style = delay ? ({ ['--ed' as string]: `${delay}ms` } as CSSProperties) : undefined;
  return (
    <>
      {segs.map((s, i) =>
        s.kind === 'plain' ? (
          <Fragment key={i}>{s.text}</Fragment>
        ) : (
          <span key={i} className="em em-mark" style={style}>
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
 * 형광펜은 줄이 다 올라온 뒤(emDelay) 그어진다.
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
 * ★ 강조([[…]] 등)는 그 글자들을 span.em-mark 로 감싸고, 마지막 글자가 선 뒤(markAt) 형광펜 밑줄이 그어진다.
 *   띠는 감싼 span 의 배경이라 글자가 떠오르는 동안(opacity·filter)에도 영향이 없다.
 */
export function Chars({
  lines,
  start = 0,
  step = 45,
  markGap = 260,
}: {
  lines: readonly string[];
  start?: number;
  step?: number;
  /** 마지막 글자가 선 뒤 형광펜이 그어지기까지(ms). */
  markGap?: number;
}) {
  let n = -1;
  const total = lines.reduce((a, l) => a + [...plainText(l)].filter((c) => c !== ' ').length, 0);
  const markAt = start + total * step + markGap;
  const chars = (t: string) =>
    [...t].map((ch, j) => {
      if (ch === ' ') return ' ';
      n += 1;
      return (
        <span key={j} className="ch" style={{ ['--d' as string]: `${start + n * step}ms` } as CSSProperties}>
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
      else
        out.push(
          <span key={key} className="em em-mark em-now" style={{ ['--ed' as string]: `${markAt}ms` } as CSSProperties}>
            {chars(s.text)}
          </span>,
        );
    });
  });
  return <>{out}</>;
}

/**
 * 낱말 짙어짐 — 문장이 화면을 지나는 만큼 낱말이 앞에서부터 차례로 짙어진다(광화문 선치과 문단 강조를 옮김, 2026-09-29).
 * 부모에 `words` 클래스 + `data-words` 를 붙인다. 숫자는 ScrollMotion 이 쓴다(.w → .on).
 * ★ 흐린 상태는 html.mo-on(스크립트가 돌 때)에서만 — 자바스크립트가 없거나 움직임 줄이기면 처음부터 다 짙다.
 * ⚠️ 낱말 사이 공백은 span **바깥**에 둔다. 안에 넣으면 기계가 읽는 문장이 붙어 버린다(SectionHead 어절 가면과 같은 이유).
 */
export function Words({ text }: { text: string }) {
  const ws = text.split(' ').filter(Boolean);
  return (
    <>
      {ws.map((w, i) => (
        <Fragment key={i}>
          <span className="w">{w}</span>
          {i < ws.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
}
