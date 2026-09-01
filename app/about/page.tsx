import type { Metadata } from 'next';
import { ArticleMeta, headingId } from '@/components/article';
import Link from 'next/link';
import Image from 'next/image';
import { OUTREACH, CREDENTIALS } from '@/lib/clinic';
import { IMG } from '@/lib/assets';
import { Container, SectionHead, ContactCta, Sentences, Breadcrumb, bindKo } from '@/components/ui';
import { SpecialGrid } from '@/components/SpecialGrid';
import { InteriorGallery } from '@/components/InteriorGallery';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, faqSchema, medicalWebPageSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: '동그라미의 특별함',
  description:
    '고양시 덕양구 화정동 동그라미치과의원. 자연 그대로의 치아를 최대한 살리는 것이 진료 철학이며, 임플란트는 마지막 선택이 될 수 있도록 합니다. 10년 이상 경력의 대학병원 교수 출신 대표원장이 진료합니다.',
  alternates: { canonical: '/about' },
};

const TRAIL = [
  { name: '홈', path: '/' },
  { name: '병원 소개', path: '/about' },
];

const TITLE = '자연 그대로의 치아를 최대한 살리는 것이 동그라미 치과의 진료 철학입니다';
const LEAD =
  '임플란트는 마지막 선택이 될 수 있도록 합니다. 뽑고 심는 것이 빠른 길처럼 보여도, 자연치아는 씹는 힘의 세기와 방향을 감지하는 감각을 갖고 있어 대체하기 어렵습니다. 그래서 남길 수 있는 조건인지를 먼저 확인합니다.';

/**
 * 병원 소개.
 *
 * ★★ 이 페이지의 모든 문장은 기존 홈페이지 원문에서 온다 ★★
 *   이전 버전에는 제가 지어낸 '네 가지 원칙' 이 있었다. 병원 방침을 외부에서 창작하면
 *   실제와 어긋나고, 의료광고에서 사실이 아닌 표시는 의료법 제56조 위반이다. 전부 걷어냈다.
 *   출처는 lib/clinic.ts 의 STRENGTHS / OUTREACH / CREDENTIALS 이며 그 상수들이 원문을 담고 있다.
 *
 * ★ AEO 구조 — 질문형 H2 + 즉답
 *   "동그라미치과의원은 어떤 곳인가요" 같은 질의에 대해 AI 는 질문과 같은 제목 바로 뒤의
 *   짧은 문단을 인용한다. 그래서 소개문을 서술형 제목("병원 소개") 아래 묻지 않고,
 *   실제 질문을 제목으로 세우고 그 자리에서 답을 끝낸다.
 *
 * ★★ 왜 이 페이지만 다른 문법인가 (2026-09-01 오너: "랜딩페이지 디자인으로") ★★
 *   앞 판본은 화면 전체가 **같은 둥근 카드의 반복**이었다 — 문답 3장, 특별함 7장,
 *   사회공헌 2장. 규격이 하나뿐이면 어디를 봐도 같은 무게라 '만들어진 화면' 이 아니라
 *   '항목을 늘어놓은 문서' 로 읽힌다.
 *   여기서는 **면의 성격을 번갈아** 준다 — 사진이 화면 끝까지 나가는 구간, 카드 없이
 *   헤어라인만으로 나눈 구간, 카드 구간. 그 리듬이 랜딩페이지의 결이다.
 *
 * ⚠️ 되돌리지 말 것 (같아 보이는 화면을 만드는 지점들)
 *   ① 체크 동그라미(✓) 목록 — 어느 사이트에나 있는 장식이고, 자격은 사실이라 장식이 필요 없다.
 *   ② 그라데이션 버튼 — 이 사이트의 버튼은 단색 아니면 테두리다.
 *   ③ 카드마다 같은 눈썹 라벨 반복 — 7장에 같은 말이 7번 나왔다.
 *   ④ 사진 위 큰 번호 — 번호+라벨 조합은 이미 한 번 '경쟁 병원과 똑같다' 는 지적을 받았다.
 */
const ABOUT_QA = [
  {
    q: '동그라미치과의원은 어떤 곳인가요?',
    a: '경기도 고양시 덕양구 화정동 현창빌딩 3층에 있는 치과의원입니다. 자연 그대로의 치아를 최대한 살리는 것을 진료 철학으로 두고, 임플란트는 마지막 선택이 될 수 있도록 합니다. 10년 이상 경력의 대학병원 교수 출신 대표원장과 보건복지부 인정 전문의로 구성된 의료진이 진료합니다.',
  },
  {
    q: '어떤 진료를 받을 수 있나요?',
    a: '자연치아살리기(충치치료·치아신경치료·잇몸치료), 임플란트, 심미치료(심미보철·치아미백), 사랑니치료를 진료합니다. 같은 증상이라도 남은 치아와 잇몸뼈 상태에 따라 선택이 달라지므로 검사 후 계획을 세웁니다.',
  },
  {
    q: '진료시간은 어떻게 되나요?',
    a: '월·수·금은 오전 9시 30분부터 오후 6시 30분까지, 화·목은 오후 8시 30분까지 야간 진료를 합니다. 토요일은 오후 2시까지이며 일요일과 공휴일은 휴진입니다. 평일 점심시간은 오후 1시부터 2시 30분까지입니다.',
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(TRAIL),
          medicalWebPageSchema({
            title: '동그라미의 특별함',
            description: ABOUT_QA[0].a,
            path: '/about',
          }),
          faqSchema(ABOUT_QA),
        ]}
      />

      {/*
        ★★ 머리 — 사진이 보이는 것이 요점이다 (2026-09-01 오너: "배경사진도 좀 잘보이게") ★★
          공용 PageHero 는 사진을 76% 덮는다. 가운데 정렬 글 **뒤쪽 전체**가 어두워야
          작은 금색 글자까지 버티기 때문이다(그쪽 주석의 2.26:1 실측).
          여기서는 글을 **아래 왼쪽으로 몰아** 두고 덮개도 아래쪽에만 준다.
          그래서 사진 위쪽 절반은 거의 그대로 보이고, 글이 앉는 자리만 어둡다.
        ⚠️ 글을 가운데로 되돌리지 말 것 — 그러면 화면 전체를 덮어야 해서 사진이 다시 사라진다.
        ⚠️⚠️ 덮개를 여기서 더 옅게 하지 말 것 — **여기가 바닥이다** (2026-09-01 실측) ⚠️⚠️
           오너 요청으로 두 번 밝혔고, 지금 값에서 빵부스러기가 4.92:1 이다(기준 4.5).
           여유가 0.42 뿐이라 한 단만 더 밝히면 바로 미달이다.
           제목 9.14:1 · 본문 8.83:1 은 넉넉하지만, **가장 위에 있는 작은 글자**가 늘 먼저 깨진다.
        ⚠️ 사진 위에 작은 금색 글자를 올리지 말 것 — 금색은 흰색보다 먼저 무너진다.
      */}
      <section className="relative isolate -mt-[68px] flex min-h-[88vh] flex-col justify-end overflow-hidden bg-wine-deep pt-[68px] text-parchment sm:-mt-[94px] sm:pt-[94px]">
        <Image
          src={IMG.interior[2].src}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_38%]"
        />
        {/*
          아래에서 위로 — 글이 앉는 아래 절반만 덮고 위 절반은 사진 그대로 둔다.
          ⚠️ 스톱 위치를 위로 올리지 말 것 (2026-09-01 실측) — 글 덩어리가 화면 32~84% 를
             차지해서, 0.55 로 걸쳐 있던 자리에서 제목이 2.91:1(기준 3), 본문이 2.61:1(기준 4.5)
             이었다. 복도 끝의 밝은 문이 정확히 그 자리 뒤에 있다.
        */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(30,28,25,0.82)_0%,rgba(30,28,25,0.78)_30%,rgba(30,28,25,0.64)_50%,rgba(30,28,25,0.20)_70%,rgba(30,28,25,0.02)_100%)]"
        />
        {/* 왼쪽에서 오른쪽으로 한 겹 더 — 글 줄이 긴 쪽만 받쳐 준다. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,28,25,0.40)_0%,rgba(30,28,25,0.18)_46%,rgba(30,28,25,0)_76%)]"
        />

        <Container className="relative pb-16 lg:pb-24">
          <Breadcrumb trail={TRAIL} tone="dark" />
          <h1
            id={headingId(TITLE)}
            className="display-sm mt-8 max-w-[17em] scroll-mt-28 text-[clamp(30px,4.4vw,54px)] leading-[1.2] tracking-[-0.03em] text-parchment"
          >
            {bindKo(TITLE)}
          </h1>
          <p className="mt-7 max-w-[44em] text-[17px] leading-[1.9] text-parchment/85 sm:text-[18px]">
            <Sentences text={LEAD} />
          </p>
        </Container>
      </section>

      {/*
        ★ 문답 — 카드를 걷고 헤어라인만 남겼다.
          질문이 왼쪽 기둥, 답이 오른쪽 기둥이다. 눈이 왼쪽에서 질문을 훑고 오른쪽에서 답을 읽는다.
        ⚠️ 질문형 H2 + 바로 아래 답 구조를 깨지 말 것 — AI 가 이 페이지에서 인용해 가는 자리다.
        ⚠️ 카드로 되돌리지 말 것(2026-09-01 오너) — 문답·특별함·사회공헌이 전부 같은 둥근 카드라
           화면이 한 겹으로 눌렸다.
      */}
      <section className="border-b border-brand-200/60">
        {ABOUT_QA.map((qa) => (
          <div key={qa.q} className="border-t border-brand-200/60">
            <Container className="grid gap-5 py-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-16">
              <h2
                id={headingId(qa.q)}
                className="display-sm scroll-mt-28 text-[clamp(20px,2.3vw,27px)] leading-[1.4] tracking-[-0.02em] text-ink"
              >
                {bindKo(qa.q)}
              </h2>
              <p className="max-w-[62ch] text-[17px] leading-[1.95] text-ink-soft">
                <Sentences text={qa.a} />
              </p>
            </Container>
          </div>
        ))}
      </section>

      {/*
        ★★ 의료진 — 글 왼쪽, 사진 오른쪽. 사진은 **상자에 담는다** ★★
          (2026-09-01 오너: "그냥 저 문구 오른쪽에 사각형으로 하는게 낫겠다,
           배경 그라데이션 하니깐 이상하네, 왼쪽 문구랑 규격 맞춰서")

        ⚠️⚠️ 화면 끝까지 내보내는 방식으로 되돌리지 말 것 ⚠️⚠️
          그렇게 하면 사진 가장자리를 판 색으로 녹여야 하는데(그라데이션), 원본이 순백
          스튜디오 컷이라 녹인 자리가 얼룩처럼 보였다. 게다가 오른쪽 끝은 퀵메뉴가 덮어서
          세 번째 원장님 얼굴이 가려졌다.
          상자에 담으면 셋 다 없어진다 — 녹일 가장자리가 없고, 퀵메뉴 앞에서 끝나고,
          왼쪽 글 덩어리와 **폭이 나란해진다**(글 580px · 사진 571px).
        ⚠️ 높이까지 맞추려고 세로로 늘리지 말 것 — 3:2 를 1:1 쪽으로 좁히면 양 끝 두 분의
           어깨가 잘려 나간다(원본에서 세 분이 가로를 거의 꽉 채운다). 세로 가운데 정렬로 둔다.

        ★ 사진은 이 상자에 맞춰 미리 잘라 둔 것을 쓴다(IMG.doctorsTeam). 이유는 그쪽 주석 참조.
        ⚠️ 자격 목록에 체크 동그라미를 되살리지 말 것(2026-09-01 오너). 사실을 적은 줄이라
           장식이 필요 없고, 그 장식이 '어디서나 보는 화면' 을 만드는 지점이다.
      */}
      <section className="bg-parchment py-16 lg:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-16">
          <div className="w-full max-w-[580px]">
            <SectionHead
              eyebrow="의료진"
              title={
                <>
                  대학병원 교수출신{' '}
                  <br />
                  대표원장님과 의료진
                </>
              }
              desc="손끝의 숙련도에 따라 결과가 달라지는 치과 진료, 10년 이상 경력의 교수출신 대표원장님과 보건복지부 인정 전문의들로만 구성된 의료진이 한차원 높은 의료서비스를 제공합니다."
            />

            <ul className="mt-9 border-t border-brand-200/60">
              {CREDENTIALS.map((c) => (
                <li
                  key={c}
                  className="border-b border-brand-200/60 py-3.5 text-[16px] leading-[1.7] text-ink-soft"
                >
                  {c}
                </li>
              ))}
            </ul>

            {/* ⚠️ 그라데이션 버튼으로 되돌리지 말 것 — 이 사이트의 버튼은 단색 아니면 테두리다. */}
            <Link
              href="/about/doctors"
              className="mt-9 inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink/70 px-7 py-3.5 text-[16.5px] font-bold text-ink transition-colors hover:bg-ink hover:text-parchment"
            >
              의료진 자세히 보기 <span aria-hidden>→</span>
            </Link>
          </div>

          {/*
            사진 상자 — 왼쪽 글 덩어리와 세로로 가운데를 맞춘다.
            ⚠️ 3:2 를 바꾸지 말 것 — 원본을 이 비율에 맞춰 미리 잘라 뒀다(lib/assets.ts).
               다른 비율을 주면 그 안에서 또 잘려 구도가 어긋난다.
            ⚠️ card-edge — 사이트의 다른 사진 액자와 같은 안쪽 선이다. globals.css 참조.
          */}
          <div className="card-edge relative aspect-[3/2] w-full overflow-hidden rounded-[22px]">
            <Image
              src={IMG.doctorsTeam}
              alt="동그라미치과의원 의료진 — 가운데가 대표원장입니다."
              fill
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* 특별함 7 — 원문 그대로 */}
      <section className="py-20 lg:py-28">
        <Container>
          {/* ⚠️ 제목에 개수를 박지 말 것 — '다섯 가지' 라면서 7개였다(2026-09-01 오너 지적).
              항목이 바뀔 때마다 거짓말이 된다. */}
          <SectionHead
            eyebrow="동그라미 치과만의 특별함"
            title="동그라미치과는 무엇이 다른가요?"
            desc="누가 보는지, 무엇으로 보는지, 오시기 편한지 — 병원을 고를 때 실제로 궁금한 것들입니다. 각 항목을 누르면 어떤 장비와 방법을 쓰는지 자세히 보실 수 있습니다."
          />
          <div className="mt-12">
            <SpecialGrid eager />
          </div>
        </Container>
      </section>

      {/*
        내부 둘러보기 — /about/tour 에서 옮겨 왔다 (2026-09-01, 페이지 합침).
        ⚠️ 다시 별도 페이지로 떼지 말 것 — 그때 본문이 209자뿐이라 검색에는 빈 페이지였다.
        ★ 사진 열두 장의 설명(alt)은 이 사이트가 가진 몇 안 되는 1차 자료다. 지우지 말 것.
      */}
      <section className="border-y border-brand-200/60 bg-parchment py-20 lg:py-28">
        <Container>
          <SectionHead
            eyebrow="공간"
            title="어떤 공간에서 진료하나요?"
            desc="상담실과 진료실, 소독실을 미리 보실 수 있습니다."
          />
          <div className="mt-10">
            <InteriorGallery />
          </div>
        </Container>
      </section>

      {/*
        ⚠️ 큰 구획으로 되돌리지 말 것 (2026-09-01 오너) — 내용이 두 줄뿐이라 아래가 통째로 비었다.
        ⚠️ 문장은 버리지 말 것 — 십수년 봉사와 방송 기록은 **제3자가 확인할 수 있는 사실**이라
           AI 검색이 신뢰 근거로 읽는 부분이다. 줄이되 없애지 않는다.
        ⚠️ 카드로 되돌리지 말 것 — 두 줄짜리 사실에 상자를 씌우면 특별함 카드와 같은 무게가 된다.
      */}
      <Container className="py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <p className="text-[13.5px] font-black tracking-[0.06em] text-brand-500">사회공헌</p>
          <div className="max-w-[62ch] space-y-4">
            {OUTREACH.map((o) => (
              <p key={o} className="text-[17px] leading-[1.9] text-ink-soft">
                <Sentences text={o} />
              </p>
            ))}
            <div className="pt-6">
              <ArticleMeta path="/about" />
            </div>
          </div>
        </div>
      </Container>

      {/*
        ⚠️ '의료진 소개 · 오시는 길' 카드를 되살리지 말 것 (2026-09-01 오너: "자꾸 연결됨").
           주 메뉴에도, 푸터에도, 이 페이지 안 의료진 구획에도 이미 있다 — 네 번째였다.
        ⚠️ 진료 네 갈래 버튼도 되살리지 말 것 — 같은 링크가 주 메뉴(진료)에 이미 있고,
           이 페이지 첫 화면은 '이 병원이 어떤 곳인가' 를 말하는 자리다.
      */}
      <ContactCta />
    </>
  );
}
