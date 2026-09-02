import Image from 'next/image';
import Link from 'next/link';
import { CLINIC } from '@/lib/clinic';
import { DOCTORS } from '@/lib/doctors';

/**
 * 의료진 — **대표원장 한 판, 아래에 원장 두 분이 한 줄.** 셋 다 가로형 유리 카드다.
 *
 * ★★ 짜임 (2026-08-31 운영자) ★★
 *   ① 대표원장 — 사진 왼쪽, 오른쪽에 이름 · 자격 · 경력 · 학회.
 *      ⚠️ 오른쪽 글은 **두 칸**이다(경력 | 학회). 한 칸으로 쌓았더니 경력 아래가 크게 비고
 *         학회가 판 맨 아래로 떨어졌다 — 운영자: "대표원장 학회는 오른쪽에 해주고".
 *   ② 원장 두 분 — **사진 왼쪽 · 내용 오른쪽 한 카드**로, 둘이 한 줄에 선다.
 *      사진을 줄이고 학회는 뺐다(운영자: "사진 크기 좀 줄여주고, 학회활동 생략해줘").
 *      학회 전체는 의료진 소개 페이지에 있다.
 *
 *   ⚠️⚠️ **손을 올리면 뜨는 팝업을 되살리지 말 것** ⚠️⚠️
 *     한 번 만들었다 걷어냈다. 판이 줄 전체를 덮어 다른 원장으로 못 옮겨갔고, 판이 유리라
 *     뒤가 비쳤고, 판이 아래 버튼 자리까지 늘어났고, 손가락·크롤러에는 아예 안 보였다.
 *   ★ 지금은 처음부터 다 보인다. 감출 것이 없으니 어긋날 것도 없다.
 *
 * ★★ 원장 개별 페이지는 없다 (2026-08-31) ★★
 *   "의료진페이지 한명한명 만들지말고, 지금 의료진 소개 페이지만 냅둬줘."
 *   링크는 전부 /about/doctors 한 곳으로 간다. 사람마다 다른 곳으로 보내는 링크를
 *   다시 만들지 말 것 — 갈 페이지가 없다.
 *
 * ⚠️ 경력·학회는 lib/doctors.ts **원문 그대로**다(license·keyCareer). 여기서 문장을
 *    만들거나 잘라 쓰지 않는다 — 거기에는 원문 부분집합인지 확인하는 가드가 있다.
 * ⚠️⚠️ 글자를 작게 만들거나 흐린 흰색을 쓰지 말 것 (운영자: "너무 문구 작고",
 *    "문구 어두운건 다 흰색으로"). 위계는 크기·굵기와 골드가 맡는다.
 *
 * ★★ 색감 ★★
 *   골드(--color-signal #d9a441, 어두운 면 글자 7.42:1)는 작고 구조적인 자리에만 —
 *   직함 · 자격 표식 · 구분선 · 버튼 테두리.
 *   ⚠️ 큰 면을 골드로 채우지 말 것 — 전에 학회 판을 채웠다가 "너무 황금색이랑 안 어울린다".
 *
 * ★★ 사진 배경 ★★
 *   세 사진은 촬영 배경이 서로 달랐다(#c0bdba · #dddfe4 · #cdcdd3 — 실측).
 *   `-bg` 판은 그 톤을 하나로 맞춰 둔 것이다(scripts/normalizeDoctorBg.mjs).
 *   ⚠️ 원본 파일을 쓰면 세 배경이 도로 어긋난다.
 *
 * ★ 누끼(배경 제거)는 네 번 시도해 네 번 실패했다 — 배경이 방사형인 데다 인물 그림자가
 *   얹혀 있어, 예측 오차가 가운과 배경의 차이(27~48)와 같다. 색만 보는 방법으로는 못 가른다.
 *   되는 방법은 사람 분리 모델(rembg·포토샵 배경 제거)로 한 번 따서 투명 PNG 를 넣는 것뿐.
 *   그때는 아래 evened() 만 바꾸면 된다. ⚠️ 임계값을 바꿔 가며 다시 시도하지 말 것.
 */

/** 사진 배경을 맞춰 둔 판. ⚠️ 원본을 쓰면 배경이 도로 어긋난다. */
const evened = (photo: string) => photo.replace(/\.jpg$/i, '-bg.jpg');

/** 사진이 앉는 회색 판 — 통일된 사진 배경색과 같은 값이라 경계가 안 보인다. */

type Doc = (typeof DOCTORS)[number];

/**
 * 유리 판.
 * ⚠️ .pane-dark 를 쓰지 말 것 — 그건 뒤를 눌러서 유리를 만드는 **밝은 바탕용**이다.
 *    이미 어두운 면에서는 누를 것이 없어 검은 네모가 된다. .pane-frost 가 그 자리를 위해 있다.
 */

/**
 * 사진 가장자리를 흐려 없애는 마스크 — 스튜디오 회색 배경이 네모로 남지 않게.
 *
 * ★★ 2026-09-02 에 좌우까지 넓혔다 ★★
 *   어두운 면 위에서는 스튜디오 회색이 어둠에 묻혀 아래만 지워도 충분했다. 면이 베이지로
 *   밝아지자 **회색 네모 셋이 크림 바탕에 그대로 떠 보였다.** 아래·좌우를 함께 지운다.
 * ⚠️ 아래 78% 값을 낮추지 말 것 — 더 일찍 사라지면 흰 가운 아랫단까지 지워진다(실측).
 * ⚠️ 좌우는 7% 까지만. 그 이상 파고들면 어깨선이 잘린다(사진마다 인물 폭이 다르다).
 * ⚠️ mask-composite 를 지우지 말 것 — 두 겹을 겹치지 않으면 뒤 겹 하나만 적용돼
 *    아래쪽 지움이 통째로 사라진다.
 */
const FADE_Y =
  'linear-gradient(to bottom, #000 0%, #000 78%, rgba(0,0,0,0.55) 92%, rgba(0,0,0,0) 100%)';
const FADE_X =
  'linear-gradient(to right, rgba(0,0,0,0) 0%, #000 7%, #000 93%, rgba(0,0,0,0) 100%)';
const FADE = `${FADE_Y}, ${FADE_X}`;

/** 무대 위 한 사람 — 사진 아래에 이름·자격이 가운데로 선다. */
function Stand({ d, big }: { d: Doc; big?: boolean }) {
  return (
    /* ⚠️ 양옆을 pt 로 내리지 말 것 — 사진 아랫변을 맞추는 방식으로 바뀌었다(위 주석). */
    <div className="reveal flex flex-col items-center text-center">
      {/*
        ⚠️ 사진에 테두리·배경판을 주지 말 것 — 그 순간 다시 카드가 된다.
           아래로 흐려 없애는 것만으로 사진이 면 위에 '서 있게' 된다.
      */}
      {/*
        ⚠️ 높이를 비율로 되돌리지 말 것 — 폭이 다르면 높이가 따라 달라져 사진 아랫변이
           어긋나고, 그만큼 이름 줄이 위아래로 흩어진다(2026-08-31 오너 지적).
        ⚠️ 가운데의 -mt 는 두 높이의 **차이와 같다**(460-380=80). 한쪽만 바꾸면 줄이 깨진다.
      */}
      {/*
        ★ 대표원장 뒤에만 옅은 금빛을 깐다 (2026-08-31 운영자: "대표 원장이라는게
          조금 티가 나야돼"). 사진이 크고 높은 것만으로는 훑을 때 티가 안 났다.
        ⚠️ **자리를 차지하지 않는 방식**이어야 한다(absolute). 셋의 사진 아랫변과
           이름 줄이 한 선에 서 있는데, 자리를 차지하는 것을 넣으면 그 줄이 깨진다.
        ⚠️ 진하게 하지 말 것 — 인물 뒤에서 배경이 떠 보이면 사진이 오려 붙인 것처럼 된다.
      */}
      <div className="relative w-full">
        {big && (
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-x-8 -top-10 bottom-0 -z-10 rounded-[999px] bg-[radial-gradient(60%_55%_at_50%_45%,rgba(217,164,65,0.16)_0%,transparent_70%)]"
          />
        )}
      {/*
        ★ 사진에 모션 (2026-09-02 오너: "의료진 사진에 모션 살짝 넣어줘").
          .img-in — 스크롤로 들어올 때 1.08 배에서 제자리로 내려앉으며 떠오른다.
          손을 올리면 아주 조금 더 들어간다(1.035). 얼굴 사진이라 크게 움직이면 부담스럽다.
        ⚠️ 관찰자를 새로 만들지 말 것 — RevealScript 가 .img-in 을 이미 본다.
        ⚠️ transform 을 이 상자(마스크가 걸린 곳)에 주지 말 것. 안쪽 img 에 준다 —
           상자가 움직이면 마스크가 함께 움직여 아랫변 페이드가 흔들린다.
      */}
      <div
        className={`img-in group/photo relative w-full ${
          big
            ? 'h-[360px] sm:h-[430px] lg:-mt-20 lg:h-[460px]'
            : 'h-[300px] sm:h-[360px] lg:h-[380px]'
        }`}
        style={{
          maskImage: FADE,
          WebkitMaskImage: FADE,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      >
        <Image
          src={evened(d.photo)}
          alt={`${d.name} ${d.role}`}
          fill
          sizes={big ? '(max-width: 1023px) 80vw, 420px' : '(max-width: 1023px) 60vw, 320px'}
          className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover/photo:scale-[1.035]"
          priority={big}
        />
      </div>
      </div>

      {/*
        ★★ 직함 — 대표원장만 **금색 알약**으로 채운다 ★★
          (2026-08-31 운영자: "대표 원장이라는게 조금 티가 나야돼")
        ⚠️⚠️ 셋의 **상자 크기를 같게 유지할 것** ⚠️⚠️
           안쪽 여백과 테두리를 대표원장에게만 주면 그 줄만 아래로 내려앉아, 사진 아랫변을
           맞춰 세운 이름 줄이 어긋난다(실측: 셋 다 사진 바닥 184px 한 선).
           그래서 원장 두 분도 같은 여백과 **투명한 테두리**를 갖는다.
        ⚠️ 큰 면을 골드로 채우지 말라는 규칙과 어긋나지 않는다 — 알약 하나는 작고
           구조적인 자리다. 이보다 큰 면에 골드를 칠하지 말 것.
      */}
      {/*
        ⚠️ mt-6 을 빼지 말 것 — 사진 아랫변과 직함 줄이 **정확히 같은 자리**에서 만나
           흐려지는 가운 자락 위에 글이 얹혀 보였다(2026-08-31 운영자: "사진이랑 문구랑
           좀 겹치는거 아니야?"). 사진 아래는 마스크로 흐려지므로 눈에는 겹쳐 보인다.
        ⚠️ 셋에 **같은 값**을 줄 것. 한 사람만 띄우면 사진 아랫변에 맞춰 세운 줄이 어긋난다.
      */}
      <p
        className={`mt-6 inline-flex items-center rounded-full border px-3.5 py-1 font-bold ${
          big
            ? 'border-ink bg-ink text-[15px] text-parchment'
            : 'border-transparent text-[14.5px] text-clay-700'
        }`}
      >
        {/*
          ⚠️ 병원명을 떼지 말 것 (2026-09-02 오너: "대표원장/원장 문구 옆에 병원명 추가").
             '대표원장' 만 있으면 어느 병원 대표원장인지가 이 줄에 없다 — 홈은 사람 이름으로
             검색해 들어오는 자리라 사람과 병원이 한 줄에 같이 있어야 한다.
          ⚠️ /about/doctors 에는 붙이지 않는다 — 그 페이지는 2026-09-01 에 오너가 직접
             빼라고 한 자리다(페이지 전체가 이 병원 의료진이라 세 번 되풀이된다).
        */}
        {/* ⚠️ `{CLINIC.shortName} {d.role}` 처럼 나눠 쓰지 말 것 — 사이에 React 주석 노드가
            끼어 "동그라미치과<!-- --> <!-- -->대표원장" 으로 나간다(실측). 한 문자열로 낸다. */}
        {`${CLINIC.shortName} ${d.role}`}
      </p>
      <p
        className={`mt-2 font-bold tracking-[0.14em] text-clay-700 ${
          big ? 'text-[30px] sm:text-[34px]' : 'text-[26px] sm:text-[29px]'
        }`}
      >
        <span className="-mr-[0.14em]">{d.name}</span>
      </p>
      <p className={`mt-4 font-bold text-ink ${big ? 'text-[17px]' : 'text-[16.5px]'}`}>
        {d.license}
      </p>
      {/* ⚠️ 학회는 여기 넣지 말 것 — 세로가 길어져 무대 구도가 무너진다. 전체는 소개 페이지에 있다. */}
      <ul className="mt-2.5 space-y-1.5">
        {d.keyCareer.map((c) => (
          <li key={c} className="text-[16px] leading-[1.55] text-ink-soft">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DoctorStage() {
  const [director, ...rest] = DOCTORS;
  if (!director) return null;
  const [left, right] = rest;

  return (
    <div className="mt-16">
      {/*
        ⚠️ 가운데 칸을 양옆보다 넓게 둔다(1.25fr). 같은 폭으로 두면 셋이 동급으로 읽혀
           무대 구도가 사라진다. 양옆은 lg:pt-16 만큼 내려 앉는다(Stand 참조).
        ⚠️ items-start 를 유지할 것 — 가운데가 끌어올려지는 것은 양옆이 내려간 결과다.
      */}
      {/* ⚠️ lg:pt-20 — 가운데를 -mt-20 만큼 끌어올렸으므로 그만큼 위에 자리를 비워 둔다. */}
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-10 lg:pt-20">
        {left ? <Stand d={left} /> : <div aria-hidden />}
        <Stand d={director} big />
        {right ? <Stand d={right} /> : <div aria-hidden />}
      </div>

      {/*
        ★ 갈 곳은 **의료진 소개 페이지 하나**다. 원장 개별 페이지는 없앴다.
          경력 전체와 학회 전체가 거기 있다.
      */}
      <div className="mt-16 flex justify-center">
        <Link
          href="/about/doctors"
          className="inline-flex items-center gap-2 rounded-full border border-ink/45 px-7 py-3.5 text-[16px] font-bold text-ink transition-colors hover:bg-white/10"
        >
          의료진 자세히 보기
          <span aria-hidden className="text-clay-700">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
