'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, type ReactNode } from 'react';
import { IMG } from '@/lib/assets';

/**
 * 인증·수료 — 아래에서 하나씩 솟아오르고, 커서를 따라 기우는 입체 진열.
 *
 * ★★ 부채꼴 펼침 → 하나씩 솟아오르기 (2026-08-25 운영자: "저 인증패들 나오는거,
 *    하나씩 밑에서 튀어나오면서 선명하게 조금 크게 잘보이게 해줘") ★★
 *    직전에는 한 점에서 좌우로 벌어지는 부채꼴이었다. 펼쳐지는 **중간 내내 흐리고
 *    작고 기울어 있어서**, 스크롤을 멈춘 자리에 따라 인증패가 제대로 안 보였다.
 *    지금은 자리를 처음부터 잡아 두고 **아래에서 위로 하나씩 올라오기만** 한다 —
 *    도착하면 흐림이 0 이고 크기도 1 이라 언제 멈춰도 선명하다.
 *
 * ★ 크기는 **원본 해상도(236×242)에 맞춘다.** 그보다 크게 늘리면 그만큼 흐려질 뿐이다.
 *   눈길은 크기가 아니라 모션이 끈다(globals.css .plaque-in).
 *
 * ★★ 남은 세 가지가 입체를 만든다 ★★
 *   ① 기울기 — 커서 위치를 따라 판이 기운다(원근 900px).
 *   ② 층    — 인증패는 52px, 라벨은 20px 띄운다. 기울 때 둘이 다른 속도로
 *             움직이는 것이 3D 로 읽히는 진짜 이유다. 같은 평면에 두면
 *             아무리 회전해도 '기운 사진'일 뿐이다.
 *   ③ 바닥 그림자 — 판만 뜨고 그림자는 바닥(Z 0)에 남는다.
 *   ⚠️ 가만히 있을 때의 기본 각도(부채처럼 -6/-2/+2/+6도)는 **뺐다.** 솟아오르는
 *      연출에서는 각도가 붙으면 '흐트러진 것'으로 보인다. 커서 기울기만 남긴다.
 *
 * ★ 밑변 정렬은 그대로 지킨다 — 세 번째(세계근관치료학회)만 236×178 로 납작해서
 *   가운데 정렬하면 혼자 아래로 내려앉는다. items-end 로 네 장의 밑변을 한 선에 세운다.
 *
 * ★ 누르면 의료진 페이지로 간다. 움직이기만 하고 눌리지 않으면 사용자는 두세 번
 *   눌러 본 뒤에야 포기한다.
 *
 * ⚠️ 등장은 이 사이트의 .reveal 과 레이아웃에 하나뿐인 RevealScript 가 맡는다.
 *    여기서 IntersectionObserver 를 새로 만들지 말 것 — 관찰자를 한 곳으로 모은
 *    구조(2026-08-18 성능 작업)가 깨진다.
 */

/**
 * 액자가 놓이는 칸 — 밑변이 여기 선다.
 *
 * ⚠️⚠️ 236px 를 넘기지 말 것 — **원본 해상도가 236×242 다** ⚠️⚠️
 *   300px 로 키웠더니(2026-09-02 오전) 1.24 배 확대가 되어 인증서 글자가 뭉갰다
 *   (오너: "사진 크기 조금 줄여서 화질좋게"). 지금은 원본과 1:1 이라 가장 선명하다.
 *   unoptimized 라 브라우저가 원본을 그대로 받고, 늘리는 만큼 그대로 흐려진다.
 * ★ 크기로 눈길을 끌던 몫은 이제 **모션**이 진다(globals.css .plaque-in).
 * ⚠️ 더 크게 보여 주고 싶으면 원본 파일부터 큰 것으로 바꿀 것. 여기 숫자만 올리면
 *    커지는 것은 흐림뿐이다.
 * ⚠️ 폭 상한도 높이와 같은 이유다 — 넷 중 하나(세계근관치료학회)는 236×178 로 납작해서,
 *    폭이 넓은 칸에 들어가면 **폭이 먼저 차 1.14 배로 늘어난다**(실측).
 *    가로·세로 둘 다 막아야 넷 모두 원본 이하로 그려진다.
 */
const SHELF = 'mx-auto h-[184px] w-full max-w-[236px] sm:h-[236px]';

export function CredentialFan({ href = '/about/doctors' }: { href?: string | null } = {}) {
  const items = IMG.credentials;
  /*
   * ⚠️ 의료진 페이지에서는 href={null} 로 부른다 — 그 페이지가 바로 이 링크의 목적지라
   *    자기 자신으로 가는 링크가 된다. 자기 링크는 훑는 사람에게 막다른 길이고,
   *    검색 쪽에서도 의미 없는 내부 링크가 하나 늘 뿐이다.
   */
  const Frame = href
    ? ({ label, children }: { label: string; children: React.ReactNode }) => (
        <Link
          href={href}
          aria-label={`${label} — 의료진 페이지에서 크게 보기`}
          className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
        >
          {children}
        </Link>
      )
    : ({ children }: { label: string; children: React.ReactNode }) => <div>{children}</div>;

  return (
    <ul className="relative z-10 mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10">
      {items.map((c, i) => (
        /*
          ⚠️ 하나씩 올라오게 만드는 것은 이 delay 다. 다 같이 올라오면 '한 덩어리가
             떠오르는' 것이지 '하나씩 튀어나오는' 것이 아니다.
        */
        <li key={c.src} className="plaque-in" style={{ transitionDelay: `${i * 220}ms` }}>
          <Tilt deg={20}>
            <Frame label={c.label}>
              <figure className="px-2">
                {/*
                  ⚠️ 폭 상한은 **사진 상자에만** 건다 — figure 전체에 걸면 캡션까지 236px 로
                     좁아져 '오스템임플란트 연구자문치과 위촉패' 가 두 줄로 접힌다(실측).
                */}
                <div className="relative mx-auto max-w-[236px]">
                {/*
                  바닥 그림자 — 판만 뜨고 이건 바닥에 남는다(translateZ 없음).
                  ⚠️ 이 상자(폭 상한 236px) 안에 두어야 그림자가 판 밑에 정확히 깔린다.
                     밖으로 빼면 칸이 넓은 화면에서 그림자만 판보다 넓게 퍼진다.
                */}
                <span
                  aria-hidden
                  className="plaque-shadow pointer-events-none absolute inset-x-5 bottom-[38px] h-[16px] rounded-[50%] bg-dusk/25 blur-[12px] sm:bottom-[46px]"
                />

                {/*
                  ⚠️⚠️ 크기를 이미지의 '내부 크기'에 맡기지 말 것 ⚠️⚠️
                    전에는 width/height 를 적고 `h-auto max-h-full w-auto` 로 뒀는데,
                    실제로는 **184×189 로 렌더됐다**(원본은 236×242). next/image 가 고른
                    변형본의 크기가 그대로 화면 크기가 돼 버려, 선반을 230px 로 키워도
                    사진은 그대로였다(실측으로 잡음).
                    → fill + object-contain 으로 **선반이 크기를 정하게** 한다. 이제
                      선반 높이를 바꾸면 사진도 따라 커진다.
                  ⚠️ object-bottom — 밑변 정렬이 여기서 지켜진다. 가운데 정렬로 두면
                     납작한 세 번째(236×178)만 혼자 떠 보인다.
                */}
                <div className={`relative ${SHELF}`}>
                  <Image
                    src={c.src}
                    alt={c.label}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 44vw, 300px"
                    /*
                      ⚠️ 최적화를 끈다. next/image 가 만든 변형본이 **184×189 로 줄어**
                         나와서(원본 236×242, 실측) 245px 로 그리면 30% 확대가 된다 —
                         인증서 글자가 뭉갠다. 이 넷은 원본이 52~71KB 로 작고 화면
                         아래쪽이라 lazy 로 받으므로, 원본을 그대로 쓰는 편이 낫다.
                      ⚠️ 큰 사진(히어로·진료 카드)에는 절대 쓰지 말 것 — 그쪽은 최적화가
                         파일 크기를 몇 배로 줄여 준다.
                    */
                    unoptimized
                    className="object-contain object-bottom"
                    style={{
                      transform: 'translateZ(52px)',
                      /* ⚠️ box-shadow 가 아니라 drop-shadow — 이 PNG 들은 배경이 지워져 있어
                         상자 그림자를 주면 없는 네모가 보인다. drop-shadow 는 실제 윤곽을 따른다. */
                      filter:
                        'drop-shadow(0 20px 24px rgba(58,33,26,.30)) drop-shadow(0 3px 6px rgba(58,33,26,.18))',
                    }}
                  />
                </div>
                </div>

                {/*
                  캡션 자리를 두 줄 높이로 고정한다 — 이름 길이가 달라 한 줄/두 줄이 오가면
                  카드 아래 선이 어긋난다(원본이 정확히 그랬다).
                */}
                <figcaption
                  /* ⚠️ text-ash 로 되돌리지 말 것 — 어두운 구획에서 1.7:1 로 안 보인다(app/page.tsx 주석). */
                  className="relative mt-6 flex min-h-[3.2rem] items-start justify-center text-center text-[16.5px] leading-snug font-medium text-ink-soft"
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {c.label}
                </figcaption>
              </figure>
            </Frame>
          </Tilt>
        </li>
      ))}
    </ul>
  );
}

/* ══ 기울기 ═════════════════════════════════════════════════════════ */

/**
 * 커서를 따라 기우는 판.
 * ⚠️ 손가락 입력·모션 감소에서는 아무것도 걸지 않는다 — 커서가 없거나, 있어도 불편이다.
 */
function Tilt({ children, deg = 5 }: { children: ReactNode; deg?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateX(${-py * deg}deg) rotateY(${px * deg}deg) translateZ(0)`;
    };
    const leave = () => {
      el.style.transform = '';
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [deg]);

  return (
    <div className="tilt-host">
      <div ref={ref} className="tilt">
        {children}
      </div>
    </div>
  );
}
