"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * 生徒情報を削除する
 * @description 管理者権限を確認した上で、生徒情報を削除します
 * @param studentId 削除する生徒のID
 * @throws {Error} 管理者権限がない場合
 */
export async function deleteStudent(studentId: string) {
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

    // 生徒情報の削除
    await db.student.delete({
      where: { id: studentId },
    });

    revalidatePath("/admin/students");
  } catch (error) {
    console.error("[DELETE_STUDENT]", error);
    throw error;
  }
}
