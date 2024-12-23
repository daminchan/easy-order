"use client";

import { type FC, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Product } from "@/lib/types/product";
import { OrderProductCard } from "../OrderProductCard";

/** 商品リストのProps */
type Props = {
  /** 商品リスト */
  products: Product[];
  /** 商品ごとの注文数量 */
  quantities: Record<Product["id"], number>;
  /** 数量変更時のハンドラ */
  onQuantityChange: (productId: Product["id"], quantity: number) => void;
  /** お気に入り商品のIDリスト */
  favoriteProductIds: Product["id"][];
  /** お気に入り切り替え時のハンドラ */
  onToggleFavorite: (productId: Product["id"]) => void;
  /** 現在のページ番号 */
  currentPage: number;
  /** ページ変更時のハンドラ */
  onPageChange: (page: number) => void;
  /** 総ページ数 */
  totalPages: number;
  /** スクロール位置 */
  scrollPosition: number;
  /** スクロール位置変更時のハンドラ */
  onScroll: (position: number) => void;
  /** 全商品リスト（ソート済み） */
  allProducts: Product[];
};

/** 商品リスト */
export const OrderProductList: FC<Props> = ({
  products,
  quantities,
  onQuantityChange,
  favoriteProductIds,
  onToggleFavorite,
  currentPage,
  onPageChange,
  totalPages,
  scrollPosition,
  onScroll,
  allProducts,
}) => {
  /** スクロールコンテナのref */
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /** スクロールボタンのクリックハンドラ */
  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 280; // カードの幅
    const newPosition =
      direction === "left"
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
    onScroll(newPosition);
  };

  /** 右スクロールボタンの無効化条件 */
  const isRightScrollDisabled = () => {
    if (typeof window === "undefined") return false;
    return (
      scrollPosition >= (allProducts.length - 1) * 280 - window.innerWidth + 280
    );
  };

  return (
    <div className="relative">
      {/* モバイル表示（横スクロール） */}
      <div className="relative md:hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
        >
          {allProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0">
              <OrderProductCard
                product={product}
                quantity={quantities[product.id] ?? 0}
                onQuantityChange={(quantity) =>
                  onQuantityChange(product.id, quantity)
                }
                isFavorite={favoriteProductIds.includes(product.id)}
                onToggleFavorite={() => onToggleFavorite(product.id)}
                isMobile
              />
            </div>
          ))}
        </div>

        {/* スクロールボタン */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button
            onClick={() => handleScroll("left")}
            className="p-2 rounded-full bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={() => handleScroll("right")}
            className="p-2 rounded-full bg-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isRightScrollDisabled()}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* PC表示（ページネーション） */}
      <div className="hidden md:block">
        <div className="flex flex-wrap gap-4 justify-center">
          {products.map((product) => (
            <div key={product.id} className="w-[280px]">
              <OrderProductCard
                product={product}
                quantity={quantities[product.id] ?? 0}
                onQuantityChange={(quantity) =>
                  onQuantityChange(product.id, quantity)
                }
                isFavorite={favoriteProductIds.includes(product.id)}
                onToggleFavorite={() => onToggleFavorite(product.id)}
              />
            </div>
          ))}
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md bg-white border shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-md border shadow-sm ${
                      currentPage === page
                        ? "bg-green-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-white border shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
