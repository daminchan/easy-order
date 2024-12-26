"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { type AdminOrderGroup } from "@/lib/types/admin-order";

type PrintOrdersResponse = {
  orders?: AdminOrderGroup[];
  error?: string;
};

/**
 * 印刷用の注文データを取得する
 * @description 管理者権限を確認した上で、当日以降の注文データを取得します
 */
export async function getPrintOrders(): Promise<PrintOrdersResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect("/sign-in");
    }

    // 管理者権限の確認
    const admin = await db.admin.findUnique({
      where: { id: userId },
    });

    if (!admin) {
      throw new Error("管理者権限がありません");
    }

    // 注文データを取得（当日以降の注文を取得）
    const orders = await db.order.findMany({
      where: {
        deliveryDate: {
          gte: new Date(),
        },
        status: "active",
      },
      include: {
        student: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        deliveryDate: "asc",
      },
    });

    // 学年と商品でグループ化
    const groupedOrders = orders.reduce<AdminOrderGroup[]>((acc, order) => {
      order.items.forEach((item) => {
        const groupIndex = acc.findIndex(
          (group) =>
            group.grade === order.student.grade &&
            group.productName === item.product.name &&
            group.deliveryDate.getTime() === order.deliveryDate.getTime()
        );

        const otherOrders = order.items
          .filter((i) => i.product.id !== item.product.id)
          .map((i) => i.product.name)
          .join(", ");

        const orderItem = {
          id: order.id,
          student: {
            className: order.student.className,
            name: order.student.name,
          },
          quantity: item.quantity,
          otherOrders: otherOrders || undefined,
          isReceived: order.isReceived,
          deliveryDate: order.deliveryDate,
        };

        if (groupIndex === -1) {
          // 新しいグループを作成
          acc.push({
            grade: order.student.grade,
            productName: item.product.name,
            deliveryDate: order.deliveryDate,
            orders: [orderItem],
          });
        } else {
          // 既存のグループに追加
          acc[groupIndex].orders.push(orderItem);
        }
      });

      return acc;
    }, []);

    // 配達日、学年、商品名でソート
    const sortedGroups = groupedOrders.sort((a, b) => {
      const dateCompare = a.deliveryDate.getTime() - b.deliveryDate.getTime();
      if (dateCompare !== 0) return dateCompare;
      if (a.grade !== b.grade) return a.grade - b.grade;
      return a.productName.localeCompare(b.productName);
    });

    return { orders: sortedGroups };
  } catch (error) {
    console.error("[GET_PRINT_ORDERS]", error);
    return { error: "注文データの取得に失敗しました" };
  }
}
