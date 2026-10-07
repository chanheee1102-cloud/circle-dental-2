'use client';

import { useEffect, useRef } from 'react';

/**
 * 화면 가까이 와야 받는 움짤 영상 — 홈 '살릴 수 있는지부터' 동그라미 창 (2026-10-07 오너: "노트북에서 영상이 깨진다, 최적화").
 *
 * ★ 왜 Clip 과 따로 두나
 *   Clip 은 autoplay 라 페이지를 열자마자 영상을 통째로 받는다. 이 창은 화면 다섯 번째 구획이라
 *   첫 화면 전송량에 넣을 이유가 없다 → preload="none" 으로 두고, 화면 600px 앞에서 받기 시작해 재생,
 *   화면 밖으로 나가면 멈춘다(노트북에서 다른 움직임과 함께 돌며 프레임이 밀리던 것도 덜어 준다).
 * ★ 움직임 줄이기 → 영상은 숨고 포스터(첫 장면) 그림만(motion-reduce:hidden / block).
 * ⚠️ public/video/{base}.webm · .mp4 · .webp(포스터) 세 파일이 있어야 한다.
 */
export function LazyClip({ base, label, className = '' }: { base: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let loaded = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!loaded) {
            loaded = true;
            v.preload = 'auto';
            v.load();
          }
          v.play().catch(() => {});
        } else if (loaded) {
          v.pause();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <video
        ref={ref}
        className={`h-full w-full object-cover motion-reduce:hidden ${className}`}
        muted
        loop
        playsInline
        preload="none"
        poster={`/video/${base}.webp`}
        aria-label={label}
      >
        <source src={`/video/${base}.webm`} type="video/webm" />
        <source src={`/video/${base}.mp4`} type="video/mp4" />
      </video>
      {/* eslint-disable-next-line @next/next/no-img-element -- 포스터 한 장 */}
      <img src={`/video/${base}.webp`} alt={label} className={`hidden h-full w-full object-cover motion-reduce:block ${className}`} />
    </>
  );
}
