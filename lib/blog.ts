import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * 블로그 글 저장소.
 *
 * ★★ 왜 파일 한 개 = 글 한 개인가 (2026-09-02 오너: "자동화 느낌으로, 한 달 10개") ★★
 *   한 달에 열 개면 손으로 코드를 고치는 방식은 금방 무너진다.
 *   `content/blog/` 에 JSON 파일 하나를 **떨구기만 하면** 목록·상세·사이트맵·구조화 데이터가
 *   전부 따라오게 만든다. 자동화가 할 일은 파일을 쓰고 배포를 거는 것뿐이다.
 *
 * ★ 왜 JSON 인가 — 만들어 내는 쪽(생성기)이 기계라서다. 마크다운은 사람이 쓸 때 편하고,
 *   JSON 은 기계가 쓸 때 안전하다. 따옴표·줄바꿈을 기계가 알아서 처리한다.
 *   본문은 HTML 문자열이다 — 생성기가 이미 HTML 로 내보내므로 중간 변환이 없다.
 *
 * ⚠️⚠️ 본문 HTML 은 **우리가 저장소에 커밋한 것만** 들어온다 ⚠️⚠️
 *   외부 입력을 그대로 그리는 자리가 아니다. 방문자가 보낸 값이나 외부 API 응답을
 *   이 폴더에 바로 쓰지 말 것 — 그 순간 저장형 XSS 가 된다.
 *   아래 sanitizeBody 가 script/iframe/on* 을 걷어 내지만, 그것은 마지막 방어선이지
 *   외부 입력을 허용해도 된다는 뜻이 아니다.
 *
 * ⚠️ 의료광고다. 글마다 의료법 제56조가 그대로 적용된다.
 *    치료경험담·치료 전후 사진·최상급 표현('최고'·'유일')·객관적 근거 없는 효과 단정 금지.
 *    생성기 쪽에서 거르더라도 사람이 한 번 보고 올리는 것이 맞다.
 *
 * ⚠️ 파일 이름이 곧 주소다. 한 번 올린 글의 파일 이름을 바꾸면 그 주소가 404 가 된다.
 *    (색인된 글이면 검색 순위도 함께 사라진다.) 고쳐야 하면 이름은 두고 내용만 고칠 것.
 */

export interface BlogPost {
  /** 주소가 되는 이름. 파일 이름에서 온다(2026-09-05-implant-life.json → implant-life). */
  slug: string;
  title: string;
  /** YYYY-MM-DD. 목록 정렬과 구조화 데이터의 발행일. */
  date: string;
  /** 고친 날. 없으면 발행일과 같다. */
  updated?: string;
  /** 목록과 검색 결과에 나가는 한두 문장. */
  summary: string;
  /** 진료 영역 이름과 맞추면 목록에서 묶어 보기 좋다. 없어도 된다. */
  category?: string;
  /** 본문 HTML. h2/h3/p/ul/ol/li/strong/em/a/blockquote/figure/img 정도만 쓴다. */
  html: string;
}

const DIR = join(process.cwd(), 'content', 'blog');

/**
 * 위험한 조각을 걷어 낸다 — **마지막 방어선**이다.
 * ⚠️ 이것이 있으니 아무 HTML 이나 넣어도 된다고 생각하지 말 것. 위 주석 참고.
 */
function sanitizeBody(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}

/** 파일 이름에서 주소를 뽑는다 — 앞에 붙은 날짜는 정렬용이라 주소에서 뺀다. */
function slugFromFile(file: string): string {
  return file.replace(/\.json$/i, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/**
 * 글 전체를 최신순으로.
 * ⚠️ 폴더가 없거나 비어 있어도 **터지지 않는다** — 글이 하나도 없는 것은 정상 상태다.
 *    (블로그를 열어 두고 첫 글을 올리기 전까지가 그렇다.)
 */
export function allPosts(): BlogPost[] {
  let files: string[];
  try {
    files = readdirSync(DIR).filter((f) => f.toLowerCase().endsWith('.json'));
  } catch {
    return [];
  }

  const posts: BlogPost[] = [];
  for (const file of files) {
    let raw: unknown;
    try {
      raw = JSON.parse(readFileSync(join(DIR, file), 'utf8'));
    } catch {
      /* 깨진 파일 하나가 사이트 전체를 막지 않게 건너뛴다. */
      continue;
    }
    const p = raw as Partial<BlogPost>;
    /* 없으면 화면이 이상해지는 값들 — 하나라도 비면 그 글은 싣지 않는다. */
    if (!p.title || !p.date || !p.summary || !p.html) continue;
    posts.push({
      slug: p.slug || slugFromFile(file),
      title: p.title,
      date: p.date,
      updated: p.updated,
      summary: p.summary,
      category: p.category,
      html: sanitizeBody(p.html),
    });
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function postBySlug(slug: string): BlogPost | undefined {
  return allPosts().find((p) => p.slug === slug);
}

/** 글에 쓰인 분류 — 목록 위에 몇 가지를 다루는지 보여 줄 때 쓴다. */
export function postCategories(): string[] {
  return [...new Set(allPosts().map((p) => p.category).filter(Boolean) as string[])];
}
