import Link from 'next/link';
import Image from 'next/image';
import { SPECIALS } from '@/lib/specials';
import { bindKo } from '@/components/ui';

/**
 * '동그라미치과의 특별함' 카드 일곱 장.
 *
 * ★ /about 만 쓴다 (2026-09-01 확인 — 홈에는 이 구획이 없다).
 *
 * ★★ 왜 첫 장만 두 칸을 쓰나 (2026-09-01 오너: "여기 좀 난잡하지 않게") ★★
 *   일곱 장을 4열에 깔면 **마지막 줄에 세 장만 남아 오른쪽이 빈다.** 그 빈 칸이
 *   격자를 무너뜨려 화면이 정리가 안 된 것처럼 보인다.
 *   첫 장을 두 칸으로 두면 2+1+1 / 1+1+1+1 로 **두 줄이 정확히 채워진다** — 빈 칸 0.
 *   덤으로 '교수 출신 원장 직접 진료' 가 나머지와 같은 무게로 묻히지 않는다.
 * ⚠️ 항목 수가 바뀌면 이 계산도 다시 할 것. 8개가 되면 첫 장을 한 칸으로 되돌려야 두 줄이 맞는다.
 *
 * ★★ 난잡해 보이던 진짜 원인 세 가지 — 되돌리지 말 것 ★★
 *   ① **문장마다 줄을 바꾸던 것**(Sentences). 290px 짜리 좁은 칸에서 그 규칙이 걸리면
 *      한 장이 서너 줄 짜리 들쭉날쭉한 덩어리가 되고, 그것이 일곱 개 겹쳤다.
 *      여기서는 글이 그냥 흐르게 두고, 한국어 묶음(관형형+의존명사)만 bindKo 로 살린다.
 *   ② **사진 위 아이콘 뱃지**. 사진 · 아이콘 · 제목 · 본문 · 링크로 한 장에 눈길이 다섯 번
 *      갈렸다. 아이콘은 정보를 더하지 않아서 뺐다(아이콘 자체는 StrengthIcons 에 남아 있다).
 *   ③ **들쭉날쭉한 본문 길이**. line-clamp-3 으로 세 줄에서 끊어 카드 높이를 고르게 만든다.
 *      잘린 글자도 HTML 에는 그대로 있어 검색·AI 는 전문을 읽는다(자세한 내용은 상세 페이지).
 *
 * ⚠️⚠️ 되살리지 말 것 (2026-09-01 오너: "클로드 특유의 디자인 포인트 빼고") ⚠️⚠️
 *   ⓐ 카드마다 붙던 같은 눈썹 라벨 — 일곱 장에 '동그라미치과의 특별함' 이 일곱 번 나왔다.
 *   ⓑ 사진 위 큰 번호 — 번호+라벨 조합은 '경쟁 병원과 똑같다' 는 지적을 받은 형태다.
 *
 * ★ 첫 두 장만 priority — 일곱 장을 한꺼번에 우선 로딩하면 첫 화면이 느려진다.
 */
export function SpecialGrid({ eager = false }: { eager?: boolean }) {
  return (
    <div className="reveal-stack grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {SPECIALS.map((s, i) => {
        /* 첫 장만 두 칸 — 사진과 글이 위아래가 아니라 좌우로 선다. */
        const wide = i === 0;
        return (
          <Link
            key={s.slug}
            href={`/about/special/${s.slug}`}
            className={`group card-edge flex overflow-hidden rounded-2xl border border-brand-200/70 bg-parchment transition-colors hover:border-brand-300 ${
              wide ? 'flex-col sm:col-span-2 sm:flex-row' : 'flex-col'
            }`}
          >
            <div
              className={`img-in relative overflow-hidden ${
                wide ? 'aspect-[16/10] sm:aspect-auto sm:w-1/2' : 'aspect-[16/10]'
              }`}
            >
              <Image
                src={s.image}
                alt={s.alt}
                fill
                priority={eager && i < 2}
                sizes={
                  wide
                    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                    : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                }
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className={`flex flex-1 flex-col p-7 ${wide ? 'sm:justify-center' : ''}`}>
              <h3 className="display-sm text-[20px] leading-[1.35] text-ink transition-colors group-hover:text-clay-700">
                {bindKo(s.title)}
              </h3>
              {/* ⚠️ min-w-0 — 없으면 좁은 칸에서 글이 어절 폭으로 눌린다. */}
              <p className="mt-3.5 min-w-0 line-clamp-3 text-[15.5px] leading-[1.8] text-ink-soft">
                {bindKo(s.body)}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-[14.5px] font-bold text-clay-700">
                자세히 보기
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
