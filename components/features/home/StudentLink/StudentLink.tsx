/**
 * @description 生徒用のリンクボタンコンポーネント
 * @note
 * - FCを明示的にimportして使用
 * - イベントハンドラは直接記述
 * - propsで受け取れるスタイルはclassNameで指定
 */
import { type FC } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const StudentLink: FC = () => {
  return (
    <Button
      asChild
      size="lg"
      className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-lg transition-transform hover:scale-105"
    >
      <Link href="/orders">生徒の方はこちら</Link>
    </Button>
  );
};
