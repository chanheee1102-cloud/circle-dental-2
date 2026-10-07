/**
 * 한국어 줄바꿈 엔진 — 광화문 선치과(sun-dental components/ui.tsx, 2026-09-29~10-07 확정판)에서 **글자 그대로** 옮겼다 (2026-10-07 오너: "선치과 줄바꿈 규칙으로 전체 점검").
 *   규칙 = 마침표에서 줄을 바꾸고(.sent), 문장 안은 절 쉼표에서(.clause), 나열 쉼표에서는 바꾸지 않으며,
 *   한 줄보다 긴 토막만 말 쉬는 자리(연결어미 > 조사 > 그 밖) 하나를 열고 나머지 공백은 붙임 공백(U+00A0)으로 묶는다.
 * ⚠️ 규칙을 고칠 때는 선치과 쪽과 같이 고칠 것 — 두 사이트가 같은 규칙이어야 오너 기준이 하나다.
 * ⚠️ React 없는 순수 함수만 둔다. 화면 조각(Sentences)은 components/ui.tsx.
 */
export const HL_ON = '\uE000';
export const HL_OFF = '\uE001';
export const HL_RE = /[\uE000\uE001]/g;

/**
 * 문장·마디·쉼 줄바꿈 (오너 규칙, 2026-09-09)
 *  1) 마침표에서 줄을 바꾼다(.sent = block).
 *  2) 문장 안에서는 절 쉼표 마디(.clause)가 통째로 내려간다. 나열 쉼표("수술, 보철, 정기검진")는 마디를 가르지 않는다(isListComma).
 *  3) 마디 안에서는 **말하다 쉬는 자리**(연결어미·조사 뒤)만 보통 공백, 나머지는 붙임 공백(pauseGlue) —
 *     .clause 의 text-wrap: balance 가 쉬는 자리들 가운데 줄 길이가 고른 조합을 고른다(2026-09-29 개편, 옛 .chunk 덩어리 방식 폐기).
 * ★ split 은 경계에서만 자르므로 글자를 잃지 않는다. 좁은 화면에서는 마디를 풀어(inline) 흐르게 두되 붙임 공백은 그대로 지킨다.
 */
/**
 * 쉬는 자리 두 등급 (오너 규칙 보강 2026-09-21: "최대한 마침표·쉼표에서, 균형 맞출 때만 말 쉬는 데서")
 *  - 센 쉼: 연결어미(…하고 | …지만 | …는데) — 절이 갈리는 자리라 여기서 끊어도 말이 안 끊긴다.
 *  - 약한 쉼: 조사(…을 | …에서) — "운동을 | 하기 때문에" 처럼 목적어와 동사가 갈라진다. 센 쉼으로 잘라도
 *    덩어리가 너무 길 때(LONG_MAX)만 보조로 쓴다.
 */
const STRONG_PAUSE_END = /(고|며|면|서|라서|해서|하면|해도|지만|는데|은데|더라도|으며|이며|하고|이고|라면|다가|자마자|니까|므로)$/;
/* '의'(소유격)는 뒷말과 한 덩어리라 쉼 자리에서 뺐다("끝의 | 둥근 부분" 방지) */
const PAUSE_END = /(은|는|이|가|을|를|에|에서|으로|로|과|와|도|고|며|면|서|까지|부터|처럼|보다|에게|한테|마다|조차|이나|나|든|라서|해서|하면|해도|지만|는데|은데|더라도|으며|이며|하고|이고|라면|이라|다가|자마자|니까|므로)$/;
/** 앞말과 한 덩어리로 읽히는 낱말 — 이 앞에서는 끊지 않는다("오차로 | 인해", "가지고 | 있고" 방지) */
const NO_BREAK_BEFORE = /^(인해|인한|통해|통한|위해|위한|위해서|의해|의한|대해|대한|대해서|따라|따른|따라서|비해|비하면|걸쳐|관해|관한|더불어|이상|이하|이내|정도|만큼|때문|때문에|덕분|덕분에|이후|이전|동안|사이|뒤|후|전|중|안|밖|없이|없는|없어|없고|없다|없으며|없기|있는|있어|있을|있고|있다|있으며|있어서|있으면|있기|있습니다|없습니다|않고|않는|않은|않아|않으면|못한|못하는|것|수|줄|지|때|데|적|뿐|아니라|아니고|아닌|아닙니다|주는|주고|주며|주면|줍니다|주세요|주시면|주시기|드립니다|드리고|드리며|드려|드리는|드릴|봅니다|보세요|보시면|보시길|두고|둡니다|등|및|또는|혹은|그리고|그래서|하지만|다른|같은|위|아래|옆)$/;
/** 뒷말을 꾸미는 낱말 — 이 뒤에서는 끊지 않는다("볼 베어링 같은 | 구조로" 방지). 관형사·관형형·부사 몇 개 */
const NO_BREAK_AFTER = /^(같은|다른|이런|그런|저런|어떤|모든|여러|각|매|새|첫|두|세|네|한|그|이|저|및|또는|혹은|가장|더|덜|안|못|바로|아주|매우|너무|약|총|전|후|약간|다소|주로|대개|대부분|거의|보다|훨씬|꼭|늘|자주|다시|먼저|미리|함께)$/;
/** 관형형 어미로 끝나는 낱말 — 뒤의 명사를 꾸미므로 뒤에서 끊지 않는다("돌아가는 | 운동", "많은 | 사람" 방지) */
const NO_BREAK_AFTER_END = /(하는|되는|가는|오는|지는|나는|보는|주는|받는|이는|리는|르는|치는|우는|내는|키는|시는|하던|되던|작은|많은|적은|높은|낮은|좋은|나쁜|넓은|좁은|깊은|짧은|젊은|밝은|굵은|얇은|굳은|굽은|틀어진|벗어난|눌린|밀린|남은|둥근|[가-힣]된|[가-힣]한|적인|스러운|[가-힣]할|[가-힣]될|[가-힣]인|있는|없는|않는|않은)$/;
/** "사소하고 | 다양한 원인", "딱딱하고 | 질긴 음식" — '고' 로 이어진 꾸밈말 짝은 안 가른다 */
const COORD_MODIFIER = /(한|된|스러운|적인|긴|운|는|은|진|린|든)$/;
/** 앞말에 붙어 읽히는 뒷말 꼴 — "자기도 | 모르게", "…을 | 싣는" 방지 */
const NO_BREAK_BEFORE_END = /(게|듯|채)$/;
const OBJECT_MARK = /(을|를)$/;
const VERB_LIKE = /(는|은|던|을|고|며|면|서|해|여|아|어|다|지|게|기|려|러|니다|습니다)$/;
/** 쉼표 앞(또는 뒤) 조각이 이보다 짧으면 나열(소리, 통증, 개구 제한)로 본다 */
const ENUM_MAX = 8;
/** 서술 없는 명사구가 이 길이 이하면 나열 항목으로 본다("모의 식립과 수술 가이드,") */
const ENUM_PHRASE_MAX = 16;
/** 쉼표 앞 낱말이 연결어미로 끝나면 **절이 갈리는 쉼표**(…하고, …지만,) — 줄을 바꿔도 되는 첫째 자리 */
const CLAUSE_COMMA_END = /(고|며|면|서|해|여|지만|는데|은데|더라도|으며|이며|니|듯|도|게|거나|든지|면서|려고|다가|도록|므로|니까)$/;
/** 문장 머리 부사 뒤 쉼표("또한," "특히,")는 뒷말에 붙인다 — 한 낱말만 한 줄에 서지 않게 */
const LEAD_ADVERB = /^(또한|특히|다만|그리고|그래서|하지만|그러나|즉|이때|반면|따라서|한편|물론|대신|예를 들어|그러므로|이처럼)$/;
/** 서술이 든 낱말(관형형·연결어미·종결·주제) — 나열 항목은 보통 명사구라 이것이 없다 */
const PREDICATE_END = /(는|은|던|인|된|진|온|린|난|적인|하고|하며|하여|해|고|며|서|면|다|니다|요)$/;

/**
 * 나열 쉼표의 종류 (오너 2026-09-21 "나열되는 쉼표마다 줄바꿈하지 말고" · 2026-09-29 재지적).
 *   'hard' = 짧은 나열("수술, 보철, 정기검진")·문장 머리 부사("또한,") — 여기서는 줄을 바꾸지 않는다.
 *   'long' = 항목 자체가 긴 명사구 나열("모의 식립과 수술 가이드, CAD/CAM 보철 제작까지") — 조사 등급의 쉼 자리로만 친다.
 *   null   = 절 쉼표(…하고, …지만,)·긴 동격("…지켜온 광화문 선치과,") — 쉼 자리 가운데 1순위.
 *   예전엔 '쉼표 앞 조각이 8자 이하'만 봐서 "첫 상담부터 수술, | 보철," 처럼 첫 항목 앞에 다른 말이 붙으면 나열을 못 알아봤다.
 * before = 앞 쉼표(또는 마디 머리)부터 이 쉼표까지, after = 이 쉼표 뒤부터 다음 쉼표(또는 끝)까지.
 */
export function listCommaKind(before: string, after: string, single = false): 'hard' | 'long' | null {
  const b = before.replace(/[,，]\s*$/, '').trim();
  const last = strip(b.split(/\s+/).pop() ?? '');
  if (LEAD_ADVERB.test(b)) return 'hard';
  if (CLAUSE_COMMA_END.test(last)) return null;
  /* '·' 로 이미 나열한 뒤의 쉼표는 나열을 닫는 쉼표다("관절잡음·개구장애·턱 통증, 원인부터…") */
  if (/[·ㆍ]/.test(b)) return null;
  const a = after.replace(/[,，]\s*$/, '').trim();
  /*
   * 쉼표가 **하나뿐**이고 뒤가 서술(절)이면 나열이 아니다 — "어금니 임플란트, 뼈가 부족하다면?" "서울 중구 세종대로, 광화문역 … 의원입니다."
   * 나열은 보통 쉼표가 둘 이상(수술, 보철, 정기검진)이다. 이걸 짧은 나열로 잘못 봐서 제목 전체가 붙어 버렸고,
   * 폰에서 칸을 넘치자 브라우저가 물음표만 다음 줄로 떼어 냈다(2026-09-29).
   */
  if (single && a.split(/\s+/).some((w) => { const x = strip(w); return x.length >= 2 && PREDICATE_END.test(x); })) return null;
  if (a.length <= ENUM_MAX || b.length <= ENUM_MAX) return 'hard';
  const predicate = b.split(/\s+/).some((w) => { const x = strip(w); return x.length >= 2 && PREDICATE_END.test(x); });
  if (b.length <= ENUM_PHRASE_MAX && !predicate) return 'long';
  return null;
}
/** 나열 쉼표면 마디를 가르지 않는다(splitClauses) */
const isListComma = (before: string, after: string, single = false) => listCommaKind(before, after, single) !== null;

/** 여는 괄호 − 닫는 괄호 — 0 보다 크면 괄호 안 */
function parenDelta(s: string): number {
  return (s.match(/[(（[]/g)?.length ?? 0) - (s.match(/[)）\]]/g)?.length ?? 0);
}

/**
 * 쉼표 마디 나누기 — 괄호 안의 쉼표에서는 나누지 않는다.
 * "(환자의 자발적 호흡, 외부에 반응)" 이 쉼표에서 두 줄로 갈라졌다(오너 지적 2026-09-11).
 */
export function splitClauses(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    cur += ch;
    depth += parenDelta(ch);
    if (ch === ',' && depth <= 0 && /^\s+\S/.test(s.slice(i + 1))) {
      out.push(cur.trim());
      cur = '';
    }
  }
  if (cur.trim()) out.push(cur.trim());
  /*
   * 나열 쉼표는 마디 경계가 아니다 (오너 2026-09-21: "나열되는 쉼표마다 줄바꿈하지 말고").
   * 나열이면(isListComma) 다음 조각에 붙여 한 마디로 둔다. 판정은 **바로 앞 조각**만 본다(합친 덩어리 전체가 아니라).
   */
  const merged: string[] = [];
  for (let k = 0; k < out.length; k++) {
    const prevRaw = out[k - 1];
    if (merged.length && prevRaw && prevRaw.endsWith(',') && isListComma(prevRaw, out[k], out.length === 2)) merged[merged.length - 1] += ` ${out[k]}`;
    else merged.push(out[k]);
  }
  return merged;
}

const strip = (w: string) => w.replace(HL_RE, '').replace(/[,.!?…)”’"']+$/, '');

/** 낱말 배열을 쉼 자리(pause 판정)에서 덩어리로 — 괄호 안·꾸밈말 뒤·붙는 말 앞에서는 쉬지 않는다 */
/** 두 낱말 사이를 끊어도 되는가 — 꾸밈말 뒤·붙는 말 앞·소유격 뒤·'고' 짝·목적어+동사는 안 된다 */
function canBreakBetween(w: string, next: string, prev = ''): boolean {
  const bare = strip(w);
  const nx = strip(next);
  /* 목적어 뒤의 -는/-은 은 조사가 아니라 뒤 명사를 꾸미는 말("턱을 괴는 | 자세", "음식을 즐기는 | 식습관") */
  if (prev && OBJECT_MARK.test(strip(prev)) && /[는은]$/.test(bare) && !/[,，]$/.test(w)) return false;
  if (NO_BREAK_AFTER.test(bare) || NO_BREAK_AFTER_END.test(bare) || /의$/.test(bare)) return false;
  if (NO_BREAK_BEFORE.test(nx) || NO_BREAK_BEFORE_END.test(nx)) return false;
  /* "…와 함께" 는 한 덩어리, "습관이 | 함께 얽혀" 는 끊어도 된다 — 함께·같이 앞은 와·과 뒤일 때만 막는다(09-29) */
  if (/^(함께|같이)$/.test(nx) && /[와과]$/.test(bare)) return false;
  /* "6번 | 출구", "도보 | 2분" — 길 안내 숫자 묶음은 한 덩어리 (2026-09-29 꼬리말) */
  if (/\d+번$/.test(bare) && /^출구/.test(nx)) return false;
  if (/^(도보|차로|걸어서)$/.test(bare) && /^\d/.test(nx)) return false;
  if (/(고|거나)$/.test(bare) && COORD_MODIFIER.test(nx)) return false;
  /* 목적어와 그것을 받는 동사("힘을 싣는", "구조를 가지고", "치료를 시작합니다")는 한 덩어리 */
  if (OBJECT_MARK.test(bare) && VERB_LIKE.test(nx)) return false;
  /* 목적어 + 받침 ㄴ·ㄹ 로 끝나는 꾸밈 동사("면허를 가진", "치아를 살릴")도 한 덩어리 (2026-09-29) */
  const lastCh = nx.charCodeAt(nx.length - 1) - 0xac00;
  if (OBJECT_MARK.test(bare) && nx.length >= 2 && lastCh >= 0 && lastCh < 11172 && [4, 8].includes(lastCh % 28)) return false;
  return true;
}

/** 마디 안의 나열 쉼표 자리와 종류(괄호 안 쉼표는 'hard') */
function listCommaKinds(words: string[]): Map<number, 'hard' | 'long'> {
  const at = new Map<number, 'hard' | 'long'>();
  let segStart = 0;
  let depth = 0;
  let d0 = 0;
  const single = words.filter((w) => { d0 += parenDelta(w); return d0 <= 0 && /[,，]$/.test(w); }).length === 1;
  for (let i = 0; i < words.length; i++) {
    depth += parenDelta(words[i]);
    if (!/[,，]$/.test(words[i])) continue;
    if (depth > 0) { at.set(i, 'hard'); continue; }
    let j = i + 1;
    while (j < words.length - 1 && !/[,，]$/.test(words[j])) j++;
    const kind = listCommaKind(words.slice(segStart, i + 1).join(' '), words.slice(i + 1, j + 1).join(' '), single);
    if (kind) at.set(i, kind);
    segStart = i + 1;
  }
  return at;
}

/** 글자 폭 어림(em) — Pretendard 실측: 한글·한자 ≈1(15자+문장부호가 263px@15.5px 에 꽉 참), 라틴·숫자 0.55, 공백 0.28, 문장부호 0.3 */
function emWidth(t: string): number {
  let w = 0;
  for (const ch of t) w += ch === HL_ON || ch === HL_OFF ? 0 : /[ㄱ-ㆎ가-힣一-鿿]/.test(ch) ? 1 : /[A-Za-z0-9]/.test(ch) ? 0.55 : /\s/.test(ch) ? 0.28 : 0.3;
  return w;
}
/**
 * 이 길이를 넘는 토막에만 쉼 자리를 하나 더 연다. 홈 강점 카드 글 칸이 263px(15.5px 글씨 ≈ 17em) — 그 안에 여유 있게 들어가는 길이.
 * ⚠️ 본문이 keep-all 이라 열린 자리가 없는 긴 토막은 좁은 칸에서 가로로 넘친다. 이 값을 크게 올리지 말 것.
 */
const RUN_MAX_EM = 15.5;
/** '치의학과'·'보철과' 처럼 과(科)로 끝나는 이름은 조사 '과' 가 아니다 */
const NOT_PARTICLE = /(학과|보철과|보존과|교정과|내과|외과|치과|안과|피부과)$/;
/** 쉼 자리 등급별 벌점(em) — 절 쉼표 0 < 연결어미 2 < 조사·긴 나열 쉼표 4 < 그냥 끊어도 되는 공백 8 < 마지막 수단 14 */
const TIER_PENALTY = [0, 2, 4, 8, 14];
/** 붙여 쓴 가운뎃점·빗금("소독·밀폐", "CAD/CAM")을 앞뒤 글자와 묶는다(U+2060) — 줄바꿈 규칙을 안 거치는 표 칸 글용. "다시 소독 / ·밀폐하는" 처럼 점 앞에서 꺾였다(09-29 점검). */
const WJ = String.fromCharCode(0x2060);
export const keepDots = (s: string) =>
  s
    .replace(/([^\s])([·ㆍ])(?=[^\s])/g, `$1${WJ}$2`) // 가운뎃점은 앞 글자에만 묶는다 — 점 뒤에서 줄이 바뀌는 건 괜찮다("…개구장애· / 저작근 통증,")
    .replace(/([^\s])(\/)(?=[^\s])/g, `$1${WJ}$2${WJ}`); // 빗금은 앞뒤 모두("CAD/CAM")
/** 띄어 쓴 나열 구분 기호 한 글자("A · B", "A | B") */
const SEPARATOR = /^[·ㆍ|/–—]$/;

/**
 * ★★ 줄바꿈 자리는 '꼭 필요한 만큼만, 좋은 순서대로' 연다 (오너 규칙 2026-09-09 → 09-21 → 09-29) ★★
 *   오너: "나열되는 쉼표에서 전부 하지 말고, 최대한 길이 균형 맞춰서 말 쉬는 텀에 줄바꿈 하되 쉼표나 마침표 쪽에서 하면 좋다."
 *   · 마침표 = 문장(.sent, block) 경계라 늘 갈린다.
 *   · 절 쉼표(…하고, …지만,) = 늘 연다.
 *   · 그 사이 토막이 한 줄(RUN_MAX_EM)보다 길 때만, 가운데에 가깝고 등급이 좋은 자리(연결어미 > 조사 > 그 밖) 하나를 열고 양쪽을 다시 본다.
 *   · 나머지 공백은 전부 붙임 공백(U+00A0) — 브라우저는 열린 자리에서만 줄을 바꾸고, .clause 의 text-wrap: balance 가 그중 고른 조합을 고른다.
 * ★ 쉬는 자리를 모두 열어 두면 브라우저 balance 가 "원판이 앞으로 | 밀리고," 처럼 쉼표를 두고 엉뚱한 조사에서 갈랐다(09-29 실측 986마디 비교).
 * ★ 옛 방식(앞에서부터 덩어리를 채워 inline-block)은 글자 수로 재 한글 폭을 못 맞췄고, 칸보다 넓은 덩어리는 브라우저가 아무 공백에서나 꺾었다.
 * ⚠️ 짧은 나열 쉼표·꾸밈말 뒤·붙는 말 앞·괄호 안은 마지막 수단(등급 4) — 다른 자리가 전혀 없을 때만.
 */
/** maxEm — 붙임 덩어리 최대 길이. 큰 제목(글씨가 커 한 줄에 드는 글자 수가 적다)은 짧게 준다 */
export function pauseGlue(clause: string, maxEm = RUN_MAX_EM): string {
  const words = clause.split(/\s+/).filter(Boolean);
  if (words.length < 2) return clause.trim();
  const n = words.length - 1;
  const lists = listCommaKinds(words);
  /* 공백마다 등급 — 0 절 쉼표 · 1 연결어미 · 2 조사·긴 나열 쉼표 · 3 끊어도 되는 공백 · 4 마지막 수단 */
  const tier = new Array<number>(n);
  let depth = 0;
  for (let i = 0; i < n; i++) {
    depth += parenDelta(words[i]);
    const bare = strip(words[i]);
    const kind = lists.get(i);
    if (depth > 0 || kind === 'hard' || !canBreakBetween(words[i], words[i + 1], words[i - 1])) tier[i] = 4;
    else if (/[,，]$/.test(words[i])) tier[i] = kind === 'long' ? 2 : 0;
    else if (STRONG_PAUSE_END.test(bare)) tier[i] = 1;
    /* 명사를 잇는 '와·과'("뼈와 신경의")는 조사보다 약한 쉼 — 이것만 남았을 때 쓴다 */
    else if (/[와과]$/.test(bare) && !NOT_PARTICLE.test(bare)) tier[i] = 3;
    else if (PAUSE_END.test(bare) && !NOT_PARTICLE.test(bare)) tier[i] = 2;
    else tier[i] = 3;
  }
  /* 나열 구분 기호(" · ", " | ", " / ") 앞 공백은 절대 열지 않는다 — 열면 "· 대한 구강…", "· 토요일" 처럼 점이 줄 첫머리에 떨어졌다(09-29 전체 점검).
     기호 뒤 공백은 긴 나열 쉼표와 같은 등급(2)으로 둔다. */
  const glued = new Array<boolean>(n).fill(false);
  for (let i = 0; i < n; i++) {
    if (SEPARATOR.test(words[i + 1])) { glued[i] = true; tier[i] = 4; }
    if (SEPARATOR.test(words[i]) && tier[i] > 2) tier[i] = 2;
  }
  const open = tier.map((t, i) => t === 0 && !glued[i]);
  const width = (a: number, b: number) => emWidth(words.slice(a, b + 1).join(' '));
  const openIn = (a: number, b: number) => {
    const total = width(a, b);
    if (b <= a || total <= maxEm) return;
    let best = a;
    let bestScore = Infinity;
    for (let i = a; i < b; i++) {
      if (glued[i]) continue;
      const score = Math.abs(width(a, i) - total / 2) + TIER_PENALTY[tier[i]];
      if (score < bestScore) { bestScore = score; best = i; }
    }
    open[best] = true;
    openIn(a, best);
    openIn(best + 1, b);
  };
  let start = 0;
  for (let i = 0; i <= n; i++) {
    if (i === n || open[i]) { openIn(start, i); start = i + 1; }
  }
  /* 가운뎃점·빗금 앞뒤는 단어 잇기표(U+2060)로 묶는다 — keep-all 이어도 '뼈 | ·신경', 'CAD/ | CAM' 처럼 꺾였다(09-29 실측) */
  const join = (w: string) => w.replace(/([^\s])([·ㆍ/])(?=[^\s])/g, '$1⁠$2⁠');
  return words.map((w, i) => (i === 0 ? join(w) : (open[i - 1] ? ' ' : ' ') + join(w))).join('');
}

/**
 * 문장 나누기 — 마침표·물음표·느낌표(뒤따르는 닫는 따옴표·괄호까지) 다음 공백에서 자른다.
 * 예전 정규식은 `?"` 처럼 닫는 따옴표가 붙으면 못 잘랐다("…건가요?" "뼈에…" 가 한 문장으로 이어짐, 2026-09-29).
 * "1. " 같은 번호, 말줄임표(...)는 문장 끝이 아니다.
 */
export function splitSentences(text: string): string[] {
  const out: string[] = [];
  /* 뒤가 '(' 면 앞 문장의 덧붙임("…없습니다. (확인 후 식립)")이라 자르지 않는다 */
  const re = /([.!?])(["'”’)\]\uE001]*)\s+(?=[^\s(])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const before = text.slice(last, m.index);
    if (m[1] === '.' && (/(^|\s)\d{1,2}$/.test(before) || /[.…]$/.test(before))) continue;
    out.push(text.slice(last, m.index + m[1].length + m[2].length).trim());
    last = re.lastIndex;
  }
  out.push(text.slice(last).trim());
  return out.filter(Boolean);
}
