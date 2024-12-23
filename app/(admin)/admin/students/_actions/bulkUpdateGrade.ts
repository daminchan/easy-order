"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/** 一括更新データの型定義 */
const bulkUpdateGradeSchema = z.object({
  fromGrade: z.number(),
  toGrade: z.number(),
});

type BulkUpdateGradeInput = z.infer<typeof bulkUpdateGradeSchema>;

/**
 * 学年を一括更新する
 * @description 管理者権限を確認した上で、指定した学年の生徒を一括で別の学年に更新します
 * @param input 一括更新データ
 * @throws {Error} 管理者権限がない場合
 */
export async function bulkUpdateGrade(input: BulkUpdateGradeInput) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("認証されていません");
    }

    // 管理者権限の確認
    const admin = await db.admin.findUnique({
      where: { id: userId },
    });

    if (!admin) {
      throw new Error("管理者権限がありません");
    }

    // バリデーション
    const validatedData = bulkUpdateGradeSchema.parse(input);

    // 学年の一括更新
    await db.student.updateMany({
      where: { grade: validatedData.fromGrade },
      data: { grade: validatedData.toGrade },
    });

    revalidatePath("/admin/students");
  } catch (error) {
    console.error("[BULK_UPDATE_GRADE]", error);
    throw error;
  }
}
