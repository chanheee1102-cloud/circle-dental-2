import Image from 'next/image';
import { IMG } from '@/lib/assets';
import { Container, Breadcrumb, Sentences, bindKo } from '@/components/ui';
import { headingId } from '@/components/article';

/**
 * 병원 소개 구역의 머리말 — **사진이 보이는 머리**.
 *
 * ★★ 왜 공용 PageHero 를 안 쓰나 (2026-09-01 오너: "병원소개 서브페이지들은 전부
 *    히어로 그 배경 사진 밝히자, about 페이지처럼") ★★
 *   PageHero 는 글을 가운데에 두기 때문에 **글 뒤쪽 전체**가 어두워야 한다. 그래서 사진을
 *   76% 덮고, 결과적으로 사진이 질감으로만 남는다(그쪽 주석의 2.26:1 실측 참고).
 *   여기서는 글을 아래 왼쪽으로 몰고 덮개도 아래쪽에만 준다. 위 절반은 사진 그대로다.
 *
 * ⚠️⚠️ 덮개 값을 더 옅게 하지 말 것 — **여기가 바닥이다** (2026-09-01 실측) ⚠️⚠️
 *   오너 요청으로 두 번 밝혔고, 지금 값에서 가장 위에 있는 작은 글자(빵부스러기)가
 *   4.92:1 이다(기준 4.5). 여유가 0.42 뿐이라 한 단만 더 밝히면 바로 미달이다.
 *   제목·본문은 9:1 대로 넉넉하지만 **작은 글자가 늘 먼저 깨진다.**
 * ⚠️ 글을 가운데로 되돌리지 말 것 — 그러면 화면 전체를 덮어야 해서 사진이 다시 사라진다.
 * ⚠️ 사진 위에 작은 금색 글자를 올리지 말 것 — 금색은 흰색보다 먼저 무너진다.
 *   (그래서 이 머리말에는 눈썹 라벨이 없다. 어디인지는 빵부스러기가 말한다.)
 */

/**
 * 띠에 깔 병원 사진 — 이름표로 고른다.
 * ⚠️ 페이지가 파일 경로를 알 필요가 없게 여기 한 곳에 모은다. 사진을 바꾸면 여기만 고친다.
 */
const PHOTOS = {
  corridor: IMG.interior[2], // 진료실로 이어지는 복도 — 시선이 가운데로 모인다
  booth: IMG.interior[0], // 유리 파티션 상담 부스
  consult: IMG.interior[3], // 엑스레이 화면을 놓고 설명하는 장면
  room: IMG.interior[1], // 창가 진료실
  sterile: IMG.interior[5], // 멸균 기구를 꺼내는 장면
} as const;

export function AboutHero({
  trail,
  title,
  lead,
  photo,
  position = '50% 38%',
}: {
  trail: { name: string; path: string }[];
  /**
   * ⚠️ 되도록 문자열로 줄 것 — 문자열일 때만 앵커 id 가 붙는다. id 가 있어야 답변 엔진이
   *    문서 전체가 아니라 이 제목을 지목해 인용한다.
   */
  title: React.ReactNode;
  lead?: string;
  photo: keyof typeof PHOTOS;
  /** 사진에서 살릴 부분. 인물이나 표지가 잘리면 여기로 옮긴다. */
  position?: string;
}) {
  return (
    <section className="relative isolate -mt-[68px] flex min-h-[80vh] flex-col justify-end overflow-hidden bg-wine-deep pt-[68px] text-parchment sm:-mt-[94px] sm:pt-[94px]">
      <Image
        src={PHOTOS[photo].src}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: position }}
      />
      {/* 아래에서 위로 — 글이 앉는 아래 절반만 덮고 위 절반은 사진 그대로 둔다. */}
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
        <Breadcrumb trail={trail} tone="dark" />
        <h1
          id={typeof title === 'string' ? headingId(title) : undefined}
          className="display-sm mt-8 max-w-[17em] scroll-mt-28 text-[clamp(30px,4.4vw,54px)] leading-[1.2] tracking-[-0.03em] text-parchment"
        >
          {/* ⚠️ 관형형+의존명사를 묶어 준다 — '살리는 / 것이' 같은 끊김을 막는다(bindKo). */}
          {typeof title === 'string' ? bindKo(title) : title}
        </h1>
        {lead ? (
          <p className="mt-7 max-w-[44em] text-[17px] leading-[1.9] text-parchment/85 sm:text-[18px]">
            <Sentences text={lead} />
          </p>
        ) : null}
      </Container>
    </section>
  );
}
