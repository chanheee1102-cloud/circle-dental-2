/*
 * ⚠️⚠️ page-dark 를 다시 붙이지 말 것 (2026-09-02 피드백: "전체적으로 하얗고 따뜻한 색상으로") ⚠️⚠️
 *   이 사이트의 기본 팔레트는 홈이 쓰는 웜 스톤(바탕 #efebe4 · 카드 #fffdf8)이다.
 *   .page-dark 는 그 값을 통째로 뒤집던 껍데기였고, 지금은 어느 페이지에도 붙이지 않는다.
 *   되돌리려면 globals.css 의 .page-dark 블록이 그대로 남아 있으니 클래스만 다시 붙이면 된다.
 *   다만 그때는 밝은 결 기준으로 고쳐 둔 색들(금색 라벨·선 색·밝은 띠)을 함께 봐야 한다.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
