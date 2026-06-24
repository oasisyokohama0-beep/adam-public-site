import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { FixedCta } from "@/components/layout/FixedCta";
import { AgeGate } from "@/components/modals/AgeGate";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// NOTE(handover): Noto Serif/Sans JP は next/font/google だと Turbopack 本番ビルドで解決エラー
// Google Fonts CDN から直接読み込む

export const metadata: Metadata = {
  title: {
    default: "ADAM TOKYO",
    template: "%s | ADAM TOKYO",
  },
  description:
    "女性用風俗 ADAM TOKYO（東京・新宿）。超性感特化型 — 確かな技術力で特別なひとときを。完全予約制・丁寧なサポートで初めての方も安心です。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: "ADAM TOKYO",
    description: "女性用風俗 ADAM TOKYO（東京・新宿）。超性感特化型。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${cormorant.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500&family=Noto+Serif+JP:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-bg text-ink">
        <AgeGate />
        <SiteHeader />
        {children}
        <FixedCta />
      </body>
    </html>
  );
}
