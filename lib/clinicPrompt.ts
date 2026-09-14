import { readFile, commitFiles } from './github';

/**
 * 담당자 프롬프트 — 이 병원의 글·사진 규칙 두 칸을 저장소 content/clinic-prompt.json 에 둔다.
 *
 * ★★ 칸이 둘인 이유 (2026-09-14 오너: "이미지 프롬프트, 글 프롬프트 두 개? 제목까지 세 개?") ★★
 *   제목은 본문과 같은 말투를 써야 한다. 칸을 셋으로 나누면 "1인칭 원장 시점" 을 두 칸에 적게 되고,
 *   두 칸이 어긋났을 때 어느 쪽이 이기는지가 모호해진다. 그래서 **글·제목은 한 칸**이다.
 *   제목만의 요청은 그 칸에 한 줄 적으면 그대로 먹는다 — 기본값 첫 줄이 이미 제목 규칙이다.
 *
 * ★★ 기본값 = 지금까지 코드에 박혀 있던 프롬프트 그대로 (2026-09-14 오너: "고정적으로 항상 붙는
 *   프롬프트들도 칸에 미리 넣어둬. 수정해서 바꿀 수 있게") ★★
 *   전에는 "사람 안 나오게" 가 lib/adminImage.ts 에 박혀 있어서, 마케터가 무엇을 적어도 뒤에서 막혔다.
 *   지금은 그 문장이 IMAGE_DEFAULT 의 한 줄이다 — 지우면 사람이 나온다. 이것이 이 기능의 핵심이다.
 *
 * ⚠️ 그래도 칸에서 못 여는 것 셋 (코드에 잠겨 있고, 칸을 비워도 늘 붙는다):
 *     1) 의료법 제56조 낱말 — adminDraft 의 하드코딩 블록 + 결정론 검사(medlaw)
 *     2) 사진의 얼굴·입·환부·피·치료 전후 — adminImage 의 IMAGE_FLOOR
 *     3) 출력 구조(HTML 태그 화이트리스트·JSON 스키마) — adminDraft 의 normalize
 *   칸은 취향을 정하는 자리고, 이 셋은 병원을 지키는 자리다. 섞지 말 것.
 *
 * ★ 왜 저장소 파일인가 — 무인 발행 크론(/api/cron/blog)에는 브라우저가 없다. localStorage 에 두면
 *   사람이 쓸 때만 반영되고 자동으로 올라간 글은 병원 말투를 잃는다. (content/auto-blog.json 과 같은 방식)
 * ★ 사이트가 그릴 때 읽는 파일이 아니라 **API 가 요청마다 읽는** 파일이다(github.readFile, no-store).
 *   그래서 저장하면 다음 글부터 바로 적용된다 — content/central-hidden.json 처럼 빌드를 기다리지 않는다.
 * ⚠️ content/blog/ 안에 두지 않는다 — lib/blog.ts 가 그 폴더의 *.json 을 전부 글로 읽는다.
 */
export const CLINIC_PROMPT_PATH = 'content/clinic-prompt.json';

/** 한 칸당 글자 수 상한. 규칙 한 칸이 프롬프트 전체를 밀어낼 만큼 길어지면 안 된다. */
export const PROMPT_MAX = 2000;

/**
 * 글·제목 기본값 — 2026-09-14 이전 draftPrompt 의 '반드시 지킬 형식' 블록을 그대로 옮긴 것.
 * ⚠️ 여기를 고치면 **아직 한 번도 저장하지 않은 병원**의 글이 바뀐다. 저장한 병원은 저장값이 이긴다.
 */
export const WRITING_DEFAULT = [
  '대표원장이 환자에게 설명하듯 1인칭으로 씁니다. 말투는 "~합니다 / ~입니다" 이고, 환자는 "분" 으로 부릅니다.',
  '제목은 환자가 실제로 묻는 질문 문장 하나로 씁니다 (예: "임플란트를 심고 며칠 뒤부터 씹어도 되나요?"). 낚시·과장은 쓰지 않습니다.',
  '첫 문단에서 결론을 먼저 말합니다. "결론부터 말씀드리면" 같은 직답 신호를 첫 문단에 둡니다.',
  '그다음 소제목 셋에서 다섯으로 이유·상황·주의를 풀고, 마지막 문단은 짧게 정리합니다.',
  '본문은 HTML 이고 <p> <h2> <h3> <strong> <a> 만 씁니다. <ul> <ol> <li> <table> <img> <h1> 과 마크다운(**, ##, -)은 쓰지 않습니다.',
  '항목을 나열하고 싶으면 줄을 바꾸지 말고 문장으로 잇습니다 ("또한 / 한편 / 특히 / 다만").',
  '본문 길이는 공백 포함 1,400~2,200자. 한 문단은 서너 문장.',
  '숫자·기간은 "대개 / 보통 / 경우가 많습니다" 로 폭을 두고, 개인차가 있음을 자연스럽게 담습니다.',
  '건강보험·법·제도 같은 사실은 확신이 없으면 "치과에서 확인해 드립니다" 로 두고 숫자를 지어내지 않습니다.',
].join('\n');

/**
 * 사진 기본값 — 2026-09-14 이전 adminImage 의 LOOK 을 한국어로 옮긴 것 (사이트의 다른 AI 사진과 같은 결).
 * ★ 다섯째 줄이 "사람은 나오지 않습니다" 다. 사람이 나오는 사진을 원하면 그 줄을 고치면 된다.
 */
export const IMAGE_DEFAULT = [
  '밝고 정돈된 치과. 흰 상판, 임상적인 주광, 부드러운 그림자.',
  '흰색과 옅은 회색 위주에, 배경에 따뜻한 베이지를 한 톤만 둡니다.',
  '접사 사진처럼 얕은 심도로, 차분하고 전문적으로.',
  '리넨 천·말린 꽃·투박한 도자기는 쓰지 않습니다.',
  '사람은 나오지 않습니다. 손·얼굴·신체 일부도 넣지 않습니다.',
].join('\n');

export type ClinicPrompt = {
  /** 글·제목 규칙 — 말투·시점·구성·길이. */
  writing: string;
  /** 사진 규칙 — 무엇이 어떻게 찍혀야 하는지. */
  image: string;
  /** 마지막 저장 시각(한국 시간, 표시용). */
  updatedAt?: string;
};

export const CLINIC_PROMPT_DEFAULT: ClinicPrompt = { writing: WRITING_DEFAULT, image: IMAGE_DEFAULT };

/** 줄바꿈을 고르고 앞뒤 공백을 털고 상한으로 자른다. 서버가 마지막으로 자르는 자리다. */
export function cleanPrompt(v: unknown): string {
  return String(v ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, PROMPT_MAX);
}

/**
 * 저장소에서 읽는다.
 * ★ 파일이 없으면(= 한 번도 저장한 적 없으면) **기본값** 이다 — 지금까지와 똑같이 쓴다.
 * ★ 파일이 있으면 저장값이 이긴다. 마케터가 칸을 비우고 저장했다면 그 빈 칸이 진실이다
 *   ("저장하면 그대로 반영" — 2026-09-14 오너). 화면에 '기본값으로 되돌리기' 를 둬서 언제든 돌아온다.
 * ⚠️ 토큰이 없거나 GitHub 가 답을 못 주면 기본값으로 간다(fail-open). 글쓰기가 멈추는 것보다 낫다.
 */
export async function readClinicPrompt(token: string | null | undefined): Promise<ClinicPrompt & { saved: boolean }> {
  if (!token) return { ...CLINIC_PROMPT_DEFAULT, saved: false };
  try {
    const { text } = await readFile(token, CLINIC_PROMPT_PATH);
    const j = JSON.parse(text) as Partial<ClinicPrompt>;
    return {
      writing: cleanPrompt(j.writing),
      image: cleanPrompt(j.image),
      updatedAt: typeof j.updatedAt === 'string' ? j.updatedAt : undefined,
      saved: true,
    };
  } catch {
    return { ...CLINIC_PROMPT_DEFAULT, saved: false };
  }
}

export async function writeClinicPrompt(token: string, p: ClinicPrompt, message: string) {
  return commitFiles(token, [{ path: CLINIC_PROMPT_PATH, content: JSON.stringify(p, null, 2) + '\n' }], message);
}

/**
 * 글·제목 규칙을 프롬프트 한 덩이로. 비어 있으면 빈 문자열 — 부르는 쪽이 배열에서 걸러 낸다.
 * ⚠️ 이 덩이 **뒤에** 의료법 블록이 온다. 마지막 말이 법이어야 한다(adminDraft.draftPrompt 의 순서를 바꾸지 말 것).
 */
export function writingBlock(writing: string): string {
  if (!writing.trim()) return '';
  return ['## 반드시 지킬 형식과 말투', writing.trim()].join('\n');
}

/** 주제를 고를 때 — 형식·말투는 쓸모가 없고 "무엇을 다룰지" 만 본다. */
export function topicBlock(writing: string): string {
  if (!writing.trim()) return '';
  return [
    '## 이 병원의 글 규칙 (주제를 고를 때 참고)',
    '형식·말투·길이에 관한 부분은 여기서 무시하고, **어떤 진료·어떤 환자를 자주 다루라**는 부분만 반영합니다.',
    '그런 말이 없으면 이 항목은 무시합니다. 겹치지 않는 주제를 고르는 것이 먼저입니다.',
    '"""',
    writing.trim().slice(0, 800),
    '"""',
  ].join('\n');
}

/** 감수 단계 — 병원이 정한 말투를 감수가 표준어로 되돌려 놓지 못하게 막는 한 줄. */
export function reviewKeepLine(writing: string): string {
  const w = writing.trim();
  if (!w) return '';
  return `- 아래는 병원이 정한 말투·형식입니다. 여기에 맞게 쓰인 문장은 문제가 아니므로 그대로 둡니다: "${w.replace(/\s+/g, ' ').slice(0, 400)}"`;
}
