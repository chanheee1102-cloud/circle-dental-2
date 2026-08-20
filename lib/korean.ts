/**
 * 한국어 조사 처리.
 *
 * ★★ 왜 필요한가 (2026-08-20 실측에서 잡음) ★★
 *   질환 페이지 제목을 `${name}란 무엇인가요?` 로 찍었더니
 *     "치아우식증란 무엇인가요?"   ← 틀림. '치아우식증이란' 이 맞다
 *   이 문장은 **h1 이자 AI 가 그대로 인용하는 문장**이다. 비문이 그대로 인용된다.
 *
 *   규칙: 앞 글자에 받침이 있으면 '이란/은/을/과', 없으면 '란/는/를/와'.
 *   한글 음절은 유니코드 AC00 부터 28개씩 묶여 있고, (코드-AC00) % 28 이 0이면 받침이 없다.
 *
 * ⚠️ 한글이 아닌 글자(영문·숫자)로 끝나면 판정할 수 없다 — 받침 있는 쪽으로 둔다
 *    ("임플란트" 처럼 외래어도 한글로 적히므로 실무에서는 대부분 잡힌다).
 */
function hasFinalConsonant(word: string): boolean {
  const ch = word.trim().slice(-1);
  const code = ch.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return true; // 한글이 아니면 안전한 쪽으로
  return (code - 0xac00) % 28 !== 0;
}

/** 받침 여부에 따라 조사를 고른다. `josa('충치', '은', '는')` → '는' */
export function josa(word: string, withFinal: string, withoutFinal: string): string {
  return hasFinalConsonant(word) ? withFinal : withoutFinal;
}

/** "치아우식증이란" / "충치란" */
export const iran = (w: string) => `${w}${josa(w, '이란', '란')}`;
/** "치아우식증은" / "충치는" */
export const eunNeun = (w: string) => `${w}${josa(w, '은', '는')}`;
/** "치아우식증을" / "충치를" */
export const eulReul = (w: string) => `${w}${josa(w, '을', '를')}`;
