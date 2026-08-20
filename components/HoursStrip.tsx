'use client';

import { useEffect, useState } from 'react';
import { CLINIC } from '@/lib/clinic';

/**
 * 진료시간 — 한 주가 한 줄에 들어간다.
 *
 * ★★ 왜 세로 표를 버렸나 (2026-08-20 운영자: "너무 길어, 한눈에 보이게") ★★
 *   요일마다 한 줄씩 쌓으니 8행 × 100px = 800px 이 됐다. 화면을 다 써 놓고
 *   정작 "화요일이 언제까지지?" 를 알려면 눈이 세로로 여덟 번 움직여야 했다.
 *   요일은 **원래 가로로 나열되는 정보**다 (달력이 그렇다).
 *   7칸으로 펴면 200px 남짓에 끝나고, 야간 진료가 화·목이라는 **패턴**이 한눈에 보인다.
 *
 * ★ 오늘 칸을 표시한다 — 이 표를 보는 사람의 진짜 질문은 "오늘 하나요?" 다.
 *   ⚠️ 기준은 방문자의 기기 시간이 아니라 **병원이 있는 곳(Asia/Seoul)의 날짜**다.
 *      해외에서 보면 기기 날짜가 하루 어긋나는데, 궁금한 건 병원의 오늘이다.
 *   ⚠️ "지금 진료 중" 은 쓰지 않는다. 점심시간·휴진일·임시 휴진을 화면이 알 수 없어
 *      틀린 안내가 된다. 오늘이 어느 칸인지만 짚어 준다.
 *   ⚠️ 서버 렌더 때는 아무 칸도 표시하지 않는다(mounted 후에만). 서버와 클라이언트의
 *      날짜가 다르면 hydration 이 깨진다.
 */
export default function HoursStrip() {
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    /* Asia/Seoul 기준 요일(0=일 … 6=토) */
    const seoul = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
    ).getDay();
    /* CLINIC.hours 는 월요일부터다 — 일요일(0)은 마지막 칸(6). */
    setToday(seoul === 0 ? 6 : seoul - 1);
  }, []);

  return (
    <>
      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] bg-white/10 sm:grid-cols-4 lg:grid-cols-7">
        {CLINIC.hours.map((h, n) => {
          /* '09:30 – 18:30' 을 그대로 쓴다. 쪼개면 '부터/까지'가 사라져 뜻이 흐려진다. */
          const on = today === n;
          return (
            <div
              key={h.label}
              /*
               * ⚠️ 7 은 2 로도 4 로도 나누어떨어지지 않는다. 마지막 칸을 그냥 두면
               *    좁은 화면에서 **빈 슬롯이 회색 사각형으로 남는다**(칸 사이 1px 선의
               *    바탕색이 그대로 보인다). 마지막 칸이 남은 폭을 차지하게 한다.
               */
              className={`relative flex flex-col gap-3 px-5 py-7 ${
                n === CLINIC.hours.length - 1 ? 'col-span-2 lg:col-span-1' : ''
              }`}
              style={{ background: on ? 'color-mix(in srgb, var(--color-brand) 26%, #14171c)' : '#14171c' }}
            >
              {/* 오늘 표시 — 색만으로 알리지 않는다. 색을 못 보는 사람에게는 글자가 근거다. */}
              {on && (
                <span className="absolute right-4 top-4 rounded-full bg-brand-2 px-2 py-[3px] text-[11px] font-bold text-[#0d1113]">
                  오늘
                </span>
              )}
              <dt className={`text-[14px] tracking-[0.02em] ${h.closed ? 'text-white/45' : 'text-white/55'}`}>
                {/* 화면에는 '월', 낭독기에는 '월요일'. */}
                {h.label.replace('요일', '').replace(' · 공휴일', '')}
                <span className="sr-only">요일</span>
              </dt>
              <dd>
                <span
                  className={`block text-[16px] font-bold leading-[1.5] tracking-[-0.01em] tabular-nums ${
                    h.closed ? 'text-white/55' : 'text-white'
                  }`}
                >
                  {h.time}
                </span>
                {h.note ? (
                  <span className="mt-2 block text-[13px] leading-[1.5] text-brand-2">{h.note}</span>
                ) : h.closed ? (
                  <span className="mt-2 block text-[13px] leading-[1.5] text-white/65">공휴일 포함</span>
                ) : null}
              </dd>
            </div>
          );
        })}
      </dl>

      {/*
        점심시간은 요일 칸에 넣지 않는다 — 7칸 전부에 같은 값을 반복하게 되고,
        토요일만 예외라는 사실이 오히려 묻힌다.
      */}
      <p className="mt-6 text-[14.5px] leading-[1.8] text-white/60">
        점심시간 <span className="font-bold tabular-nums text-white">{CLINIC.lunch.time}</span>
        <span className="ml-2">({CLINIC.lunch.note})</span>
      </p>
    </>
  );
}
