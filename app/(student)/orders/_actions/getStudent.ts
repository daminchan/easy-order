"use server";

import { db } from "@/lib/db";
import { type Student } from "@prisma/client";

type GetStudentResponse = {
  student?: Student;
  error?: string;
};

/** ログイン中の生徒データを取得する */
export const getStudent = async (
  userId: string
): Promise<GetStudentResponse> => {
  try {
    console.log("=== 生徒データ取得処理開始 ===");
    console.log("検索するユーザーID:", userId);

    // データベース接続情報の確認（パスワードは隠す）
    const dbUrl = process.env.DATABASE_URL || "";
    console.log("データベース接続情報:", {
      url: dbUrl.replace(/:([^:@]+)@/, ":***@"),
      host: dbUrl.match(/@([^:]+):/)?.[1] || "不明",
      port: dbUrl.match(/:(\d+)\//)?.[1] || "不明",
      database: dbUrl.match(/\/([^?]+)/)?.[1] || "不明",
    });

    // すべての生徒データを取得して確認
    console.log("全生徒データ取得開始");
    const allStudents = await db.student.findMany();
    console.log("全生徒データ取得結果:", {
      count: allStudents.length,
      students: allStudents.map((s) => ({
        id: s.id,
        grade: s.grade,
        className: s.className,
        name: s.name,
        isActive: s.isActive,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    });

    console.log("対象生徒の検索開始");
    const student = await db.student.findUnique({
      where: { id: userId },
    });

    if (!student) {
      console.log("生徒が見つかりません - ID:", userId);
      return { error: "生徒情報が見つかりませんでした" };
    }

    console.log("生徒データ取得成功:", {
      id: student.id,
      grade: student.grade,
      className: student.className,
      name: student.name,
      isActive: student.isActive,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    });

    return { student };
  } catch (error) {
    console.error("生徒データ取得エラー:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      connectionInfo: {
        databaseUrl: process.env.DATABASE_URL ? "設定あり" : "未設定",
        nodeEnv: process.env.NODE_ENV,
      },
    });
    return { error: "生徒情報の取得に失敗しました" };
  }
};
