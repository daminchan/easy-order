"use client";

import { type FC, useState, useMemo } from "react";
import { type AdminOrderGroup } from "@/lib/types/admin-order";
import { OrderList } from "./_components/OrderList";
import { Package, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  /** 注文グループリスト */
  orders: AdminOrderGroup[];
  /** 配達日ごとの注文集計 */
  dailySummary: {
    date: Date;
    productSummary: {
      productName: string;
      totalQuantity: number;
    }[];
  }[];
};

/** 管理者用の注文一覧ページの実装 */
export const OrdersPage: FC<Props> = ({ orders, dailySummary }) => {
  // 利用可能な配達日の取得
  const availableDates = useMemo(() => {
    const dates = [
      ...new Set(orders.map((order) => order.deliveryDate.toISOString())),
    ];
    return dates.map((date) => new Date(date));
  }, [orders]);

  // デフォルトで最も近い日付を選択
  const [selectedDate, setSelectedDate] = useState<string>(
    availableDates.length > 0 ? availableDates[0].toISOString() : ""
  );

  // 選択された日付の注文のみをフィルター
  const filteredOrders = useMemo(() => {
    if (!selectedDate) return orders;
    return orders.filter(
      (order) => order.deliveryDate.toISOString() === selectedDate
    );
  }, [orders, selectedDate]);

  // 選択された日付の注文集計
  const currentDaySummary = useMemo(() => {
    if (!selectedDate) return null;
    return dailySummary.find(
      (summary) => summary.date.toISOString() === selectedDate
    );
  }, [dailySummary, selectedDate]);

  // ページネーション用の状態
  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(0);

  // 現在のページの商品集計
  const currentPageSummary = useMemo(() => {
    if (!currentDaySummary) return [];
    const start = currentPage * ITEMS_PER_PAGE;
    return currentDaySummary.productSummary.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [currentDaySummary, currentPage]);

  // 総ページ数
  const totalPages = useMemo(() => {
    if (!currentDaySummary) return 0;
    return Math.ceil(currentDaySummary.productSummary.length / ITEMS_PER_PAGE);
  }, [currentDaySummary]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">注文一覧</h1>
        </div>
        <p className="text-muted-foreground">
          学年・商品別の注文一覧です。受け取り状態の管理ができます。
        </p>
      </div>

      {/* 配達日選択と注文集計 */}
      <div className="mb-8 space-y-6">
        <div className="w-72">
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <SelectValue placeholder="配達日を選択">
                  {selectedDate &&
                    format(new Date(selectedDate), "M月d日(E)", { locale: ja })}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {availableDates.map((date) => (
                <SelectItem key={date.toISOString()} value={date.toISOString()}>
                  {format(date, "M月d日(E)", { locale: ja })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 注文集計（ページネーション形式） */}
        {currentDaySummary && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium text-gray-900">商品別注文数</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {currentPage + 1} / {totalPages} ページ
              </div>
            </div>
            <div className="p-4">
              <div className="grid gap-4">
                {currentPageSummary.map((summary) => (
                  <div
                    key={summary.productName}
                    className="flex items-center justify-between rounded-lg border bg-gray-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-base font-medium text-gray-900">
                        {summary.productName}
                      </span>
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {summary.totalQuantity}個
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                  >
                    前へ
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={currentPage === totalPages - 1}
                  >
                    次へ
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-12">
          <div className="text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              注文がありません
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              選択された日付の注文はありません
            </p>
          </div>
        </div>
      ) : (
        <OrderList orderGroups={filteredOrders} />
      )}
    </div>
  );
};
