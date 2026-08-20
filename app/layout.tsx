import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CLINIC } from '@/lib/clinic';
import { SITE_URL } from '@/lib/schema';
import QuickMenu from '@/components/QuickMenu';
import Chrome from '@/components/Chrome';
import SiteFooter from '@/components/SiteFooter';
import Smooth from '@/components/Smooth';
import { Preloader } from '@/components/Motion';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${CLINIC.name} — ${CLINIC.tagline}`,
  description: CLINIC.description,
  keywords: [
    '화정동 치과', '고양시 치과', '덕양구 치과', '동그라미치과', '화정역 치과',
    '자연치아살리기', '화정동 임플란트', '사랑니 발치', '야간진료 치과',
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  openGraph: {
    type: 'website', locale: 'ko_KR', url: SITE_URL, siteName: CLINIC.name,
    title: `${CLINIC.name} — ${CLINIC.tagline}`,
    description: CLINIC.description,
  },
  twitter: { card: 'summary_large_image' },
  /*
   * 파비콘은 app/icon.png · app/apple-icon.png 파일 규약을 쓴다.
   * ⚠️ 예전에는 453×106 **가로형 로고**를 그대로 지정했다. 탭의 16px 자리에서는
   *    높이 4px 짜리 실선이 되어 아무것도 안 보인다. 동그란 심볼만 잘라 정사각으로 만들었다.
   */
};

export const viewport: Viewport = { themeColor: '#1f7a6e', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* 대형 세리프 — bom-on 의 유료 서체 'avenue' 자리를 무료 서체로 대신한다. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/*
          ⚠️⚠️ 순서와 위치가 곧 동작이다 ⚠️⚠️
          Smooth 는 본문을 position:fixed 상자에 넣고 transform 으로 민다.
          transform 이 걸린 조상은 position:fixed 자식의 기준점이 되므로,
          화면에 고정돼야 하는 것(헤더 · 퀵메뉴 · 프리로더)은 반드시
          <Smooth> **바깥**에 있어야 한다. 안에 넣으면 같이 스크롤된다.

          Chrome / Preloader 를 각 페이지에서 layout 으로 올린 이유도 이것이다
          (2026-08-20). 예전에는 13개 page.tsx 가 각자 <Chrome /> 을 그렸다.
        */}
        <Preloader />
        <Chrome />
        {/*
          푸터는 Smooth **안**에 있어야 한다 — 본문과 함께 스크롤되는 내용이다.
          (헤더·퀵메뉴만 바깥이다. 그쪽은 화면에 고정돼야 하니까.)
          전에는 홈의 page.tsx 안에만 있어서 나머지 13개 페이지에 푸터가 없었다.
        */}
        <Smooth>
          {children}
          <SiteFooter />
        </Smooth>
        <QuickMenu />
      </body>
    </html>
  );
}
