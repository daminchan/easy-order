"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type ResetReceiveStatusResponse = {
  orderId?: string;
  error?: string;
};

/**
 * 注文の受け取り状態をリセットする
 * @description 管理者用の機能。注文の受け取り状態を未受け取りに戻す
 */
export const resetReceiveStatus = async (
  orderId: string
): Promise<ResetReceiveStatusResponse> => {
  try {
    // 注文情報の取得
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { error: "注文が見つかりません" };
    }

    // 受け取り状態のリセット
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        isReceived: false,
      },
    });

    // キャッシュの再検証
    revalidatePath("/admin/orders");

    return { orderId: updatedOrder.id };
  } catch (error) {
    console.error("受け取り状態のリセットエラー:", error);
    return { error: "受け取り状態のリセットに失敗しました" };
  }
};
