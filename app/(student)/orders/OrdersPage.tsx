"use client";
import { type FC, useState, useEffect } from "react";
import { OrderForm } from "./_components/OrderForm";
import { OrderHistory } from "./_components/OrderHistory";
import { OrderHistorySkeleton } from "./_components/OrderHistory/OrderHistorySkeleton";
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

/** 生徒の注文ページの実装 */
export const OrdersPage: FC<Props> = ({ products, student, orders }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [showOrderForm, setShowOrderForm] = useState(true);
  const [isOrderLoading, setIsOrderLoading] = useState(false);

  // ordersが更新されたらローディングを解除
  useEffect(() => {
    setIsOrderLoading(false);
  }, [orders]);

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
    try {
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "キャンセルエラー",
        description: "予期せぬエラーが発生しました",
      });
    }
  };

  /** 注文を受け取り済みにする */
  const handleReceive = async (orderId: string) => {
    try {
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
        description: "受け取り確認が完了しました",
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "受け取り確認エラー",
        description: "予期せぬエラーが発生しました",
      });
    }
  };

  return (
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
                  setIsOrderLoading(true);
                  router.refresh();
                  // 注文完了後に注文履歴を表示
                  setShowOrderForm(false);
                }}
              />
            ) : isOrderLoading ? (
              <OrderHistorySkeleton />
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
  );
};
