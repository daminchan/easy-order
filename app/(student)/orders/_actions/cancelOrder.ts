"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ORDER_STATUS } from "@/lib/types/order";
import { isWithinDeadline } from "@/lib/utils/delivery-date";

type CancelOrderResponse = {
  /** キャンセルされた注文のID */
  orderId?: string;
  /** エラーメッセージ */
  error?: string;
};

/**
 * 注文をキャンセルする
 * @description 注文をキャンセル状態に更新する。配達日の2営業日前15時までのみキャンセル可能
 * @param orderId - キャンセルする注文のID
 * @param studentId - キャンセルを行う生徒のID（本人確認用）
 * @returns キャンセルされた注文のIDまたはエラーメッセージ
 */
export const cancelOrder = async (
  orderId: string,
  studentId: string
): Promise<CancelOrderResponse> => {
  try {
    // 注文情報の取得
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { error: "注文が見つかりません" };
    }

    // 本人確認
    if (order.studentId !== studentId) {
      return { error: "この注文をキャンセルする権限がありません" };
    }

    // すでにキャンセル済みの場合
    if (order.status === ORDER_STATUS.CANCELLED) {
      return { error: "この注文はすでにキャンセルされています" };
    }

    // キャンセル期限のチェック
    if (!isWithinDeadline(order.deliveryDate)) {
      return { error: "キャンセル期限を過ぎています" };
    }

    // 注文のキャンセル
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        status: ORDER_STATUS.CANCELLED,
      },
    });

    // キャッシュの再検証
    revalidatePath("/orders");

    return { orderId: updatedOrder.id };
  } catch (error) {
    console.error("注文キャンセルエラー:", error);
    return { error: "注文のキャンセルに失敗しました" };
  }
};
