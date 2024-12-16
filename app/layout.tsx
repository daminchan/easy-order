import { type Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "./globals.css";

export const metadata: Metadata = {
  title: "EazyOrder",
  description: "簡単に注文、スムーズに受け取り",
};

type Props = {
  /** ページコンテンツ */
  children: React.ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <html lang="ja" className={GeistSans.className}>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
