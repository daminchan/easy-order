/**
 * @description サインインページ
 * @note
 * - FCを明示的にimportして使用
 * - レスポンシブ対応
 * - 中央寄せレイアウト
 */
import { type FC } from "react";
import { SignIn } from "@clerk/nextjs";

const SignInPage: FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-4 sm:p-0">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white shadow-xl rounded-lg",
              footerAction: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignInPage;
