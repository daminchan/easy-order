/**
 * アプリケーション共通のヘッダーコンポーネント
 * @description
 * - 左側にホームリンク
 * - 右側にユーザーメニューと認証ボタンを配置
 * - レスポンシブ対応
 */
"use client";

import { type FC, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  useUser,
} from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Home, User, ClipboardList, ShoppingBag } from "lucide-react";
import { checkIsAdmin } from "@/app/_actions/checkIsAdmin";

/** ナビゲーションリンクの型定義 */
type NavLink = {
  href: string;
  label: string;
  icon?: React.ReactNode;
  adminOnly?: boolean;
};

/** ナビゲーションリンク一覧 */
const navLinks: NavLink[] = [
  { href: "/", label: "ホーム", icon: <Home className="h-4 w-4" /> },
  { href: "/user", label: "マイページ", icon: <User className="h-4 w-4" /> },
  {
    href: "/admin/students",
    label: "生徒管理",
    icon: <ClipboardList className="h-4 w-4" />,
    adminOnly: true,
  },
  {
    href: "/admin/orders",
    label: "注文管理",
    icon: <ShoppingBag className="h-4 w-4" />,
    adminOnly: true,
  },
  {
    href: "/admin/print",
    label: "印刷管理",
    icon: <ShoppingBag className="h-4 w-4" />,
    adminOnly: true,
  },
  {
    href: "/admin/users",
    label: "認証ユーザー管理",
    icon: <ShoppingBag className="h-4 w-4" />,
    adminOnly: true,
  },
];

/** ヘッダーコンポーネント */
export const Header: FC = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const result = await checkIsAdmin(user?.id ?? null);
      setIsAdmin(result);
    };

    checkAdmin();
  }, [user?.id]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* 左側のナビゲーション */}
        <nav className="flex items-center gap-1 text-sm">
          {navLinks.map((link) => {
            // Admin権限チェック
            if (link.adminOnly && !isAdmin) {
              return null;
            }

            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 transition-all hover:bg-gray-100",
                  isActive
                    ? "bg-gray-100 text-primary font-medium"
                    : "text-muted-foreground"
                )}
              >
                {link.icon}
                <span className="hidden sm:inline-block">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 右側の認証ボタン */}
        <div className="flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                ログイン
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                  userButtonPopoverCard: "w-full max-w-[240px]",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};
