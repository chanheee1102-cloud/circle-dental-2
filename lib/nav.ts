/**
 * 사이트 구조 정의.
 *
 * ★ 헤더 메뉴·푸터·사이트맵·빵부스러기가 전부 이 파일에서 파생된다.
 *   페이지를 추가하고 사이트맵에 넣는 것을 잊으면 그 페이지는 검색엔진이 영원히 모른다.
 *   한 곳에서 정의해 그 사고를 구조적으로 막는다.
 *
 * ★ 정보 구조 설계 근거 — 진료과목만으로는 검색 수요의 절반을 놓친다.
 *   환자는 "임플란트" 로도 검색하지만 "이가 빠졌는데 어떡하죠" 로도 묻는다.
 *   그래서 축을 둘로 나눴다: **진료**(무엇을 하는가) / **미리 알아두기**(내 상태가 무엇인가).
 *   후자가 AI 검색에서 인용을 만드는 축이다.
 */

export interface NavChild {
  label: string;
  href: string;
  /** 메뉴에 붙는 한 줄 설명. 클릭 전에 무엇인지 알게 한다. */
  desc?: string;
  /**
   * 사이트 밖으로 나가는 링크(블로그 등).
   * ⚠️ 이 표시가 없으면 사이트맵이 그 주소를 **우리 페이지로 착각해** 내보낸다.
   *    flatNavPaths 가 이 값을 보고 건너뛴다.
   */
  external?: boolean;
}

/*
 * (2026-08-14) 메가메뉴 오른쪽 '대표 카드'(NavFeature — 사진 + 홍보 문구 + CTA)를 제거했다.
 *   운영자 판단: "굳이 오른쪽에 저건 없어도 돼. 그냥 메뉴만 나오면 돼."
 *   메뉴는 가려던 곳으로 빨리 보내는 자리라 거기서 읽을거리를 권하지 않는다.
 *   ⚠️ 이 파일이 lib/assets · lib/doctors 를 import 하던 이유가 그 카드였다.
 *      (2026-09-02: 블로그를 사이트 안에 두기로 하면서 lib/clinic import 는 다시 뺐다.)
 *      import 도 함께 지웠다 — 헤더는 클라이언트 컴포넌트라 안 쓰는 데이터가 딸려 오면
 *      그만큼 첫 화면에서 받아야 할 자바스크립트가 늘어난다.
 */
export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV: NavItem[] = [
  {
    /* 기존 홈페이지의 '치과소개' 자리. 우리 쪽에 있는 소개 계열을 전부 여기 모은다. */
    label: '치과소개',
    href: '/about',
    children: [
      { label: '동그라미의 특별함', href: '/about', desc: '진료를 대하는 기준' },
      { label: '의료진 소개', href: '/about/doctors', desc: '외래교수 출신 대표원장과 전문의' },
      { label: '근거 · 인증', href: '/about/trust', desc: '자격·논문·언론 기록' },
      { label: '첫 방문 안내', href: '/about/process', desc: '접수부터 상담까지' },
      { label: '진료시간 · 오시는 길', href: '/visit', desc: '위치 · 시간 · 연락처' },
    ],
  },
  {
    /*
     * 기존 홈페이지의 '자연치아살리기' 묶음 — 뽑지 않고 살리는 쪽 진료를 한데 둔다.
     * ⚠️ '전체 진료과목'(/treatment)을 여기 첫 줄에 둔다. 기존 메뉴에는 없던 자리지만
     *    열 갈래를 한눈에 보는 페이지가 어디서도 안 닿으면 그 페이지가 고아가 된다.
     */
    label: '자연치아살리기',
    href: '/treatment/save-natural-tooth',
    children: [
      { label: '전체 진료과목', href: '/treatment', desc: '증상별 진료 안내' },
      { label: '자연치아 살리기', href: '/treatment/save-natural-tooth', desc: '자연치아 보존을 위한 정밀 진료' },
      { label: '충치치료', href: '/treatment/cavity', desc: '충치 단계에 따른 맞춤 치료' },
      { label: '치아신경치료', href: '/treatment/endodontic', desc: '자연치아 보존을 위한 근관치료' },
      { label: '잇몸치료(스케일링)', href: '/treatment/periodontal', desc: '치석 제거와 잇몸 염증 관리' },
      { label: '스케일링 · 예방', href: '/treatment/scaling-prevention', desc: '만 19세 이상, 연 1회 건강보험 적용' },
    ],
  },
  {
    label: '임플란트',
    href: '/treatment/implant',
    children: [
      { label: '임플란트', href: '/treatment/implant', desc: '치아를 뽑았거나 빠진 자리' },
      /* ⚠️ '크라운 · 보철' 을 여기 다시 넣지 말 것 (2026-09-03 오너: "두개 페이지가 똑같은데") —
         심미치료 묶음의 '심미보철' 과 **같은 페이지**(/treatment/crown-prosthesis)였다.
         한 페이지가 메뉴 두 곳에 다른 이름으로 걸리면 서로 다른 페이지인 줄 알고 둘 다 눌러 본다. */
    ],
  },
  {
    label: '심미치료',
    href: '/treatment/whitening',
    children: [
      { label: '라미네이트', href: '/treatment/laminate', desc: '앞면만 얇게 덮는 방법' },
      { label: '심미보철', href: '/treatment/crown-prosthesis', desc: '깎는 양으로 고르기' },
      { label: '치아미백', href: '/treatment/whitening', desc: '커피·나이로 누레진 앞니' },
    ],
  },
  {
    /* ⚠️ '사랑니치료' 로 되돌리지 말 것 (2026-09-02 오너). 붙여쓰기는 '자연치아살리기' 와
       같은 규칙 — 메뉴 이름표는 붙여 쓰고 문서 제목은 띄어 쓴다. */
    label: '사랑니발치',
    href: '/treatment/wisdom-tooth',
    children: [
      { label: '사랑니 발치', href: '/treatment/wisdom-tooth', desc: '사랑니 주변이 붓고 아플 때' },
    ],
  },
  {
    /* 기존 '상담 및 예약' 자리 — 예약 길은 히어로와 퀵메뉴에 있으므로 읽을거리를 둔다. */
    label: '인사이트',
    href: '/insight',
    children: [
      { label: '블로그', href: '/insight/blog', desc: '자주 받는 질문을 글로' },
      { label: '증상으로 찾기', href: '/insight/symptom', desc: '내 증상이 무엇인지부터' },
      { label: '질환 사전', href: '/insight/condition', desc: '들은 병명이 무엇인지' },
      { label: '치료 여정', href: '/insight/journey', desc: '몇 번 오고 얼마나 걸리는지' },
      { label: '비용 가이드', href: '/insight/cost', desc: '보험이 되는 것과 안 되는 것' },
      { label: '용어 사전', href: '/insight/glossary', desc: '설명에 나오는 말 풀이' },
      { label: '응급 상황', href: '/insight/emergency', desc: '지금 당장 해야 할 것' },
      { label: '자주 묻는 질문', href: '/faq', desc: '비용 · 시간 · 통증' },
    ],
  },
];

/** 사이트맵·푸터가 함께 쓰는 평탄화 목록. */
export function flatNavPaths(): string[] {
  const out = new Set<string>(['/']);
  for (const item of NAV) {
    out.add(item.href);
    /* ⚠️ 바깥 링크는 넣지 말 것 — 남의 도메인 주소가 우리 사이트맵에 실린다. */
    for (const c of item.children ?? []) if (!c.external) out.add(c.href);
  }
  return [...out];
}

/** 빵부스러기 라벨 조회 — 경로에서 사람이 읽는 이름으로. */
export function labelForPath(path: string): string | undefined {
  for (const item of NAV) {
    if (item.href === path) return item.label;
    for (const c of item.children ?? []) if (c.href === path) return c.label;
  }
  return undefined;
}
