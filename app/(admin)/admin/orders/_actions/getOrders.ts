"use server";

import { db } from "@/lib/db";
import { type AdminOrderGroup } from "@/lib/types/admin-order";
import { startOfDay } from "date-fns";

type GetOrdersResponse = {
  orders?: AdminOrderGroup[];
  /** 配達日ごとの注文集計 */
  dailySummary?: {
    date: Date;
    productSummary: {
      productName: string;
      totalQuantity: number;
    }[];
  }[];
  error?: string;
};

/** 管理者用の注文一覧を取得する */
export const getOrders = async (): Promise<GetOrdersResponse> => {
  try {
    // アクティブな注文を取得
    const orders = await db.order.findMany({
      where: {
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
        deliveryDate: "asc", // 日付順に変更
      },
    });

    // 配達日ごとの注文集計を作成
    const dailySummaryMap = orders.reduce((acc, order) => {
      const dateKey = startOfDay(order.deliveryDate).toISOString();
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: order.deliveryDate,
          productSummary: {},
        };
      }

      order.items.forEach((item) => {
        const productName = item.product.name;
        if (!acc[dateKey].productSummary[productName]) {
          acc[dateKey].productSummary[productName] = 0;
        }
        acc[dateKey].productSummary[productName] += item.quantity;
      });

      return acc;
    }, {} as Record<string, { date: Date; productSummary: Record<string, number> }>);

    // 集計データを配列に変換
    const dailySummary = Object.values(dailySummaryMap).map((summary) => ({
      date: summary.date,
      productSummary: Object.entries(summary.productSummary).map(
        ([productName, totalQuantity]) => ({
          productName,
          totalQuantity,
        })
      ),
    }));

    // 学年と商品でグループ化
    const groupedOrders = orders.reduce<AdminOrderGroup[]>((acc, order) => {
      order.items.forEach((item) => {
        const groupIndex = acc.findIndex(
          (group) =>
            group.grade === order.student.grade &&
            group.productName === item.product.name &&
            group.deliveryDate.getTime() === order.deliveryDate.getTime() // 配達日も考慮
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
            deliveryDate: order.deliveryDate, // 配達日を追加
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

    return {
      orders: sortedGroups,
      dailySummary: dailySummary.sort(
        (a, b) => a.date.getTime() - b.date.getTime()
      ),
    };
  } catch (error) {
    console.error("注文一覧の取得エラー:", error);
    return { error: "注文一覧の取得に失敗しました" };
  }
};
