"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type DeleteOrderResponse = {
  success?: boolean;
  error?: string;
};

/**
 * 注文を削除する
 * @description 指定された注文IDの注文を削除する
 * @param orderId - 削除する注文のID
 */
export const deleteOrder = async (
  orderId: string
): Promise<DeleteOrderResponse> => {
  try {
    // 注文の存在確認
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return { error: `注文が見つかりません (ID: ${orderId})` };
    }

    // 注文アイテムを含めて削除
    await db.$transaction(async (tx) => {
      // 注文アイテムを先に削除
      await tx.orderItem.deleteMany({
        where: { orderId },
      });

      // 注文を削除
      await tx.order.delete({
        where: { id: orderId },
      });
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラーが発生しました";
    console.error("注文削除エラー:", errorMessage);
    return { error: `注文の削除に失敗しました: ${errorMessage}` };
  }
};
