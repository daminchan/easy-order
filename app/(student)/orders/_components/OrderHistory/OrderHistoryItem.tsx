"use client";
import { type FC } from "react";
import { type OrderHistoryItem as OrderHistoryItemType } from "@/lib/types/order";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { OrderStatus } from "./OrderStatus";
import { OrderReceiveDialog } from "../OrderReceive";
import { Button } from "@/components/ui/button";
import Image from "next/image";

/** 注文履歴アイテムコンポーネントのProps */
type OrderHistoryItemProps = {
  /** 注文履歴アイテム */
  order: OrderHistoryItemType;
  /** キャンセル期限切れかどうか */
  deadlinePassed: boolean;
  /** キャンセル処理 */
  onCancel: (orderId: string) => Promise<void>;
  /** 受け取り処理 */
  onReceive: (orderId: string) => Promise<void>;
};

/** 注文履歴アイテムコンポーネント */
export const OrderHistoryItem: FC<OrderHistoryItemProps> = ({
  order,
  deadlinePassed,
  onCancel,
  onReceive,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "rounded-lg border p-4 space-y-4",
        order.status === "cancelled"
          ? "bg-red-50 border-red-100"
          : order.isReceived
          ? "bg-gray-50 border-gray-100"
          : "bg-green-50 border-green-100"
      )}
    >
      {/* 注文情報ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {format(order.orderDate, "yyyy/MM/dd HH:mm", { locale: ja })}
            </span>
            <OrderStatus status={order.status} isReceived={order.isReceived} />
          </div>
          <p className="font-medium text-gray-900">
            {format(order.deliveryDate, "M月d日(E)", { locale: ja })}の注文
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">合計金額</p>
          <p className="text-lg font-bold text-gray-900">
            {order.totalAmount.toLocaleString()}円
          </p>
        </div>
      </div>

      {/* 注文内容 */}
      <div className="space-y-2">
        {order.details.map((detail) => (
          <div
            key={detail.id}
            className={cn(
              "flex items-center gap-3 rounded-md p-3 bg-white border",
              order.status === "cancelled"
                ? "border-red-100"
                : order.isReceived
                ? "border-gray-100"
                : "border-green-100"
            )}
          >
            {detail.imageUrl && (
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={detail.imageUrl}
                  alt={detail.productName}
                  fill
                  className="object-cover"
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

      {/* アクション */}
      {order.status === "active" && !order.isReceived && (
        <div className="flex justify-end gap-2 pt-2">
          {!deadlinePassed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCancel(order.id)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              キャンセル
            </Button>
          )}
          <OrderReceiveDialog order={order} onReceive={onReceive}>
            <Button
              variant="outline"
              size="sm"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              受け取り確認
            </Button>
          </OrderReceiveDialog>
        </div>
      )}
    </motion.div>
  );
};
