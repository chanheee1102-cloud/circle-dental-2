import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { IndexHero, DocSection } from '@/components/article';
import { Reveal } from '@/components/Motion';
import { CLINIC } from '@/lib/clinic';
import { SITE_URL, CLINIC_ID } from '@/lib/schema';
import { SITE_MODIFIED, formatKoreanDate } from '@/lib/contentMeta';

export const metadata: Metadata = {
  title: `개인정보처리방침 — ${CLINIC.shortName}`,
  description:
    '동그라미치과의원의 개인정보 처리 기준입니다. 홈페이지에서는 개인정보를 수집하지 않으며, 내원 진료 시 받는 정보와 보존기간을 법령 근거와 함께 적었습니다.',
  alternates: { canonical: '/privacy' },
};

/**
 * 개인정보처리방침.
 *
 * ★★ 왜 있어야 하나 ★★
 *   「개인정보 보호법」 제30조가 '정보주체가 쉽게 확인할 수 있도록' 공개하라고 정하고 있고,
 *   그 관행상의 자리가 푸터다. 푸터에서 링크하는데 페이지가 없으면 404 를 가리키는
 *   법정 고지가 된다 — 없느니만 못하다.
 *
 * ⚠️⚠️ 내용은 지어내지 않았다 ⚠️⚠️
 *   기존 circle-dental 프로젝트의 같은 페이지에서 옮겨 적은 것이고, 인용한 조문
 *   (의료법 시행규칙 제15조의 보존기간, 개인정보 보호법 제23·30·31·35~37조,
 *   의료법 제21조)도 그대로다. 법령 근거가 붙은 문서라 임의로 다듬으면 안 된다.
 *
 * ⚠️ 개인정보 보호책임자의 성명·직책은 **비워 두었다.**
 *    「개인정보 보호법」 제31조가 지정·공개를 정하고 있지만, 추측해서 적으면
 *    사실과 다른 법정 고지가 된다. 확인되면 그 자리에 넣는다.
 */
export default function PrivacyPage() {
  return (
    <>
      <main>
        <IndexHero
          eyebrow="Privacy"
          lines={['개인정보를', '어떻게 다루나요?']}
          lede={`${CLINIC.name}은 「개인정보 보호법」과 「의료법」에 따라 환자의 개인정보를 보호하고 관련 고충을 신속하게 처리하기 위해 다음과 같이 처리방침을 두고 있습니다. 이 방침은 홈페이지 이용과 내원 진료 모두에 적용됩니다.`}
          crumbs={[
            { label: '홈', href: '/' },
            { label: '개인정보처리방침', href: '/privacy' },
          ]}
        />

        <section className="bg-paper py-20 md:py-28">
          <div className="shell max-w-[74ch]">
            <Reveal>
              <p className="text-[13.5px] text-ink-2">
                최종 확인{' '}
                <time dateTime={SITE_MODIFIED} className="font-bold text-ink">
                  {formatKoreanDate(SITE_MODIFIED)}
                </time>
              </p>
            </Reveal>

            <div className="mt-12 space-y-14">
              {SECTIONS.map((s, i) => (
                <DocSection key={s.title} title={`${i + 1}. ${s.title}`}>
                  <p className="t-body font-semibold text-ink">{s.lead}</p>
                  {s.body.map((p) => (
                    <p key={p.slice(0, 20)} className="t-body mt-5">
                      {p}
                    </p>
                  ))}
                </DocSection>
              ))}

              {/*
                ⚠️ 확인되지 않은 항목은 '아직 없음' 이라고 밝히고 비워 둔다.
                   추측해서 채우면 그건 사실과 다른 법정 고지가 된다.
              */}
              <DocSection title="9. 개인정보 보호책임자 지정">
                <p className="t-body font-semibold text-ink">
                  「개인정보 보호법」 제31조는 개인정보 보호책임자를 지정해 공개하도록 정하고 있습니다.
                </p>
                <p className="t-body mt-5">
                  성명과 직책이 확인되면 이 자리에 표기합니다. 추측해서 적으면 사실과 다른 고지가 되므로
                  비워 두었습니다. 그전까지 개인정보에 관한 문의는 대표전화 {CLINIC.phone} 또는{' '}
                  {CLINIC.email}로 연락 주시기 바랍니다.
                </p>
              </DocSection>
            </div>
          </div>
        </section>
      </main>

      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${SITE_URL}/privacy#webpage`,
            url: `${SITE_URL}/privacy`,
            name: '개인정보처리방침',
            inLanguage: 'ko-KR',
            dateModified: SITE_MODIFIED,
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': CLINIC_ID },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: '개인정보처리방침', item: `${SITE_URL}/privacy` },
              ],
            },
          },
        ]}
      />
    </>
  );
}

/**
 * 본문 — 기존 circle-dental 의 같은 페이지에서 그대로 옮겼다.
 * ⚠️ 법령 근거가 붙은 문장이다. 읽기 좋게 다듬는다는 이유로 조문 번호·기간을 바꾸지 말 것.
 */
const SECTIONS = [
  {
    title: '홈페이지에서 수집하는 정보',
    lead: '회원가입·문의·예약 양식이 없으므로 홈페이지에서 이름·연락처 등을 입력받는 절차가 존재하지 않습니다.',
    body: [
      '이 홈페이지에는 개인정보를 입력받는 양식이 하나도 없습니다. 상담과 예약은 전화, 네이버 예약, 카카오톡 채널로 연결되며 이때 입력하신 정보는 각 서비스 사업자가 처리하고 저희 서버를 거치지 않습니다. 따라서 해당 채널의 개인정보 처리는 네이버 및 카카오의 개인정보처리방침을 따릅니다.',
      '다만 홈페이지를 제공하는 과정에서 웹서버의 접속 기록(접속 일시, 브라우저 종류, 접속한 주소)이 자동으로 남을 수 있습니다. 이 기록은 서비스 운영과 장애 대응 목적으로만 쓰이며 개인을 특정하는 용도로 이용하지 않습니다.',
    ],
  },
  {
    title: '외부 서비스와 쿠키',
    lead: '병원 소개 영상과 지도는 외부 서비스를 화면에 얹어 보여주는 방식이라, 해당 서비스의 쿠키가 사용될 수 있습니다.',
    body: [
      '홈페이지 첫 화면의 병원 영상은 Vimeo, 오시는 길의 지도는 Google 지도를 화면에 함께 실어 보여줍니다. 이 과정에서 각 서비스가 브라우저에 쿠키를 남길 수 있으며 이는 저희가 아니라 해당 사업자가 처리합니다. 영상은 추적을 최소화하는 설정(Do Not Track)을 적용해 제공하고 있습니다.',
      '브라우저 설정에서 쿠키 저장을 거부하실 수 있습니다. 다만 거부하시면 영상이나 지도가 정상적으로 보이지 않을 수 있습니다.',
    ],
  },
  {
    title: '내원 시 수집하는 정보',
    lead: '접수·진료·보험청구에 필요한 최소한의 정보를 받으며, 건강에 관한 정보는 민감정보로 분류해 별도로 관리합니다.',
    body: [
      '진료 접수 시 성명, 생년월일, 연락처, 주소를 받고 진료 과정에서 병력·복용약·검사결과·방사선 영상 등 건강에 관한 정보가 기록됩니다. 건강정보는 「개인정보 보호법」 제23조의 민감정보에 해당하므로 진료와 법령이 정한 목적 외에는 사용하지 않습니다.',
      '수집한 정보는 진료와 상담, 진료비 청구와 수납, 건강보험 요양급여 청구, 진료기록의 작성과 보관, 그리고 법령상 의무 이행을 위해 사용합니다. 이 범위를 벗어나는 목적으로는 이용하지 않으며, 마케팅 목적으로 활용하지 않습니다.',
    ],
  },
  {
    title: '진료기록 보존기간',
    lead: '진료기록의 보존기간은 「의료법 시행규칙」 제15조에 정해져 있으며, 병원이 임의로 늘리거나 줄일 수 없습니다.',
    body: [
      '「의료법 시행규칙」 제15조는 기록의 종류마다 보존기간을 정하고 있습니다. 진료기록부와 수술기록은 10년, 환자 명부와 검사내용 및 검사소견기록, 방사선 사진과 그 소견서, 간호기록부는 5년, 진단서 등의 부본은 3년, 처방전은 2년입니다.',
      '보존기간이 지난 기록은 복구할 수 없는 방법으로 파기합니다. 전자적으로 저장된 기록은 재생이 불가능한 기술적 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.',
    ],
  },
  {
    title: '제3자 제공',
    lead: '건강보험 청구처럼 법령에 근거가 있거나 환자가 동의한 경우에 한해 제공합니다.',
    body: [
      '원칙적으로 개인정보를 외부에 제공하지 않습니다. 다만 국민건강보험공단·건강보험심사평가원에 요양급여를 청구하는 경우, 법령에 특별한 규정이 있는 경우, 수사기관이 법이 정한 절차에 따라 요구하는 경우, 그리고 환자 본인이 동의한 경우에는 그 범위 안에서 제공합니다.',
      '다른 의료기관으로 진료 의뢰나 회송이 필요할 때는 환자의 동의를 받은 뒤 진료에 필요한 범위의 정보만 전달합니다.',
    ],
  },
  {
    title: '정보주체의 권리',
    lead: '열람, 정정·삭제, 처리정지를 요구하실 수 있고 병원은 지체 없이 조치해야 합니다.',
    body: [
      `「개인정보 보호법」 제35조부터 제37조에 따라 본인의 개인정보에 대한 열람, 정정과 삭제, 처리정지를 요구하실 수 있습니다. 요구는 전화(${CLINIC.phone}) 또는 이메일(${CLINIC.email})로 하실 수 있으며 병원은 지체 없이 필요한 조치를 하겠습니다.`,
      '다만 진료기록은 「의료법」이 보존을 의무로 정하고 있어 보존기간 안에는 삭제 요구에 응하기 어려울 수 있습니다. 이 경우 그 사유를 알려 드립니다. 만 14세 미만 아동의 정보는 법정대리인이 위 권리를 행사하실 수 있습니다.',
      '진료기록 사본의 발급은 「의료법」 제21조에 따라 환자 본인, 또는 법이 정한 요건을 갖춘 대리인이 신분 확인 절차를 거쳐 신청하실 수 있습니다.',
    ],
  },
  {
    title: '안전성 확보 조치',
    lead: '접근 권한을 최소한으로 제한하고, 기록에 접근한 이력을 남깁니다.',
    body: [
      '진료기록에 접근할 수 있는 사람을 업무상 필요한 최소한으로 제한하고 접근 권한을 부여·변경·말소한 기록을 남깁니다. 개인정보를 다루는 직원에게는 정기적으로 교육을 실시하며, 기록이 보관된 장소는 잠금장치를 두어 통제합니다.',
    ],
  },
  {
    title: '문의처',
    lead: '개인정보 처리에 관한 문의, 불만 처리, 피해 구제는 아래로 연락 주시면 됩니다.',
    body: [
      `${CLINIC.name} (대표전화 ${CLINIC.phone}, ${CLINIC.email})으로 연락 주시기 바랍니다. 개인정보 침해에 관한 상담이 필요하시면 개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118), 개인정보 분쟁조정위원회(kopico.go.kr, 1833-6972)의 도움을 받으실 수 있습니다.`,
    ],
  },
] as const;
