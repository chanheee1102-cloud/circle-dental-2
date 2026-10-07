'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { PUBLICATION_DETAIL } from '@/lib/doctors';

/**
 * 근거 페이지 '학술 활동이 있나요?' 의 사진 — 누르면 발표논문 배너가 크게 열린다 (2026-10-07 오너).
 *   썸네일 = 오너가 보낸 원내 진열 사진(public/img/trust-certificates-shelf.jpg).
 *   열리는 판 = 홈의 발표논문 배너와 같은 짜임(어두운 판 · 왼쪽 제목·저자 · 오른쪽 논문 화면). 오너 지시로 버튼(주요 이력·의료진 소개)은 뺐다.
 * ★ 브라우저 기본 <dialog> — Esc·바깥 누르기로 닫히고, 열린 동안 뒤 페이지에 초점이 가지 않는다.
 */
export function PublicationLightbox() {
  const dlg = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close(); // 판 바깥(어두운 막)을 누르면 닫힌다
    };
    d.addEventListener('click', onClick);
    return () => d.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => dlg.current?.showModal()}
        className="group relative block aspect-[6/5] w-full overflow-hidden rounded-xl border border-brand-200/70 bg-brand-100 text-left"
        aria-label="발표 논문 크게 보기"
      >
        <Image
          src="/img/trust-certificates-shelf.jpg"
          alt="원내 선반에 진열된 상장과 화분"
          fill
          sizes="(min-width: 1024px) 420px, 80vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[14px] font-medium text-ink shadow-sm">
          발표 논문 보기 <span aria-hidden>↗</span>
        </span>
      </button>

      <dialog
        ref={dlg}
        className="m-auto w-[min(1180px,94vw)] overflow-visible bg-transparent p-0 backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
        aria-label="발표 논문"
      >
        <div className="relative overflow-hidden rounded-[24px] bg-wine-deep lg:grid lg:min-h-[460px] lg:grid-cols-[54%_minmax(0,1fr)] lg:items-center">
          <div className="relative z-10 px-6 py-10 sm:px-10 lg:py-16">
            <p className="eyebrow-chip text-clay-300">발표논문</p>
            <p className="mt-5 text-[18px] leading-[1.6] font-semibold text-parchment sm:text-[21px]">
              {PUBLICATION_DETAIL.title}
            </p>
            <p className="mt-3 text-[15px] text-clay-300/80 sm:text-[16px]">{PUBLICATION_DETAIL.authors}</p>
          </div>
          <div aria-hidden className="absolute inset-0">
            <Image
              src={PUBLICATION_DETAIL.banner}
              alt=""
              fill
              sizes="(max-width: 1024px) 94vw, 1180px"
              className="object-cover object-right"
            />
            <div className="absolute inset-0 bg-wine-deep/82 lg:hidden" />
            <div className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(90deg,rgba(46,55,61,0.97)_0%,rgba(46,55,61,0.94)_40%,rgba(46,55,61,0.72)_56%,rgba(46,55,61,0)_74%)]" />
          </div>
          <button
            type="button"
            onClick={() => dlg.current?.close()}
            className="absolute top-3 right-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-[20px] text-white transition-colors hover:bg-black/70"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      </dialog>
    </>
  );
}
