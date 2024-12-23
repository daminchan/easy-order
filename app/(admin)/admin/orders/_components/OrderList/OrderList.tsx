"use client";

import { type FC, useState, useMemo } from "react";
import { type AdminOrderGroup } from "@/lib/types/admin-order";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { DeleteOrderDialog } from "../DeleteOrderDialog";
import { BulkDeleteDialog } from "../BulkDeleteDialog";
import { FilterTabs } from "../FilterTabs";
import { deleteOrder } from "../../_actions/deleteOrder";
import { bulkDeleteOrders } from "../../_actions/bulkDeleteOrders";
import { resetReceiveStatus } from "../../_actions/resetReceiveStatus";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// アニメーション設定
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/** 1ページあたりの表示件数 */
const ITEMS_PER_PAGE = 3;

type Props = {
  /** 注文グループ一覧 */
  orderGroups: AdminOrderGroup[];
};

type Filter = {
  grade?: number;
  productName?: string;
};

/** 注文カードコンポーネント */
const OrderCard: FC<{
  order: AdminOrderGroup["orders"][number];
  onDelete: (orderId: string) => Promise<void>;
  onResetReceiveStatus: (orderId: string) => Promise<void>;
}> = ({ order, onDelete, onResetReceiveStatus }) => (
  <motion.div
    variants={item}
    whileHover={{ scale: 1.02 }}
    className="relative bg-white rounded-lg border shadow-sm p-4 transition-shadow hover:shadow-md"
  >
    {/* 受け取り状態 */}
    <div className="absolute top-4 right-4">
      <DeleteOrderDialog orderId={order.id} onDelete={onDelete} />
    </div>

    {/* 注文情報 */}
    <div className="space-y-4 pt-8">
      {/* 配達予定 */}
      <div className="bg-green-50 -mx-4 px-4 py-3 border-y">
        <div className="flex items-center gap-2 text-green-800">
          <Calendar className="h-5 w-5" />
          <p className="text-base font-medium">
            配達予定: {format(order.deliveryDate, "M/d(E)", { locale: ja })}
          </p>
        </div>
      </div>

      {/* 生徒情報 */}
      <div className="border rounded-lg p-3 space-y-2 bg-gray-50">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-base font-medium text-gray-900">
                {order.student.name}
              </div>
              <div className="text-sm text-gray-500">
                {order.student.className}組
              </div>
            </div>
            {order.isReceived ? (
              <div className="px-4 py-2 text-base font-medium bg-gray-100 text-gray-600 rounded-lg border-2 border-gray-200 min-w-[100px] text-center">
                受取済
              </div>
            ) : (
              <div className="px-4 py-2 text-base font-medium bg-green-100 text-green-700 rounded-lg border-2 border-green-200 min-w-[100px] text-center animate-pulse">
                未受取
              </div>
            )}
          </div>

          {/* 注文情報 */}
          <div className="flex items-baseline gap-2">
            <div className="text-base">
              <span className="font-medium">{order.quantity}</span>個
            </div>
            {order.otherOrders && (
              <div className="text-sm text-gray-500">
                他の注文: {order.otherOrders}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 受け取り状態リセットボタン */}
      {order.isReceived && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onResetReceiveStatus(order.id)}
            className="w-full border-gray-300 hover:bg-gray-50"
          >
            受け取り状態をリセット
          </Button>
        </div>
      )}
    </div>
  </motion.div>
);

/**
 * 注文一覧
 * @description 管理者向けの注文一覧を表示するコンポーネント
 */
export const OrderList: FC<Props> = ({ orderGroups = [] }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>({});
  /** 各グループのページ番号を管理 */
  const [pageNumbers, setPageNumbers] = useState<Record<string, number>>({});
  /** 現在選択中のカテゴリーインデックス */
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  /** 利用可能な学年一覧 */
  const grades = useMemo(() => {
    const gradeSet = new Set(orderGroups.map((group) => group.grade));
    return Array.from(gradeSet).sort((a, b) => a - b);
  }, [orderGroups]);

  /** 利用可能な商品名一覧 */
  const productNames = useMemo(() => {
    const productSet = new Set(orderGroups.map((group) => group.productName));
    return Array.from(productSet).sort();
  }, [orderGroups]);

  /** フィルター適用後の注文グループ */
  const filteredGroups = useMemo(() => {
    return orderGroups.filter((group) => {
      const gradeMatch =
        filter.grade === undefined || group.grade === filter.grade;
      const productMatch =
        filter.productName === undefined ||
        group.productName === filter.productName;
      return gradeMatch && productMatch;
    });
  }, [orderGroups, filter]);

  /** 注文を削除 */
  const handleDelete = async (orderId: string): Promise<void> => {
    try {
      const { error } = await deleteOrder(orderId);
      if (error) {
        toast({
          variant: "destructive",
          title: "削除エラー",
          description: error,
        });
        return;
      }
      toast({
        title: "削除完了",
        description: "注文を削除しました",
      });
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "削除エラー",
        description: "注文の削除に失敗しました",
      });
    }
  };

  /** 注文を一括削除 */
  const handleBulkDelete = async (
    type: "all" | "byDeliveryDate",
    deliveryDate?: Date
  ) => {
    const { error, count } = await bulkDeleteOrders({ type, deliveryDate });
    if (error) {
      toast({
        variant: "destructive",
        title: "一括削除エラー",
        description: error,
      });
      return;
    }
    toast({
      title: "一括削除完了",
      description: `${count}件の注文を削除しました`,
    });
    router.refresh();
  };

  /** 受け取り状態をリセット */
  const handleResetReceiveStatus = async (orderId: string) => {
    const { error } = await resetReceiveStatus(orderId);
    if (error) {
      toast({
        variant: "destructive",
        title: "リセットエラー",
        description: error,
      });
      return;
    }
    toast({
      title: "リセット完了",
      description: "受け取り状態をリセットしました",
    });
    router.refresh();
  };

  /** グループのページを変更 */
  const changePage = (groupKey: string, delta: number) => {
    setPageNumbers((prev) => {
      const currentPage = prev[groupKey] || 0;
      return {
        ...prev,
        [groupKey]: currentPage + delta,
      };
    });
  };

  if (orderGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">注文がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">注文一覧</h2>
              <BulkDeleteDialog onDelete={handleBulkDelete} />
            </div>
            <FilterTabs
              grades={grades}
              productNames={productNames}
              currentFilter={filter}
              onFilterChange={setFilter}
            />
          </div>
        </CardContent>
      </Card>

      {/* 注文一覧 */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6"
      >
        {filteredGroups.length === 0 ? (
          <motion.div variants={item} className="text-center py-12">
            <p className="text-gray-500">条件に一致する注文がありません</p>
          </motion.div>
        ) : (
          <>
            {/* スマホ版（カテゴリー選択 + ページネーション） */}
            <div className="md:hidden">
              <Card>
                <CardHeader className="border-b bg-muted/50">
                  <div className="space-y-4">
                    {/* カテゴリー選択セレクトボックス */}
                    <div className="flex items-center justify-between">
                      <Select
                        value={currentCategoryIndex.toString()}
                        onValueChange={(value) =>
                          setCurrentCategoryIndex(Number(value))
                        }
                      >
                        <SelectTrigger className="w-[260px]">
                          <SelectValue placeholder="カテゴリーを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredGroups.map((group, index) => (
                            <SelectItem
                              key={`${group.grade}-${group.productName}`}
                              value={index.toString()}
                            >
                              <span className="flex items-center gap-2">
                                {group.grade}年 - {group.productName}
                                <Badge
                                  variant="secondary"
                                  className="ml-2 bg-background"
                                >
                                  {group.orders.length}
                                </Badge>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Badge variant="secondary">
                        {filteredGroups[currentCategoryIndex].orders.length}件
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {(() => {
                      const group = filteredGroups[currentCategoryIndex];
                      const groupKey = `${group.grade}-${group.productName}`;
                      const currentPage = pageNumbers[groupKey] || 0;
                      const totalPages = Math.ceil(
                        group.orders.length / ITEMS_PER_PAGE
                      );
                      const startIndex = currentPage * ITEMS_PER_PAGE;
                      const endIndex = startIndex + ITEMS_PER_PAGE;
                      const currentOrders = group.orders.slice(
                        startIndex,
                        endIndex
                      );

                      return (
                        <>
                          <div className="space-y-4">
                            {currentOrders.map((order) => (
                              <OrderCard
                                key={order.id}
                                order={order}
                                onDelete={handleDelete}
                                onResetReceiveStatus={handleResetReceiveStatus}
                              />
                            ))}
                          </div>

                          {/* ページネーション */}
                          {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 pt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changePage(groupKey, -1)}
                                disabled={currentPage === 0}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <span className="text-sm text-gray-600">
                                {currentPage + 1} / {totalPages}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changePage(groupKey, 1)}
                                disabled={currentPage === totalPages - 1}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* PC版（グリッドレイアウト） */}
            <div className="hidden md:grid md:gap-6">
              {filteredGroups.map((group) => {
                const groupKey = `${group.grade}-${group.productName}`;
                const currentPage = pageNumbers[groupKey] || 0;
                const totalPages = Math.ceil(
                  group.orders.length / ITEMS_PER_PAGE
                );
                const startIndex = currentPage * ITEMS_PER_PAGE;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const currentOrders = group.orders.slice(startIndex, endIndex);

                return (
                  <motion.div key={groupKey} variants={item}>
                    <Card>
                      <CardHeader className="border-b bg-muted/50">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {group.grade}年 - {group.productName}
                          </h3>
                          <Badge variant="secondary">
                            {group.orders.length}件
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            {currentOrders.map((order) => (
                              <OrderCard
                                key={order.id}
                                order={order}
                                onDelete={handleDelete}
                                onResetReceiveStatus={handleResetReceiveStatus}
                              />
                            ))}
                          </div>

                          {/* ページネーション */}
                          {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 pt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changePage(groupKey, -1)}
                                disabled={currentPage === 0}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <span className="text-sm text-gray-600">
                                {currentPage + 1} / {totalPages}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changePage(groupKey, 1)}
                                disabled={currentPage === totalPages - 1}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
