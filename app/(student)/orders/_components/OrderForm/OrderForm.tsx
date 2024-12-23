"use client";

import { type FC, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type Product } from "@/lib/types/product";
import { type Order, type OrderFormInput } from "@/lib/types/order";
import { OrderCart } from "./OrderCart";
import { useToast } from "@/hooks/use-toast";
import { getAvailableDeliveryDates } from "@/lib/utils/delivery-date";
import { checkExistingOrder } from "../../_actions/checkExistingOrder";
import { SortDialog } from "../SortDialog";
import { toggleFavorite } from "../../_actions/toggleFavorite";
import { getFavorites } from "../../_actions/getFavorites";
import { OrderDeliverySection } from "./OrderDeliverySection";
import { OrderProductList } from "./OrderProductList";
import { OrderCartButton } from "./OrderCartButton";

/** 注文フォームProps */
type Props = {
  /** 利用可能な商品リスト */
  products: Product[];
  /** 注文処理 */
  onSubmit: (input: OrderFormInput) => Promise<void>;
  /** 生徒ID */
  studentId: string;
};

/** 1ページあたりの商品数（PC表示時） */
const ITEMS_PER_PAGE = 3;

/** 注文フォームコンポーネント */
export const OrderForm: FC<Props> = ({ products, onSubmit, studentId }) => {
  const { toast } = useToast();
  const router = useRouter();
  /** 商品ごとの注文数 */
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  /** 選択された配達日 */
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date | null>(
    null
  );
  /** 既存の注文情報 */
  const [existingOrder, setExistingOrder] = useState<Order | null>(null);
  /** 現在のページ番号（PC表示時） */
  const [currentPage, setCurrentPage] = useState(1);
  /** スクロール位置 */
  const [scrollPosition, setScrollPosition] = useState(0);
  /** ソート条件 */
  const [selectedSort, setSelectedSort] = useState<
    "date" | "price" | "name" | "favorite"
  >("date");
  /** お気に入り商品のIDリスト */
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  /** 注文作成中かどうか */
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  /** 配達可能日の取得 */
  const availableDeliveryDates = getAvailableDeliveryDates();

  /** 総ページ数 */
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  /** ソート条件に基づいて商品をソート */
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (selectedSort) {
        case "favorite":
          // お気に入りを優先表示
          const aIsFavorite = favoriteProductIds.includes(a.id);
          const bIsFavorite = favoriteProductIds.includes(b.id);
          if (aIsFavorite === bIsFavorite) {
            return a.name.localeCompare(b.name); // 同じ場合は名前順
          }
          return aIsFavorite ? -1 : 1;
        case "price":
          return a.price - b.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
        default:
          return 0; // 日付順はデフォルトの順序を使用
      }
    });
  }, [products, selectedSort, favoriteProductIds]);

  /** 現在のページの商品 */
  const currentProducts = useMemo(() => {
    // スマホ表示時は全商品を表示
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return sortedProducts;
    }
    // PC表示時は3つずつ表示
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, sortedProducts]);

  /** 配達日選択時の処理 */
  const handleDeliveryDateChange = async (date: Date | null) => {
    setSelectedDeliveryDate(date);
    setExistingOrder(null);

    if (date) {
      const { exists, order } = await checkExistingOrder(studentId, date);
      if (exists && order) {
        setExistingOrder(order);
      }
    }
  };

  /** 商品の注文数を更新 */
  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities((prev) => {
      if (quantity <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: quantity };
    });
  };

  /** 注文確定 */
  const handleCreateOrder = async () => {
    if (!selectedDeliveryDate) {
      toast({
        variant: "destructive",
        title: "配達日が選択されていません",
        description: "配達日を選択してください",
      });
      return;
    }

    const items = Object.entries(quantities).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
    if (items.length === 0) return;

    setIsCreatingOrder(true);
    try {
      await onSubmit({ deliveryDate: selectedDeliveryDate, items });
      toast({
        title: "注文が完了しました",
        description: "注文履歴から状況を確認できます",
        variant: "default",
      });
      setQuantities({});
      setSelectedDeliveryDate(null);
      setExistingOrder(null);
    } catch (error) {
      toast({
        title: "注文に失敗し��した",
        description: "もう一度お試しください",
        variant: "destructive",
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  /** お気に入り商品の取得 */
  useEffect(() => {
    const loadFavorites = async () => {
      const { productIds, error } = await getFavorites(studentId);
      if (!error && productIds) {
        setFavoriteProductIds(productIds);
      }
    };
    loadFavorites();
  }, [studentId]);

  /** お気に入りの切り替え */
  const handleToggleFavorite = async (productId: string) => {
    // Optimistic update
    setFavoriteProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    const { error } = await toggleFavorite(studentId, productId);
    if (error) {
      // エラーの場合は元の状態に戻す
      setFavoriteProductIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
      toast({
        variant: "destructive",
        title: "エラー",
        description: error,
      });
    }
  };

  /** 既存の注文を表示 */
  const handleViewExistingOrder = (orderId: Order["id"]) => {
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="space-y-8">
      {/* ソートボタン */}
      <div className="flex justify-end">
        <SortDialog
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />
      </div>

      {/* 配達日選択 */}
      <OrderDeliverySection
        selectedDate={selectedDeliveryDate}
        onDateChange={handleDeliveryDateChange}
        existingOrder={existingOrder}
        availableDeliveryDates={availableDeliveryDates}
        onViewExistingOrder={handleViewExistingOrder}
      />

      {/* 商品選択（既存の注文がある場合は無効化） */}
      {!existingOrder && (
        <>
          <OrderProductList
            products={currentProducts}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
            favoriteProductIds={favoriteProductIds}
            onToggleFavorite={handleToggleFavorite}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            totalPages={totalPages}
            scrollPosition={scrollPosition}
            onScroll={setScrollPosition}
            allProducts={sortedProducts}
          />

          <OrderCartButton
            quantities={quantities}
            products={products}
            onCreateOrder={handleCreateOrder}
            isDeliveryDateSelected={!!selectedDeliveryDate}
            isCreatingOrder={isCreatingOrder}
          />
        </>
      )}
    </div>
  );
};
