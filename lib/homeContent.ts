/**
 * 홈 전용 내용 — 디자인 수정 요청서(2026-09-16, 클라이언트 sukho) 목업 기준.
 *
 * ★★ 원칙 ★★
 *   · 사진은 전부 **이 병원의 실제 사진**(public/img, 기존 홈페이지 자산)이다. 목업의 스톡
 *     환자 얼굴은 쓰지 않는다 — 남의 사진은 그 자체가 허위 표시다(lib/assets.ts 머리말).
 *   · 문구는 목업의 카피를 따르되 **효과·결과를 단정하는 말은 넣지 않는다**(의료법 제56조).
 *     "뽑기 전에 한 번 더 살펴본다 / 함께 판단한다" 는 진료 태도의 서술이지 결과 약속이 아니다.
 *   · 모든 카드는 실재하는 페이지로 이어진다(app/ 라우트 확인 완료).
 */

const P = '/img';

/** 첫 화면 — 파노라마 화면을 짚으며 설명하는 장면. 목업 히어로와 같은 구도다. */
export const HERO_PHOTO = {
  src: `${P}/20210923_217b53ad1570b.jpg`,
  alt: '진료실에서 의료진이 모니터의 파노라마 엑스레이와 태블릿의 구강 사진을 나란히 놓고 환자에게 설명하는 모습',
};

/** 동그라미가 가장 먼저 생각하는 것 — 진료 전에 스스로 묻는 네 가지. 순서가 곧 순위다. */
export const PRINCIPLES = [
  { n: '01', title: '정말 치료가 필요한가' },
  { n: '02', title: '자연치아를 살릴 방법은 없는가' },
  { n: '03', title: '지금 꼭 치료해야 하는가' },
  { n: '04', title: '환자가 치료 내용을 충분히 이해하고 있는가' },
] as const;

export const PRINCIPLE_STATEMENT =
  '가능하다면 내 치아를 오래 사용하는 것. 그것이 치료의 첫 번째 선택이어야 한다고 생각합니다.';

/**
 * 어떤 고민이 있으신가요 — 환자의 말 → 갈 곳.
 * ⚠️ quote 는 환자의 말이다. 병원 말투로 다듬지 않는다.
 * ⚠️ tag 는 lib/nav.ts 의 진료 이름과 같은 말을 쓴다(새 진료명을 만들지 않는다).
 */
export const HOME_CONCERNS = [
  {
    quote: '이가 아파요.',
    tag: '충치 / 신경치료',
    href: '/treatment/cavity',
    photo: {
      src: `${P}/20250507_d47b45c0c33ce.jpg`,
      alt: '상담실에서 의료진이 모니터를 보며 환자와 이야기하는 모습',
    },
  },
  {
    quote: '치아를 뽑아야 한다고 들었어요.',
    tag: '발치 전 상담 / 임플란트',
    href: '/treatment/implant',
    photo: {
      src: `${P}/20210923_67b5506b18b26.jpg`,
      alt: '파노라마 엑스레이 촬영 장면',
    },
  },
  {
    quote: '사랑니가 아파요.',
    tag: '사랑니 발치',
    href: '/treatment/wisdom-tooth',
    photo: {
      src: `${P}/20250509_db27dda8e4fa2.jpg`,
      alt: '진료실에서 의료진 두 사람이 진료 중인 모습',
    },
  },
  {
    quote: '치아가 조금 더 예뻤으면 좋겠어요.',
    tag: '심미치료',
    href: '/treatment/aesthetic',
    photo: {
      src: `${P}/20210923_956b5d44b57ef.jpg`,
      alt: '상담실에서 치아 모형과 파노라마 화면으로 설명하는 모습',
    },
  },
  {
    quote: '치아를 살릴 수 있을까요?',
    tag: '자연치아 살리기',
    href: '/treatment/save-natural-tooth',
    photo: {
      src: `${P}/20250507_da92f28e449a4.jpg`,
      alt: '모니터 앞에서 의료진이 환자에게 진료 계획을 설명하는 모습',
    },
  },
] as const;

/**
 * 자연치아 보존 띠 — 유닛 트레이의 핸드피스 근접. 어둡고 형태가 단순해 덮개 아래서 결만 남는다.
 * ⚠️ 멸균 트레이 사진(72fa74e154297)은 포장지 글자가 많아 덮어도 어지러웠다(실측). 되돌리지 말 것.
 */
/*
 * ★ 2026-09-17 오너: "사진 부족한 건 GPT 로 넣어, 메인 페이지만 우선" — 아래 gen/ 세 장은 **AI 생성 이미지**다
 *   (OpenAI gpt-image, C:/tmp/gen-home-images.mjs 로 만들었다). 사람·손·글자 없이 **사물만**(치아 모형·올리브·린넨).
 *   진료 장면·의료진·환자를 생성해 넣지 말 것 — 사물 정물은 분위기이지 사실 주장이 아니라서 허용했다.
 * ⚠️ 위 원칙("사진은 전부 실제 사진")의 예외는 이 세 장뿐이다. 다른 자리에 넓히려면 오너 GO 필요.
 */
export const PRESERVE_PHOTO = {
  src: `${P}/gen/preserve.jpg`,
  alt: '',
};

/** 둘러보기 — 큰 사진 하나 + 작은 사진 둘. 전체는 /about/tour. */
export const TOUR_PHOTOS = {
  main: {
    src: `${P}/20210902_c9d4c8d8ff172.jpg`,
    alt: '접수 데스크와 대기 공간 — 좌석과 벽면 로고',
  },
  sub: [
    { src: `${P}/20210923_14482879bf993.jpg`, alt: '유닛체어와 모니터가 놓인 독립 진료실' },
    { src: `${P}/20210923_5e82b10a99850.jpg`, alt: '유리 파티션으로 나뉜 개별 상담 부스' },
  ],
} as const;

/**
 * 인사이트 최신 글 카드의 **대체 표지** — 표지 없는 글(중앙 글에 흔하다)에 번갈아 쓴다. AI 생성 정물(PRESERVE_PHOTO 주석).
 * (2026-09-17: 슬로건 타일 STORY_TILES 는 폐기 — 눌러도 갈 곳이 없는 장식이라 최신 글로 바꿨다. app/page.tsx StorySection.)
 */
export const STORY_FALLBACK_COVERS = [
  { src: `${P}/gen/story-olive.jpg`, alt: '아이보리 선반 위의 작은 올리브 화분과 흰 치아 모형' },
  { src: `${P}/gen/story-linen.jpg`, alt: '아이보리 린넨 위의 흰 치아 모형과 작은 치과용 거울' },
] as const;

/**
 * 의료진 사진 — 배경 톤을 맞춰 둔 판(-bg)이 있는 사람은 그것을 쓴다(scripts/normalizeDoctorBg.mjs).
 * 대표원장은 -bg 판이 없어 원본을 쓴다.
 */
export function doctorPhoto(slug: string, photo: string): string {
  if (slug === 'kim-dongju' || slug === 'kim-injin') return photo.replace(/\.jpg$/i, '-bg.jpg');
  return photo;
}
