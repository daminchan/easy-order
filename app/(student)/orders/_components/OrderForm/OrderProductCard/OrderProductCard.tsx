"use client";

import { type FC } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Info } from "lucide-react";
import { type Product } from "@/lib/types/product";

/** 商品カードのProps */
type Props = {
  /** 商品情報 */
  product: Product;
  /** 注文数量 */
  quantity: number;
  /** 数量変更時のハンドラ */
  onQuantityChange: (quantity: number) => void;
  /** お気に入り状態 */
  isFavorite: boolean;
  /** お気に入り切り替え時のハンドラ */
  onToggleFavorite: () => void;
  /** モバイル表示かどうか */
  isMobile?: boolean;
};

/** 商品カード */
export const OrderProductCard: FC<Props> = ({
  product,
  quantity,
  onQuantityChange,
  isFavorite,
  onToggleFavorite,
  isMobile = false,
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.3,
    }}
    className={`relative flex-shrink-0 w-[280px] rounded-lg border bg-white shadow-sm ${
      isMobile ? "md:hidden" : "hidden md:block"
    } ${!product.available && "opacity-50"}`}
  >
    {/* 商品画像 */}
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gray-100">
          <span className="text-gray-400">No image</span>
        </div>
      )}
      {/* お気に入りボタン */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm"
      >
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2, 1],
            color: isFavorite ? "rgb(239, 68, 68)" : "rgb(107, 114, 128)",
          }}
          initial={false}
          transition={{
            scale: {
              times: [0, 0.3, 0.6, 1],
              duration: 0.6,
            },
            color: {
              duration: 0.2,
            },
          }}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        </motion.div>
      </button>
    </div>

    {/* 商品情報 */}
    <div className="p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
        </div>
        <p className="mt-1 text-lg font-bold text-gray-900">
          {product.price.toLocaleString()}円
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2 text-gray-600 hover:text-gray-900"
        >
          <Info className="h-4 w-4 mr-2" />
          メニュー詳細
        </Button>
      </div>

      {/* 数量入力 */}
      {product.available && (
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => onQuantityChange(quantity - 1)}
              className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => onQuantityChange(Number(e.target.value))}
              min="0"
              className="block w-16 rounded-md border-gray-200 text-center shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              className="rounded-md bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  </motion.div>
);
