/*
 * treatment 아래 모든 페이지의 결 — 어두운 서브페이지 (2026-08-31 오너: "서브페이지 전부").
 *
 * ⚠️ 이 파일을 지우면 이 폴더만 밝은 결로 되돌아간다. 색은 globals.css 의
 *    .page-dark 한 곳에 모여 있다 — 값을 바꾸려면 거기서 바꿀 것.
 * ⚠️ 홈(/)에는 붙이지 않는다. 홈은 밝은 결이 기준이다.
 *
 * ★ treat-page — 진료과목 아홉 곳의 바탕색을 충치치료의 결 하나로 모은다
 *   (2026-09-01 오너: "진료 메뉴 전체를 충치치료 페이지 디자인으로 통일").
 *   ⚠️ 이 클래스를 여기 말고 다른 데서 붙이지 말 것. 한 곳에서만 붙어야
 *      "진료 페이지는 전부 같다" 가 규칙으로 유지된다.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="page-dark treat-page">{children}</div>;
}
