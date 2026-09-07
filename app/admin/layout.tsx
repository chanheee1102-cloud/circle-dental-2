import type { Metadata } from 'next';

/*
 * ⚠️ 관리자 화면은 검색에 안 실린다 — robots.ts 의 disallow 와 여기 noindex 가 한 쌍이다.
 *    한쪽만 있으면 링크를 타고 온 크롤러가 색인한다.
 */
export const metadata: Metadata = {
  title: '블로그 관리',
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
