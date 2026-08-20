'use client';

import { useEffect, useRef, useState } from 'react';
import { VIDEO } from '@/lib/clinic';

/**
 * 히어로 배경 — 영상이 켜져 있으면 소개 영상, 꺼져 있으면 **병원 실제 사진이 흐른다.**
 *
 * ★★ 껐을 때가 빈 화면이면 안 된다 (2026-08-20 운영자 지적) ★★
 *   전에는 끄면 사진을 opacity .12 + 흑백으로 눌러서 사실상 검은 화면이 됐다.
 *   토글을 눌렀는데 아무것도 없으면 "고장" 으로 읽힌다.
 *   지금은 끄면 사진이 **선명하게** 드러나고, 4.8초마다 다음 장으로 넘어가며
 *   아주 느리게 확대된다(켄번즈). 켜면 첫 장으로 돌아가 영상 밑판이 된다.
 *
 * ★★ 사진을 항상 먼저 깔고, **영상이 진짜 재생될 때만** 겹친다 ★★
 *
 *   ⚠️⚠️ 여기서 한 번 틀렸다 (2026-08-20 실측) ⚠️⚠️
 *     처음에는 iframe 을 붙이고 **900ms 타이머**로 페이드인했다. 그런데 이 환경에서
 *     Vimeo 가 차단돼 있었고, 플레이어 대신
 *       "We couldn't verify the security of your connection."
 *     라는 **영어 오류 화면이 사진 위로 그대로 떠올랐다.** 폴백을 만들어 놓고
 *     폴백이 안 걸리는 코드를 쓴 셈이다.
 *
 *     타이머는 "영상이 떴다" 를 증명하지 않는다. 시간만 증명한다.
 *     그래서 지금은 **플레이어가 보내는 postMessage 를 받은 뒤에만** 겹친다.
 *     차단·오프라인·느린 회선에서는 메시지가 안 오고, 사진이 그대로 남는다.
 *
 * ★ 화면비를 실측해서 cover 크기를 계산한다 (데스크톱 1.775 / 모바일 0.800).
 *   비율을 고정하면 세로 영상이 가로 자리에서 위아래가 크게 잘려 얼굴이 사라진다.
 *
 * ⚠️ 모바일에서는 iframe 을 늦게 붙인다 — 사진과 대역폭을 다투면 가장 큰 요소가
 *    뜨는 시각이 통째로 밀린다.
 */
const VIMEO_ORIGIN = 'https://player.vimeo.com';
/** 이 시간 안에 플레이어 신호가 없으면 영상은 없는 것으로 친다. */
const GIVE_UP_MS = 6000;

export default function HeroVideo({
  on,
  stills,
  index,
}: {
  on: boolean;
  stills: { src: string; alt: string }[];
  index: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    setNarrow(mq.matches);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => mq.removeEventListener('change', onChange);
    }

    /* 사진이 자리를 잡은 뒤에 iframe 을 붙인다. */
    const w = window as Window & { requestIdleCallback?: (c: () => void, o?: { timeout: number }) => number };
    const idle = (cb: () => void) => {
      if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 2200 });
      else window.setTimeout(cb, 1200);
    };
    idle(() => setMounted(true));
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /*
   * ★ 재생 신호를 기다린다 — 타이머가 아니라 플레이어가 보내는 메시지다.
   *   Vimeo 임베드는 준비되면 postMessage 로 이벤트를 보낸다. 차단되면 아무것도 안 온다.
   */
  useEffect(() => {
    if (!mounted) return;
    let done = false;

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== VIMEO_ORIGIN || done) return;
      let data: unknown = e.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch { return; }
      }
      const ev = (data as { event?: string } | null)?.event;
      if (ev === 'ready' || ev === 'play' || ev === 'playing' || ev === 'timeupdate') {
        done = true;
        setPlaying(true);
      }
    };
    window.addEventListener('message', onMessage);

    /* 신호가 안 오면 조용히 포기한다 — 사진이 그대로 남는다(오류 화면을 안 보여준다). */
    const giveUp = setTimeout(() => { done = true; }, GIVE_UP_MS);

    return () => {
      window.removeEventListener('message', onMessage);
      clearTimeout(giveUp);
    };
  }, [mounted]);

  const v = narrow ? VIDEO.mobile : VIDEO.desktop;
  const showVideo = on && playing;
  /* 켜져 있으면 첫 장이 영상 밑판, 꺼져 있으면 지금 장이 주인공. */
  const shown = on ? 0 : index;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/*
        ① 사진 — 영상이 못 뜨는 환경에서도 화면이 비지 않는다.
        ⚠️ 전부 겹쳐 두고 opacity 로만 바꾼다. 한 장씩 갈아 끼우면 교체 순간
           빈 프레임이 한 번 보인다(디코딩이 끝나기 전에 표시되기 때문).
        ⚠️ 첫 장만 즉시 받고 나머지는 lazy — 첫 화면 로딩에 8장이 달려들면
           가장 큰 요소가 뜨는 시각이 그만큼 밀린다.
      */}
      {stills.map((s, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={s.src}
          src={s.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority={i === 0 ? 'high' : 'auto'}
          loading={i === 0 ? 'eager' : 'lazy'}
          style={{
            opacity: i === shown ? (on ? 1 : 0.96) : 0,
            /* 꺼져 있을 때만 아주 느리게 확대된다 — 정지 사진이 아니라 '보고 있는 화면'이 된다. */
            animation: !on && i === shown ? 'heroDrift 15s ease-in-out infinite alternate' : undefined,
            transition: 'opacity 1.25s ease-in-out',
          }}
        />
      ))}

      {/* ② 영상 — 실측 화면비로 cover 계산. 신호를 받기 전에는 완전히 감춘다.
             ⚠️ visibility 까지 끈다 — opacity:0 만으로는 차단 오류 화면이
                스크린리더와 텍스트 선택에 잡힌다. */}
      {mounted && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `max(100vw, calc(100svh * ${v.ratio}))`,
            height: `max(100svh, calc(100vw / ${v.ratio}))`,
            opacity: showVideo ? 1 : 0,
            visibility: showVideo ? 'visible' : 'hidden',
            transition: 'opacity 1.2s ease-in-out, visibility 1.2s',
          }}
        >
          <iframe
            ref={frameRef}
            title={`${VIDEO.title} 배경 영상`}
            src={v.src}
            allow="autoplay; fullscreen; picture-in-picture"
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
