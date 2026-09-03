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
      { label: '동그라미의 특별함', href: '/about', desc: '동그라미치과의 진료 철학' },
      { label: '의료진 소개', href: '/about/doctors', desc: '의료진의 약력과 진료 분야' },
      { label: '근거 · 인증', href: '/about/trust', desc: '주요 이력과 학술 활동' },
      { label: '첫 방문 안내', href: '/about/process', desc: '초진 진료 과정 안내' },
      { label: '진료시간 · 오시는 길', href: '/visit', desc: '진료시간과 내원 안내' },
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
    /*
     * ⚠️ 하위 주제를 여기 다 걸지 말 것 (2026-09-03 오너: "이렇게 여러페이지 말고") —
     *    한때 여덟 개를 걸었다가 되돌렸다. 뼈이식·상악동·보험·네비게이션·관리 다섯은
     *    페이지로는 살아 있고 임플란트 페이지의 '주제별로 자세히 보기' 에서 닿는다.
     *    메뉴는 **환자가 실제로 갈라 묻는 두 갈래**만 든다.
     * ⚠️ '크라운 · 보철' 도 여기 넣지 말 것 (2026-09-03 오너: "두개 페이지가 똑같은데") —
     *    심미치료 묶음의 '심미보철' 과 같은 페이지다.
     */
    /*
     * ⚠️ '최첨단' 을 붙이지 말 것 (2026-09-03) — 근거 없는 최상급은 의료광고 심의에서
     *    지적받는 유형이다. 이 사이트는 같은 이유로 원문의 '인체에 무해한 저선량 CT' 를
     *    '저선량 CT' 로 이미 정정했다(lib/specials.ts low-dose-ct).
     * ★ '3D CT 정밀진단' 은 진료 페이지가 아니라 병원 소개의 CT 페이지로 간다 —
     *   그 내용이 거기 있고, 같은 글을 두 곳에 두면 검색이 어느 쪽을 고를지 헷갈린다.
     * ⚠️ 일반 임플란트 페이지(/treatment/implant)는 이 목록에서 뺐지만 묶음 주소 그대로라
     *    서랍의 '전체 보기' 와 메뉴 이름 자체가 그리로 간다.
     */
    children: [
      { label: '디지털 임플란트', href: '/treatment/implant/digital-navigation', desc: 'CT와 구강스캐너로 미리 계획' },
      { label: '전체임플란트', href: '/treatment/implant/full-arch', desc: '한 악의 치아를 모두 잃었을 때' },
      { label: '3D CT 정밀진단', href: '/about/special/low-dose-ct', desc: '저선량으로 촬영하는 3차원 진단' },
      { label: '즉시 식립 · 재수술', href: '/treatment/implant/extraction-and-retreatment', desc: '바로 심는 경우와 다시 심는 경우' },
    ],
  },
  {
    label: '심미치료',
    href: '/treatment/whitening',
    children: [
      /*
       * ⚠️ '무삭제' 를 붙이지 말 것 (2026-09-03) — 라미네이트 페이지가 "앞면만 0.3~0.7mm
       *    얇게 다듬고" 라고 적는다. 메뉴가 '무삭제' 라고 하면 우리 페이지와 정면으로
       *    어긋나고, 프렙리스 라미네이트를 이 병원이 하는지도 확인된 바가 없다.
       *    원장님 확인이 오면 그때 되살리고 라미네이트 페이지에도 함께 적을 것.
       */
      { label: '라미네이트', href: '/treatment/laminate', desc: '최소삭제로 앞면만 덮는 방법' },
      { label: '심미보철', href: '/treatment/crown-prosthesis', desc: '치아의 기능 회복, 심미적인 자신감까지' },
      { label: '치아미백', href: '/treatment/whitening', desc: '본연의 치아색을 밝히는 미백치료' },
    ],
  },
  {
    /* ⚠️ '사랑니치료' 로 되돌리지 말 것 (2026-09-02 오너). 붙여쓰기는 '자연치아살리기' 와
       같은 규칙 — 메뉴 이름표는 붙여 쓰고 문서 제목은 띄어 쓴다. */
    label: '사랑니발치',
    href: '/treatment/wisdom-tooth',
    /*
     * ★ 아래 둘은 새 페이지가 아니라 **사랑니 페이지 안의 구간**을 가리킨다 (2026-09-03 오너).
     *   그 내용이 이미 거기 있고, 같은 글을 페이지로 또 만들면 검색이 어느 쪽을 고를지 헷갈린다.
     * ⚠️ 주소의 id 는 app/treatment/wisdom-tooth/page.tsx 의 section id 와 글자 그대로
     *    같아야 한다. 하나라도 어긋나면 그 칸만 조용히 페이지 맨 위로 간다.
     */
    children: [
      { label: '사랑니 발치', href: '/treatment/wisdom-tooth', desc: '사랑니 주변이 붓고 아플 때' },
      { label: '매복사랑니', href: '/treatment/wisdom-tooth#매복-사랑니', desc: '누워 있거나 잇몸에 덮인 사랑니' },
      { label: '발치 후 주의사항', href: '/treatment/wisdom-tooth#발치-후-주의사항', desc: '뺀 다음 며칠 동안' },
    ],
  },
  {
    /* 기존 '상담 및 예약' 자리 — 예약 길은 히어로와 퀵메뉴에 있으므로 읽을거리를 둔다. */
    label: '인사이트',
    href: '/insight',
    children: [
      { label: '블로그', href: '/insight/blog', desc: '알아두면 좋은 치과 정보' },
      { label: '증상으로 찾기', href: '/insight/symptom', desc: '증상별 진료 안내' },
      { label: '질환 사전', href: '/insight/condition', desc: '치과 질환 정보' },
      { label: '치료 여정', href: '/insight/journey', desc: '치료 과정과 기간' },
      { label: '비용 가이드', href: '/insight/cost', desc: '진료 비용과 보험 정보' },
      { label: '용어 사전', href: '/insight/glossary', desc: '치과 용어 쉽게 보기' },
      { label: '응급 상황', href: '/insight/emergency', desc: '치과 응급상황 대처법' },
      { label: '자주 묻는 질문', href: '/faq', desc: '진료에 관한 주요 질문' },
    ],
  },
];

/** 사이트맵이 쓰는 평탄화 목록 (푸터는 자기 목록을 따로 가진다). */
export function flatNavPaths(): string[] {
  const out = new Set<string>(['/']);
  for (const item of NAV) {
    out.add(item.href);
    /* ⚠️ 바깥 링크는 넣지 말 것 — 남의 도메인 주소가 우리 사이트맵에 실린다. */
    /* ⚠️ '#매복-사랑니' 같은 조각 주소도 넣지 말 것 — 검색엔진은 조각을 떼고 보므로
       사이트맵에 같은 페이지가 세 번 실린다(2026-09-03 실측: wisdom-tooth 가 3줄). */
    for (const c of item.children ?? []) if (!c.external) out.add(c.href.split('#')[0]);
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
