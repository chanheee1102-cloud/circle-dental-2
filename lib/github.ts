/**
 * GitHub Contents API — 관리자 화면의 '발행하기' 가 실제로 하는 일.
 *
 * ★★ 왜 DB 가 아니라 git 인가 (2026-09-07) ★★
 *   이 사이트는 정적이다. 글은 content/blog/*.json 이고, 파일이 저장소에 들어가면 Vercel 이
 *   다시 빌드해 목록·상세·사이트맵·llms.txt 가 전부 따라온다. 그러니 '발행' 은 곧 '커밋' 이다.
 *   DB 를 두면 서버·인증·어드민을 새로 만들어야 하고, 외부 입력 HTML 을 그리게 되어 저장형
 *   XSS 표면이 생긴다. 커밋 방식은 글이 git 에 남아 되돌리기가 한 줄이고, 새 인프라가 0 이다.
 *
 * ⚠️ 토큰은 서버 환경변수(GITHUB_TOKEN)가 우선이다. 없으면 요청 헤더(x-github-token)로 받는다 —
 *    관리자가 브라우저에 한 번 붙여 넣는 방식. 토큰을 저장소에 적지 말 것.
 * ⚠️ 발행 뒤 화면에 보이기까지 Vercel 빌드 시간(2~3분)이 걸린다. 관리자 화면이 그것을 말해 준다.
 */

const API = 'https://api.github.com';

export function repoInfo() {
  const repo = process.env.GITHUB_REPO || 'chanheee1102-cloud/circle-dental-2';
  const branch = process.env.GITHUB_BRANCH || 'main';
  return { repo, branch };
}

export function tokenFrom(req: Request): string | null {
  return process.env.GITHUB_TOKEN || req.headers.get('x-github-token') || null;
}

async function gh(token: string, path: string, init: RequestInit = {}) {
  const r = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'x-github-api-version': '2022-11-28',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`GitHub ${r.status}: ${text.slice(0, 200)}`);
  }
  return r.json();
}

/** 폴더 안 파일 목록 (이름·sha·크기). */
export async function listDir(token: string, dir: string) {
  const { repo, branch } = repoInfo();
  const items = (await gh(token, `/repos/${repo}/contents/${dir}?ref=${branch}`)) as Array<{
    name: string;
    path: string;
    sha: string;
    size: number;
    type: string;
  }>;
  return items.filter((i) => i.type === 'file');
}

/** 파일 하나 읽기 (UTF-8 텍스트). */
export async function readFile(token: string, path: string) {
  const { repo, branch } = repoInfo();
  const j = (await gh(token, `/repos/${repo}/contents/${path}?ref=${branch}`)) as { content: string; sha: string; encoding: string };
  const text = Buffer.from(j.content.replace(/\n/g, ''), 'base64').toString('utf8');
  return { text, sha: j.sha };
}

/** 파일 쓰기(새로 만들거나 덮어쓰기). 덮어쓸 때는 sha 가 있어야 한다 — 없으면 GitHub 가 거부한다. */
export async function writeFile(token: string, path: string, content: Buffer | string, message: string, sha?: string) {
  const { repo, branch } = repoInfo();
  const body: Record<string, string> = {
    message,
    content: Buffer.isBuffer(content) ? content.toString('base64') : Buffer.from(content, 'utf8').toString('base64'),
    branch,
  };
  if (sha) body.sha = sha;
  return gh(token, `/repos/${repo}/contents/${path}`, { method: 'PUT', body: JSON.stringify(body) });
}

export async function deleteFile(token: string, path: string, sha: string, message: string) {
  const { repo, branch } = repoInfo();
  return gh(token, `/repos/${repo}/contents/${path}`, { method: 'DELETE', body: JSON.stringify({ message, sha, branch }) });
}

/** 파일의 현재 sha (없으면 undefined) — 덮어쓰기 전에 쓴다. */
export async function fileSha(token: string, path: string): Promise<string | undefined> {
  try {
    return (await readFile(token, path)).sha;
  } catch {
    return undefined;
  }
}
