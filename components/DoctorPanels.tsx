import Link from 'next/link';
import Image from 'next/image';

/**
 * 의료진 — 더뉴치과 메인 '대표원장 소개' 판을 옮긴 것 (2026-09-28 오너).
 *
 * ★ 한 사람당 가로로 긴 판 하나. 반은 사진, 반은 크게 쓴 이름.
 *   마우스를 올리면(키보드로 '자세히 보기' 에 닿아도) 이름이 아래로 빠지고, 사진이 바깥쪽으로 밀리며
 *   사진 쪽에 이름표가 서고, 비워진 반쪽으로 경력이 올라온다. 두 번째 판은 좌우를 뒤집는다.
 * ★ 이름 뒤의 얇은 원은 '동그라미' — 더뉴가 인증 엠블럼을 두는 자리에 병원 이름의 원을 둔다.
 * ★ 올릴 마우스가 없는 화면(터치)·좁은 화면에서는 처음부터 경력까지 다 보인다.
 * ⚠️ 경력 줄은 lib/doctors.ts 의 keyCareer 그대로(원문 부분집합 — 그 파일의 assert 가 지킨다). 자격(license)은 이름 아래 한 번만.
 *    "경력 싹다 보여주는 것보다 중요한 경력만"(2026-08-31 운영자) — 전체 줄 수는 개수로만 적는다.
 * ⚠️ 사진 반쪽의 바탕색(bg)은 사진의 스튜디오 바탕을 잰 값이다. 사진 가장자리를 흐려 그 색에 녹인다.
 */
export interface DoctorPanel {
  slug: string;
  name: string;
  role: string;
  license: string;
  keyCareer: readonly string[];
  careerCount: number;
  societyCount: number;
  photo: string;
}

/** 사진 스튜디오 바탕 실측값(가장자리 픽셀) — 사진을 바꾸면 다시 잴 것 */
const PHOTO_BG: Record<string, string> = {
  'byun-seokho': '#b4b3ad',
  'kim-dongju': '#cfd2d9',
  'kim-injin': '#cdd2da',
};

export function DoctorPanels({ doctors }: { doctors: DoctorPanel[] }) {
  return (
    <div className="dp-list">
      {doctors.map((d, i) => {
        const spec = d.license.replace('보건복지부인증 ', '');
        return (
          <article
            key={d.slug}
            className={`dp-card reveal${i % 2 ? ' dp-flip' : ''}`}
            data-doc={d.slug}
            style={{ ['--dp-bg' as string]: PHOTO_BG[d.slug] ?? '#cfd2d9' }}
            aria-labelledby={`dp-${d.slug}`}
          >
            <div className="dp-photo">
              <Image
                src={d.photo}
                alt={`${d.name} ${d.role}`}
                width={625}
                height={670}
                sizes="(max-width: 1023px) 90vw, 520px"
                className="dp-img"
              />
              {/* 사진 쪽 이름표 — 올렸을 때만. 이름은 아래 제목이 이미 읽히므로 보조기기에는 숨긴다. */}
              <div className="dp-tag" aria-hidden>
                <span className="dp-tag-role">{d.role}</span>
                <span className="dp-tag-name">{d.name}</span>
                <span className="dp-tag-spec">{spec}</span>
              </div>
            </div>

            <div className="dp-side">
              <svg className="dp-ring" viewBox="0 0 200 200" aria-hidden focusable="false">
                <circle cx="100" cy="100" r="98" />
              </svg>
              <div className="dp-name">
                <span className="dp-role">{d.role}</span>
                <h3 id={`dp-${d.slug}`} className="dp-big">
                  {d.name}
                </h3>
                <span className="dp-spec">{spec}</span>
                <span className="dp-orn" aria-hidden>
                  <i />
                  <b />
                  <i />
                </span>
              </div>
              <div className="dp-info">
                {/*
                  2026-09-28 전문가 검토: 자격 줄(license)은 뺐다 — 이름 아래 '통합치의학과 전문의' 와 바로 겹쳤고,
                  '학력·경력 N줄 · 학회 N곳' 줄도 뺐다 — 바로 아래 단추가 같은 일을 하고, 줄 수는 만든 사람의 말이다.
                  (자격은 구획 머리말 '세 원장 모두 보건복지부인증 통합치의학과 전문의' 가 한 번에 말한다.)
                */}
                <ul>
                  {d.keyCareer.filter((c) => c !== d.license).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <Link href={`/about/doctors#${d.slug}`} className="dp-btn">
                  {d.name} {d.role} 자세히 보기
                  <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
                    <path d="M0 5h16M12.5 1 16.5 5l-4 4" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
