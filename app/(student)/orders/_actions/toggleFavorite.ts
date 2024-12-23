"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ToggleFavoriteResult = {
  success: boolean;
  error?: string;
  isFavorited?: boolean;
};

/** お気に入りの切り替え */
export const toggleFavorite = async (
  studentId: string,
  productId: string
): Promise<ToggleFavoriteResult> => {
  try {
    // 既存のお気に入りを確認
    const existingFavorite = await db.studentFavorite.findUnique({
      where: {
        studentId_productId: {
          studentId,
          productId,
        },
      },
    });

    if (existingFavorite) {
      // お気に入りを解除
      await db.studentFavorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      revalidatePath("/orders");
      return { success: true, isFavorited: false };
    } else {
      // お気に入りに追加
      await db.studentFavorite.create({
        data: {
          studentId,
          productId,
        },
      });
      revalidatePath("/orders");
      return { success: true, isFavorited: true };
    }
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
    return {
      success: false,
      error: "お気に入りの切り替えに失敗しました",
    };
  }
};
