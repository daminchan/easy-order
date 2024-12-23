"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/** 更新データの型定義 */
const updateStudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  className: z.string(),
  grade: z.number(),
  isActive: z.boolean(),
});

type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

/**
 * 生徒情報を更新する
 * @description 管理者権限を確認した上で、生徒情報を更新します
 * @param input 更新データ
 * @throws {Error} 管理者権限がない場合
 */
export async function updateStudent(input: UpdateStudentInput) {
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
    const validatedData = updateStudentSchema.parse(input);

    // 生徒��報の更新
    await db.student.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        className: validatedData.className,
        grade: validatedData.grade,
        isActive: validatedData.isActive,
      },
    });

    revalidatePath("/admin/students");
  } catch (error) {
    console.error("[UPDATE_STUDENT]", error);
    throw error;
  }
}
