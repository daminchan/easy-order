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

    return { products };
  } catch {
    return { error: "商品の取得に失敗しました" };
  }
};
