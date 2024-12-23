"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

type BulkDeleteOrdersInput = {
  type: "all" | "byDeliveryDate";
  deliveryDate?: Date;
};

type BulkDeleteOrdersResponse = {
  count?: number;
  error?: string;
};

/**
 * 注文を一括削除する
 * @description 全ての注文または指定された配達日の注文を一括削除する
 * @param input.type - 削除タイプ（全て or 配達日指定）
 * @param input.deliveryDate - 削除対象の配達日（typeがbyDeliveryDateの場合のみ必要）
 */
export const bulkDeleteOrders = async ({
  type,
  deliveryDate,
}: BulkDeleteOrdersInput): Promise<BulkDeleteOrdersResponse> => {
  try {
    let where = {};

    if (type === "byDeliveryDate") {
      if (!deliveryDate) {
        return { error: "配達日が指定されていません" };
      }
      where = {
        deliveryDate: {
          equals: deliveryDate,
        },
      };
    }

    // 削除対象の注文を取得
    const targetOrders = await db.order.findMany({
      where,
      select: { id: true },
    });

    if (targetOrders.length === 0) {
      return { error: "削除対象の注文が見つかりません" };
    }

    const orderIds = targetOrders.map((order) => order.id);

    // トランザクションで一括削除を実行
    await db.$transaction(async (tx) => {
      // 注文アイテムを先に削除
      await tx.orderItem.deleteMany({
        where: {
          orderId: {
            in: orderIds,
          },
        },
      });

      // 注文を削除
      await tx.order.deleteMany({
        where: {
          id: {
            in: orderIds,
          },
        },
      });
    });

    revalidatePath("/admin/orders");
    return { count: targetOrders.length };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラーが発生しました";
    console.error("注文一括削除エラー:", errorMessage);
    return { error: `注文の一括削除に失敗しました: ${errorMessage}` };
  }
};
