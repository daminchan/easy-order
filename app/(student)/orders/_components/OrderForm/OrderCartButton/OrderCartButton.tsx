"use client";

import { type FC } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { type Product } from "@/lib/types/product";

/** カートボタンのProps */
type Props = {
  /** 商品ごとの注文数量 */
  quantities: Record<Product["id"], number>;
  /** 商品リスト */
  products: Product[];
  /** 注文作成時のハンドラ */
  onCreateOrder: () => Promise<void>;
  /** 配達日が選択されているかどうか */
  isDeliveryDateSelected: boolean;
  /** 注文作成中かどうか */
  isCreatingOrder: boolean;
};

/** カートボタン */
export const OrderCartButton: FC<Props> = ({
  quantities,
  products,
  onCreateOrder,
  isDeliveryDateSelected,
  isCreatingOrder,
}) => {
  /** 合計金額 */
  const totalAmount = Object.entries(quantities).reduce(
    (total, [productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      return total + (product?.price ?? 0) * quantity;
    },
    0
  );

  /** 注文可能かどうか */
  const canOrder =
    isDeliveryDateSelected &&
    !isCreatingOrder &&
    Object.values(quantities).some((quantity) => quantity > 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:sticky md:mt-4 md:rounded-lg md:border md:shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-500">合計金額</p>
          <p className="text-xl font-bold text-gray-900">
            {totalAmount.toLocaleString()}円
          </p>
        </div>
        <Button
          onClick={onCreateOrder}
          disabled={totalAmount === 0 || isCreatingOrder}
          className="bg-green-600 hover:bg-green-700 max-w-[200px]"
        >
          {isCreatingOrder ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>注文中...</span>
            </div>
          ) : (
            "注文する"
          )}
        </Button>
      </div>
    </div>
  );
};
