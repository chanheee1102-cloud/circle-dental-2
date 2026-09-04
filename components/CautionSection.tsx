import Image from 'next/image';
import { Container, Sentences } from '@/components/ui';

/**
 * **치료 전에 알아 두실 점** — 왼쪽에 제목·사진, 오른쪽에 번호 붙은 항목.
 *
 * ★★ 왜 부품으로 뽑았나 (2026-09-04 오너: "여기 같은 부분들 많은데 번호 붙여. 그리고 왼쪽에
 *    사진 넣고 밑에 여백 많으니깐. 전부 적용해") ★★
 *   같은 구획이 네 페이지(심미보철·라미네이트·치아미백·사랑니)에 각각 손으로 쓰여 있었다.
 *   그래서 페이지마다 번호가 있기도 없기도 하고, 선 색과 여백도 달랐다. 한 곳으로 모은다.
 *
 * ★ 번호를 붙인다 — 선으로만 나누면 몇 가지인지 세어야 알고, 읽다가 어디까지 봤는지도 잃는다.
 * ★ 왼쪽 사진이 아래 빈자리를 채운다. 제목만 두면 왼쪽 절반이 통째로 비었다.
 * ⚠️ 번호와 글 사이는 flex 다 — 글 칸에 **min-w-0 flex-1** 이 없으면 한 어절씩 눌린다.
 *    이 저장소에서 세 번 재발한 결함이다. 지우지 말 것.
 * ⚠️ 구분선은 항목 **사이**에만 — divide-y 를 쓰고 ul 에 border 를 두르지 않는다.
 *    두르면 첫 항목 위와 마지막 항목 아래에 선이 하나씩 더 생긴다.
 */
export function CautionSection({
  title,
  items,
  photo,
  intro,
  band = false,
  children,
}: {
  title: string;
  items: string[];
  /** 왼쪽 제목 아래 사진. 없으면 제목만. */
  photo?: { src: string; alt: string };
  intro?: string;
  /** 밝은 띠 위에 놓을지. 한 페이지에 밝은 띠는 하나다. */
  band?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`py-16 sm:py-24 lg:py-32 ${band ? 'light-band border-y border-wine-line' : ''}`}
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="reveal">
            <h2 className="display-sm max-w-[13em] text-[clamp(24px,2.8vw,34px)] leading-[1.3] text-ink">
              {title}
            </h2>
            {intro && (
              <p className="mt-6 max-w-[30em] text-[16.5px] leading-[1.85] text-twilight">
                <Sentences text={intro} />
              </p>
            )}
            {photo && (
              /* ⚠️ 3:2 는 원본 비율이다 — 세로로 늘리면 좌우가 잘려 확대돼 보인다(반복해서 겪었다). */
              <div className="mt-8 overflow-hidden rounded-2xl border border-brand-200/70 bg-brand-100">
                <div className="relative aspect-[3/2]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 460px, 92vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <ol className="divide-y divide-wine-line">
            {items.map((r, i) => (
              <li key={r} className="reveal flex gap-5 py-6 first:pt-0">
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-[13.5px] font-black tracking-[0.06em] text-clay-700 tabular-nums"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {/* ⚠️ min-w-0 flex-1 — 없으면 글이 어절 폭으로 눌린다. */}
                <p className="min-w-0 flex-1 text-[17px] leading-[1.85] text-twilight">
                  <Sentences text={r} />
                </p>
              </li>
            ))}
          </ol>
        </div>
        {children}
      </Container>
    </section>
  );
}
