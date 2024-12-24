"use client";

import { type FC } from "react";
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

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type Props = {
  /** 開閉状態 */
  open: boolean;
  /** ダイアログを閉じる時のコールバック */
  onClose: () => void;
  /** 注文を確定する時のコールバック */
  onConfirm: () => void;
  /** 配達予定日 */
  deliveryDate: Date;
  /** 注文する商品情報 */
  items: OrderItem[];
};

/** 注文確認ダイアログ */
export const OrderConfirmDialog: FC<Props> = ({
  open,
  onClose,
  onConfirm,
  deliveryDate,
  items,
}) => {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>注文内容の確認</DialogTitle>
          <p className="text-sm font-medium text-red-500 mt-2">
            ※ 内容をご確認の上、注文を確定してください
          </p>
        </DialogHeader>

        {/* 配達日 */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
          <p className="text-sm text-green-600 font-medium">配達予定日</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {format(deliveryDate, "M月d日(E)", { locale: ja })}
          </p>
        </div>

        {/* 注文内容の確認 */}
        <ScrollArea className="max-h-[300px] pr-4">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{item.price.toLocaleString()}円</span>
                    <span>×</span>
                    <span>{item.quantity}個</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {(item.price * item.quantity).toLocaleString()}円
                  </p>
                </div>
              </div>
            ))}

            {/* 合計金額 */}
            <div className="flex justify-between items-baseline border-t pt-4">
              <span className="text-base font-medium">合計</span>
              <span className="text-xl font-bold text-gray-900">
                {totalAmount.toLocaleString()}円
              </span>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={onConfirm}
          >
            注文を確定する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
