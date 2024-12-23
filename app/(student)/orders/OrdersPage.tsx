"use client";
import { type FC, useState } from "react";
import { OrderForm } from "./_components/OrderForm";
import { OrderHistory } from "./_components/OrderHistory";

import { type Product } from "@/lib/types/product";
import { type Student } from "@/lib/types/student";
import { type Order, type OrderHistoryItem } from "@/lib/types/order";
import { createOrder } from "./_actions/createOrder";
import { cancelOrder } from "./_actions/cancelOrder";
import { receiveOrder } from "./_actions/receiveOrder";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Package, History } from "lucide-react";

type Props = {
  /** 商品一覧 */
  products: Product[];
  /** 生徒情報 */
  student: Student;
  /** 注文履歴 */
  orders: Order[];
};

/**
 * 生徒の注文ページの実装
 * @description 注文フォームと注文履歴を表示し、注文の作成とキャンセルを管理するコンポーネント
 * @param props.products - 商品一覧
 * @param props.student - 生徒情報
 * @param props.orders - 注文履歴データ
 */
export const OrdersPage: FC<Props> = ({ products, student, orders }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [showOrderForm, setShowOrderForm] = useState(true);

  /** 注文履歴の表示用データに変換 */
  const orderHistoryItems: OrderHistoryItem[] = orders.map((order) => ({
    id: order.id,
    orderDate: order.createdAt,
    deliveryDate: order.deliveryDate,
    status: order.status as "active" | "cancelled",
    isReceived: order.isReceived,
    details: order.items.map((item) => ({
      id: item.product.id,
      productName: item.product.name,
      imageUrl: item.product.imageUrl,
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount: order.totalAmount,
  }));

  /** 注文をキャンセルする */
  const handleCancel = async (orderId: string) => {
    const { error } = await cancelOrder(orderId, student.id);
    if (error) {
      toast({
        variant: "destructive",
        title: "キャンセルエラー",
        description: error,
      });
      return;
    }
    toast({
      title: "キャンセル完了",
      description: "注文をキャンセルしました",
    });
    router.refresh();
  };

  /** 注文を受け取る */
  const handleReceive = async (orderId: string) => {
    const { error } = await receiveOrder(orderId);
    if (error) {
      toast({
        variant: "destructive",
        title: "受け取り確認エラー",
        description: error,
      });
      return;
    }
    toast({
      title: "受け取り確認完了",
      description: "注文の受け取りを確認しました",
    });
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">注文</h1>
          {/* 生徒情報 */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {student.grade}年{student.className}組
            </span>
            <span className="text-sm font-medium text-gray-900">
              {student.name}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* アクションボタン（トグル） */}
          <div className="flex items-center gap-2">
            <Button
              variant={showOrderForm ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOrderForm(true)}
              className="gap-2"
            >
              <Package className="h-4 w-4" />
              商品を注文
            </Button>
            <Button
              variant={!showOrderForm ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOrderForm(false)}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              注文履歴
            </Button>
          </div>

          {/* コンテンツカード */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-green-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                {showOrderForm ? "商品を注文する" : "注文履歴"}
              </h2>
              {showOrderForm && (
                <p className="text-green-100 text-sm mt-1">
                  注文締切：提供日の2日前 15:00まで
                </p>
              )}
            </div>
            <div className="p-6">
              {showOrderForm ? (
                <OrderForm
                  products={products}
                  studentId={student.id}
                  onSubmit={async (input) => {
                    const { error } = await createOrder(student.id, input);
                    if (error) {
                      toast({
                        variant: "destructive",
                        title: "注文エラー",
                        description: error,
                      });
                      return;
                    }
                    toast({
                      title: "注文完了",
                      description: "注文が完了しました",
                    });
                    router.refresh();
                    // 注文完了後に注文履歴を表示
                    setShowOrderForm(false);
                  }}
                />
              ) : (
                <OrderHistory
                  orders={orderHistoryItems}
                  onCancel={handleCancel}
                  onReceive={handleReceive}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
