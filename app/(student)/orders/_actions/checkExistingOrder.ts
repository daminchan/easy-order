"use server";

import { db } from "@/lib/db";
import { type Order } from "@/lib/types/order";

type CheckExistingOrderResponse = {
  exists: boolean;
  order?: Order;
  error?: string;
};

/**
 * 指定された配達日の注文が既に存在するかチェックする
 * @param studentId - 生徒ID
 * @param deliveryDate - 配達日
 * @returns 注文の存在有無と注文情報
 */
export const checkExistingOrder = async (
  studentId: string,
  deliveryDate: Date
): Promise<CheckExistingOrderResponse> => {
  try {
    const existingOrder = await db.order.findFirst({
      where: {
        studentId,
        deliveryDate,
        status: "active",
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!existingOrder) {
      return { exists: false };
    }

    // Prismaの型からビジネスロジック用の型に変換
    const order: Order = {
      id: existingOrder.id,
      deliveryDate: existingOrder.deliveryDate,
      status: existingOrder.status,
      isReceived: existingOrder.isReceived,
      totalAmount: existingOrder.totalAmount,
      items: existingOrder.items.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          imageUrl: item.product.imageUrl ?? undefined,
        },
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: existingOrder.createdAt,
    };

    return {
      exists: true,
      order,
    };
  } catch (error) {
    console.error("注文チェックエラー:", error);
    return {
      exists: false,
      error: "注文の確認に失敗しました",
    };
  }
};
