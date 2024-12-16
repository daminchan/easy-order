import { type Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { jaJP } from "@clerk/localizations";
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
    <ClerkProvider localization={jaJP}>
      <html lang="ja" className={GeistSans.className}>
        <body>
          <header className="p-4 flex justify-end">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
