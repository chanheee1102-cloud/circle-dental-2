import Image from 'next/image';
import { IMG } from '@/lib/assets';
import { Container, Breadcrumb, Sentences, bindKo } from '@/components/ui';
import { headingId } from '@/components/article';

/**
 * 병원 소개 구역의 머리말 — **사진이 보이는 머리**.
 *
 * ★★ 왜 공용 PageHero 를 안 쓰나 ★★
 *   PageHero 는 글판이 가운데에 서고, 여기는 **왼쪽**에 선다. 그 차이 하나뿐이라
 *   언젠가 합칠 수 있지만, 지금은 합치면 병원 소개 아홉 페이지를 한꺼번에 건드리게 된다.
 *
 * ⚠️⚠️ 덮개를 걷지 말 것 (2026-09-02, 다섯 번째 판) ⚠️⚠️
 *   덮개를 없애려는 시도를 세 번 했고 세 번 다 반려됐다 — 파일 맨 위 _restore 이력 참고.
 *   흰 글자를 사진 위에 올리는 구조에서 덮개는 **선택이 아니라 조건**이다.
 * ⚠️ 덮개 색은 중성 먹색이다. 갈색으로 바꾸면 사진이 누렇게 뜬다.
 * ⚠️ 값을 낮추려면 반드시 실측할 것 — 빵부스러기(14px)가 늘 먼저 깨진다.
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
      {/*
        ⚠️ alt 를 채우지 말 것 — 이 사진은 장식이다. 뜻은 아래 제목이 전부 진다.
        ⚠️ filter 로 밝기를 올리지 말 것. 덮개 값이 이 사진의 원래 밝기를 전제로 잡혀 있다.
      */}
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
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(30,28,25,0.82)_0%,rgba(30,28,25,0.78)_30%,rgba(30,28,25,0.74)_50%,rgba(30,28,25,0.20)_70%,rgba(30,28,25,0.02)_100%)]" />
      {/* 왼쪽에서 오른쪽으로 한 겹 더 — 글 줄이 긴 쪽만 받쳐 준다. */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,rgba(30,28,25,0.40)_0%,rgba(30,28,25,0.18)_46%,rgba(30,28,25,0)_76%)]" />

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
