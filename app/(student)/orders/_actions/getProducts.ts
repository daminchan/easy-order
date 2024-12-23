"use server";

import { db } from "@/lib/db";

import { type Product } from "@/lib/types/product";

type GetProductsResponse = {
  products?: Product[];
  error?: string;
};

/** 商品一覧を取得する */
export const getProducts = async (): Promise<GetProductsResponse> => {
  try {
    const prismaProducts = await db.product.findMany({
      where: {
        available: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    // Prismaの型からビジネスロジック用の型に変換
    const products: Product[] = prismaProducts.map(
      ({
        id,
        name,
        price,
        available,
        imageUrl,
        description,
        displayOrder,
        createdAt,
        updatedAt,
      }) => ({
        id,
        name,
        price,
        available,
        imageUrl: imageUrl ?? undefined,
        description: description ?? undefined,
        displayOrder,
        createdAt,
        updatedAt,
      })
    );

    return { products };
  } catch {
    return { error: "商品の取得に失敗しました" };
  }
};
