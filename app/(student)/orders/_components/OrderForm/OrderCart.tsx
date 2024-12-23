"use client";
import { type FC } from "react";
import { type Product } from "@/lib/types/product";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  /** 選択された日付 */
  selectedDate: Date;
  /** 商品リスト */
  products: Product[];
  /** 商品ごとの注文数 */
  quantities: Record<string, number>;
  /** モーダルを閉じる */
  onClose: () => void;
  /** 注文を確定する */
  onConfirm: () => void;
};

/** カートの内容を表示するコンポーネント */
export const OrderCart: FC<Props> = ({
  selectedDate,
  products,
  quantities,
  onClose,
  onConfirm,
}) => {
  /** 合計金額の計算 */
  const total = Object.entries(quantities).reduce(
    (acc, [productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      return acc + (product?.price ?? 0) * quantity;
    },
    0
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>カートの内容</DialogTitle>
        </DialogHeader>

        <div className="mt-2 bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="h-5 w-5 text-green-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium text-green-800">受け取り日</span>
          </div>
          <div className="text-2xl font-bold text-green-900 text-center">
            {format(selectedDate, "M月d日(E)", { locale: ja })}
          </div>
        </div>

        <ScrollArea className="h-[240px] pr-4 mt-4">
          <div className="space-y-4">
            {Object.entries(quantities).map(([productId, quantity]) => {
              const product = products.find((p) => p.id === productId);
              if (!product) return null;

              return (
                <div
                  key={productId}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.price.toLocaleString()}円 × {quantity}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900 pl-4">
                    {(product.price * quantity).toLocaleString()}円
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between font-medium">
            <p className="text-base">合計</p>
            <p className="text-lg">{total.toLocaleString()}円</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            戻る
          </Button>
          <Button onClick={onConfirm}>注文を確定する</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
