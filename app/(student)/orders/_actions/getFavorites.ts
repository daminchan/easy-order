"use server";

import { db } from "@/lib/db";

type GetFavoritesResult = {
  productIds?: string[];
  error?: string;
};

/** 生徒のお気に入り商品IDリストを取得 */
export const getFavorites = async (
  studentId: string
): Promise<GetFavoritesResult> => {
  try {
    const favorites = await db.studentFavorite.findMany({
      where: {
        studentId,
      },
      select: {
        productId: true,
      },
    });

    return {
      productIds: favorites.map((f) => f.productId),
    };
  } catch {
    return {
      error: "お気に入りの取得に失敗しました",
    };
  }
};
