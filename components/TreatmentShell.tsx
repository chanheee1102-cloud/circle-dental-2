import Image from 'next/image';
import { CLINIC } from '@/lib/clinic';
import { Container, Breadcrumb, Sentences } from '@/components/ui';

/*
 * 진료과목 페이지의 공통 껍데기 (2026-09-01 오너: "진료 메뉴 전체를 충치치료 페이지 디자인으로").
 *
 * ★★ 무엇이 문제였나 ★★
 *   진료 페이지 아홉 곳이 머리말을 저마다 손으로 그려 뒀다. 어떤 곳은 가운데 정렬,
 *   어떤 곳은 왼쪽 정렬, 눈썹 글씨도 알약·점·맨글씨가 뒤섞여 있었다.
 *   같은 메뉴 안에서 페이지를 넘길 때마다 다른 사이트처럼 보였다.
 *
 * ★ 기준은 충치치료 페이지다 — 가운데 정렬, 사진 위 두 겹 덮개, 금색 눈썹, 큰 제목,
 *   두 개의 버튼, 그 아래 세 칸 띠.
 *
 * ⚠️⚠️ 머리말 바깥을 bg-night 로 두는 데는 이유가 있다 ⚠️⚠️
 *   globals.css 의 .page-dark 는 '어두운 섬'(bg-night 등) 안에서 색 이름을 원래 값으로
 *   되돌린다. 덕분에 이 부품은 뒤집힌 페이지(임플란트·크라운)와 원래 어두운 페이지
 *   (충치치료·치아미백·사랑니) **양쪽에서 똑같이** 그려진다.
 *   bg-night 를 다른 이름으로 바꾸면 뒤집힌 페이지에서 글자가 사라진다.
 *
 * ⚠️ 덮개를 한 겹으로 줄이지 말 것 — 사진 밝은 부분에서 작은 글자가 먼저 무너진다.
 * ⚠️ 빛 번짐 색은 금색(clay)만. 남의 사이트 색(보라·초록)을 가져오지 말 것.
 */

/** 사진 위에 올리는 두 겹 덮개의 기준색 — night(#24221e) 을 rgba 로 적은 것이다. */
const SCRIM = '36,34,30';

export interface HeroPhoto {
  src: string;
  alt: string;
  /** 사진에서 살릴 부분. 얼굴이 잘리면 여기로 옮긴다. */
  position?: string;
}

export function TreatmentHero({
  trail,
  eyebrow,
  title,
  lead,
  photo,
}: {
  trail: { name: string; path: string }[];
  /** 금색 한 줄 — 지역명 + 진료명 + 확인되는 자격까지. */
  eyebrow: string;
  /** 줄 단위로 넘긴다. 줄마다 아래에서 밀려 올라온다(.line-rise). */
  title: string[];
  lead: string;
  photo?: HeroPhoto;
}) {
  return (
    /* ⚠️ 음수 margin + 같은 값의 padding — 띠가 헤더 뒤까지 올라간다. 수치를 페이지마다 바꾸지 말 것. */
    <section className="relative isolate -mt-[68px] overflow-hidden bg-night pt-[128px] pb-24 sm:-mt-[94px] sm:pt-[154px] lg:pb-32">
      {photo && (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={photo.position ? { objectPosition: photo.position } : undefined}
        />
      )}

      {/* 두 겹 덮개 — 방사형(가운데를 살림) + 선형(위아래를 눌러 줌). */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(80% 64% at 50% 38%, rgba(${SCRIM},0.5) 0%, rgba(${SCRIM},0.82) 62%, rgba(${SCRIM},0.93) 100%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(${SCRIM},0.72) 0%, rgba(${SCRIM},0.46) 38%, rgba(${SCRIM},0.88) 100%)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(56%_42%_at_50%_-6%,rgba(217,164,65,0.14)_0%,transparent_66%)]"
      />
      {/* 미세 노이즈 — 큰 어두운 면이 밴딩으로 뭉개지는 것을 막는다. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />

      <Container className="relative text-center">
        {/* ⚠️ 손으로 다시 그리지 말 것 — 공용 부품이라야 규칙이 바뀔 때 같이 따라온다. */}
        <div className="mb-10 flex justify-center">
          <Breadcrumb trail={trail} tone="dark" />
        </div>

        <p className="enter text-[13.5px] font-black text-clay-300" style={{ animationDelay: '40ms' }}>
          {eyebrow}
        </p>

        <h1 className="line-rise reveal display-sm mx-auto mt-7 max-w-[16em] text-[clamp(32px,5.4vw,62px)] leading-[1.14] tracking-[-0.035em] text-parchment">
          {/*
            ⚠️ 줄 끝의 공백 한 칸을 지우지 말 것 (2026-09-01).
              제목을 줄마다 span 으로 쪼개면 기계가 읽는 문자열이 '어떤 경우에어떤 진료를'
              처럼 **붙어 버린다**. 화면에서는 줄이 나뉘어 있으니 사람 눈에는 안 보이는 문제다.
              CSS 없이 HTML 만 읽는 수집기(AI 답변 쪽이 특히 그렇다)가 그 상태로 가져간다.
              줄 끝 공백은 블록 안에서 접히므로 화면은 그대로다.
          */}
          {title.map((line, i) => (
            <span key={line}>
              <span>{i < title.length - 1 ? `${line} ` : line}</span>
            </span>
          ))}
        </h1>

        <p
          className="enter mx-auto mt-8 max-w-[34em] text-[18px] leading-[1.9] text-parchment/85"
          style={{ animationDelay: '320ms' }}
        >
          {/*
            ⚠️ tone="dark" 를 빼지 말 것 — 이 자리는 언제나 어두운 면이다.
              빼면 `**강조**` 가 밝은 면용 짙은 금색(#8a5a1f)으로 나와 2.69:1 이 된다(실측).
          */}
          <Sentences text={lead} tone="dark" />
        </p>

        <div className="enter mt-10 flex flex-wrap justify-center gap-3" style={{ animationDelay: '440ms' }}>
          {/*
            ⚠️ bg-wine-bg 로 되돌리지 말 것 (2026-09-01 실측) — 뒤집힌 페이지에서 이 버튼이
              통째로 사라진다. '어두운 섬' 규칙이 원래 값으로 되돌려 주는 이름은 parchment 쪽이고
              wine-bg 는 그 목록에 없어서 어두운 값이 그대로 남기 때문이다.
          */}
          <a
            href={CLINIC.booking.naver}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-parchment px-8 py-4 text-[17px] font-semibold text-dusk transition-colors hover:bg-mist"
          >
            진료 예약하기 <span aria-hidden>→</span>
          </a>
          <a
            href={CLINIC.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-parchment/80 px-8 py-4 text-[17px] font-semibold tabular-nums text-parchment transition-colors hover:bg-white/10"
          >
            {CLINIC.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}

/**
 * 머리말 바로 아래 세 칸 띠 — 한 단 올린 어두운 면.
 * ⚠️ 지어낸 숫자를 쓰지 않는다. 이 병원이 실제로 하는 일만 적는다.
 */
export function TreatmentStrip({
  items,
}: {
  items: { k: string; t: string; d?: string }[];
}) {
  return (
    <section className="border-y border-white/8 bg-night-2 py-12 lg:py-16">
      <Container>
        <ul className="reveal-stack grid gap-10 sm:grid-cols-3">
          {items.map((f) => (
            <li key={f.t} className="reveal">
              <p className="text-[11.5px] font-black tracking-[0.06em] text-clay-400">{f.k}</p>
              <p className="mt-2.5 text-[19px] font-black tracking-[-0.02em] text-white">{f.t}</p>
              {f.d && (
                <p className="mt-3 max-w-[24em] text-[15.5px] leading-[1.85] text-brand-300">{f.d}</p>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
