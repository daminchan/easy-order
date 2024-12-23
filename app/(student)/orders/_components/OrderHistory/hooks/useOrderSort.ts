"use client";
import { type OrderHistoryItem as OrderHistoryItemType } from "@/lib/types/order";
import { ORDER_CONSTANTS } from "@/lib/constants/order";

/** 注文履歴の並び替えフック */
export const useOrderSort = (orders: OrderHistoryItemType[]) => {
  // アクティブな注文を優先的に表示し、最新3件のみ表示
  const sortedOrders = [...orders].sort((a, b) => {
    // 最新のアクティブな注文1つを見つける
    const latestActive = orders
      .filter((order) => order.status === "active")
      .sort((x, y) => y.orderDate.getTime() - x.orderDate.getTime())[0];

    // 最新のアクティブな注文は一番上に
    if (latestActive) {
      if (a.id === latestActive.id) return -1;
      if (b.id === latestActive.id) return 1;
    }

    // それ以外は新しい順
    return b.orderDate.getTime() - a.orderDate.getTime();
  });

  return sortedOrders.slice(0, ORDER_CONSTANTS.MAX_HISTORY_ITEMS);
};
