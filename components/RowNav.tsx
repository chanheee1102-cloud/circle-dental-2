'use client';

/**
 * 가로 흐름의 ‹ › — 인터서울 아티클 줄의 넘김 단추. 마우스로는 옆으로 굴릴 방법이 없어(휠은 세로) 단추가 필요하다.
 * ★ 상태가 없다 — 대상 상자(id)를 찾아 폭의 80% 만큼 부드럽게 민다. 관찰자·리스너를 만들지 않는다.
 * ⚠️ 대상은 overflow-x:auto 인 상자여야 한다(.snap-row). 다른 데서 쓰려면 그 상자에 id 를 줄 것.
 */
export function RowNav({ target, label, className = '' }: { target: string; label: string; className?: string }) {
  const go = (dir: -1 | 1) => {
    const el = document.getElementById(target);
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };
  return (
    <div className={`flex gap-2 ${className}`}>
      <button type="button" aria-label={`이전 ${label}`} onClick={() => go(-1)} className="icon-ring icon-ring-btn">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" aria-label={`다음 ${label}`} onClick={() => go(1)} className="icon-ring icon-ring-btn">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
