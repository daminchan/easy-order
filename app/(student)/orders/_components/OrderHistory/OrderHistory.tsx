"use client";
import { type FC } from "react";
import { type OrderHistoryItem as OrderHistoryItemType } from "@/lib/types/order";
import { AnimatePresence } from "framer-motion";
import { OrderHistoryItem } from "./OrderHistoryItem";
import { useOrderSort } from "./hooks/useOrderSort";
import { addDays, setHours, setMinutes, isBefore } from "date-fns";
import { ORDER_CONSTANTS } from "@/lib/constants/order";

/** 注文履歴コンポーネントのProps */
type OrderHistoryProps = {
  /** 注文履歴リスト */
  orders: OrderHistoryItemType[];
  /** キャンセル処理 */
  onCancel: (orderId: string) => Promise<void>;
  /** 受け取り処理 */
  onReceive: (orderId: string) => Promise<void>;
};

/** キャンセル期限が切れているかチェック */
const isDeadlinePassed = (deliveryDate: Date): boolean => {
  const now = new Date();
  const deadline = setMinutes(
    setHours(
      addDays(deliveryDate, -ORDER_CONSTANTS.CANCEL_DEADLINE_DAYS),
      ORDER_CONSTANTS.CANCEL_DEADLINE_HOUR
    ),
    ORDER_CONSTANTS.CANCEL_DEADLINE_MINUTE
  );
  return isBefore(deadline, now);
};

/** 注文履歴コンポーネント */
export const OrderHistory: FC<OrderHistoryProps> = ({
  orders,
  onCancel,
  onReceive,
}) => {
  const sortedOrders = useOrderSort(orders);

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            注文履歴がありません
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            新しい注文を作成してください
          </p>
        </div>
      ) : (
        <AnimatePresence>
          {sortedOrders.map((order) => (
            <OrderHistoryItem
              key={order.id}
              order={order}
              deadlinePassed={isDeadlinePassed(order.deliveryDate)}
              onCancel={onCancel}
              onReceive={onReceive}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};
