# 봄온(bom-on.com) 모션 전수 감사 — 2026-08-20

동그라미치과 v2 는 청담봄온의 모션 어휘를 따라 만들었다.
이 문서는 **원본을 실제로 열어 계측한 결과**와, 그중 무엇을 가져왔고 무엇을 일부러 안 가져왔는지의 대조표다.

측정 방법: Playwright 로 원본을 띄우고 ① 로드된 CSS 41개·JS 47개를 통째로 받아 읽고
② `ScrollTrigger.getAll()` 로 살아 있는 트리거를 열거하고 ③ 실제로 스크롤·호버·클릭하며
계산된 스타일의 전후 차이를 찍었다. 추정한 값은 하나도 없다.

---

## 원본이 쓰는 것 (실측)

라이브러리: **GSAP + ScrollTrigger + ScrollSmoother + SplitText + Flip + CustomEase + Observer**,
그 외에 anime.js · AOS · Swiper · countUp · odometer · waypoints · jquery.marquee.
살아 있는 ScrollTrigger 인스턴스 **28개**, 그중 pin 3개(히어로 scrub 3 / img_wrap scrub 1 / 가로 구간 scrub 3).

| 원본 | 계측값 | v2 |
|---|---|---|
| 전체 스크롤 관성 | `ScrollSmoother{smooth:1.5, effects:true}` | ✅ `Smooth.tsx` (지수감쇠 tau≈230ms) |
| 히어로 고정 | `.main_top_cont` pin, `pinSpacing:false`, scrub 3 | ✅ `Pin` — 한 화면 붙들고 놓음 |
| 글자 등장 | `.header-1~4` `y:200 → 0`, expo.out, 1.01s, stagger .07 | ✅ `LetterReveal` |
| 줄 등장 | SplitText `.single-line-inner` `yPercent:110 → 0` | ✅ `LineReveal` |
| 글자 초점 | `.header-5` anime.js `blur(10px)→0` + `x:-50→0` | ✅ `BlurText` (▲ 아래 참고) |
| 방향 등장 | gs_reveal `fromLeft x:-300` / `fromRight x:30` / `fromUp y:12` | ✅ `Reveal from=` |
| 되풀이 | `toggleActions:"play none none reset"` | ✅ `replay` 옵션 |
| 커튼 와이프 | `.figure-reveal` `scaleY 1→0` + 안쪽 `scale 1.5→1` | ✅ `FigureReveal` (배율은 1.03 로 순화) |
| 부채꼴 펼침 | `.slide0` `scale .8→1, opacity .5→1, blur 3px→0, x±420`, scrub 2 | ✅ `FanRow` |
| 가로 스크롤 | `xPercent:-80`, scrub 3, pin, anticipatePin | ✅ `HorizontalScroll` |
| 가로 진행 바 | `.scrollbar-progress` width = `self.progress*100%` | ✅ `.hprog-bar` |
| 붙는 사진 | `.img_wrap` pin + scrub 1, `end:"+=100%"` | ✅ `StickyMedia` |
| 지연 배경 | `.re03_bg_n` onEnter → **setTimeout 1000** → `scale .5→1` 1.2s | ✅ `PopIn` |
| 팔로우 커서 | `posX += (mouseX-posX)/4`, `scale 1+min(dist/200,.3)`, `rot (mouseX-posX)*.2` | ✅ `DragCursor` |
| 숫자 카운터 | countUp / odometer | ✅ `Counter` (근거 있는 값만) |
| 마퀴 | jquery.marquee `duration:10000, duplicated` | ✅ `LetterMarquee` |
| 3점 로더 | `sk-bouncedelay` 1.4s, -0.32s 시차 | ✅ `Preloader` |
| ON 토글 | `#checkbox` change → 영상 주입·재생, 800ms 뒤 문구 | ✅ `OnSwitch` + `HeroVideo` |
| 전체화면 GNB | body.open 토글 + 스크롤 잠금 | ✅ `Chrome` |

### 일부러 안 가져온 것

| 원본 | 왜 |
|---|---|
| 목록 hover ↔ 이미지 교차 전환 (`.re03 li:hover`) | 아코디언이 열리며 높이가 81→137px 로 뛴다. **마우스 없는 기기에서는 아예 못 여는 UI** 다. v2 는 클릭으로 여는 `DefinitionSwitch` 를 쓴다 |
| Swiper 슬라이드 `scaleX:2.8` 확대 | 사진을 가로로만 2.8배 늘린다. 원본은 그래픽이라 티가 덜 나지만 진료실 사진에는 못 쓴다 |
| 커스텀 커서 이미지 (`cursor:url(...)`) | 브라우저 기본 커서를 대체하면 클릭 가능 여부를 알기 어려워진다 |
| 전역 글자 크기 조절 (`updateGlobalFontSize`) | `body *` 를 순회하며 인라인 폰트 크기를 덮어쓴다. 브라우저 확대가 이미 하는 일이고, 여러 번 누르면 값이 누적돼 망가진다 |
| `initMagnetic` 등 | 원본에서 **호출되지 않는 죽은 코드**다 (`initScript()` 자체가 어디서도 안 불린다) |

---

## ⚠️ 되돌리기 전에 알아야 할 것

### 1. 관성 스크롤은 공짜가 아니다

`Smooth.tsx` 는 본문을 `position:fixed` 상자에 넣고 `transform` 으로 민다. 그 결과:

- **`position:fixed` 자식은 뷰포트가 아니라 그 상자 기준이 된다.**
  헤더·퀵메뉴·프리로더가 `app/layout.tsx` 에서 `<Smooth>` **바깥**에 있는 이유다.
  안으로 옮기면 같이 스크롤된다.
- **`position:sticky` 는 안에서 죽는다.** 스크롤하는 조상이 없기 때문이다.
  그래서 `Pin` / `StickyMedia` / `HorizontalScroll` 이 관성이 켜진 경우에만 JS 로 붙든다.
- 다음 경우에는 **자동으로 꺼진다**: `prefers-reduced-motion: reduce`, `pointer: coarse`(터치).
  관성 스크롤은 멀미를 유발하는 대표 패턴이고, 모바일에서는 브라우저의 네이티브 관성이 더 낫다.

### 2. `isSmooth()` 는 상태가 아니라 판정식이어야 한다

React 는 자식 `useEffect` 를 부모보다 **먼저** 실행한다.
처음에는 `Smooth` 가 전역 플래그를 세우고 `Pin` 이 그걸 읽게 했는데, 자식이 먼저 읽으니 항상 `false` 였다.
그래서 JS 핀은 안 걸리고, CSS sticky 는 나중에 붙은 `.is-smooth` 클래스에 해제돼
**아무것도 고정되지 않는** 상태가 됐다. 조건을 양쪽이 각자 계산하게 바꿔 순서 의존을 없앴다.

### 3. `FanRow` 의 `.fan-item` 은 매 프레임 다시 찾는다

`setFlat(false)` 는 비동기라, 그 직후에는 `.fan-item` 이 아직 DOM 에 없다.
한 번 모아 두면 빈 배열을 붙들고 아무것도 안 움직인다.

### 4. 내용은 모션과 무관하게 지킨다

- 지어낸 수치·성공률·가격은 없다. `Counter` 도 근거 있는 값(`3인`)만 센다.
  `14:00까지` 같은 시각은 정규식에서 제외했다 — 시각을 0부터 세면 뜻이 달라진다.
- 효과 설명 옆에는 항상 주의가 붙는다(`lib/aeo.ts` 의 `caution`).
  글을 줄일 때도 주의는 남긴다(`DefinitionSwitch`).

---

## 확인한 것 (2026-08-20)

- 관성: 스크롤 90ms 후 -1260 → 안착 -1400 (목표 -1400)
- 고정: 히어로 700px 까지 top 0 유지 후 해제 / 가로 구간·붙는 사진 각각 top 0 도달
- 커서: 정지 시 scale 1.000 · 급이동 시 scale 1.30(상한) rot 28.8° · 이탈 시 scale 0
- 진행 바: 35.3% → 100%
- 모바일(터치): `no-smooth`, sticky 는 네이티브, 헤더 고정 유지, 가로 넘침 0
- 모션 감소: 투명하게 남은 요소 0개, 커서 `display:none`, 부채꼴은 격자로 대체
- 서브 4페이지 200 + 헤더 정상, 해시 링크 `#visit` → top 89 (헤더 88 보정)
- 빌드 74/74, 콘솔 에러 0 (Vimeo 401 은 테스트 환경의 외부 차단)
