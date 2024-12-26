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
import { Footer } from "@/components/ui/Footer";
import { Providers } from "./providers";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/ui/header/header";

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
        <body className="min-h-screen flex flex-col">
          <Providers>
            {/* <header className="p-4 flex justify-end">
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header> */}
            <div className="print:hidden">
              <Header />
            </div>
            <main className="flex-grow">{children}</main>
            <div className="print:hidden">
              <Footer />
            </div>
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
