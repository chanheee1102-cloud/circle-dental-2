/**
 * 동그라미치과의원 — 병원 정보 단일 소스.
 *
 * ★ 값은 전부 기존 circle-dental 프로젝트의 검증된 데이터에서 그대로 가져왔다.
 *   이 버전에서 새로 만든 것은 **화면과 움직임뿐**이고 사실은 한 글자도 안 바꿨다.
 */

export const CLINIC = {
  name: '동그라미치과의원',
  shortName: '동그라미치과',
  nameEn: 'CIRCLE DENTAL CLINIC',
  tagline: '통증과 불편함을 고려하는 치과',
  description:
    '고양시 덕양구 화정동 동그라미치과의원입니다. 자연치아를 최대한 살리는 방향을 먼저 검토하고, 임플란트·심미치료·사랑니 발치를 진료합니다.',

  /** 히어로 대형 마퀴 문구 — bom-on 의 "Turn on Bom on" 자리. */
  marquee: 'Save your own tooth',

  phone: '031-972-2875',
  phoneHref: 'tel:0319722875',
  email: 'orion-17@hanmail.net',
  /** 전화와 같은 번호다 (기존 홈페이지 표기 그대로). */
  fax: '031-972-2875',
  url: 'https://circle-dental.co.kr',

  /**
   * 사업자 정보 — 푸터에 **한 곳에만** 적는다. 두 군데 적으면 반드시 어긋난다.
   * ⚠️⚠️ 이 두 값은 지어낼 수 없는 종류의 정보다 ⚠️⚠️
   *   기존 circle-dental 프로젝트에 VERIFIED 로 기록돼 있던 값을 그대로 옮겼다.
   *   틀린 사업자등록번호를 적는 것은 표시 광고 위반이고, 되돌릴 수 없는 종류의 실수다.
   */
  bizNo: '383-35-00998',
  director: '변석호',

  /**
   * 공식 채널.
   * ⚠️ 푸터에 거는 주소가 그대로 JSON-LD 의 sameAs 로도 나간다 —
   *    "이 홈페이지와 저 계정이 같은 병원" 이라는 선언이다.
   *    **확인된 계정만** 건다. 없는 주소를 걸면 404 를 가리키는 동일성 선언이 되어
   *    오히려 신호를 해친다. (아래 둘은 원본에서 확인 완료된 것)
   */
  social: {
    instagram: 'https://www.instagram.com/circle_dental/',
    naverBlog: 'https://blog.naver.com/circledental2021',
  },

  address: {
    full: '경기도 고양시 덕양구 화신로260번길 51, 3층 301·302·303호',
    building: '현창빌딩 3층',
    locality: '고양시 덕양구',
    region: '경기도',
    postalCode: '10500',
  },
  nearestStation: '화정역',
  parking: '건물 내 기계식 주차장 · 무료',
  parkingNote:
    '기계식 주차장이라 차량 크기에 따라 이용이 어려울 수 있습니다. 큰 차량으로 오실 예정이면 미리 전화로 문의해 주세요.',

  /**
   * 진료시간 — **요일 한 줄씩**.
   * ⚠️ 묶어서 적으면(예: '월·수·금') 방문자가 자기 요일을 묶음에서 풀어 읽어야 한다.
   *    요일별로 펼쳐 두면 눈으로 바로 찾는다. 값은 기존 데이터 그대로다.
   * ⚠️ closed 는 '휴진' 표시용 — 시간 칸을 비워 두지 않는다(빈 칸은 정보가 아니다).
   */
  hours: [
    { label: '월요일', time: '09:30 – 18:30', note: '', closed: false },
    { label: '화요일', time: '09:30 – 20:30', note: '야간 진료', closed: false },
    { label: '수요일', time: '09:30 – 18:30', note: '', closed: false },
    { label: '목요일', time: '09:30 – 20:30', note: '야간 진료', closed: false },
    { label: '금요일', time: '09:30 – 18:30', note: '', closed: false },
    { label: '토요일', time: '09:30 – 14:00', note: '점심시간 없음', closed: false },
    { label: '일요일 · 공휴일', time: '휴진', note: '', closed: true },
  ],
  /**
   * 좌표 — 지도가 가리키는 지점.
   * ⚠️⚠️ 추정 좌표를 넣지 않는다 ⚠️⚠️
   *   틀린 위치를 가리키는 지도는 없는 것보다 나쁘다 — 환자가 엉뚱한 데로 간다.
   *   이 값은 기존 circle-dental 프로젝트에서 **확인 완료(verified: true)** 로
   *   기록돼 있던 것을 그대로 옮긴 것이다. 새로 찍은 값이 아니다.
   */
  geo: { lat: 37.6331145, lng: 126.8326594 },

  /** 점심시간은 요일 목록과 성격이 달라 따로 둔다. */
  lunch: { time: '13:00 – 14:30', note: '토요일 제외' },

  booking: {
    naver: 'https://booking.naver.com/booking/13/bizes/596877?area=pll',
    kakao: 'https://pf.kakao.com/_psxkqb',
  },
} as const;

/**
 * 히어로 배경 영상 — 기존 홈페이지가 쓰던 Vimeo 영상 그대로.
 *
 * ★ 화면비는 **oEmbed 로 실측한 값**이다 (2026-08-20 확인).
 *   https://vimeo.com/api/oembed.json?url=https://vimeo.com/<ID>
 *   비율을 고정해 두면 세로 영상이 가로 자리에서 위아래가 크게 잘려 얼굴이 사라진다.
 * ⚠️ 영상을 교체하면 ratio 도 반드시 다시 재서 바꿀 것.
 */
const vimeoBg = (id: string, hash?: string) =>
  `https://player.vimeo.com/video/${id}?${hash ? `h=${hash}&` : ''}background=1&autoplay=1&loop=1&muted=1&autopause=0&dnt=1`;

export const VIDEO = {
  title: '동그라미치과의원 소개',
  /** 데스크톱 — 실측 426×240 = 1.775 */
  desktop: { src: vimeoBg('601092926'), ratio: 1.775, id: '601092926' },
  /** 모바일 — 실측 240×300 = 0.800 (세로) */
  mobile: { src: vimeoBg('640233415', '53c2ec8b24'), ratio: 0.8, id: '640233415' },
} as const;

/** 진료 기둥 — 기존 TREATMENT_PILLARS 원문 그대로. */
export const PILLARS = [
  {
    key: 'natural',
    no: '01',
    name: '자연치아살리기',
    en: 'Save Natural Tooth',
    copy: '뽑기 전에 남길 수 있는지 먼저 봅니다. 자연치아가 가장 좋은 치아입니다.',
    photo: '/img/20210923_43d85ec16a0eb.jpg',
  },
  {
    key: 'implant',
    no: '02',
    name: '임플란트',
    en: 'Implant',
    copy: '마지막 선택이 되도록 노력합니다. 장기적인 예후까지 함께 봅니다.',
    photo: '/img/20210923_6b7e0b66df9e0.jpg',
  },
  {
    key: 'aesthetic',
    no: '03',
    name: '심미치료',
    en: 'Aesthetic',
    copy: '배열, 색상, 모양까지 바꿔 아름다운 미소를 디자인합니다.',
    photo: '/img/20210923_5e82b10a99850.jpg',
  },
  {
    key: 'wisdom',
    no: '04',
    name: '사랑니치료',
    en: 'Wisdom Tooth',
    copy: '빠르고 정확한 시술로 붓기와 통증을 완화시켜줍니다.',
    photo: '/img/20210902_37dca2d5f1170.jpg',
  },
] as const;

export const DOCTORS = [
  {
    slug: 'byun-seokho',
    name: '변석호',
    role: '대표원장',
    photo: '/img/20211123_b07b19257d734.jpg',
    focus: ['자연치아 보존', '근관치료(신경치료)', '임플란트', '보철·심미'],
    career: [
      '경희대학교 치의학전문대학원 외래교수',
      '경희대학교 치의학전문대학원 치의학박사',
      '경희대학교 치의학전문대학원 치의학석사',
      '보건복지부 인정 통합치의학과 전문의',
      '고려대학교 학사',
      '전) 능곡서울치과 대표원장',
    ],
  },
  {
    slug: 'kim-dongju',
    name: '김동주',
    role: '원장',
    photo: '/img/20210906_28ce020ff6ebb.jpg',
    focus: ['임플란트', '근관치료(신경치료)', '심미치료', '보철'],
    career: [
      '경희대학교 치의학전문대학원 치의학석사',
      '보건복지부 인정 통합치의학과 전문의',
      '고려대학교 학사',
      '강원도 화천보건의료원 치과과장 역임',
      '평창 동계올림픽 자문 치과의사',
      'Upenn Endo Microedondotics course 수료',
    ],
  },
  {
    slug: 'kim-injin',
    name: '김인진',
    role: '원장',
    photo: '/img/20210906_d48365779037c.jpg',
    focus: ['임플란트', '심미보철', '교정', '총의치'],
    career: [
      '경희대학교 치의학전문대학원 치의학석사',
      '보건복지부 인정 통합치의학과 전문의',
      'UCLA Biochemistry B.S',
      'Upenn Endo Microedondotics course 수료',
      'UCLA 교정과정 수료',
      'Dentium 심미보철 과정 수료',
    ],
  },
] as const;

/** 내부 사진 — 기존 assets.ts 의 interior 목록. */
export const INTERIOR = [
  { src: '/img/20210923_5e82b10a99850.jpg', alt: '유리 파티션으로 나뉜 개별 상담 부스' },
  { src: '/img/20210923_6b7e0b66df9e0.jpg', alt: '창가 진료실의 유닛체어와 벽걸이 모니터' },
  { src: '/img/20210923_43d85ec16a0eb.jpg', alt: '진료실로 이어지는 복도' },
  { src: '/img/20210902_37dca2d5f1170.jpg', alt: '대기 공간' },
  { src: '/img/20210902_58bd28c129a12.jpg', alt: '진료실 내부' },
  { src: '/img/20210902_977d73c166f70.jpg', alt: '상담실' },
  { src: '/img/20210902_c4ee720cb55a9.jpg', alt: '소독실' },
  { src: '/img/20210902_c87e01dba95dc.jpg', alt: '엑스레이실' },
];

/**
 * 대표원장 인증·수료 실물 이미지 4장 — 기존 assets.ts 의 credentials 그대로.
 *
 * ★ label 을 src 옆에 짝지어 둔다(assets.ts 원본 주석 인용) — 배열을 따로 두면
 *   한쪽만 순서가 바뀌어도 화면은 멀쩡해 보이면서 라벨이 엉뚱한 사진에 붙는다.
 *   실제로 원본에서 그 사고가 났다(x 좌표 실측으로 짝을 다시 맞췄다).
 * ★ 전부 236×242(1장은 236×178) 스캔본 — 세로형 인테리어 사진과 비율이 다르다.
 *   그래서 화면에서는 object-cover 로 잘라내지 않고 object-contain 으로 온전히 보여준다.
 */
export const CREDENTIALS = [
  { src: '/img/20211103_75f9aab13211a.png', label: '오스템임플란트 연구자문치과 위촉패' },
  { src: '/img/20211103_f8dc531367c4e.png', label: 'Professional implant Training course 수료패' },
  { src: '/img/20211103_f00cdb3987872.png', label: '세계근관치료학회 수료증' },
  { src: '/img/20211103_0cf836e0f0288.png', label: '대한치과보존학회 회원증' },
];

/**
 * 전역 메뉴.
 * ⚠️ 인사이트 계열은 **실제 페이지**라 해시가 아니라 경로여야 한다.
 *    해시로 두면 다른 페이지에서 눌렀을 때 아무 데도 안 간다.
 */
export const NAV = [
  { label: '증상으로 찾기', href: '/insight/symptom', en: 'Symptom' },
  { label: '치료 알아보기', href: '/treatment', en: 'Treatment' },
  { label: '미리 알아두기', href: '/insight', en: 'Insight' },
  { label: '비용 기준', href: '/insight/cost', en: 'Cost' },
  { label: '자주 묻는 질문', href: '/faq', en: 'FAQ' },
  { label: '오시는 길', href: '/#visit', en: 'Visit' },
];
