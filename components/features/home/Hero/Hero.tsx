/**
 * @description ホームページのメインビジュアルを表示するコンポーネント
 * @note
 * - FCを明示的にimportして使用
 * - 単一責任の原則に従い、視覚的な表示のみを担当
 * - スタイルは必要最小限のものをコンポーネントに直接定義
 */
import { type FC } from "react";
import { StudentLink } from "../StudentLink";

export const Hero: FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          EazyOrder
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto">
          簡単に注文、スムーズに受け取り
        </p>
        <StudentLink />
      </div>
    </div>
  );
};
