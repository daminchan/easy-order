"use server";

import { db } from "@/lib/db";

// コンポーネントで使用する型定義
export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  available: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type GetProductsResponse = {
  products?: Product[];
  error?: string;
};

/** 商品データを取得する */
export const getProducts = async (): Promise<GetProductsResponse> => {
  try {
    console.log("=== 商品データ検索開始 ===");

    const prismaProducts = await db.product.findMany({
      where: { available: true },
      orderBy: { displayOrder: "asc" },
    });

    // nullをundefinedに変換
    const products: Product[] = prismaProducts.map((p) => ({
      ...p,
      description: p.description ?? undefined,
      imageUrl: p.imageUrl ?? undefined,
    }));

    console.log("商品データ取得結果:", {
      count: products.length,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        available: p.available,
        displayOrder: p.displayOrder,
      })),
    });

    return { products };
  } catch (error) {
    console.error("商品データ取得エラー:", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return { error: "商品の取得に失敗しました" };
  }
};
