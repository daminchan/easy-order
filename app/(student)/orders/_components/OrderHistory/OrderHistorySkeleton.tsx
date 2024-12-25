"use client";

import { type FC } from "react";

/** 注文履歴のスケルトンローディング */
export const OrderHistorySkeleton: FC = () => {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border p-4 space-y-4 animate-pulse"
        >
          {/* 注文日時と状態 */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-32 bg-gray-200 rounded" />
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded" />
          </div>

          {/* 商品リスト */}
          <div className="space-y-3">
            {[...Array(2)].map((_, itemIndex) => (
              <div
                key={itemIndex}
                className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
              >
                {/* 商品画像のスケルトン */}
                <div className="h-12 w-12 bg-gray-200 rounded-md flex-shrink-0" />

                {/* 商品情報 */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>

                {/* 価格 */}
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>

          {/* 合計金額 */}
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
