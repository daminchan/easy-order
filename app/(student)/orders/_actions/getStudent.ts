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
    console.log("=== 生徒データ検索開始 ===");
    console.log("Clerk ユーザーID:", userId);

    // データベース内の全生徒のIDを確認
    const studentIds = await db.student.findMany({
      select: { id: true },
    });
    console.log(
      "データベース内の生徒ID一覧:",
      studentIds.map((s) => s.id)
    );

    // 対象生徒の検索
    const student = await db.student.findUnique({
      where: { id: userId },
    });

    if (!student) {
      console.log("該当する生徒情報が見つかりません");
      return { error: "生徒情報が見つかりませんでした" };
    }

    console.log("生徒情報を取得しました:", {
      id: student.id,
      name: student.name,
      grade: student.grade,
      className: student.className,
    });

    return { student };
  } catch (error) {
    console.error("生徒データ取得エラー:", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return { error: "生徒情報の取得に失敗しました" };
  }
};
