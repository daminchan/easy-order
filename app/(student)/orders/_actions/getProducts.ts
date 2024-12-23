"use server";

import { db } from "@/lib/db";
import { type Product } from "@prisma/client";

type GetProductsResponse = {
  products?: Product[];
  error?: string;
};

/** 商品データを取得する */
export const getProducts = async (): Promise<GetProductsResponse> => {
  try {
    console.log("=== 商品データ取得処理開始 ===");

    // データベース接続情報の確認（パスワードは隠す）
    const dbUrl = process.env.DATABASE_URL || "";
    console.log("データベース接続情報:", {
      url: dbUrl.replace(/:([^:@]+)@/, ":***@"),
      host: dbUrl.match(/@([^:]+):/)?.[1] || "不明",
      port: dbUrl.match(/:(\d+)\//)?.[1] || "不明",
      database: dbUrl.match(/\/([^?]+)/)?.[1] || "不明",
    });

    console.log("商品データ取得クエリ実行");
    const products = await db.product.findMany({
      where: { available: true },
      orderBy: { displayOrder: "asc" },
    });

    console.log("商品データ取得結果:", {
      count: products.length,
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        available: p.available,
        displayOrder: p.displayOrder,
      })),
    });

    return { products };
  } catch (error) {
    console.error("商品データ取得エラー:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      connectionInfo: {
        databaseUrl: process.env.DATABASE_URL ? "設定あり" : "未設定",
        nodeEnv: process.env.NODE_ENV,
      },
    });
    return { error: "商品の取得に失敗しました" };
  }
};
