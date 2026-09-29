import { Fragment, type CSSProperties, type ReactNode } from 'react';

/*
 * ★★ 모션 조각 — 문구 강조 · 줄 가림막 · 글자 떠오름 · 낱말 짙어짐 ★★
 *   (2026-09-29 오너: "모션그래픽 엄청 넣어줘" + "문구 강조도" → 같은 날 "문구 강조는 색감이나 진중한 모션으로")
 *
 *   전부 **서버 컴포넌트**다. 클래스와 지연값(--d · --ld · --ed · --td)만 붙이고, 켜는 일은
 *   RevealScript 의 '늦은 관찰자'(화면 안으로 12% 들어왔을 때)가 한다. 움직임 값은 app/motion.css.
 *
 * ★ 강조 표시 (한 문자열 안에 섞어 쓴다)
 *     ==필요한 치료==   글자색이 왼쪽에서 오른쪽으로 천천히 블루그레이로 번진다(.em-tone).
 *     [[한 번 더]]      위와 같다 — 예전 '손그림 동그라미' 자리. 표시는 남겨 호출하는 쪽을 안 고쳐도 되게 했다.
 *     __가장 좋습니다__ 색이 번진 뒤 가는 선(1px)이 밑에 그어진다(.em-line).
 *   손그림 원·형광펜은 뺐다 — 오너: "진중한 모션으로". 색 하나와 가는 선만 쓴다.
 *   ⚠️ 표시는 문구를 바꾸지 않는다 — 글자는 원문 그대로, 색만 얹는다(의료광고 문구 검토를 다시 받을 일이 없다).
 *   ⚠️ 짝이 안 맞는 표시는 글자로 남는다. 한 줄(line) 안에서 여닫을 것.
 */
const TOKEN = /(\[\[.+?\]\]|==.+?==|__.+?__)/g;

type Seg = { kind: 'plain' | 'tone' | 'line'; text: string };

export function parseEm(text: string): Seg[] {
  return text
    .split(TOKEN)
    .filter(Boolean)
    .map((t) =>
      t.startsWith('[[') && t.endsWith(']]')
        ? { kind: 'tone' as const, text: t.slice(2, -2) }
        : t.startsWith('==') && t.endsWith('==') && t.length > 4
          ? { kind: 'tone' as const, text: t.slice(2, -2) }
          : t.startsWith('__') && t.endsWith('__') && t.length > 4
            ? { kind: 'line' as const, text: t.slice(2, -2) }
            : { kind: 'plain' as const, text: t },
    );
}

/** 강조 표시를 뺀 맨 글자 — aria-label·검색 요약에 쓴다. */
export const plainText = (text: string) => parseEm(text).map((s) => s.text).join('');

/**
 * 문자열 → 강조가 입혀진 조각들. delay 는 색이 번지기 시작하는 때(ms, 요소가 켜진 뒤).
 * ★ 가는 선(.em-line)은 바깥 span 이 선을, 안쪽 .em-ink 가 글자색을 맡는다 — 한 요소에 두면
 *   background-clip:text 가 선까지 글자 모양으로 잘라 버린다.
 */
export function Em({ text, delay = 0 }: { text: string; delay?: number }) {
  const segs = parseEm(text);
  const style = delay ? ({ ['--ed' as string]: `${delay}ms` } as CSSProperties) : undefined;
  return (
    <>
      {segs.map((s, i) =>
        s.kind === 'plain' ? (
          <Fragment key={i}>{s.text}</Fragment>
        ) : s.kind === 'line' ? (
          <span key={i} className="em em-line" style={style}>
            <span className="em-ink">{s.text}</span>
          </span>
        ) : (
          <span key={i} className="em em-tone" style={style}>
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
 * 강조는 줄이 다 올라온 뒤(emDelay) 번진다.
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
 * ★ 강조([[…]] · ==…==) 글자는 마지막 글자가 선 뒤(toneAt) **한 글자씩 차례로** 색이 바뀐다(--td).
 *   다른 곳처럼 background-clip 으로 번지게 하면, 떠오르는 동안(opacity·filter) 글자가 그 틀에서 빠져 안 보인다.
 */
export function Chars({
  lines,
  start = 0,
  step = 45,
  toneGap = 260,
  toneStep = 90,
}: {
  lines: readonly string[];
  start?: number;
  step?: number;
  /** 마지막 글자가 선 뒤 강조 색이 번지기 시작하기까지(ms). */
  toneGap?: number;
  /** 강조 글자끼리 색이 바뀌는 간격(ms). */
  toneStep?: number;
}) {
  let n = -1;
  let k = -1;
  const total = lines.reduce((a, l) => a + [...plainText(l)].filter((c) => c !== ' ').length, 0);
  const toneAt = start + total * step + toneGap;
  const chars = (t: string, em: boolean) =>
    [...t].map((ch, j) => {
      if (ch === ' ') return ' ';
      n += 1;
      if (em) k += 1;
      const style = { ['--d' as string]: `${start + n * step}ms` } as Record<string, string>;
      if (em) style['--td'] = `${toneAt + k * toneStep}ms`;
      return (
        <span key={j} className={em ? 'ch ch-em' : 'ch'} style={style as CSSProperties}>
          {ch}
        </span>
      );
    });
  const out: ReactNode[] = [];
  lines.forEach((l, li) => {
    if (li) out.push(<br key={`br${li}`} />);
    parseEm(l).forEach((s, si) => {
      out.push(<Fragment key={`${li}-${si}`}>{chars(s.text, s.kind !== 'plain')}</Fragment>);
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
