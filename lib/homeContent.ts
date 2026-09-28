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

/*
 * ─────────────── 2026-09-28 더뉴치과 메인의 짜임·움직임 이식 (오너: "저 모션들이랑 디자인들을 적용해보자") ───────────────
 *   가져온 것 셋 — ① 주요 진료 과목(올리면 넓어지는 카드) ② 대표원장(올리면 이름이 빠지고 경력이 올라오는 판)
 *   ③ 특별함(세로로 긴 사진 카드, 올리면 모서리가 둥글어지며 설명이 열림). 색·글꼴·틀은 동그라미 그대로.
 */

/**
 * 주요 진료 네 장 — 더뉴의 '주요 진료 과목'처럼 카드마다 바탕 색이 다른 사물 정물.
 * ★ 사진은 **AI 생성 정물**이다(2026-09-28 오너: "이미지도 AI 사용해도 되니까 내용에 맞게").
 *   C:/tmp/cd-new/gen-clinic-cards.mjs(gpt-image-2). 사람·손·글자 없이 치아 모형·임플란트 모형·베니어만.
 *   바탕 색은 요청서 팔레트 안에서 골랐다 — 블루그레이 / 토프 / 아이보리 / 블루그레이 딥.
 * ★ tone = 사진 윗부분(글자가 서는 자리)의 밝기. 밝은 세 장은 차콜 글자, 어두운 한 장만 흰 글자
 *   (밝은 파스텔 위 흰 글자는 대비 2:1 안팎이라 읽히지 않는다 — 더뉴처럼 전부 흰 글자로 하지 않은 이유).
 * ★ name·copy·href 는 lib/clinic.ts TREATMENT_PILLARS 원문, quote 는 위 HOME_CONCERNS 의 환자 말 그대로.
 */
/** 고민 카드의 환자 말을 그대로 가져온다 — 같은 말을 두 곳에 적어 두면 어긋난다 */
const quoteOf = (href: string): string => HOME_CONCERNS.find((c) => c.href === href)?.quote ?? '';

export const CLINIC_CARDS = [
  {
    key: 'natural',
    en: 'Natural Tooth',
    quote: quoteOf('/treatment/save-natural-tooth'),
    tone: 'light',
    photo: { src: `${P}/gen/care-natural.jpg`, alt: '블루그레이 바탕에서 작은 흰 접시 위에 놓인 치아 모형과 초록 잎' },
  },
  {
    key: 'implant',
    en: 'Implant',
    quote: quoteOf('/treatment/implant'),
    tone: 'light',
    photo: { src: `${P}/gen/care-implant.jpg`, alt: '토프색 바탕의 돌 받침 위에 선 임플란트 나사와 흰 크라운 모형' },
  },
  {
    key: 'aesthetic',
    en: 'Aesthetic',
    quote: quoteOf('/treatment/aesthetic'),
    tone: 'light',
    photo: { src: `${P}/gen/care-aesthetic.jpg`, alt: '아이보리 바탕에 한 줄로 놓인 도자기 베니어와 둥근 거울' },
  },
  {
    key: 'wisdom',
    en: 'Wisdom Tooth',
    quote: quoteOf('/treatment/wisdom-tooth'),
    tone: 'dark',
    photo: { src: `${P}/gen/care-wisdom.jpg`, alt: '어두운 슬레이트 바탕에 옆으로 누운 뿌리가 긴 사랑니 모형' },
  },
] as const;

/**
 * 특별함 카드 — 세로로 긴 카드(2:3)에 맞춰 **실제 병원 사진**을 고르고 잘라 쓸 자리를 정한다.
 * ★ 글(title·body)은 lib/specials.ts 원문. 사진만 카드 비율에 맞는 것으로 고른다(원래 사진은 대부분 가로 1056px 라
 *   세로로 자르면 절반이 버려진다 → 해상도가 되는 사진은 그대로, 안 되는 자리는 같은 내용의 1920px 사진으로).
 * ★ medical-team 제목만 카드용으로 바꾼다 — 원문 '10년 이상 경력의 대학병원…' 은 우리가 확인한 사실이 아니라
 *   (lib/specials.ts 주석) 홈에서는 쓰지 않아 왔다. 홈 의료진 구획과 같은 기준('10년 이상'·'교수 출신' 안 씀)으로, 확인된 자격(lib/doctors.ts license)만 적는다.
 */
export const SPECIAL_CARD_ART: Record<string, { src: string; alt: string; pos: string; title?: string }> = {
  'medical-team': {
    src: '/img/clinic/doctor-desk.webp',
    alt: '초록 진료복을 입은 원장이 책상에 앉아 차트를 적는 모습',
    pos: '50% 20%',
    title: '보건복지부인증 전문의 의료진',
  },
  'digital-diagnosis': {
    src: '/img/special/20210903_a7607dc6f00a6.jpg',
    alt: '태블릿에 띄운 3차원 구강 스캔 결과를 환자에게 가리켜 설명하는 모습',
    pos: '62% 50%',
  },
  'custom-implant': {
    src: `${P}/20210923_956b5d44b57ef.jpg`,
    alt: '상담실에서 파노라마 엑스레이 화면과 치아 모형으로 설명하는 모습',
    pos: '42% 50%',
  },
  'low-dose-ct': {
    src: '/img/special/20210903_9e70d783f0043.jpg',
    alt: '치과용 CT 장비에서 촬영을 준비하는 환자',
    pos: '55% 50%',
  },
  hygiene: {
    src: `${P}/20210923_72fa74e154297.jpg`,
    alt: '멸균 포장된 진료 기구를 소독기에서 꺼내는 장면',
    pos: '50% 50%',
  },
  'pain-control': {
    src: '/img/special/20210927_ab779fb49387d.jpg',
    alt: '진료 중인 대표원장과 진료 보조 스태프',
    pos: '60% 50%',
  },
  warranty: {
    src: '/img/special/20211103_53aaffd64e862.jpg',
    alt: '임플란트 부품과 임플란트 보증서(IMPLANT WARRANTY CERTIFICATE)',
    pos: '60% 50%',
  },
};

/**
 * 의료진 사진 — 배경 톤을 맞춰 둔 판(-bg)이 있는 사람은 그것을 쓴다(scripts/normalizeDoctorBg.mjs).
 * 대표원장은 -bg 판이 없어 원본을 쓴다.
 */
export function doctorPhoto(slug: string, photo: string): string {
  if (slug === 'kim-dongju' || slug === 'kim-injin') return photo.replace(/\.jpg$/i, '-bg.jpg');
  return photo;
}
