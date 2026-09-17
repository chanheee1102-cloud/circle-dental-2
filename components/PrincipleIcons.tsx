/**
 * '동그라미가 가장 먼저 생각하는 것' 네 줄의 선 아이콘 — 목업(2026-09-16 요청서)의 원 안 아이콘.
 *
 * ★ 24×24 격자, 1.4px 선, currentColor. 담는 원(.icon-ring)이 색을 정한다.
 * ★ 읽는 것이 아니라 알아보는 것이라 자세히 그리지 않는다(PillarIcons 와 같은 원칙).
 * ⚠️ aria-hidden — 옆의 글자가 뜻을 진다.
 */
import type { ReactNode } from 'react';

function Svg({ children, size = 22 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
    >
      {children}
    </svg>
  );
}

/** 어금니 윤곽 — 치아 하나를 본다. */
const TOOTH =
  'M12 3.6c-3.3 0-5.6 2.1-5.6 5.1 0 2.2.6 3.6 1 5.2.4 1.6.5 3.2.7 4.4.2 1.2.6 2.3 1.5 2.3.9 0 1.1-1 1.3-2.2.2-1.2.4-2.3 1.1-2.3s.9 1.1 1.1 2.3c.2 1.2.4 2.2 1.3 2.2.9 0 1.3-1.1 1.5-2.3.2-1.2.3-2.8.7-4.4.4-1.6 1-3 1-5.2 0-3-2.3-5.1-5.6-5.1Z';

/** 01 정말 치료가 필요한가 — 치아 하나. */
export function ToothIcon({ size }: { size?: number } = {}) {
  return (
    <Svg size={size}>
      <path d={TOOTH} />
    </Svg>
  );
}

/** 02 자연치아를 살릴 방법은 없는가 — 치아와 잎. */
export function ToothLeafIcon({ size }: { size?: number } = {}) {
  return (
    <Svg size={size}>
      <path d="M10.5 4.2c-3 .2-5 2.2-5 5 0 2.2.6 3.6 1 5.2.4 1.6.5 3.2.7 4.4.2 1.2.6 2.3 1.5 2.3.9 0 1.1-1 1.3-2.2.2-1.2.4-2.3 1.1-2.3s.9 1.1 1.1 2.3c.2 1.2.4 2.2 1.3 2.2.9 0 1.3-1.1 1.5-2.3.1-.8.2-1.8.4-2.8" />
      <path d="M14.2 12.6c0-3.6 2.5-6.4 6.2-6.6-.2 3.7-3 6.4-6.2 6.6Z" />
      <path d="M14.2 12.6 18.6 8.2" />
    </Svg>
  );
}

/** 03 지금 꼭 치료해야 하는가 — 시계. */
export function ClockIcon({ size }: { size?: number } = {}) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.4v4.9l3.2 2" />
    </Svg>
  );
}

/** 04 환자가 치료 내용을 충분히 이해하고 있는가 — 말풍선 안의 확인 표시. */
export function UnderstandIcon({ size }: { size?: number } = {}) {
  return (
    <Svg size={size}>
      <path d="M12 4.2c-4.6 0-8.2 2.9-8.2 6.5 0 2.1 1.2 4 3.1 5.2l-.9 3.6 3.9-2.2c.7.1 1.4.2 2.1.2 4.6 0 8.2-2.9 8.2-6.6S16.6 4.2 12 4.2Z" />
      <path d="m8.9 10.9 2.1 2.1 4.2-4.3" />
    </Svg>
  );
}

export const PRINCIPLE_ICONS = [ToothIcon, ToothLeafIcon, ClockIcon, UnderstandIcon] as const;
