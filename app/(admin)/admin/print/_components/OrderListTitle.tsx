"use client";

import { type FC } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

type Props = {
  /** 選択された日付 */
  date: Date;
  /** 選択された学年 */
  grade?: number | null;
  /** 選択された商品カテゴリー */
  category?: string;
};

/** 注文一覧のタイトルコンポーネント */
export const OrderListTitle: FC<Props> = ({ date, grade, category }) => {
  return (
    <div className="space-y-1">
      <h1 className="text-xl font-bold">
        {format(date, "M月d日(E)", { locale: ja })}の注文一覧
        {category && ` - ${category}`}
      </h1>
      <p className="text-sm text-gray-500">詳細</p>
    </div>
  );
};
