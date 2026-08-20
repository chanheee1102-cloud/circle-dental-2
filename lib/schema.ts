import { CLINIC, DOCTORS, PILLARS, VIDEO } from './clinic';
import { DEFINITIONS, FAQS } from './aeo';

/**
 * 구조화 데이터 — 검색엔진과 답변형 AI 가 읽는 층.
 *
 * ⚠️⚠️ **확인 안 된 것은 넣지 않는다** ⚠️⚠️
 *   사람이 읽는 본문의 과장보다 지우기 어려운 거짓말이다. 별점·후기 수·성공률처럼
 *   확인할 수 없는 값은 아예 필드를 만들지 않는다(빈 값으로도 두지 않는다).
 *   치과에서 후기·별점은 의료법 제56조 제2항이 금지하는 것이기도 하다.
 */

export const SITE_URL = 'https://circle-dental.co.kr';
export const CLINIC_ID = `${SITE_URL}/#clinic`;

const abs = (p: string) => `${SITE_URL}${p}`;

/** 진료시간을 스키마 형식으로 — 화면과 같은 데이터에서 파생한다(두 벌로 적지 않는다). */
const HOURS_SPEC = [
  { dayOfWeek: ['Monday', 'Wednesday', 'Friday'], opens: '09:30', closes: '18:30' },
  { dayOfWeek: ['Tuesday', 'Thursday'], opens: '09:30', closes: '20:30' },
  { dayOfWeek: ['Saturday'], opens: '09:30', closes: '14:00' },
];

export function clinicSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': CLINIC_ID,
    name: CLINIC.name,
    alternateName: [CLINIC.shortName, CLINIC.nameEn],
    url: SITE_URL,
    description: CLINIC.description,
    slogan: CLINIC.tagline,
    telephone: CLINIC.phone,
    email: CLINIC.email,
    logo: abs('/img/logo.png'),
    image: abs(PILLARS[0].photo),
    priceRange: '₩₩',
    currenciesAccepted: 'KRW',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CLINIC.address.full,
      addressLocality: CLINIC.address.locality,
      addressRegion: CLINIC.address.region,
      postalCode: CLINIC.address.postalCode,
      addressCountry: 'KR',
    },
    openingHoursSpecification: HOURS_SPEC.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.dayOfWeek,
      opens: h.opens,
      closes: h.closes,
    })),
    /* ★ 주차는 '무료' 로 확인된 사실이라 넣는다. 확인 안 됐으면 이 필드를 통째로 뺀다. */
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: '주차', value: true },
    ],
    publicAccess: true,
    isAcceptingNewPatients: true,
    medicalSpecialty: 'Dentistry',
    availableService: DEFINITIONS.map((d) => ({
      '@type': 'MedicalProcedure',
      name: d.term,
      description: d.definition,
      url: `${SITE_URL}/#treatment`,
    })),
    employee: DOCTORS.map((d) => ({
      '@type': 'Physician',
      '@id': `${SITE_URL}/#doctor-${d.slug}`,
      name: `${d.name} ${d.role}`,
      medicalSpecialty: 'Dentistry',
    })),
    /*
     * ★ 푸터에 거는 채널과 **같은 목록**이어야 한다 (components/SiteFooter.tsx).
     *   sameAs 는 "이 홈페이지와 저 계정이 같은 병원" 이라는 선언이라,
     *   화면에 없는 계정을 여기만 적으면 근거 없는 주장이 된다.
     */
    sameAs: [
      CLINIC.booking.naver,
      CLINIC.booking.kakao,
      CLINIC.social.naverBlog,
      CLINIC.social.instagram,
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: CLINIC.name,
    inLanguage: 'ko-KR',
    publisher: { '@id': CLINIC_ID },
  };
}

export function procedureSchemas() {
  return DEFINITIONS.map((d) => ({
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    '@id': `${SITE_URL}/#procedure-${d.key}`,
    name: d.term,
    /* ★ 환자가 쓰는 말도 같이 싣는다 — 검색·답변이 이 문장으로 들어온다. */
    alternateName: d.question,
    description: d.definition,
    indication: { '@type': 'MedicalIndication', description: d.indication },
    /* ★ 부작용 고지를 스키마에도 넣는다 — 인용될 때 함께 딸려가야 한다. */
    preparation: d.caution,
    bodyLocation: '구강',
    provider: { '@id': CLINIC_ID },
  }));
}

export function physicianSchemas() {
  return DOCTORS.map((d) => ({
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${SITE_URL}/#doctor-${d.slug}`,
    name: `${d.name} ${d.role}`,
    givenName: d.name,
    jobTitle: d.role,
    image: abs(d.photo),
    medicalSpecialty: 'Dentistry',
    knowsAbout: [...d.focus],
    /* 약력은 원문 그대로 — 한 줄도 지어내지 않는다. */
    alumniOf: d.career.filter((c) => c.includes('대학')),
    worksFor: { '@id': CLINIC_ID },
    hospitalAffiliation: { '@id': CLINIC_ID },
  }));
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/**
 * 히어로 배경 영상.
 * ⚠️ uploadDate 를 모르면 넣지 않는다 — 스키마의 날짜는 검색 결과에 그대로 나간다.
 */
export function videoSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `${CLINIC.name} 소개 영상`,
    description: `${CLINIC.tagline} — ${CLINIC.name} 내부와 진료 환경을 담은 소개 영상입니다.`,
    thumbnailUrl: abs(PILLARS[0].photo),
    embedUrl: `https://player.vimeo.com/video/${VIDEO.desktop.id}`,
    publisher: { '@id': CLINIC_ID },
  };
}
