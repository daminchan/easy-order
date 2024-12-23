"use client";
import { type FC, type ReactNode, useState } from "react";
import { type OrderHistoryItem } from "@/lib/types/order";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

type OrderReceiveDialogProps = {
  /** 注文情報 */
  order: OrderHistoryItem;
  /** 受け取り処理 */
  onReceive: (orderId: string) => Promise<void>;
  /** トリガーとなる要素 */
  children: ReactNode;
};

/** 注文受け取り確認ダイアログ */
export const OrderReceiveDialog: FC<OrderReceiveDialogProps> = ({
  order,
  onReceive,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>注文の受け取り確認</DialogTitle>
          <p className="text-sm font-medium text-red-500 mt-2">
            ※ 商品を受け取ってから押してください
          </p>
        </DialogHeader>

        {/* 受け取り日 */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
          <p className="text-sm text-green-600 font-medium">受け取り日</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {format(order.deliveryDate, "M月d日(E)", { locale: ja })}
          </p>
        </div>

        {/* 注文内容の確認 */}
        <ScrollArea className="max-h-[300px] pr-4">
          <div className="space-y-4">
            {/* 注文日時 */}
            <div className="text-sm text-gray-500">
              注文日時: {format(order.orderDate, "M/d HH:mm", { locale: ja })}
            </div>

            {/* 商品リスト */}
            <div className="space-y-3">
              {order.details.map((detail) => (
                <div
                  key={detail.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"
                >
                  {detail.imageUrl && (
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={detail.imageUrl}
                        alt={detail.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {detail.productName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{detail.price.toLocaleString()}円</span>
                      <span>×</span>
                      <span>{detail.quantity}個</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {(detail.price * detail.quantity).toLocaleString()}円
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 合計金額 */}
            <div className="flex justify-between items-baseline border-t pt-4">
              <span className="text-base font-medium">合計</span>
              <span className="text-xl font-bold text-gray-900">
                {order.totalAmount.toLocaleString()}円
              </span>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleClose}>
            閉じる
          </Button>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            onClick={async () => {
              await onReceive(order.id);
              handleClose();
            }}
          >
            受け取りを確認
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
