'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { onTick, isSmooth } from '@/components/Smooth';

/* ══════════════════════════════════════════════════════════════
   bom-on 에서 뜯어온 움직임 조각 모음.
   원본은 GSAP/ScrollTrigger 가 하던 일을 여기서는 IntersectionObserver 와
   scroll 이벤트로 한다 — 라이브러리를 하나도 안 늘린다.
   ══════════════════════════════════════════════════════════════ */

/**
 * 스크롤 진입 시 등장.
 *
 * ★ 봄온 재감사(2026-08-20)에서 두 가지를 더 가져왔다.
 *   ① 방향 — 실측 gs_reveal 은 네 방향 변형을 쓴다.
 *      fromLeft x:-300 / fromRight x:30 / fromUp y:12 / fromDown y:-12 / 기본 y:60.
 *      (좌우가 -300 대 30 으로 비대칭인 건 원본 그대로다.)
 *   ② 되풀이 — 실측 toggleActions "play none none reset".
 *      위로 되돌아가면 리셋되고 다시 내려오면 또 재생된다.
 *      우리는 지금까지 전부 1회 재생(unobserve)이라, 오르내리는 사용자에게는
 *      아무 일도 안 일어나는 페이지로 보였다.
 * ⚠️ replay 를 기본값으로 켜지 않는다 — 본문 텍스트가 매번 다시 사라졌다
 *    나타나면 읽는 데 방해가 된다. 큰 제목·사진처럼 '연출' 자리에만 켠다.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  from,
  replay = false,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
  from?: 'up' | 'down' | 'left' | 'right';
  replay?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            if (!replay) io.unobserve(e.target);
          } else if (replay) {
            e.target.classList.remove('in');
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [replay]);
  const base = from ? `rv rv-${from}` : 'reveal';
  return (
    <Tag ref={ref} className={`${base} ${className}`} style={{ '--d': `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}

/**
 * 한 줄씩 마스크 밖으로 밀려 올라오는 제목.
 * ★ 원본의 SplitType + GSAP 타임라인을 CSS 로 옮긴 것 — 줄 단위라 글자 분해가 필요 없다.
 * ⚠️ 부모에 overflow:hidden 이 있어야 '밖에서 들어오는' 그림이 된다(.line-mask 가 그 역할).
 */
export function LineReveal({
  lines,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  lines: string[];
  delay?: number;
  className?: string;
  /**
   * ⚠️⚠️ 섹션 제목에는 반드시 as="h2" 를 준다 ⚠️⚠️
   *   기본값이 div 라서, 홈의 섹션 제목이 **heading 이 하나도 아니었다**(실측: h2 2개뿐).
   *   화면에는 크게 보이지만 문서 구조상으로는 그냥 글자 덩어리다 —
   *   화면 낭독기는 목차를 못 만들고, 답변형 AI 는 '질문 제목 + 다음 문단' 이라는
   *   인용 단위를 못 잡는다. 이 사이트의 전략이 통째로 걸린 자리다.
   */
  as?: ElementType;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.querySelectorAll('.line-mask').forEach((m) => m.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.querySelectorAll('.line-mask').forEach((m) => m.classList.add('in'));
          io.unobserve(e.target);
        }),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={l + i} className="line-mask" style={{ '--d': `${delay + i * 120}ms` } as React.CSSProperties}>
          <span>{l}</span>
          {/*
            ⚠️⚠️ 줄 사이에 공백을 넣어야 한다 ⚠️⚠️
              두 줄은 각각 block 이라 화면에서는 줄이 나뉘지만, textContent 는
              그냥 이어 붙는다 — "어떤 진료를받을 수 있나요?" (실측).
              크롤러와 답변형 AI 는 그 문자열을 읽으므로 검색어와 매칭이 깨진다.
              화면에는 안 보이고 읽기에만 잡히는 공백을 끼운다.
          */}
          {i < lines.length - 1 ? <span className="sr-only"> </span> : null}
        </span>
      ))}
    </Tag>
  );
}

/**
 * 글자 단위 무한 마퀴.
 * 실측: 글자마다 <span class="letter">, 부모 overflow:hidden, 5s infinite (delay 1s).
 * ⚠️ 같은 덩어리를 두 벌 이어 붙이고 트랙을 -50% 로 흘려야 이음매가 안 보인다.
 */
export function LetterMarquee({
  text,
  seconds = 26,
  className = '',
  colorClass = 'text-brand',
  size = 'hero',
}: {
  text: string;
  seconds?: number;
  className?: string;
  colorClass?: string;
  /**
   * hero — 히어로·푸터의 대형 띠 (실측 267px @1920 = 13.9vw)
   * band — 섹션 사이 구분선. **같은 크기로 쓰면 안 된다** —
   *        구분선 하나가 화면의 1/4(260px)을 먹는다. 목록 페이지처럼
   *        머리 바로 아래에 놓이는 자리에서는 본문을 화면 밖으로 밀어낸다.
   */
  size?: 'hero' | 'band';
}) {
  /*
   * ⚠️ 한글이 섞이면 세리프(.display)를 쓰지 않는다.
   *   Playfair Display 에는 한글 글자가 없어서 한 글자씩 Pretendard 로 폴백한다.
   *   그러면 한 줄 안에서 라틴은 세리프, 한글은 산세리프가 되어 굵기·베이스라인이 어긋난다
   *   (실측: "3인" 에서 3 은 13.5px 폭, 인 은 30px 폭이었다).
   *   한글이 있는 문구는 통째로 Pretendard 로 간다 — 자간만 좁혀 밀도를 맞춘다.
   */
  const hasKo = /[가-힣]/.test(text);

  const chunk = (key: string) => (
    <span key={key} className="inline-flex flex-none pr-[0.18em]">
      {[...`${text} `].map((ch, i) => (
        <span
          key={key + i}
          className={`inline-block ${hasKo ? 'font-bold' : 'display'} ${colorClass} ${ch === ' ' ? 'w-[0.28em]' : ''}`}
          style={{
            /* 원본 실측 267px @1920 = 13.9vw. line-height 1.0 이라 글자가 안 잘린다. */
            fontSize: size === 'band' ? 'clamp(26px, 4.4vw, 62px)' : 'clamp(56px, 13.9vw, 268px)',
            lineHeight: '1',
            letterSpacing: hasKo ? '-0.045em' : undefined,
            animation: 'letterBreathe 3.6s ease-in-out infinite',
            animationDelay: `${i * 70}ms`,
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
  const track = (key: string, hidden?: boolean) => (
    <span
      key={key}
      aria-hidden={hidden || undefined}
      className="inline-flex will-change-transform"
      style={{ animation: `marqueeSlide ${seconds}s linear infinite` }}
    >
      {[0, 1, 2, 3].map((i) => chunk(`${key}-${i}`))}
    </span>
  );
  return (
    <div className={`relative flex overflow-hidden whitespace-nowrap select-none pointer-events-none ${className}`}>
      {track('a')}
      {track('b', true)}
    </div>
  );
}

/**
 * On 토글 — bom-on 의 서명.
 * 실측: checked 면 배경 #ff7048, 풀면 #b4b4b4 로 **1.5초**에 걸쳐 바뀌고 히어로가 꺼진다.
 * "Turn on Bom on" 이라는 카피를 화면이 그대로 실행하는 구조다.
 * ⚠️ 손잡이는 바깥(이동) / 안쪽(흔들림) 두 겹이다 — 한 요소에 겹치면 이동이 안 먹는다.
 */
export function OnSwitch({ on, onChange, label = 'On' }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label="배경 켜기 / 끄기"
      onClick={() => onChange(!on)}
      className="relative inline-flex h-[46px] w-[111px] items-center rounded-full border-0 p-0"
      style={{ cursor: 'pointer' }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: on ? 'var(--color-brand)' : 'var(--color-off)', transition: 'background 1.5s ease-in-out' }}
      />
      <span
        className={`display relative z-10 text-[22px] text-white ${on ? 'ml-[18px]' : 'ml-auto mr-[18px]'}`}
        style={{ transition: 'margin 0.3s var(--ease-soft)' }}
      >
        {label}
      </span>
      <span
        className="absolute left-[5px] top-[5px] z-10 h-9 w-9"
        style={{ transform: on ? 'translateX(65px)' : 'none', transition: 'transform 0.3s var(--ease-soft)' }}
      >
        <i
          className="block h-full w-full rounded-full bg-white"
          style={{ boxShadow: '0 4px 14px rgba(0,0,0,.28)', animation: 'wobbleMe 1.2s ease-in-out infinite' }}
        />
      </span>
    </button>
  );
}

/**
 * 가로 스크롤 구간 — 세로로 굴리면 안에서 가로로 밀린다.
 * 실측: xPercent -80, scrub 3, pin, anticipatePin 1,
 *       onUpdate 에서 .scrollbar-progress 의 width 를 progress% 로 갱신.
 *
 * ★ 재감사에서 추가된 것 — **진행 바**.
 *   이게 없으면 가로 구간에 갇힌 사용자가 얼마나 남았는지 알 수 없어 중간에 나간다.
 *
 * ⚠️ 고정 방식이 두 갈래다.
 *   · 관성 OFF → CSS position:sticky. 브라우저가 처리하니 프레임이 안 밀린다.
 *   · 관성 ON  → sticky 는 죽는다(스크롤하는 조상이 없다). JS 로 translateY 핀.
 *   두 경우 모두 진행률 계산은 getBoundingClientRect 하나로 같다 — 관성은
 *   transform 이라 rect 에 이미 반영돼 있기 때문이다.
 */
export function HorizontalScroll({ children, ariaLabel }: { children: ReactNode; ariaLabel: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const stick = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [h, setH] = useState('100svh');

  useEffect(() => {
    const o = outer.current;
    const k = stick.current;
    const t = track.current;
    if (!o || !k || !t) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = window.matchMedia('(max-width: 900px)').matches;

    if (reduce || narrow) {
      t.style.transform = 'none';
      /* 좁은 화면에서는 그냥 가로로 넘겨 보는 레일이 된다. */
      t.style.overflowX = 'auto';
      t.classList.add('rail');
      setH('auto');
      return;
    }

    const pinned = isSmooth();
    if (pinned) k.style.position = 'relative';

    let over = 0;
    const measure = () => {
      over = Math.max(0, t.scrollWidth - window.innerWidth);
      setH(`calc(100svh + ${over}px)`);
    };
    const frame = () => {
      const r = o.getBoundingClientRect();
      const total = o.offsetHeight - window.innerHeight;
      const p = total <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / total));
      t.style.transform = `translate3d(${-over * p}px, 0, 0)`;
      if (bar.current) bar.current.style.width = `${p * 100}%`;
      /* 관성 모드에서는 sticky 대신 직접 붙든다. */
      if (pinned) k.style.transform = `translate3d(0, ${Math.min(Math.max(-r.top, 0), total)}px, 0)`;
    };
    measure();
    frame();
    const off = onTick(frame);
    const onResize = () => { measure(); frame(); };
    window.addEventListener('resize', onResize);
    return () => { off(); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <div ref={outer} style={{ height: h }} className="relative">
      <div ref={stick} className="hscroll-sticky">
        <div ref={track} className="hscroll-track" role="group" aria-label={ariaLabel}>
          {children}
        </div>
        <div className="hprog-rail" aria-hidden>
          <div ref={bar} className="hprog-bar" />
        </div>
      </div>
    </div>
  );
}

/**
 * 3점 로더 — 실측 sk-bouncedelay 1.4s, -0.32s 씩 어긋남.
 * ⚠️ 최대 1.6초 뒤에는 무조건 걷힌다. 로더가 안 걷히면 사이트가 죽은 것으로 보인다.
 */
export function Preloader() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1150);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[80] grid place-items-center bg-paper"
      style={{
        opacity: gone ? 0 : 1,
        visibility: gone ? 'hidden' : 'visible',
        transition: 'opacity .7s var(--ease-soft), visibility .7s',
      }}
    >
      <div className="flex gap-2.5">
        <span className="sk-dot" />
        <span className="sk-dot" />
        <span className="sk-dot" />
      </div>
    </div>
  );
}

/**
 * 속도에 반응하는 커서.
 *
 * ★★ 재감사 실측 (scroll.js) — 전에 만든 건 마우스에 '딱 붙어' 따라다녔다.
 *    그건 커서가 하나 더 있는 것일 뿐이다. 원본은 셋이 세트로 움직인다: ★★
 *      posX += (mouseX - posX) / 4        16ms 마다 → 끌려오는 지연
 *      scale    = 1 + min(dist / 200, .3) → 빨리 움직일수록 부푼다
 *      rotation = (mouseX - posX) * 0.2   → 진행 방향으로 기운다
 *    여기에 CSS transition .5s cubic-bezier(.75,1.27,.3,1.35) 가 겹쳐
 *    멈출 때 살짝 넘어갔다 돌아온다.
 *
 * ⚠️ 위치를 left/top 이 아니라 transform 으로 준다 — 원본은 left/top 이지만
 *    그건 매 프레임 레이아웃을 다시 계산시킨다. 결과는 같고 비용만 없앤다.
 * ⚠️ 손가락 입력(pointer:coarse)에는 아예 안 만든다. 커서가 없는데 커서를
 *    그리면 화면에 정체불명의 덩어리가 떠 있게 된다.
 */
export function DragCursor({ hostId, label = 'SCROLL' }: { hostId: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = document.getElementById(hostId);
    const cur = ref.current;
    if (!host || !cur) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let mx = 0, my = 0, px = 0, py = 0, live = false, raf = 0;

    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const on = () => {
      /* 처음 들어올 땐 마우스 자리에서 시작한다 — 화면 구석에서 날아오면 안 된다. */
      if (!live) { px = mx; py = my; }
      live = true;
      cur.classList.add('show');
    };
    const off = () => { live = false; cur.classList.remove('show'); };

    const loop = () => {
      px += (mx - px) / 4;
      py += (my - py) / 4;
      const dist = Math.hypot(mx - px, my - py);
      const scale = 1 + Math.min(dist / 200, 0.3);
      const angle = (mx - px) * 0.2;
      cur.style.transform = `translate3d(${px - 42}px, ${py - 42}px, 0) scale(${live ? scale : 0}) rotate(${angle}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    host.addEventListener('mousemove', move);
    host.addEventListener('mouseenter', on);
    host.addEventListener('mouseleave', off);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener('mousemove', move);
      host.removeEventListener('mouseenter', on);
      host.removeEventListener('mouseleave', off);
    };
  }, [hostId]);
  return (
    <div ref={ref} className="vcursor grid place-items-center rounded-full bg-brand text-white" style={{ width: 84, height: 84 }}>
      <span className="text-[12px] font-bold tracking-[0.16em]">{label}</span>
    </div>
  );
}

/**
 * 글자 초점 인 — bom-on 재감사에서 발견한 효과.
 * 실측: .letter 에 blur(8.6px) → 0, 글자마다 시차. opacity 로 대신하면 다른 인상이 된다.
 *
 * ⚠️ 공백은 blur 를 걸지 않는다 — 안 보이는 것에 GPU 를 쓸 이유가 없다.
 * ⚠️ 한 번 켜지면 관찰을 끊는다(unobserve). blur 는 비싸서 계속 물고 있으면 안 된다.
 */
export function BlurText({
  text,
  className = '',
  step = 55,
}: {
  text: string;
  className?: string;
  step?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const go = () => el.querySelectorAll('.blur-letter').forEach((s) => s.classList.add('in'));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { go(); return; }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { go(); io.unobserve(e.target); } }),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={ref} className={className}>
      {[...text].map((ch, i) =>
        ch === ' ' ? (
          <span key={i}> </span>
        ) : (
          <span key={i} className="blur-letter" style={{ '--d': `${i * step}ms` } as React.CSSProperties}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

/**
 * 커튼 와이프 이미지 — 회색 판이 위에서 아래로 걷히며 사진이 드러난다.
 * 실측: .figure-reveal 이 scaleY(1) → scaleY(0.05), 그 아래 사진은 scale(1.0262) → 1.
 */
export function FigureReveal({
  src,
  alt,
  delay = 0,
  className = '',
  imgClassName = 'h-full w-full object-cover',
}: {
  src: string;
  alt: string;
  delay?: number;
  className?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('in'); return; }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <figure
      ref={ref}
      className={`figure-reveal ${className}`}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={imgClassName} loading="lazy" />
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   봄온 재감사 2026-08-20 — 새로 가져온 것들
   ══════════════════════════════════════════════════════════════════════ */

/**
 * 글자 하나씩 아래에서 날아드는 제목.
 * 실측 (.header-1~4): gsap.set({autoAlpha:0, y:200}) →
 *   to({y:0, autoAlpha:1, ease:"expo.out", duration:1.01, stagger:0.07})
 *
 * ★ 200px 은 글자 높이보다 훨씬 크다. "아래에서 올라온다"가 아니라
 *   "멀리서 날아든다"에 가깝고, expo.out 이라 마지막에 거의 멈춘 듯 붙는다.
 * ⚠️ 공백은 span 으로 감싸지 않는다 — 감싸면 줄바꿈이 안 되고 자간이 틀어진다.
 * ⚠️ 화면 낭독기에는 통글자로 읽히도록 aria-label 을 준다. 글자마다 span 이면
 *    낱자로 읽어 버리는 리더가 있다.
 */
export function LetterReveal({
  text,
  className = '',
  step = 70,
  delay = 0,
  replay = true,
}: {
  text: string;
  className?: string;
  step?: number;
  delay?: number;
  replay?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = (on: boolean) =>
      el.querySelectorAll('.ltr').forEach((s) => s.classList.toggle('in', on));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { set(true); return; }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) { set(true); if (!replay) io.unobserve(e.target); }
          else if (replay) set(false);
        }),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [replay]);

  /*
   * ⚠️⚠️ 어절 단위로 묶어야 한다 ⚠️⚠️
   *   글자마다 inline-block 을 주면 브라우저는 **글자 사이 어디서나** 줄을 바꿔도 된다고 본다.
   *   실제로 "시작되는 진료" 가 "시작되는 / 진료" 로 끊겨 마지막 줄에 한 어절만 남았다.
   *   word-break: keep-all 도 여기서는 소용없다 — 이미 글자마다 독립된 상자라서다.
   *   → 어절을 nowrap 상자로 감싸면 줄바꿈이 띄어쓰기 자리로만 몰린다.
   * ⚠️ 어절 하나가 화면보다 넓을 일은 제목에서 사실상 없다(한국어 어절은 짧다).
   *    그래서 이 자리에서는 nowrap 이 안전하다.
   */
  let n = 0;
  const words = text.split(' ');
  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {[...word].map((ch, i) => (
            <span key={i} className="ltr" style={{ '--d': `${delay + n++ * step}ms` } as React.CSSProperties}>
              {ch}
            </span>
          ))}
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

/**
 * 뒤늦게 떠오르는 배경 오브젝트.
 * 실측 (.re03_bg_n / .re06_bg): ScrollTrigger onEnter → **setTimeout 1000ms** →
 *   gsap.to({ scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" })
 *
 * ★ 1초를 그냥 기다리는 게 핵심이다. 다른 요소와 같이 나오면 그냥 배경이지만,
 *   화면이 멈춘 뒤에 혼자 떠오르면 시선이 그리로 간다.
 */
export function PopIn({
  children,
  className = '',
  wait = 1000,
}: {
  children: ReactNode;
  className?: string;
  wait?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('in'); return; }
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          timer = setTimeout(() => e.target.classList.add('in'), wait);
        }),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, [wait]);
  return <div ref={ref} className={`popin ${className}`}>{children}</div>;
}

/**
 * 스크롤을 굴리면 겹쳐 있던 카드가 부채꼴로 펼쳐진다.
 * 실측 (.slide0):
 *   from { x: 0, scale: .8, opacity: .5, filter: blur(3px), position: absolute }
 *   to   { x: (i - n/2) * 420px, scale: 1, opacity: 1, blur: 0 }   scrub: 2
 *
 * ★ blur 가 핵심이다. scale·opacity 만으로는 '겹쳐 있다 흩어진다'가 아니라
 *   그냥 커지는 것으로 보인다.
 * ⚠️ 420px 은 원본 카드 폭 기준이다. 여기서는 화면 폭에 맞춰 계산한다 —
 *    고정 px 로 두면 좁은 화면에서 카드가 화면 밖으로 날아간다.
 * ⚠️ 좁은 화면·모션 감소에서는 그냥 격자로 쌓는다. 겹친 카드를 펼치는 연출은
 *    가로 공간이 있어야만 성립한다.
 */
export function FanRow({ items }: { items: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [flat, setFlat] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = window.matchMedia('(max-width: 900px)').matches;
    if (reduce || narrow) return;
    setFlat(false);

    /*
     * ⚠️ 여기서 한 번 모아 두면 안 된다 — setFlat(false) 는 비동기라
     *    이 시점에 .fan-item 은 아직 DOM 에 없다. (실제로 이 버그로 카드가
     *    한 자리에 겹쳐 있고 아무것도 안 움직였다.) 매 프레임 다시 찾는다.
     */
    const frame = () => {
      const kids = Array.from(el.querySelectorAll<HTMLElement>('.fan-item'));
      if (!kids.length) return;
      const r = el.getBoundingClientRect();
      /* 섹션이 화면 아래에서 가운데로 올라오는 동안 0 → 1 */
      const span = window.innerHeight * 0.85;
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top - window.innerHeight * 0.15) / span));
      const gap = Math.min(420, (window.innerWidth - 140) / Math.max(1, kids.length));
      kids.forEach((k, i) => {
        const x = (i - (kids.length - 1) / 2) * gap * p;
        k.style.transform = `translate3d(${x}px, 0, 0) scale(${0.8 + 0.2 * p})`;
        k.style.filter = `blur(${(1 - p) * 3}px)`;
        k.style.opacity = `${0.5 + 0.5 * p}`;
      });
    };
    frame();
    const off = onTick(frame);
    window.addEventListener('resize', frame);
    return () => { off(); window.removeEventListener('resize', frame); };
  }, []);

  return (
    <div
      ref={ref}
      className={flat ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4' : 'relative grid h-[clamp(300px,36vw,440px)] place-items-center'}
    >
      {items.map((it, i) => (
        <div key={i} className={flat ? '' : 'fan-item absolute w-[min(300px,22vw)]'}>
          {it}
        </div>
      ))}
    </div>
  );
}

/**
 * 숫자 세어 올리기. 실측: countUp.min.js / odometer.min.js 를 함께 싣고 있다.
 * ⚠️ 근거 있는 실제 값만 센다. "만족도 98%" 같은 걸 만들어 붙이면 그건 의료광고다.
 * ⚠️ 화면 낭독기에는 최종값만 준다 — 세는 중간값을 계속 읽어 주면 소음이다.
 */
export function Counter({
  to,
  suffix = '',
  duration = 1600,
  className = '',
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = `${to}${suffix}`; return; }
    let raf = 0;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          const t0 = performance.now();
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / duration);
            /* expo.out — 봄온이 제목에 쓰는 것과 같은 감속 */
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
            el.textContent = `${Math.round(to * eased)}${suffix}`;
            if (p < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        }),
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, suffix, duration]);
  return (
    <span className={className}>
      <span ref={ref} aria-hidden>0{suffix}</span>
      <span className="sr-only">{to}{suffix}</span>
    </span>
  );
}

/**
 * 화면에 붙어 있는 사진 구간.
 * 실측 (.partner_sect .img_wrap): ScrollTrigger pin + scrub 1, end "+=100%".
 *
 * ⚠️ 관성 ON 이면 CSS sticky 가 죽으므로 JS 로 붙든다. 관성 OFF 면
 *    브라우저 sticky 를 그대로 쓴다 — 프레임이 안 밀리는 쪽이 낫다.
 *    (HorizontalScroll 과 같은 이유·같은 방식)
 */
export function StickyMedia({ children, className = '' }: { children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const o = outer.current;
    const k = inner.current;
    if (!o || !k || !isSmooth()) return;
    k.style.position = 'relative';
    const frame = () => {
      const r = o.getBoundingClientRect();
      const total = Math.max(0, o.offsetHeight - window.innerHeight);
      k.style.transform = `translate3d(0, ${Math.min(Math.max(-r.top, 0), total)}px, 0)`;
    };
    frame();
    const off = onTick(frame);
    window.addEventListener('resize', frame);
    return () => { off(); window.removeEventListener('resize', frame); };
  }, []);
  return (
    <div ref={outer} className={className}>
      <div ref={inner} className="sticky-media flex items-center py-16">
        {children}
      </div>
    </div>
  );
}

/**
 * 화면에 붙였다 놓아 주는 상자 — 봄온 히어로의 여는 동작.
 *
 * 실측 (scroll.js, .main_top_cont):
 *   gsap.set({ height: '100vh' }) + ScrollTrigger { pin: true, pinSpacing: false, scrub: 3 }
 *   → 히어로가 제자리에 고정된 채 **다음 섹션이 그 위를 덮으며 올라온다.**
 *   pinSpacing:false 라서 히어로 높이만큼의 빈 공간이 생기지 않는다.
 *
 * ⚠️ 덮는 쪽에 배경색과 z-index 가 있어야 한다. 투명하면 두 화면이 겹쳐 보인다.
 * ⚠️ 관성 ON 이면 CSS sticky 가 죽으므로 JS 로 붙든다(HorizontalScroll 과 동일).
 * ⚠️ 100svh 를 쓴다 — 모바일 주소창이 접히면 100vh 는 화면보다 커진다.
 */
export function Pin({ children, className = '' }: { children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const k = box.current;
    if (!k || !isSmooth()) return;
    const parent = k.parentElement;
    if (!parent) return;
    k.style.position = 'relative';
    const frame = () => {
      const r = parent.getBoundingClientRect();
      /*
       * ⚠️ 상한이 없으면 히어로가 **영원히** 화면에 붙어 있는다.
       *    지금은 아래 섹션이 배경색으로 덮어 안 보일 뿐, 계속 레이어에 남아
       *    투명한 섹션이 하나라도 생기면 그대로 비친다.
       *    실측(pinSpacing:false, end "+=offsetHeight")대로 한 화면만 붙들고 놓는다.
       */
      const hold = Math.min(Math.max(-r.top, 0), window.innerHeight);
      k.style.transform = `translate3d(0, ${hold}px, 0)`;
    };
    frame();
    const off = onTick(frame);
    window.addEventListener('resize', frame);
    return () => { off(); window.removeEventListener('resize', frame); };
  }, []);
  return (
    <div className="pin-host">
      <div ref={box} className={`pin-box ${className}`}>{children}</div>
    </div>
  );
}

/**
 * 절 단위로 줄이 바뀌는 문단.
 *
 * ★★ 왜 필요한가 (2026-08-20 운영자) ★★
 *   "…한 문장으로 / 정리했습니다." 처럼 **말이 끊기는 자리**에서 줄이 바뀌고 있었다.
 *   브라우저는 그저 '남은 폭에 들어가는 만큼' 채울 뿐 의미를 모른다.
 *   → 마침표·쉼표 뒤에서 잘라 각 절을 inline-block 으로 둔다.
 *     inline-block 은 가능하면 통째로 놓이므로 줄바꿈이 그 경계로 몰린다.
 *
 * ★ 마침표·쉼표가 없으면 **연결어미**(-하고 · -지만 · -면서 · -며 · -거나 · -어서)
 *   뒤에서 끊는다. 운영자 말대로 "말 쉬는 타이밍" 이다.
 * ⚠️ 절 안에서 다시 접히는 것은 막지 않는다. white-space:nowrap 을 걸면
 *    좁은 화면에서 한 절이 통째로 삐져나가 글자가 잘린다 — 그게 더 나쁘다.
 * ⚠️ 절 사이의 공백은 **평범한 공백**이어야 한다. &nbsp; 로 붙이면 그 자리에서
 *    줄을 못 바꿔 정반대 결과가 된다.
 */
/*
 * 끊어도 되는 자리.
 *   1순위 — 마침표·쉼표·물음표 뒤
 *   2순위 — 연결어미 뒤 ("…하고 / …지만 / …는지") = 말이 쉬는 자리
 * ⚠️ 정규식은 모든 자리를 같은 무게로 끊는다. 실제로 어디서 줄이 바뀌는지는 폭이 정한다 —
 *    그래서 **문단 폭도 함께 맞춰야** 마침표에서 끊긴다. 규칙만으로는 안 된다.
 */
const CLAUSE_END =
  /(?<=[.,;:!?])\s+|(?<=(?:하고|되고|있고|없고|지만|면서|으며|이며|거나|어서|아서|해서|되어|이고|는지|으면|하면|되면|어도|아도|해도|처럼|보다|까지|부터|대로|것이|것은|것을|때문에|위해|통해|대해))\s+/g;

export function Lede({
  text,
  className = '',
  as: Tag = 'p',
}: {
  text: string;
  className?: string;
  as?: ElementType;
}) {
  const parts = text.split(CLAUSE_END).filter(Boolean);
  return (
    <Tag className={className}>
      {parts.map((s, i) => (
        /*
         * ⚠️⚠️ 절 사이의 공백은 span **바깥**에 둬야 한다 ⚠️⚠️
         *   안에 넣으면 inline-block 상자의 **끝 공백이라 브라우저가 지워 버린다.**
         *   그 결과 "…살리는 것이동그라미치과의", "노력합니다.장기적인" 처럼
         *   두 절이 붙어 버렸다 (운영자 지적, 실제로 사이트 전체에서 그랬다).
         *   바깥에 두면 상자와 상자 사이의 평범한 공백이 되어 살아남고,
         *   동시에 줄바꿈 기회도 그 자리에 생긴다 — 원래 노리던 동작이다.
         */
        <span key={i}>
          <span className="clause">{s}</span>
          {i < parts.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
