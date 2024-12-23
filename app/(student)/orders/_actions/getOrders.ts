"use server";

import { db } from "@/lib/db";

import { type Order } from "@/lib/types/order";

type GetOrdersResponse = {
  orders?: Order[];
  error?: string;
};

/** 生徒の注文履歴を取得する */
export const getOrders = async (
  studentId: string
): Promise<GetOrdersResponse> => {
  try {
    const prismaOrders = await db.order.findMany({
      where: {
        studentId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Prismaの型からビジネスロジック用の型に変換
    const orders: Order[] = prismaOrders.map(
      ({
        id,
        deliveryDate,
        status,
        totalAmount,
        items,
        createdAt,
        isReceived,
      }) => ({
        id,
        deliveryDate,
        status,
        isReceived,
        totalAmount,
        items: items.map(({ product, quantity, price }) => ({
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl ?? undefined,
          },
          quantity,
          price,
        })),
        createdAt,
      })
    );

    return { orders };
  } catch (error) {
    return { error: "注文履歴の取得に失敗しました" };
  }
};
