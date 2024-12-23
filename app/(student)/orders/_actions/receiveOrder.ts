"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ORDER_STATUS } from "@/lib/types/order";

type ReceiveOrderResponse = {
  /** 受け取り確認された注文のID */
  orderId?: string;
  /** エラーメッセージ */
  error?: string;
};

/**
 * 注文の受け取り状態を更新する
 * @description 注文を受け取り済み状態に更新する
 * @param orderId - 受け取り確認する注文のID
 * @returns 受け取り確認された注文のIDまたはエラーメッセージ
 */
export const receiveOrder = async (
  orderId: string
): Promise<ReceiveOrderResponse> => {
  try {
    // 注文情報の取得
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { error: "注文が見つかりません" };
    }

    // キャンセル済みの注文は受け取り確認不可
    if (order.status === ORDER_STATUS.CANCELLED) {
      return { error: "キャンセルされた注文は受け取り確認できません" };
    }

    // すでに受け取り済みの場合
    if (order.isReceived) {
      return { error: "この注文はすでに受け取り済みです" };
    }

    // 受け取り状態の更新
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        isReceived: true,
      },
    });

    // キャッシュの再検証
    revalidatePath("/orders");

    return { orderId: updatedOrder.id };
  } catch (error) {
    console.error("注文受け取り状態の更新エラー:", error);
    return { error: "受け取り状態の更新に失敗しました" };
  }
};
