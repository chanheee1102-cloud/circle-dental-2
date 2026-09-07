/**
 * 콘텐츠 날짜 — 발행일과 최종 수정일.
 *
 * ★★ 왜 날짜가 필요한가 ★★
 *   의료 정보에서 검색엔진과 답변 엔진이 가장 먼저 보는 신뢰 신호가 **언제 쓴 글인가**다.
 *   같은 내용이라도 날짜가 없으면 "언제 기준인지 모르는 글" 이 되어 인용 순위에서 밀린다.
 *   Article 계열 스키마의 datePublished / dateModified 는 사실상 필수 필드다.
 *
 * ★★ 왜 상수로 두는가 — 지어내지 않기 위해서 ★★
 *   페이지마다 그럴듯한 날짜를 흩뿌려 두면 그 순간 전부 **거짓 날짜**가 된다.
 *   "최종 수정 2026-08-14" 라고 화면에 적어 놓고 실제로는 안 고쳤다면 그건 사실과 다른
 *   표시이고, 병원 홈페이지에서는 의료광고법상 위험한 종류의 거짓말이다.
 *   그래서 **실제로 그 글을 쓰거나 고친 날**만 여기 적는다.
 *
 * ⚠️ 본문을 고쳤으면 여기 날짜도 함께 올릴 것. 고치지 않았으면 올리지 말 것.
 *
 * ★★ 2026-09-07 — 손으로만 관리하니 결국 어긋났다 ★★
 *   실측: 117쪽 **전부** dateModified 가 2026-08-18 이었다. 그런데 그 사이 심미보철·
 *   임플란트 재수술·증상 묶음·인사이트 허브가 통째로 다시 쓰였다. 3주 전 날짜를 달고
 *   나가는 것은 신선도 신호를 버리는 일이자 사실과 다르다.
 *   → 이제 **증거에서 뽑는다**: scripts/contentDates.mjs 가 그 쪽의 page.tsx 와 그 쪽이 쓰는
 *     lib 데이터에서 **한글이 실제로 바뀐** 마지막 커밋 날짜를 찾아 아래 파일에 적는다.
 *   ⚠️ 위 경고가 걱정한 '오탈자 커밋 부풀림' 은 두 가지로 막는다 —
 *      ① git log -G'[가-힣]' — 한글이 바뀐 커밋만 센다. 클래스·리팩터 커밋은 안 걸린다.
 *      ② components/ 는 세지 않는다. 공용 UI 는 그 쪽의 본문이 아니다(넣었더니 주석 한 줄에
 *         69쪽이 한날로 뭉갰다).
 *   ⚠️ 결과 파일은 **커밋한다** — 배포 환경의 git 히스토리는 얕게 복제돼 빌드 때 다시
 *      계산할 수 없고, 커밋에 남아야 사람이 값을 검토할 수 있다.
 */

/** 이 사이트의 콘텐츠를 처음 공개한 날. */
export const SITE_PUBLISHED = '2026-08-10';

/**
 * 전체 콘텐츠의 최종 검토·수정일.
 *
 * 2026-08-18 — 검색·AI 노출 전수 점검 후 본문 수정. 증상 26페이지의 소제목을 질문형으로
 *   바꾸고 '어떤 질환일 수 있나요?' 구획을 새로 넣었으며, 의료진·내원 안내의 소제목과
 *   메타 설명 아홉 개를 고쳤다. 본문이 실제로 바뀌었으므로 날짜를 올린다.
 * 2026-08-14 — 구조화 데이터 전면 보완, 사진 설명 12장 작성, 병원 내부 사진 캡션 추가.
 *
 * ★ 이 값이 이제 **사이트맵의 lastmod 도** 정한다(app/sitemap.ts). 전에는 사이트맵이
 *   빌드 시각을 쓰는 바람에 91개 항목이 전부 같은 값이었고, 스키마와 사이트맵이 서로 다른
 *   날짜를 말했다. 지금은 출처가 이 파일 하나다.
 */
export const SITE_MODIFIED = '2026-08-18';

/**
 * 경로별 예외. 여기 없으면 위의 사이트 기본값을 쓴다.
 * ⚠️ 실제로 그 페이지만 따로 고친 날이 있을 때만 적는다.
 */
const OVERRIDES: Record<string, { published?: string; modified?: string }> = {
  '/about/tour': { modified: '2026-08-14' },
  '/privacy': { published: '2026-08-13', modified: '2026-08-13' },
};

/*
 * 증거에서 뽑은 쪽별 최종 수정일 (scripts/contentDates.mjs 가 만든다).
 * ⚠️ 손으로 고치지 말 것 — 다음 실행에서 덮어쓴다. 예외를 두려면 위 OVERRIDES 에 적을 것.
 */
import GENERATED from './contentModified.generated.json';

const FROM_GIT: Record<string, string> = GENERATED;

export function contentDates(path: string) {
  const o = OVERRIDES[path] ?? {};
  /*
   * 우선순위: 손으로 적은 예외 > git 증거 > 사이트 기본값.
   * ⚠️ 기본값보다 **뒤로 가지 않게** max 를 쓴다 — 증거가 없거나 오래된 쪽이
   *    사이트 전체 검토일보다 앞선 날짜를 말하면 안 된다.
   */
  const fromGit = FROM_GIT[path];
  const modified =
    o.modified ?? (fromGit && fromGit > SITE_MODIFIED ? fromGit : SITE_MODIFIED);
  return {
    published: o.published ?? SITE_PUBLISHED,
    modified,
  };
}

/** 2026-08-14 → 2026년 8월 14일. 화면에 사람이 읽는 형태로 쓸 때. */
export function formatKoreanDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}
