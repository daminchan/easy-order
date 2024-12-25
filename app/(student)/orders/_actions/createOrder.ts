"use server";

import { db } from "@/lib/db";
import { type OrderFormInput } from "@/lib/types/order";
import { revalidatePath } from "next/cache";
import { isWithinDeadline } from "@/lib/utils/delivery-date";

type CreateOrderResponse = {
  /** 作成された注文のID */
  orderId?: string;
  /** エラーメッセージ */
  error?: string;
};

/**
 * 注文を作成する
 * @description 商品の注文をデータベースに登録し、注文履歴に反映する
 * @param studentId - 注文を行う生徒のID
 * @param input - 注文フォームからの入力データ
 * @returns 作成された注文のIDまたはエラーメッセージ
 */
export const createOrder = async (
  studentId: string,
  { deliveryDate, items }: OrderFormInput
): Promise<CreateOrderResponse> => {
  const products = await db.product.findMany({
    where: {
      id: {
        in: items.map((item) => item.productId),
      },
    },
  });

  try {
    // 配達日のバリデーション
    if (!isWithinDeadline(deliveryDate)) {
      return { error: "注文締切時間を過ぎています" };
    }

    // 同じ配��日の注文が存在するかチェック
    const existingOrder = await db.order.findFirst({
      where: {
        studentId,
        deliveryDate,
        status: "active",
      },
    });

    if (existingOrder) {
      return {
        error:
          "この配達日の注文が既に存在します。変更する場合は、既存の注文をキャンセルしてから新しい注文を作成してください。",
      };
    }

    // 商品が見つからない場合はエラー
    if (products.length !== items.length) {
      return { error: "商品が見つかりません" };
    }

    // 注文アイテムの作成
    const orderItems = items.map((item) => {
      const { productId, quantity } = item;
      const product = products.find((p) => p.id === productId);
      if (!product) throw new Error("商品が見つかりません");

      const { price } = product;
      return { productId, quantity, price };
    });

    // 合計金額の計算
    const totalAmount = orderItems.reduce(
      (total, { price, quantity }) => total + price * quantity,
      0
    );

    // トランザクションで注文を作成
    const { id: orderId } = await db.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          studentId,
          deliveryDate,
          status: "active",
          totalAmount,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return order;
    });

    // キャッシュの再検証
    revalidatePath("/orders");

    return { orderId };
  } catch {
    return { error: "注文の作成に失敗しました" };
  }
};
