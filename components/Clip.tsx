/**
 * 움직이는 사진(움짤) — GIF 대신 **소리 없는 짧은 영상**으로 튼다.
 *
 * ★★ 왜 GIF 를 그대로 안 쓰나 (2026-09-07 오너: "GIF 파일로 움짤처럼 넣을 수 있나?") ★★
 *   받은 GIF 가 한 장에 **10MB** 였다. 이 사이트의 첫 화면 전송량이 700KB 인데, 그 열네 배를
 *   사진 한 장에 쓰면 LCP 가 무너지고 모바일 요금제에서 욕을 먹는다.
 *   같은 그림을 mp4 로 바꾸면 **0.75MB**, webm 이면 **0.26MB** 다 — 보기엔 똑같이 돈다.
 *   <video autoplay muted loop playsinline> 은 모든 브라우저에서 GIF 처럼 저절로 돌고,
 *   소리가 없으니 자동 재생 차단에도 안 걸린다.
 *
 * ★ webm 을 앞에, mp4 를 뒤에 — 브라우저는 **첫 번째로 재생 가능한 것**을 고른다.
 *   크롬·파이어폭스는 webm(더 작다), 사파리는 mp4 를 집는다.
 * ★ poster = 첫 프레임 webp. 영상이 내려오기 전과 '움직임 줄이기' 설정에서 보이는 그림이다.
 * ⚠️ 움직임 줄이기(prefers-reduced-motion) 를 켠 사람에게는 **돌리지 않는다** — 첫 장만 보인다.
 *    멀미·전정 장애가 있는 사람에게 자동 재생 영상은 접근성 문제다.
 * ⚠️ aria-hidden 이 아니다 — 무엇이 찍혔는지 aria-label 로 말한다. 영상엔 alt 가 없다.
 * ⚠️ 새 클립을 만들 때는 scripts 대신 아래 명령을 그대로 쓸 것(짝수 폭·yuv420p 가 핵심이다):
 *    ffmpeg -i in.gif -vf "scale=780:-2" -pix_fmt yuv420p -movflags +faststart -c:v libx264 -crf 23 -an out.mp4
 *    ffmpeg -i in.gif -vf "scale=780:-2" -pix_fmt yuv420p -c:v libvpx-vp9 -b:v 0 -crf 34 -an out.webm
 */
export function Clip({
  base,
  label,
  className = '',
}: {
  /** public/video/{base}.webm · .mp4 · .webp(포스터) 세 파일이 있어야 한다. */
  base: string;
  /** 무엇이 찍혔는지. 스크린리더가 읽는다. */
  label: string;
  className?: string;
}) {
  return (
    <video
      className={`h-full w-full object-cover motion-reduce:hidden ${className}`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={`/video/${base}.webp`}
      aria-label={label}
    >
      <source src={`/video/${base}.webm`} type="video/webm" />
      <source src={`/video/${base}.mp4`} type="video/mp4" />
    </video>
  );
}

/**
 * 움직임 줄이기를 켠 사람에게 보이는 정지 장면. Clip 과 **짝으로** 둔다.
 * ⚠️ Clip 에 motion-reduce:hidden 이 있으므로 이것이 없으면 그 사람에겐 빈 상자가 남는다.
 */
export function ClipStill({ base, alt, className = '' }: { base: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- 포스터 한 장이라 next/image 의 최적화가 필요 없다
  return <img src={`/video/${base}.webp`} alt={alt} className={`hidden h-full w-full object-cover motion-reduce:block ${className}`} />;
}
