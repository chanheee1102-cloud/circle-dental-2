import type { Metadata } from 'next';
import { ArticleMeta } from '@/components/article';
import Image from 'next/image';
import { CLINIC } from '@/lib/clinic';
import { DOCTORS, PUBLICATION_DETAIL } from '@/lib/doctors';
import { CredentialFan } from '@/components/CredentialFan';
import { Container, ContactCta, Sentences } from '@/components/ui';
import { AboutHero } from '@/components/AboutHero';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, abs, medicalWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '의료진 소개',
  description:
    '동그라미치과의원 의료진 3인. 대표원장 변석호(경희대 치의학전문대학원 외래교수·치의학박사), 김동주 원장, 김인진 원장. 모두 보건복지부인증 통합치의학과 전문의입니다.',
  alternates: { canonical: '/about/doctors' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '병원 소개', path: '/about' },
  { name: '의료진', path: '/about/doctors' },
];

/**
 * 의료진 목록.
 *
 * ★ 세 분의 경력은 기존 홈페이지 /doctor 원문 그대로다(lib/doctors.ts).
 *   추측한 항목은 하나도 없다 — 의료인 경력 허위 표시는 의료법 제56조 위반이다.
 * ★ 원장마다 Physician 스키마를 따로 낸다. 지식패널이 인식하는 단위가 '사람'이라
 *   한 페이지에 세 명을 묶어 하나로 내면 누구의 경력인지 기계가 구분하지 못한다.
 */
/**
 * 목록 머리 — 금색 라벨 + 짧은 눈금.
 * ⚠️ 눈금을 flex-1 로 늘리지 말 것 (2026-09-01 실측) — 글 칸이 762px 이라 선이 698px 까지
 *    뻗어 나가 글자와 관계없는 줄 하나가 화면을 가로질렀다. 라벨 옆 짧은 표시로 충분하다.
 */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 text-[14px] font-black tracking-[0.06em] text-clay-600">
      {children}
      <span aria-hidden className="h-px w-8 bg-clay-600/45" />
    </p>
  );
}

export default function DoctorsPage() {
  const physicians = DOCTORS.map((d) => ({
    '@context': 'https://schema.org',
    /*
     * ★ Person 과 Physician 두 타입을 함께 준다.
     *   Physician 만 주면 '저자(author)' 로 쓸 수 없다 — 스키마에서 author 가 받는 것은
     *   Person 또는 Organization 이다. 실측에서 두 페이지의 Person 노드가 사라졌던 이유가
     *   이것이다(@id 가 같아 병합될 때 Physician 이 Person 을 덮었다).
     */
    '@type': ['Person', 'Physician'],
    '@id': `${CLINIC.url}/about/doctors#${d.slug}`,
    name: `${d.name} ${d.role}`,
    givenName: d.name,
    jobTitle: `치과의사 · ${d.role}`,
    medicalSpecialty: 'Dentistry',
    url: abs('/about/doctors'),
    image: abs(d.photo),
    worksFor: { '@id': `${CLINIC.url}/#clinic` },
    knowsAbout: d.focus,
    alumniOf: d.career
      .filter((c) => /대학|대학원|UCLA|Upenn/.test(c))
      .map((c) => ({ '@type': 'EducationalOrganization', name: c })),
    memberOf: d.societies.map((s) => ({ '@type': 'Organization', name: s })),
  }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: '의료진 소개',
            description: metadata.description as string,
            path: '/about/doctors',
          }),
          ...physicians,
        ]}
      />

      <AboutHero
        trail={TRAIL}
        photo="room"
        title={
          <>
            {/* ⚠️ 줄바꿈 앞에 공백을 둔다 — 없으면 문서의 제목이 "대표원장을포함해" 로
                   붙는다(화면은 멀쩡한데 크롤러가 읽는 글자만 망가진다). */}
            {/*
              ⚠️⚠️ '교수출신' 으로 되돌리지 말 것 (2026-09-02) ⚠️⚠️
                '출신' 은 그만두었다는 뜻인데 대표원장은 **현직** 경희대학교
                치의학전문대학원 외래교수다(lib/doctors.ts career 첫 줄).
                의료인의 경력 표시는 사실과 달라서는 안 된다(의료법 제56조).
                홈 의료진 구획도 같은 이유로 '외래교수인 대표원장' 이라고 쓴다.
              ★ '세 사람 모두 전문의' 는 셋의 license 가 모두 통합치의학과 전문의라
                성립한다. 한 사람이라도 바뀌면 이 문장부터 고칠 것.
            */}
            경희대 외래교수인 대표원장을 포함해{' '}
            <br />
            세 사람 모두 전문의입니다
          </>
        }
        /*
          ⚠️⚠️ '한차원 높은 의료서비스' 로 되돌리지 말 것 (2026-08-31) ⚠️⚠️
            원문은 "**개인 맞춤형 진료**를 제공합니다" 다. '한차원 높은' 은 우리가 붙인
            말이고, 다른 병원과 견주어 낫다는 **비교·우월성 표현**이라 의료광고 심의에서
            지적받는 유형이다. 원문에 있던 사실만 남긴다.
          ⚠️ '인증' → '인정' 은 유지한다(전문의 자격 제도의 공식 용어, lib/clinic.ts 정정 이력).
        */
        lead="손끝의 숙련도에 따라 결과가 달라지는 치과 진료, 10년 이상 경력의 교수출신 대표원장님과 보건복지부인증 전문의들로만 구성된 의료진이 개인 맞춤형 진료를 제공합니다."
      />

      {/*
        ★★ 원장 3인 (2026-09-01 오너: "색감도 없고 글씨도 작고 안 찐하고 카드 형태도 별로") ★★

        고친 세 가지
          ① 색 — 이 사이트의 강조색은 금색인데 이 페이지에만 한 점도 없었다. 직함 · 진료 분야 ·
             '학회활동' 머리를 모두 금색 글자로 세운다(상자는 씌우지 않는다 — 아래 주석 참고).
             앞 판본의 '학회활동' 알약은 bg-brand-500 이었는데, 어두운 결에서 그 이름은
             **회갈색(#9c9484)** 이라 강조로 보이지 않았다.
          ② 글자 — 경력 줄이 16px 에 가장 흐린 색(ink-soft)이었다. 17px 에 본문 색(twilight)
             으로 올린다. 이름도 36px → 최대 46px.
          ③ 카드 — 큰 둥근 상자 세 개가 쌓여 있었다. 상자를 걷고 가로줄로 나눈다.
             /about 을 랜딩 결로 바꿀 때와 같은 정리다 — 같은 규격의 상자가 반복되면
             화면이 한 겹으로 눌린다.

        ⚠️ 사진 비율(625×670)을 건드리지 말 것 — 세 장 모두 같은 비율이고, 인물 사진은
           촬영 시 여백까지 계산된 결과물이라 비율을 바꾸면 머리가 잘린다(전에 겪음).
        ⚠️ 사진을 오른쪽으로 옮기지 말 것 — 사람마다 방향이 다르면 읽는 눈이 매번 자리를
           다시 찾는다(components/saas.tsx 의 같은 규칙).
        ⚠️ id={d.slug} 를 지우지 말 것 — 홈과 스키마가 /about/doctors#slug 로 이 사람을 가리킨다.
        ⚠️ '자세히' 버튼을 되살리지 말 것 — 원장 개별 페이지는 없앴다(2026-08-31 운영자).
      */}
      {/*
        발행·수정일과 검토자 — 기계와 사람이 같은 값을 보게 한다.
        ⚠️ 여백(py·pt)을 가진 상자로 감싸지 말 것 — ArticleMeta 는 지금 null 을 돌려주므로
           감싼 상자만 남아 화면에 **빈 띠**가 생긴다(2026-09-01 실측). 다시 켜질 때를 대비해
           호출은 남기되, 아무것도 안 나오면 높이도 0 이어야 한다.
      */}
      <Container>
        <ArticleMeta path="/about/doctors" />
      </Container>

      {/*
        ⚠️⚠️ mt-14 를 되살리지 말 것 (2026-09-02 오너: "사진이 저 선까지 꽉차야
           되는거 아니야?") ⚠️⚠️
           히어로 사진은 원래도 제 상자를 꽉 채우고 있었다. 문제는 여기였다 —
           이 구획이 위로 56px 을 비우고 그 **끝에** 테두리를 그어서, 사진과 선
           사이에 흰 띠가 남았다. 사진이 덜 내려온 것처럼 보인 것이 그 띠다.
           (진료 페이지는 히어로 바로 밑이 베이지 띠라 그 틈이 없다 — 그래서 그쪽만
            '꽉 차' 보였다.)
        ★ 선은 남긴다. 사진 밑변에 붙어 히어로가 끝나는 자리를 짚어 준다.
      */}
      <section className="border-t border-brand-200/80">
        {DOCTORS.map((d, i) => (
          <article key={d.slug} id={d.slug} className="step-in scroll-mt-28 border-b border-brand-200/80">
            {/*
              ★ items-stretch — 사진이 **글 높이에 맞춰 늘어난다** (2026-09-01 오너: "사진이랑
                규격 맞추고 싶은데"). 앞 판본은 사진 461px 에 글 497~587px 라 아래가 어긋났다.
              ⚠️ 사진 칸을 430px 아래로 줄이지 말 것 — 상자가 세로로 길어질수록 원본(0.93 비율)에서
                 **좌우가 잘린다.** 500px 이면 가장 긴 원장(김동주)에서도 잘리는 폭이 48px 안쪽이라
                 어깨가 남는다. 430px 로 두면 118px 이 잘려 팔이 사라졌다.
            */}
            <Container className="grid gap-10 py-12 lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)] lg:items-stretch lg:gap-14 lg:py-16">
              {/* ⚠️ img-in 을 빼지 말 것 (2026-09-02 오너: "의료진 사진에도 모션 살짝"). */}
              <div className="img-in card-edge relative aspect-[625/670] w-full overflow-hidden rounded-[22px] bg-brand-100 lg:aspect-auto lg:h-full lg:min-h-[536px]">
                <Image
                  src={d.photo}
                  alt={`${CLINIC.name} ${d.role} ${d.name}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
              </div>

              <div>
                {/*
                  ⚠️⚠️ 직함을 이름 **위의 알약**으로 되돌리지 말 것 (2026-09-01 오너:
                     "원장을 이름 오른쪽 부분에 그냥 문구로, 꼭 위에 클로드 디자인으로 넣기보다") ⚠️⚠️
                    알약이 이름 위에 한 줄, 진료 분야가 그 아래 한 줄 — 상자가 겹겹이 쌓여
                    어디에나 있는 화면이 됐다. 직함은 이름 옆에 그냥 붙여 읽게 둔다.
                  ★ items-baseline — 46px 이름과 18px 직함의 **밑선**이 맞는다. 가운데(center)로
                    맞추면 큰 글자 옆에서 작은 글자가 떠 보인다.
                  ⚠️ 금색을 회갈색(brand-500)으로 되돌리지 말 것 — 어두운 결에서 그 이름은
                     회갈색이라 강조로 안 읽힌다.
                */}
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 className="display text-[clamp(32px,3.4vw,46px)] leading-[1.15] tracking-[-0.01em] text-ink">
                    {d.name}
                  </h2>
                  {/* ⚠️ '동그라미치과' 를 다시 붙이지 말 것 (2026-09-01 오너) — 페이지 전체가
                      이 병원 의료진 소개라 세 번 되풀이된다. 기계가 읽는 쪽(스키마 name·worksFor,
                      사진 alt)에는 병원명이 그대로 있으니 정보가 사라지는 것도 아니다. */}
                  <p className="text-[19px] font-black tracking-[-0.01em] text-clay-600">
                    {d.role}
                  </p>
                </div>

                {/*
                  진료 분야 — lib/doctors.ts 의 focus 다.
                  ★ 이 값은 이미 구조화 데이터(knowsAbout)로 기계에 내보내고 있었는데 화면에는
                    없었다. 화면과 기계가 같은 말을 하게 맞춘다.
                  ⚠️ '전문' 이 아니라 '진료 분야' 다. 전문의 자격과 진료 범위는 다른 말이라
                     섞어 쓰면 의료광고 심의에서 지적받는다.
                */}
                {/*
                  ⚠️⚠️ 테두리 알약으로 되돌리지 말 것 (2026-09-01 오너: "저 테두리 좀 다른걸로") ⚠️⚠️
                    바로 위 직함이 이미 알약(eyebrow-chip)이다. 그 아래 또 알약 줄이 오니
                    같은 모양이 두 줄 겹쳐 어디에나 있는 화면이 됐다.
                    금색은 그대로 두되 상자를 벗겨 **한 줄 글**로 둔다.
                  ⚠️ 구분자는 '·' 이 아니라 '/' 다 — 항목 안에 '보철·심미' 처럼 가운뎃점이 이미 있어
                     같은 기호를 쓰면 어디서 끊기는지 알 수 없다.
                */}
                {d.focus.length > 0 && (
                  <p className="mt-5 text-[16px] leading-[1.75] font-bold text-clay-600">
                    {d.focus.join(' / ')}
                  </p>
                )}

                {/*
                  ★★ 경력과 학회를 두 열로 (2026-09-01 실측) ★★
                    한 열로 흘렸더니 글 칸 762px 에 가장 긴 줄이 273~315px 뿐이라
                    **오른쪽 447~489px 가 통째로 비었다** — 글 칸의 60%다.
                    그 빈 칸 때문에 블록이 827px 로 길어지고 사진 아래도 366px 가 떴다.
                    두 열로 나누면 빈 폭이 채워지고 블록도 짧아진다.
                  ⚠️ 한 열로 되돌리지 말 것 — 경력 줄이 짧아서 반드시 오른쪽이 빈다.
                  ⚠️ 학회가 없는 원장(김인진)은 경력만 두 칸에 걸쳐 스스로 두 줄기로 흐르게 한다.
                     안 그러면 그 분만 오른쪽이 비어 셋이 어긋나 보인다.
                */}
                <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-2">
                  <div className={d.societies.length > 0 ? '' : 'lg:col-span-2'}>
                    <Label>학력 · 경력</Label>
                    <ul
                      className={`mt-4 space-y-2 ${
                        d.societies.length > 0 ? '' : 'lg:columns-2 lg:gap-x-12 lg:space-y-0'
                      }`}
                    >
                      {d.career.map((c) => (
                        <li
                          key={c}
                          className="text-[17px] leading-[1.7] text-twilight lg:break-inside-avoid lg:py-1"
                        ><Sentences text={c} /></li>
                      ))}
                    </ul>
                  </div>

                  {d.societies.length > 0 && (
                    <div>
                      <Label>학회활동</Label>
                      <ul className="mt-4 space-y-2">
                        {d.societies.map((s) => (
                          <li key={s} className="text-[17px] leading-[1.7] text-twilight"><Sentences text={s} /></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </article>
        ))}
      </section>

      {/*
        ★★ 사회활동 — 원본 의료진 페이지에 있는데 우리에게 없던 구획 (2026-08-31) ★★
          운영자가 원본 캡처를 주며 "빠진 내용은 보충하고".
        ⚠️ 글자는 **원문 그대로**다. '십수년간' 같은 기간 표현도 병원이 쓴 말이라 손대지 않았다.
        ⚠️ 사진 설명은 현수막에 **적혀 있는 것만** 옮겼다 — 날짜·장소·주최가 사진에 다 있다.
           사진에 없는 것(참여 인원, 진료 건수 따위)을 덧붙이지 말 것. 그건 지어내는 것이다.
      */}
      <section className="border-t border-brand-200/80 py-16">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,52%)] lg:gap-16">
            <div>
              <p className="text-[16.5px] leading-[1.8] text-clay-600">
                기부와 나눔의 문화로
                <br />
                사회활동에 적극적으로 참여하는 치과
              </p>
              <h2 className="display-sm mt-5 text-[clamp(26px,2.8vw,34px)] leading-[1.4] text-ink">
                동그라미치과는 십수년간
                <br />
                농어촌 무료 진료봉사를
                <br />
                이어왔습니다.
              </h2>
            </div>

            <figure>
              <div className="overflow-hidden rounded-2xl border border-brand-200/70 bg-brand-50">
                <Image
                  src="/img/20210906_f3a7bf044c792.png"
                  alt="농촌사랑 의료봉사 활동 단체 사진 — 현수막에 '경희대학교 치과대학병원 무료진료', 기간 2014. 02. 05~02. 08, 장소 팔탄농협 2층 회의실, 주최 팔탄농업협동조합과 경희대학교 치과대학 봉사동아리(CDSA)"
                  width={760}
                  height={430}
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  className="h-auto w-full"
                />
              </div>
              {/*
                ⚠️ 이 설명을 지우지 말 것 — 사진 속 현수막이 유일한 근거다. 캡션으로 적어 두면
                   사람도 기계도 '언제·어디서·누구와' 를 사진을 뜯어보지 않고 알 수 있다.
              */}
              <figcaption className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                농촌사랑 의료봉사 활동전개 · 2014. 02. 05 ~ 02. 08 · 팔탄농협 2층 회의실 ·
                팔탄농업협동조합, 경희대학교 치과대학 봉사동아리(CDSA)
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* 인증·수료 */}
      {/* ⚠️ 어두운 면으로 되돌리지 말 것 — 종이 문서 넉 장은 밝은 면에 놓일 때 문서로 읽힌다. */}
      <section className="light-band py-12 sm:py-16 lg:py-20">
        <Container>
          <h2 className="display-sm text-[clamp(24px,2.6vw,32px)] text-ink">어떤 인증과 수료를 받았나요?</h2>
          {/*
            ★★ 네모 액자 격자 → **홈과 같은 부채꼴 진열** (2026-09-02 오너: "저런 위촉패나
               저런것들도 좀 카드 배경 없애고 임팩트나 모션 넣어주고") ★★
               같은 인증패 넷을 홈은 커서를 따라 기우는 입체 진열로, 여기는 네모 액자로
               보여 주고 있었다. **같은 물건에 화면이 두 벌**이었고, 이쪽이 더 밋밋했다.
               이제 컴포넌트 하나(components/CredentialFan.tsx)를 양쪽이 함께 쓴다.
            ★ 상자를 없앴다 — 인증서 PNG 는 배경이 지워져 있어 drop-shadow 가 실제 윤곽을
              따라간다. 액자 안의 액자가 사라지고 인증패 자체가 커진다.
            ⚠️ 액자 격자로 되돌리지 말 것. 되돌리면 홈과 다시 두 벌이 된다 —
               고치려면 CredentialFan 쪽을 고칠 것.
            ⚠️ href={null} 이다 — 이 페이지가 그 링크의 목적지라 자기 자신으로 가는 링크가 된다.
          */}
          <CredentialFan href={null} />
        </Container>
      </section>

      {/*
        발표 논문.
        ★★ 스르륵 (2026-09-02 오너: "밑에 논문도 스르륵 나오게 해주고") ★★
          바깥 .seq 가 관찰 대상이고, 안쪽 .seq-fade 들이 --d 만큼 늦게 하나씩 뜬다.
          라벨 → 제목 → 저자 → 요약 → 사진 순서다.
        ⚠️ 순서를 뒤집지 말 것 — 사진이 먼저 뜨면 글이 사진 위에서 튀어 읽는 순서가 사라진다.
        ⚠️ 관찰자를 새로 만들지 말 것. 레이아웃에 하나뿐인 RevealScript 가 .seq 를 이미 본다.
      */}
      <Container className="py-16">
        <div className="seq overflow-hidden rounded-2xl border border-brand-200/70 bg-parchment">
          <div className="grid gap-0 lg:grid-cols-2">
            <div className="p-8 lg:p-10">
              <p className="seq-fade eyebrow-chip text-clay-600" style={{ ['--d' as string]: '0ms' }}>
                발표 논문
              </p>
              <h2
                className="seq-fade display-sm mt-5 text-[clamp(21px,2.2vw,26px)] leading-snug text-ink"
                style={{ ['--d' as string]: '140ms' }}
              >
                {PUBLICATION_DETAIL.title}
              </h2>
              <p
                className="seq-fade mt-4 text-[15.5px] text-ink-soft"
                style={{ ['--d' as string]: '300ms' }}
              >
                {PUBLICATION_DETAIL.authors}
              </p>
              <div className="seq-fade mt-6 rounded-2xl bg-brand-50 p-5" style={{ ['--d' as string]: '440ms' }}>
                <p className="text-[13.5px] font-black tracking-[0.14em] text-clay-600 uppercase">
                  Clinical Relevance
                </p>
                <p className="mt-2.5 text-[16px] leading-relaxed text-twilight">
                  <Sentences text={PUBLICATION_DETAIL.relevanceKo} />
                </p>
              </div>
            </div>
            {/*
              ★ 원본(768×800)은 위 60% 가 흐린 배경이고 **노트북과 논문은 아래쪽**에 있다.
                object-top 으로 자르면 정작 논문이 화면 밖으로 밀린다(실제로 그랬다).
                아래를 기준으로 잘라야 제목·저자까지 들어온다.
            */}
            <div
              className="seq-fade img-in relative min-h-[340px] bg-brand-100"
              style={{ ['--d' as string]: '600ms' }}
            >
              <Image
                src={PUBLICATION_DETAIL.image}
                alt="발표 논문 — Long-term Follow-up of Complicated Crown Fracture With Fragment Reattachment"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-bottom"
              />
            </div>
          </div>
        </div>
      </Container>

      <ContactCta />
    </>
  );
}
